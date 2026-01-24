# API Service Layer Documentation

## Overview

Production-grade API service layer built with Axios, providing type-safe HTTP communication with the MissionX backend. Implements interceptor patterns for authentication, error handling, and request logging.

## Architecture

### Design Choice: Class-Based Service (Option C)

We chose the **Class-Based Service** pattern for the following reasons:

| Benefit           | Description                                                               |
| ----------------- | ------------------------------------------------------------------------- |
| **Inheritance**   | Channel-specific services can extend `BaseAPIService`                     |
| **Encapsulation** | AbortController and request logic encapsulated in methods                 |
| **Testability**   | Easy to mock via dependency injection of Axios instance                   |
| **Type Safety**   | Generic methods provide type safety per request                           |
| **Scalability**   | Isolated instances prevent queue contention in high-concurrency scenarios |

## Directory Structure

```
src/api/
├── index.ts                          # Public exports
├── axios-instance.ts                 # Configured Axios with interceptors
├── interceptors/
│   ├── auth.interceptor.ts          # Token injection & 401 handling
│   ├── error.interceptor.ts         # Error transformation to APIError
│   └── logging.interceptor.ts       # Dev-only request/response logging
├── services/
│   ├── base.service.ts              # Abstract base with HTTP methods
│   ├── auth.service.ts              # Login, register, refresh, logout
│   ├── tickets.service.ts           # Ticket CRUD operations
│   ├── messages.service.ts          # Message operations & file upload
│   ├── channels.service.ts          # Channel connections
│   └── types/
│       ├── auth.types.ts
│       ├── ticket.types.ts
│       ├── message.types.ts
│       └── channel.types.ts
└── types/
    ├── api.types.ts                 # APIResponse, APIError, PaginatedResponse
    └── endpoints.ts                 # Type-safe endpoint constants
```

## Core Features

### 1. Axios Instance Configuration

**File:** [axios-instance.ts](src/api/axios-instance.ts)

```typescript
import { axiosInstance } from "~/api";

// Singleton instance with:
// - Base URL from VITE_API_BASE_URL
// - 15s timeout (configurable via VITE_API_TIMEOUT)
// - Automatic Bearer token injection
// - Global error handling
```

**Environment Variables:**

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_API_TIMEOUT=15000
VITE_ENABLE_API_LOGGING=true
```

### 2. Interceptors

#### Authentication Interceptor

- **Request:** Injects `Bearer <token>` for non-public routes
- **Response:** Handles 401 Unauthorized (logs out + redirects to /login)
- **TODO:** Token refresh logic when backend implements JWT

#### Error Interceptor

- Transforms all errors to `APIError` instances
- Maps HTTP status codes to user-friendly messages
- Extracts `retry-after` for 429 rate limit responses
- Handles network errors and timeouts

#### Logging Interceptor (Dev Only)

- Logs request method, URL, params, data
- Logs response status, duration, data size
- Only active in development or when `VITE_ENABLE_API_LOGGING=true`

### 3. Base Service Class

**File:** [services/base.service.ts](src/api/services/base.service.ts)

Abstract class providing:

- `get<T>()` - GET with query params
- `getPaginated<T>()` - GET with pagination metadata
- `post<TRequest, TResponse>()` - POST with body
- `put<TRequest, TResponse>()` - PUT with body
- `patch<TRequest, TResponse>()` - PATCH with partial data
- `delete<T>()` - DELETE
- `upload<T>()` - Multipart file upload with progress

All methods support `RequestOptions`:

```typescript
interface RequestOptions {
  signal?: AbortSignal; // For request cancellation
  headers?: Record<string, string>;
}
```

### 4. Service Classes

#### AuthService

```typescript
import { authService } from "~/api";

// Login
const response = await authService.login({ email, password });

// Register
await authService.register({ name, email, password });

// Get current user
const user = await authService.getCurrentUser();

// Logout
await authService.logout();
```

#### TicketsService

```typescript
import { ticketsService } from "~/api";

// Get paginated tickets with filters
const tickets = await ticketsService.getTickets({
  workspaceId: "ws-1",
  status: ["open", "pending"],
  assignedTo: "user-123",
  page: 1,
  limit: 20,
});

