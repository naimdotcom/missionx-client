## Plan: CX Omnichannel Inbox – Front-End Implementation

Design the front-end UI/UX for a unified Facebook/Instagram messaging platform. The stack uses TanStack Start, TanStack Query/Form, Zustand, Tailwind, and Shadcn UI. Back-end APIs will be implemented separately.

---

### Steps

1. **Initialize TanStack Start project** with TypeScript, Tailwind, Shadcn UI, and configure Zustand stores in `stores/` for auth state (`authStore`), inbox state (`inboxStore`), and channel connections (`channelStore`).

2. **Implement OAuth initiation flow** (front-end only):
   - Create `/auth/facebook` route to redirect users to Facebook OAuth dialog with required scopes
   - Create `/auth/callback` route to handle OAuth callback, extract tokens, and store in Zustand
   - Build channel connection UI to display connected Facebook Pages and Instagram accounts
   - Use Zustand's `authStore` for client-side session state

3. **Build unified inbox UI** with TanStack Query for API integration:
   - **Conversation List**:
     - `useInfiniteQuery` for paginated conversations with infinite scroll
     - Display contact name, avatar, last message preview, unread count
     - Filter by channel (Facebook/Instagram), status (open/closed), assigned agent
     - Search functionality
   - **Message Thread**:
     - Fetch messages for selected conversation using `useQuery`
     - Support multiple content types: text, images, videos, reactions, story mentions
     - Real-time updates via polling or WebSocket connection
     - Mark messages as read when viewed
   - **Message Composer**:
     - Use TanStack Form with validation for text input
     - File upload for images/videos/attachments
     - Emoji picker integration
     - `useMutation` + optimistic updates (show message immediately, sync with API)

4. **Create channel management UI**:
   - Channel connection wizard with step-by-step OAuth flow
   - Display connected channels with status indicators (active/inactive)
   - Disconnect/reconnect functionality
   - Token expiration warnings

5. **Build conversation management features**:
   - Assign conversations to agents (dropdown selector)
   - Change conversation status (open, pending, closed)
   - Set priority levels (low, normal, high, urgent)
   - Add internal notes/tags to conversations

6. **Implement real-time updates**:
   - Connect to SSE endpoint (`/api/inbox/stream`) or WebSocket
   - Update `inboxStore` when new messages arrive
   - Show notifications for new messages
   - Update conversation list order based on last message timestamp
   - Handle typing indicators if supported by API

7. **Add TanStack Form implementations**:
   - Message composer with validation (max length, required fields)
   - Quick replies/canned responses selector
   - Agent profile settings form
   - Conversation filters/search form

8. **Build responsive layouts**:
   - Desktop: 3-column layout (channels sidebar, conversation list, message thread)
   - Tablet: Collapsible sidebar, 2-column main area
   - Mobile: Stack views with navigation between conversations and messages

9. **Add Shadcn UI components**:
   - `Dialog` for modals (channel connection, settings)
   - `Dropdown Menu` for actions (assign, status change)
   - `Tabs` for conversation filters
   - `Badge` for unread counts, status indicators
   - `Avatar` for contacts and agents
   - `Textarea` for message composer
   - `Toast` for notifications

---

### API Integration Points (Back-end will provide)

The front-end expects these API endpoints:

<!-- 1. **Auth**:
   - `POST /api/auth/login` - Agent login
   - `POST /api/auth/logout` - Agent logout
   - `GET /api/auth/me` - Get current user

2. **Channels**:
   - `GET /api/channels` - List connected channels
   - `POST /api/channels/facebook` - Initiate Facebook OAuth
   - `DELETE /api/channels/:id` - Disconnect channel

3. **Conversations**:
   - `GET /api/conversations` - List conversations (paginated, filtered)
   - `GET /api/conversations/:id` - Get conversation details
   - `PATCH /api/conversations/:id` - Update conversation (assign, status, priority)

4. **Messages**:
   - `GET /api/conversations/:id/messages` - Get messages for conversation
   - `POST /api/conversations/:id/messages` - Send message
   - `PATCH /api/messages/:id/read` - Mark message as read

5. **Real-time**:
   - `GET /api/inbox/stream` - SSE endpoint for real-time updates
   - Or WebSocket connection to receive live message events -->

---

### Further Considerations

1. **Real-time strategy**: SSE (simpler, one-way) vs. WebSocket (bi-directional, typing indicators)?

2. **Offline support**: Use TanStack Query's cache for offline-first experience?

3. **Message rendering**: How to handle rich media (videos, carousels, reactions) in UI?

4. **Performance**: Virtual scrolling for long conversation lists and message threads?

5. **Accessibility**: Keyboard navigation, screen reader support, ARIA labels?
