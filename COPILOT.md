# MissionX Client - Copilot Guidelines

This document serves as the implementation guide for AI assistants (Copilots) working on the MissionX Client project. Follow these rules to ensure consistency, performance, and maintainability.

## 1. Project Overview & Tech Stack

- **Framework**: React 18.3+ (Vite)
- **Runtime**: Bun
- **Language**: TypeScript 5.7+ (Strict mode)
- **Routing**: `@tanstack/react-router` (File-based routing)
- **State Management**:
  - Server: `@tanstack/react-query`
  - Client: `zustand`
- **Styling**: Tailwind CSS + Shadcn UI
- **Icons**: Lucide React

## 2. Layout & Styling Guidelines

### Page Structure (The "Flex-Col" Pattern)

To ensure proper scrolling behavior within the viewport (removing window scrollbars in favor of container scrollbars), usage of `flexbox` for structural layout is **mandatory**.

**DO NOT** use `grid` for the main page container if it contains scrollable areas, as it often causes overflow issues with `Tabs` or dynamic content.

**Standard Page Layout Template:**

```tsx
// Outer container: Full height, flex column, no overflow
<div className="h-full flex flex-col overflow-hidden p-4 gap-4">
  {/* Header Section: Fixed height */}
  <div className="flex justify-between items-center shrink-0">
    <h1>Title</h1>
    <Actions />
  </div>

  {/* Content Area: Takes remaining space, handles own scroll */}
  <div className="flex-1 min-h-0 overflow-y-auto">
    {/* Inner Content: Use Grid here for items */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id} />
      ))}
    </div>
  </div>
</div>
```

### Grid Usage

Use CSS Grid (`grid`) for **content collections** (cards, dashboard widgets, lists), but not for the high-level page page scaffolding (use Flexbox).

- **Responsive Grids**: Always use `grid-cols-1` mobile-first, then `md:grid-cols-X` etc.
  ```tsx
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  ```

### Height & Scrolling Rules

1. **`h-full`**: The root page element must have `h-full`.
2. **`overflow-hidden`**: The root page element must hide overflow to prevent body scroll.
3. **`flex-1 min-h-0`**: This combination is critical for flex children that need to scroll. Using `flex-1` alone is often insufficient in nested flex containers.
4. **`overflow-y-auto`**: Apply this ONLY to the specific container element that holds the long content.

## 3. Component Architecture

- **Feature-First**: Components specific to a feature (e.g., Inbox, Channels) go in `src/features/<feature-name>/`.
- **Shared UI**: Generic UI atoms (buttons, inputs) go in `src/components/ui/`.
- **Layouts**: Page layouts go in `src/components/layout/`.
- **Clean Code**: Keep components small. Extract sub-components (like `ChannelCard`, `StatCard`) into the same file or a sibling folder if they grow too large.

## 4. State Management Standards

- **Server State**: Use `useQuery` / `useMutation`. never cache API responses in local state (`useState`) unless transforming them for a specific UI need.
- **Form State**: Use mostly uncontrolled inputs with `react-hook-form` or `@tanstack/react-form` (if applicable), or controlled inputs for simple use cases.
- **Global UI State**: Use `zustand` stores (e.g., `useUIStore`).

## 5. Coding Standards

- **Naming**: PascalCase for components (`ChannelsPage`), camelCase for functions/vars (`handleSubmit`), kebab-case for filenames (`channels-page.tsx`).
- **Types**:
  - Explicitly type props interfaces.
  - No `any`. Use `unknown` if necessary, but prefer specific types.
- **Imports**: Use the `~/` or `@/` alias for absolute imports.
  ```tsx
  import { Button } from "@/components/ui/button"; // Correct
  import { Button } from "../../components/ui/button"; // Incorrect
  ```

## 6. Common Patterns (Copy-Paste Ready)

**Scrollable Tabs Content:**
When using Shadcn `Tabs`, the content area often loses height context. Wrap it like this:

```tsx
<Tabs className="flex-1 flex flex-col min-h-0">
  <TabsList className="shrink-0" />

  <TabsContent value="account" className="flex-1 min-h-0 overflow-hidden mt-0">
    <div className="h-full overflow-y-auto p-1">
      {/* Scrollable content here */}
    </div>
  </TabsContent>
</Tabs>
```