// Get single ticket
const ticket = await ticketsService.getTicket("ticket-123");

// Update ticket
await ticketsService.updateTicket("ticket-123", {
  status: "closed",
  priority: "high",
});

// Assign ticket
await ticketsService.assignTicket("ticket-123", { userId: "user-456" });
```

#### MessagesService

```typescript
import { messagesService } from "~/api";

// Get messages for ticket
const messages = await messagesService.getByTicket("ticket-123");

// Send message
await messagesService.sendMessage("ticket-123", {
  text: "Hello!",
  attachmentIds: ["att-1", "att-2"],
});

// Upload attachment with progress
const attachment = await messagesService.uploadAttachment(file, (progress) =>
  console.log(`${progress}% uploaded`),
);

// Mark as read
await messagesService.markAsRead("ticket-123", ["msg-1", "msg-2"]);
```

#### ChannelsService

```typescript
import { channelsService } from "~/api";

// Get all channels
const channels = await channelsService.getChannels();

// Connect new channel
await channelsService.connectChannel({
  workspaceId: "ws-1",
  channelType: "facebook_page",
  platformId: "fb-page-123",
  name: "My Facebook Page",
});

// Disconnect channel
await channelsService.disconnectChannel("channel-123");
```

## TanStack Query Integration

### Query Key Factory

**File:** [hooks/api/query-keys.ts](src/hooks/api/query-keys.ts)

Centralized query key management following [TanStack Query best practices](https://tkdodo.eu/blog/effective-react-query-keys):

```typescript
import { queryKeys } from "~/hooks/api/query-keys";

// Hierarchical structure
queryKeys.tickets.all; // ["tickets"]
queryKeys.tickets.list("ws-1", { status }); // ["tickets", "list", "ws-1", {...}]
queryKeys.tickets.detail("ticket-123"); // ["tickets", "detail", "ticket-123"]

queryKeys.messages.byTicket("ticket-123"); // ["messages", "ticket", "ticket-123"]
```

### Usage in Hooks

**Example:** [hooks/use-messages.ts](src/hooks/use-messages.ts)

```typescript
export const useMessages = (ticketId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.messages.byTicket(ticketId!),
    queryFn: async ({ signal }) => {
      const response = await messagesService.getByTicket(ticketId!, { signal });
      return response.data;
    },
    enabled: !!ticketId,
    staleTime: 30_000,
  });
};
```

**Benefits:**

- ✅ **AbortController** via `signal` passed from TanStack Query
- ✅ **Type-safe** responses
- ✅ **Automatic cancellation** on component unmount or query invalidation

### Optimistic Updates

**Example:** Send message with optimistic UI

```typescript
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: MessagePayload) => {
      const response = await messagesService.sendMessage(payload.ticketId, {
        text: payload.text,
      });
      return response.data;
    },
    onMutate: async (payload) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.messages.byTicket(payload.ticketId),
      });

      // Snapshot previous state
      const previousMessages = queryClient.getQueryData(
        queryKeys.messages.byTicket(payload.ticketId),
      );

      // Optimistically update cache
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        ...payload,
        isOptimistic: true,
      };

      queryClient.setQueryData(
        queryKeys.messages.byTicket(payload.ticketId),
        (old) => [...(old || []), optimisticMessage],
      );

      return { previousMessages };
    },
    onError: (err, payload, context) => {
      // Rollback on error
      queryClient.setQueryData(
        queryKeys.messages.byTicket(payload.ticketId),
        context.previousMessages,
      );
    },
    onSettled: (_, __, payload) => {
      // Refetch to sync with server
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.byTicket(payload.ticketId),
      });
    },
  });
};
```

## Request Cancellation

### AbortController Support

All service methods accept `RequestOptions` with `AbortSignal`:

```typescript
// Manual cancellation
const controller = new AbortController();

messagesService.getByTicket("ticket-123", {
  signal: controller.signal,
});

