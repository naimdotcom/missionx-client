# Agent Instructions - MissionX Client

## Priority Rules (MUST FOLLOW)

### Package Manager

- **ALWAYS use `bun` instead of `npm`, `npx`, `yarn`, or `pnpm`**
- Examples:
  - ✅ `bun run dev`
  - ✅ `bun run build`
  - ✅ `bun add <package>`
  - ✅ `bun remove <package>`
  - ❌ `npm run dev`
  - ❌ `npx tsc`
  - ❌ `yarn install`

### Code Style

- Prefer **composition over inheritance** (no BaseAPIService)
- Keep methods **type-safe** with generics
- Follow **existing naming conventions**
- Use **function-based exports** in services (no classes)

### API Layer Rules

- Services should use **function-based exports** (NOT class-based)
- Use **serviceRegistry.getClient("service-name")** to get the API client
- **NEVER** import `env` in service files
- **NEVER** extend BaseAPIService (it's been removed)
- Export individual functions, not class instances
- Services are **simple modules** with related functions

### Service Pattern (FUNCTION-BASED)

```typescript
import { API_ENDPOINTS, RequestOptions } from "@/api";
import { serviceRegistry } from "@/api/core/service-registry";
import { SomeType } from "./some.types";

const client = serviceRegistry.getClient("service-name");

export const someFunction = (params: Params, options?: RequestOptions) =>
  client.get<SomeType>(API_ENDPOINTS.SOME.ENDPOINT, params, options);

export const anotherFunction = (payload: Payload) =>
  client.post<ResponseType>(API_ENDPOINTS.ANOTHER.ENDPOINT, payload);
```

### Hook Pattern (with function-based services)

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { someFunction, anotherFunction } from "./some.service";

export const useSomeQuery = (params: Params) => {
  return useQuery({
    queryFn: () => someFunction(params),
    queryKey: ["some-key", params],
  });
};

export const useAnotherMutation = () => {
  return useMutation({
    mutationFn: (payload: Payload) => anotherFunction(payload),
  });
};
```

- Write **clear, concise commit messages**
- Focus on **"why"** not just "what"
- Review changes before committing

### General

- Run **type checks** before declaring tasks complete: `bun run build` (runs tsc)
- Use **parallel execution** for independent tasks
- **Read files** before editing to understand context
- Always respond in **English**

## Common Commands

```bash
# Development
bun run dev

# Type check + Build
bun run build

# Lint
bun run lint
bun run lint:fix

# Format
bun run format
bun run format:check

# Install dependencies
bun add <package>

# Run TypeScript check only
bunx tsc --noEmit
```

## Project Architecture Quick Reference

### API Layer Structure

```
src/api/
├── core/
│   ├── api-client.ts          # APIClient class with HTTP methods
│   ├── service-registry.ts    # Registry for managing clients
│   ├── init.ts                # Initialize all API clients
│   └── api.types.ts           # Shared types
├── services/
│   ├── auth/auth.service.ts   # Uses serviceRegistry.getClient("auth")
│   ├── apps/apps.service.ts   # Uses serviceRegistry.getClient("app")
│   └── ...
└── index.ts                   # Barrel exports
```

### Service Pattern

```typescript
import { API_ENDPOINTS, RequestOptions } from "@/api";
import { serviceRegistry } from "@/api/core/service-registry";
import { SomeType } from "./some.types";

const client = serviceRegistry.getClient("service-name");

export const someFunction = (params: Params, options?: RequestOptions) =>
  client.get<SomeType>(API_ENDPOINTS.SOME.ENDPOINT, params, options);

export const anotherFunction = (payload: Payload) =>
  client.post<ResponseType>(API_ENDPOINTS.ANOTHER.ENDPOINT, payload);
```
