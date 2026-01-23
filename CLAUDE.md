# MissionX CX Platform - Technical Architecture Blueprint

> **Document Version**: 1.0  
> **Date**: January 23, 2026  
> **Author**: Senior Technical Architect  
> **Status**: Implementation Complete

---

## Executive Summary

This document outlines the complete technical architecture for **MissionX**, a high-performance, resource-efficient Customer Experience (CX) platform designed for omnichannel support across Facebook and Instagram. The platform emphasizes:

- **Performance**: Code-splitting, lazy-loading, and optimistic UI updates
- **Type Safety**: End-to-end TypeScript with strict type checking
- **Developer Experience**: Domain-driven architecture with co-located components
- **Scalability**: Virtualized lists, WebSocket real-time updates, and TanStack Query caching

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Resource Optimization Strategy](#3-resource-optimization-strategy)
4. [Omnichannel Normalization](#4-omnichannel-normalization)
5. [Routing Architecture](#5-routing-architecture)
6. [State Management](#6-state-management)
7. [Feature Modules](#7-feature-modules)
8. [The Omni-Replier](#8-the-omni-replier)
9. [Data Flow & Real-Time Updates](#9-data-flow--real-time-updates)
10. [Styling System](#10-styling-system)
11. [Security & Authentication](#11-security--authentication)
12. [Deployment & Performance](#12-deployment--performance)

---

## 1. Technology Stack

### Core Framework

| Technology     | Version | Purpose                                |
| -------------- | ------- | -------------------------------------- |
| **React**      | 18.3.1  | Component-based UI library             |
| **TypeScript** | 5.7.3   | Static typing and developer tooling    |
| **Vite**       | 6.0.7   | Lightning-fast dev server & build tool |
| **Bun**        | 1.3.6   | Fast package manager and runtime       |

### Routing & State

| Package                    | Purpose                                                   |
| -------------------------- | --------------------------------------------------------- |
| **@tanstack/react-router** | Type-safe file-based routing with nested layouts          |
| **@tanstack/react-query**  | Server state management with caching & optimistic updates |
| **Zustand**                | Lightweight client state (auth, UI, channels)             |

### UI & Styling

| Package          | Purpose                                  |
| ---------------- | ---------------------------------------- |
| **Tailwind CSS** | Utility-first CSS framework              |
| **Radix UI**     | Unstyled accessible component primitives |
| **CVA**          | Component variant management             |
| **Lucide React** | Icon library                             |

### Utilities

| Package      | Purpose                                     |
| ------------ | ------------------------------------------- |
| **date-fns** | Date formatting and manipulation            |
| **zod**      | Runtime schema validation for search params |

---

## 2. High-Level Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser Client                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │   TanStack       │  │   WebSocket      │               │
│  │   Router         │  │   Service        │               │
│  │  (File-based)    │  │  (Real-time)     │               │
│  └──────────────────┘  └──────────────────┘               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │  TanStack Query  │  │    Zustand       │               │
│  │  (Server State)  │  │  (Client State)  │               │
│  │  - Messages      │  │  - Auth          │               │
│  │  - Tickets       │  │  - Channels      │               │
│  │                  │  │  - UI State      │               │
│  └──────────────────┘  └──────────────────┘               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │               Feature Modules                         │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │  Inbox   │  │ Replier  │  │Workspace │          │  │
│  │  │ Module   │  │  Module  │  │  Module  │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Service Layer                            │  │
│  │  ┌────────────────┐  ┌─────────────────┐            │  │
│  │  │ API Client     │  │ Channel         │            │  │
│  │  │ (REST/Upload)  │  │ Normalizer      │            │  │
│  │  └────────────────┘  └─────────────────┘            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ▼
        ┌─────────────────────────────────┐
        │      Backend API Server         │
        │  - REST API                     │
        │  - WebSocket Server             │
        │  - Facebook/Instagram APIs      │
        └─────────────────────────────────┘
```

### Architectural Principles

1. **Domain-Driven Design**: Features are organized by business domain (Inbox, Replier, Workspace)
2. **Component Co-location**: Components, hooks, and types live together within features
3. **Lazy Loading**: Heavy components (EmojiPicker) are code-split
4. **Optimistic UI**: Instant feedback via TanStack Query's optimistic updates
5. **Type Safety**: Strict TypeScript with no `any` types in production code

---

## 3. Resource Optimization Strategy

### Bundle Size Management

#### Code Splitting Strategy

```typescript
// Route-level splitting (automatic via TanStack Router)
src / routes / _authenticated / inbox / $workspaceId / $ticketId.tsx;
// → Lazy-loaded when user navigates to ticket

// Component-level splitting (manual)
const EmojiPickerImpl = lazy(() => import("./emoji-picker-impl"));
// → Only loaded when emoji picker is opened
```

#### Bundle Size Targets

- **Initial bundle**: < 200 KB (gzipped)
- **Route chunks**: < 50 KB each
- **Emoji picker**: < 30 KB (lazy-loaded)

### Performance Optimizations

1. **Virtualized Lists**: Use `@tanstack/react-virtual` for ticket lists (1000+ items)
2. **Image Optimization**: Lazy-load images with `loading="lazy"`
3. **Debounced Search**: 300ms debounce on search inputs
4. **Query Stale Time**: 30s for messages, 10s for tickets
5. **WebSocket Reconnection**: Exponential backoff (1s, 2s, 4s, 8s, 16s)

---

## 4. Omnichannel Normalization

### Problem Statement

Facebook Pages and Instagram Business accounts have different API response formats, field names, and capabilities. The UI must remain consistent regardless of the source.

### Solution: ChannelNormalizer Service

#### Unified Message Interface

```typescript
interface UnifiedMessage {
  id: string; // Platform-agnostic ID
  ticketId: string;
  channelType: ChannelType; // "facebook_page" | "instagram_business"
  direction: MessageDirection; // "inbound" | "outbound"
  sender: Sender;
  contentType: ContentType; // "text" | "image" | "video" | "file"
  text?: string;
  attachments: Attachment[];
  timestamp: string; // ISO 8601
  isRead: boolean;
  platformMessageId?: string; // Original platform ID
}
```

#### Normalization Flow

```
Facebook Payload            Instagram Payload
      │                          │
      ├──────────┬───────────────┤
                 ▼
         ChannelNormalizer
         ┌─────────────────┐
         │ extractCommonFields()
         │ determineContentType()
         │ normalizeAttachments()
         └─────────────────┘
                 ▼
          UnifiedMessage
```

#### Channel-Specific Constraints

```typescript
{
  facebook_page: {
    maxTextLength: 8000,
    maxFileSize: 25 * 1024 * 1024, // 25MB
    allowedMimeTypes: ["image/jpeg", "image/png", "video/mp4", "application/pdf"]
  },
  instagram_business: {
    maxTextLength: 1000,
    maxFileSize: 8 * 1024 * 1024, // 8MB
    allowedMimeTypes: ["image/jpeg", "image/png", "video/mp4"]
  }
}
```

**Implementation**: See [`src/services/channel-normalizer.ts`](src/services/channel-normalizer.ts)

---

## 5. Routing Architecture

### Route Hierarchy

```
Root (__root.tsx)
├── / (index.tsx)                          → Landing page
│
├── _auth (Layout: public, redirects if authenticated)
│   ├── /login                             → Login form
│   └── /signup                            → Signup form
│
└── _authenticated (Layout: protected, redirects to /login if not authenticated)
    └── /inbox (Layout: inbox shell with global sidebar)
        ├── / (index)                      → Redirects to first workspace
        └── /$workspaceId (Layout: ticket list sidebar)
            ├── / (index)                  → Empty state
            └── /$ticketId                 → Conversation + Replier
```

### Route Files

```
src/routes/
├── __root.tsx                    # Root layout with Outlet
├── index.tsx                     # Landing page
├── _auth.tsx                     # Public auth layout
├── _auth/
│   ├── login.tsx                 # Login page (moved from routes/login.tsx)
│   └── signup.tsx                # Signup page
├── _authenticated.tsx            # Protected layout with GlobalSidebar
└── _authenticated/
    ├── inbox.tsx                 # Inbox layout wrapper
    └── inbox/
        ├── index.tsx             # Redirects to first workspace
        ├── $workspaceId.tsx      # Workspace layout with ticket list
        └── $workspaceId/
            ├── index.tsx         # Empty state
            └── $ticketId.tsx     # Conversation view
```

### Search Params (URL State)

#### Inbox Filters (`/inbox/$workspaceId`)

```typescript
interface SearchParams {
  status?: "open" | "pending" | "closed" | "all"; // Default: "all"
  channel?: string | "all"; // channelConnectionId
  assignee?: "me" | "unassigned" | string | "all"; // agentId
  sort?: "newest" | "oldest" | "priority" | "unread"; // Default: "newest"
}

// Example URLs:
// /inbox/ws-1?status=open&sort=priority
// /inbox/ws-1?assignee=me&channel=ch-facebook-123
```

**Validation**: Zod schema in route definition

### Authentication Guards

```typescript
// _auth.tsx (public routes)
beforeLoad: () => {
  const { isAuthenticated } = useAuthStore.getState();
  if (isAuthenticated) {
    throw redirect({ to: "/inbox" });
  }
};

// _authenticated.tsx (protected routes)
beforeLoad: () => {
  const { isAuthenticated } = useAuthStore.getState();
  if (!isAuthenticated) {
    throw redirect({ to: "/login" });
  }
};
```

---

## 6. State Management

### State Classification

| State Type                 | Location               | Persistence     | Example                         |
| -------------------------- | ---------------------- | --------------- | ------------------------------- |
| **URL State**              | Search params          | Browser history | Filters, sorting, pagination    |
| **Server State**           | TanStack Query         | Memory cache    | Messages, tickets, users        |
| **Client State**           | Zustand                | None            | Sidebar collapsed, active modal |
| **Persisted Client State** | Zustand + localStorage | localStorage    | Auth token, theme preference    |

### Zustand Stores

#### 1. Auth Store (`auth-store.ts`)

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// Persisted to localStorage with key "auth-storage"
```

#### 2. Channel Store (`channel-store.ts`)

```typescript
interface ChannelState {
  channels: ChannelConnection[];
  selectedChannelId: string | null;
  setChannels;
  addChannel;
  removeChannel;
  updateChannel;
}
```

#### 3. UI Store (`ui-store.ts`)

```typescript
interface UIState {
  sidebarCollapsed: boolean;
  theme: "light" | "dark" | "system";
  activeModal: string | null;
  toggleSidebar;
  setTheme;
  openModal;
  closeModal;
}

// Persisted: sidebarCollapsed, theme
```

### TanStack Query Patterns

#### Query Keys Structure

```typescript
["messages", ticketId][("tickets", workspaceId, filters)][("ticket", ticketId)]; // Messages for a ticket // Tickets with filters // Single ticket details
```

#### Optimistic Updates Example

```typescript
const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessageToAPI,
    onMutate: async (payload) => {
      // 1. Cancel outgoing refetches
      await queryClient.cancelQueries(["messages", payload.ticketId]);

      // 2. Snapshot previous state
      const previous = queryClient.getQueryData(["messages", payload.ticketId]);

      // 3. Optimistically update cache
      queryClient.setQueryData(["messages", payload.ticketId], (old) => [
        ...old,
        { ...payload, id: `temp-${Date.now()}`, isOptimistic: true },
      ]);

      return { previous };
    },
    onError: (err, payload, context) => {
      // Rollback on failure
      queryClient.setQueryData(
        ["messages", payload.ticketId],
        context.previous,
      );
    },
    onSettled: (data, error, payload) => {
      // Sync with server
      queryClient.invalidateQueries(["messages", payload.ticketId]);
    },
  });
};
```

---

## 7. Feature Modules

### Module Structure

Each feature follows this pattern:

```
src/features/<feature-name>/
├── components/
│   ├── component-a.tsx
│   ├── component-b.tsx
│   └── ...
└── index.tsx              # Barrel export
```

### 1. Inbox Module

**Location**: `src/features/inbox/`

**Components**:

- **TicketList**: Virtualized list with filters
- **TicketCard**: Individual ticket row with metadata (channel, SLA, sentiment)
- **ConversationView**: Message thread with auto-scroll
- **MessageBubble**: Single message with attachments

**Key Features**:

- Real-time message injection via WebSocket
- Unread badge indicators
- Channel/SLA/sentiment badges
- Infinite scroll (future)

### 2. Replier Module

**Location**: `src/features/replier/`

**Components**:

- **OmniReplier**: Main container with send logic
- **RichTextInput**: Multi-line textarea with character counter
- **EmojiPicker**: Lazy-loaded emoji selector (Suspense)
- **AttachmentUploader**: File picker with validation
- **ChannelContext**: Banner showing channel constraints

**Key Features**:

- Channel-aware constraints (character limits, file types)
- Upload progress tracking
- Optimistic message sending
- Keyboard shortcuts (Ctrl+Enter to send)

### 3. Workspace Module

**Location**: `src/features/workspace/`

**Components**:

- **WorkspaceAvatar**: Circular avatar with initials fallback
- **AddWorkspaceModal**: Creation dialog

---

## 8. The Omni-Replier

### Functional Specification

The **Omni-Replier** is the most critical UX component, enabling agents to respond across multiple channels with context-aware constraints.

#### Core Requirements

1. **Input Handling**
   - Multi-line text support with auto-resize (max height: 200px)
   - Character counter appears when near limit (Facebook: 7000/8000, Instagram: 900/1000)
   - Visual warning when over limit (red border)

2. **Emoji Engine**
   - Lazy-loaded with React `Suspense`
   - Categories: Smileys, Gestures, Hearts, Objects
   - Keyboard accessible
   - Closes after selection

3. **Attachment Management**

   ```
   Lifecycle: File Select → Validation → Upload → Preview → Send

   States:
   - pending: File selected, not yet uploading
   - uploading: In progress (show %)
   - uploaded: Ready to send
   - failed: Upload error (with retry button)
   ```

4. **Context Awareness**
   - Dynamically adjusts UI based on `channelType` prop
   - Shows character limit banner when approaching limit
   - Validates file types before upload
   - Displays platform-specific help text

#### Component Hierarchy

```
<OmniReplier ticketId="ticket-123" channelType="facebook_page">
  ├── <ChannelContext />                  # Constraint banner
  ├── <AttachmentPreview />               # Thumbnails with remove buttons
  └── <div className="flex gap-2">
      ├── <RichTextInput />               # Main textarea
      ├── <AttachmentUploader />          # Paperclip button
      ├── <EmojiPicker />                 # Lazy-loaded (optional)
      └── <Button>Send</Button>
  </div>
</OmniReplier>
```

#### Implementation Details

**File Upload Flow**:

1. User selects file → Validate size/type
2. Create local preview with `URL.createObjectURL()`
3. Call `apiClient.upload()` with progress callback
4. Update `uploads` state with progress %
5. On success, store uploaded attachment with server URL
6. On send, attach only `status: "uploaded"` files

**Keyboard Shortcuts**:

- `Ctrl/Cmd + Enter`: Send message
- `Escape`: Close emoji picker
- `Tab`: Navigate between fields

**Performance**:

- Emoji picker bundle: ~25KB (lazy-loaded)
- Image previews: Use thumbnails, not full-size
- Debounce character counter updates: 100ms

---

## 9. Data Flow & Real-Time Updates

### WebSocket Integration

#### Connection Lifecycle

```typescript
// 1. User logs in
wsService.connect(); // Opens WebSocket with userId in query param

// 2. Subscribe to events
const unsubscribe = wsService.onMessage((message: UnifiedMessage) => {
  // Inject into TanStack Query cache
  queryClient.setQueryData(["messages", message.ticketId], (old) => [
    ...old,
    message,
  ]);
});

// 3. Send typing indicator
wsService.sendTyping(ticketId, true); // Agent is typing
wsService.sendTyping(ticketId, false); // Agent stopped typing

// 4. User logs out
wsService.disconnect();
```

#### Event Types

```typescript
type WebSocketEventType =
  | "message:new" // New message from customer/agent
  | "message:read" // Message marked as read
  | "ticket:updated" // Status/priority changed
  | "agent:typing"; // Typing indicator
```

#### Reconnection Strategy

- Max attempts: 5
- Backoff: Exponential (1s, 2s, 4s, 8s, 16s)
- Auto-reconnect unless `disconnect()` called manually

### Optimistic Update Flow

```
User Action (Send Message)
         │
         ▼
   useSendMessage.mutate()
         │
         ├─── onMutate: Add optimistic message to cache
         │    (with isOptimistic: true flag)
         │
         ├─── mutationFn: POST to /api/messages
         │                │
         │                ├─ Success → onSettled: Refetch from server
         │                │
         │                └─ Error → onError: Rollback cache
         │
         ▼
   User sees message instantly
   (Gray "Sending..." indicator if still pending)
```

---

## 10. Styling System

### Tailwind v4 Design Tokens

#### CSS Variables (globals.css)

```css
:root {
  /* Base colors (existing) */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;

  /* Inbox-specific */
  --inbox-sidebar-width: 320px;
  --inbox-replier-height: 160px;

  /* Channel colors */
  --channel-facebook: 214 89% 52%; /* #1877F2 */
  --channel-instagram: 330 75% 55%; /* #E1306C */

  /* SLA states */
  --sla-safe: 142 76% 36%;
  --sla-warning: 45 93% 47%;
  --sla-critical: 0 84% 60%;
}
```

#### Component Patterns

**shadcn/ui Pattern**:

```typescript
// 1. Define variants with CVA
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default, destructive, outline, secondary, ghost, link },
    size: { default, sm, lg, icon }
  },
  defaultVariants: { variant: "default", size: "default" }
});

// 2. Component with forwarded ref
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
```

**Responsive Utilities**:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
</div>
```

---

## 11. Security & Authentication

### Current Implementation

**Auth Flow**:

1. User submits login form
2. Backend validates credentials
3. Server returns JWT token + user object
4. Frontend stores in `auth-store` (persisted to localStorage)
5. API requests include `Authorization: Bearer <token>` header

**Route Protection**:

```typescript
// _authenticated.tsx
beforeLoad: () => {
  const { isAuthenticated } = useAuthStore.getState();
  if (!isAuthenticated) {
    throw redirect({ to: "/login", search: { redirect: location.pathname } });
  }
};
```

### Security Best Practices

1. **Token Storage**: Use `httpOnly` cookies instead of localStorage (future improvement)
2. **CSRF Protection**: Include CSRF token in state-changing requests
3. **XSS Prevention**: React escapes content by default, avoid `dangerouslySetInnerHTML`
4. **Content Security Policy**: Set CSP headers on backend
5. **Rate Limiting**: Implement on backend for login/signup endpoints

---

## 12. Deployment & Performance

### Build Optimization

```bash
# Production build
bun run build

# Output analysis
bun run build --analyze
```

**Expected Bundle Sizes**:

- Main bundle: ~180 KB (gzipped)
- Vendor chunk: ~120 KB (React, TanStack Router)
- Route chunks: 30-50 KB each

### Performance Checklist

- [x] Code splitting by route
- [x] Lazy-loaded emoji picker
- [x] Optimistic UI updates
- [x] WebSocket connection pooling
- [x] Image lazy loading (`loading="lazy"`)
- [ ] Service worker for offline support (future)
- [ ] Virtualized lists with `@tanstack/react-virtual` (partially implemented)
- [ ] Compression (gzip/brotli on CDN)

### Monitoring & Analytics

**Metrics to Track**:

- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1

**Tools**:

- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Web Vitals**: Core Web Vitals reporting

---

## Appendix A: File/Folder Tree

```
src/
├── main.tsx                      # App entry point
├── routeTree.gen.ts              # Auto-generated routes
├── types/
│   ├── message.ts                # UnifiedMessage, Attachment, Sender
│   ├── ticket.ts                 # Ticket, TicketFilters, SLATimer
│   ├── channel.ts                # ChannelConnection, ChannelCapabilities
│   └── workspace.ts              # Workspace, WorkspaceMember
├── services/
│   ├── channel-normalizer.ts    # Omnichannel data normalization
│   ├── api-client.ts             # REST API client with upload support
│   └── websocket.ts              # WebSocket service
├── hooks/
│   ├── use-messages.ts           # TanStack Query hooks for messages
│   ├── use-tickets.ts            # TanStack Query hooks for tickets
│   └── use-upload.ts             # File upload lifecycle hook
├── components/
│   ├── ui/                       # shadcn/ui primitives (Button, Input, Card)
│   ├── layout/
│   │   ├── global-sidebar.tsx   # Dual-pane sidebar
│   │   ├── workspace-selector.tsx
│   │   └── nav-links.tsx
│   └── shared/
│       ├── channel-badge.tsx    # Facebook/Instagram indicator
│       ├── sla-timer.tsx        # Countdown timer with color states
│       └── sentiment-badge.tsx  # Customer sentiment indicator
├── features/
│   ├── inbox/
│   │   ├── components/
│   │   │   ├── ticket-list.tsx
│   │   │   ├── ticket-card.tsx
│   │   │   ├── conversation-view.tsx
│   │   │   └── message-bubble.tsx
│   │   └── index.tsx
│   ├── replier/
│   │   ├── components/
│   │   │   ├── omni-replier.tsx
│   │   │   ├── rich-text-input.tsx
│   │   │   ├── emoji-picker.tsx
│   │   │   ├── emoji-picker-impl.tsx  # Lazy-loaded
│   │   │   ├── attachment-uploader.tsx
│   │   │   └── channel-context.tsx
│   │   └── index.tsx
│   └── workspace/
│       ├── components/
│       │   ├── workspace-avatar.tsx
│       │   └── add-workspace-modal.tsx
│       └── index.tsx
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   ├── _auth.tsx
│   ├── _auth/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── _authenticated.tsx
│   └── _authenticated/
│       ├── inbox.tsx
│       └── inbox/
│           ├── index.tsx
│           ├── $workspaceId.tsx
│           └── $workspaceId/
│               ├── index.tsx
│               └── $ticketId.tsx
├── stores/
│   ├── auth-store.ts
│   ├── channel-store.ts
│   ├── inbox-store.ts
│   └── ui-store.ts
├── lib/
│   └── utils.ts                  # cn() helper
└── styles/
    └── globals.css               # Tailwind + design tokens
```

---

## Appendix B: Architecture Decision Records (ADRs)

### ADR-001: TanStack Router over React Router

**Decision**: Use TanStack Router for routing  
**Rationale**:

- Type-safe route definitions with autocomplete
- Built-in search param validation (Zod integration)
- File-based routing reduces boilerplate
- Better TypeScript integration than React Router v6

**Trade-offs**: Smaller community, fewer examples

---

### ADR-002: Zustand over Redux

**Decision**: Use Zustand for client state  
**Rationale**:

- Minimal boilerplate (no actions/reducers)
- Built-in persistence middleware
- ~1KB bundle size vs Redux's ~8KB
- Simpler mental model for small-to-medium apps

**Trade-offs**: Less ecosystem tooling (no Redux DevTools equivalent)

---

### ADR-003: TanStack Query for Server State

**Decision**: Separate server state from client state  
**Rationale**:

- Automatic caching and revalidation
- Optimistic updates with rollback
- Request deduplication
- WebSocket integration via cache updates

**Trade-offs**: Learning curve for devs unfamiliar with the pattern

---

### ADR-004: Feature-Based Folder Structure

**Decision**: Organize by feature, not by file type  
**Rationale**:

- Better co-location of related code
- Easier to split into micro-frontends later
- Clearer domain boundaries
- Reduces cognitive load

**Trade-offs**: Requires discipline to avoid circular dependencies

---

## Appendix C: Next Steps & Future Enhancements

### Phase 2 Features

1. **Rich Text Formatting**: Bold, italic, bullet lists in messages
2. **@Mentions**: Tag agents in internal notes
3. **Saved Replies**: Canned responses library
4. **Ticket Templates**: Pre-fill common ticket fields
5. **Advanced Filters**: Regex search, custom fields

### Phase 3 Infrastructure

1. **Offline Support**: Service worker with background sync
2. **i18n**: Multi-language support with `react-i18next`
3. **Analytics**: Track feature usage with PostHog/Mixpanel
4. **E2E Tests**: Playwright test suite
5. **Storybook**: Component documentation

---

## Conclusion

This architecture provides a **scalable, performant, and maintainable** foundation for the MissionX CX platform. Key strengths:

✅ **Type Safety**: End-to-end TypeScript with strict checks  
✅ **Performance**: Lazy-loading, code-splitting, optimistic updates  
✅ **Developer Experience**: Clear folder structure, domain-driven design  
✅ **User Experience**: Instant feedback, real-time updates, channel-aware UI

**Next Actions**:

1. Set up CI/CD pipeline (GitHub Actions)
2. Configure Sentry for error tracking
3. Implement E2E tests for critical user flows
4. Conduct performance audit with Lighthouse
5. Deploy to staging environment

---

**Document History**:

- v1.0 (Jan 23, 2026): Initial implementation complete

**Reviewed By**: Senior Technical Architect  
**Approved By**: Engineering Lead  
**Status**: ✅ Ready for Development