// Cancel request
controller.abort();
```

### TanStack Query Auto-Cancellation

TanStack Query v5 automatically passes `AbortSignal` to query functions:

```typescript
queryFn: async ({ signal }) => {
  // Signal is automatically provided
  const response = await messagesService.getByTicket(ticketId, { signal });
  return response.data;
};
```

**Benefits:**

- Prevents memory leaks during rapid ticket switching
- Cancels pending requests on component unmount
- Avoids race conditions

## Type Safety

### Generic Response Types

```typescript
// Standard response
interface APIResponse<T> {
  data: T;
  message?: string;
  meta?: { page; limit; total };
}

// Paginated response
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### End-to-End Type Safety

```typescript
// Request type
interface CreateTicketRequest {
  workspaceId: string;
  channelType: ChannelType;
  customerId: string;
  subject: string;
}

// Response type
interface Ticket {
  id: string;
  workspaceId: string;
  status: TicketStatus;
  // ...
}

// Fully typed service call
const response: APIResponse<Ticket> = await ticketsService.createTicket({
  workspaceId: "ws-1",
  channelType: "facebook_page",
  customerId: "cust-123",
  subject: "Need help",
});

// TypeScript ensures response.data is Ticket
const ticket: Ticket = response.data;
```

## Error Handling

### APIError Class

```typescript
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "APIError";
  }
}
```

### User-Friendly Messages

```typescript
try {
  await ticketsService.getTicket("invalid-id");
} catch (error) {
  if (error instanceof APIError) {
    console.log(error.message); // "Resource not found."
    console.log(error.status); // 404
    console.log(error.code); // "TICKET_NOT_FOUND"
  }
}
```

### Status Code Mapping

| Status | Message                                      |
| ------ | -------------------------------------------- |
| 400    | "Bad request. Please check your input."      |
| 401    | "Unauthorized. Please log in again."         |
| 403    | "Access denied. You don't have permission."  |
| 404    | "Resource not found."                        |
| 429    | "Too many requests. Please try again later." |
| 500    | "Server error. Please try again."            |

## Migration from Old API Client

The old `apiClient` ([services/api-client.ts](src/services/api-client.ts)) is being deprecated. Update usage:

### Before (Old)

```typescript
import { apiClient } from "~/services/api-client";

const response = await apiClient.get<Ticket[]>("/tickets", {
  workspaceId: "ws-1",
});
const tickets = response.data;
```

### After (New)

```typescript
import { ticketsService } from "~/api";

const response = await ticketsService.getTickets({
  workspaceId: "ws-1",
});
const tickets = response.data;
```

**Benefits of new API:**

- ✅ Type-safe endpoints (no hardcoded strings)
- ✅ Request cancellation support
- ✅ Better error messages
- ✅ Optimized for TanStack Query
- ✅ Production-grade interceptors

## Testing

### Mocking Services

```typescript
import { MessagesService } from "~/api";

// Create mock instance
const mockAxios = {
  get: vi.fn(),
  post: vi.fn(),
} as any;

const messagesService = new MessagesService(mockAxios);

// Test
mockAxios.get.mockResolvedValue({
  data: { data: [{ id: "msg-1", text: "Hello" }] },
});

const messages = await messagesService.getByTicket("ticket-123");
expect(messages.data).toHaveLength(1);
```

## Future Enhancements

### 1. Token Refresh

```typescript
// TODO: Implement in auth.interceptor.ts
if (response.status === 401) {
  const newToken = await authService.refreshToken({ refreshToken });
  // Retry original request with new token
}
```

### 2. Request Queue During Refresh

Prevent multiple refresh attempts when multiple requests fail simultaneously.

### 3. Rate Limiting Client-Side

Add throttling for bulk operations (e.g., marking 100 tickets as read).

### 4. WebSocket Integration

Complete the `useRealtimeMessages` hook once WebSocket service is implemented.

## Bundle Impact

| Package             | Size (minified + gzipped) |
| ------------------- | ------------------------- |
| axios               | ~13 KB                    |
| Old fetch-based API | ~1 KB                     |

**Trade-off:** We accept the 12 KB increase for:

- Better developer experience
- Interceptor system
- Request cancellation
- Mature ecosystem

---

**Last Updated:** January 25, 2026  
**Author:** Senior Frontend Architect
