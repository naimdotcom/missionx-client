# MissionX CX Omnichannel Inbox

A customer experience platform for unified messaging across Facebook and Instagram.

## Tech Stack

- **Framework**: TanStack Start (SSR-ready React framework)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: TanStack Form
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: PostgreSQL + Drizzle ORM
- **Package Manager**: Bun

## Features

- 🔐 Facebook/Instagram OAuth integration
- 💬 Unified message inbox across channels
- 📊 Real-time webhook handling
- 🎨 Modern UI with Shadcn components
- 🗄️ Normalized database schema for multi-channel support
- ⚡ High-concurrency webhook processing

## Getting Started

### Prerequisites

- Bun installed
- PostgreSQL database
- Facebook App with Messenger/Instagram permissions

### Setup

1. **Install dependencies**:

   ```bash
   bun install
   ```

2. **Configure environment variables**:

   ```bash
   cp .env.example .env
   ```

   Fill in the following:
   - `DATABASE_URL`: PostgreSQL connection string
   - `FACEBOOK_APP_ID`: Your Facebook App ID
   - `FACEBOOK_APP_SECRET`: Your Facebook App Secret
   - `FACEBOOK_WEBHOOK_VERIFY_TOKEN`: Random string for webhook verification
   - `SESSION_SECRET`: Random 32+ character string
   - `APP_URL`: Your app URL (for OAuth redirect)

3. **Generate and run database migrations**:

   ```bash
   bun run db:generate
   bun run db:migrate
   ```

4. **Start development server**:

   ```bash
   bun run dev
   ```

5. **Configure Facebook Webhooks**:
   - Go to your Facebook App → Messenger → Settings
   - Add webhook URL: `https://your-domain.com/api/webhooks/meta`
   - Verify token: Use the value from `FACEBOOK_WEBHOOK_VERIFY_TOKEN`
   - Subscribe to: `messages`, `messaging_postbacks`, `message_reads`

## Database Schema

The application uses a normalized schema designed for multi-channel messaging:

- **organizations**: Multi-tenant support
- **users**: Agent accounts
- **channel_connections**: OAuth tokens per Facebook Page/Instagram Account
- **contacts**: Deduplicated customer profiles
- **conversations**: Message threads linking contacts and channels
- **messages**: Unified message stream with rich content support
- **webhook_events**: Raw event log for idempotency and replay

## OAuth Flow

1. User clicks "Connect Facebook"
2. Redirected to `/auth/facebook`
3. Facebook OAuth dialog appears
4. User authorizes pages/Instagram accounts
5. Callback to `/api/auth/callback/facebook`
6. Exchange code for long-lived tokens (~60 days)
7. Fetch connected Pages and Instagram Business Accounts
8. Store credentials in `channel_connections` table
9. Redirect to inbox

## Webhook Architecture

High-concurrency webhook handling with deferred processing:

1. **Immediate acknowledgment**: Return 200 within Meta's 20s SLA
2. **Signature verification**: Validate `X-Hub-Signature-256` HMAC
3. **Event persistence**: Store raw payload in `webhook_events` table
4. **Idempotency**: Use `platform_message_id` to prevent duplicates
5. **Async processing**: Queue jobs for message normalization (TODO: Add Inngest/BullMQ)

## Project Structure

```
app/
├── routes/
│   ├── __root.tsx           # Root layout with HTML structure
│   ├── index.tsx            # Landing page
│   ├── auth/
│   │   └── facebook.tsx     # OAuth redirect
│   ├── api/
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── facebook.ts   # OAuth callback handler
│   │   └── webhooks/
│   │       └── meta.ts      # Facebook/Instagram webhook endpoint
│   └── inbox/
│       └── index.tsx        # Unified inbox UI
├── components/
│   └── ui/                  # Shadcn UI components
├── stores/
│   ├── auth-store.ts        # Authentication state
│   ├── inbox-store.ts       # Conversations and messages
│   └── channel-store.ts     # Channel connections
├── lib/
│   └── utils.ts             # Utility functions
└── styles/
    └── globals.css          # Global styles with Tailwind

db/
├── schema.ts                # Drizzle schema definitions
├── index.ts                 # Database client
└── migrations/              # Generated migrations
```

## Next Steps

- [ ] Add TanStack Query hooks for data fetching
- [ ] Implement TanStack Form for message composer
- [ ] Add Server-Sent Events for real-time updates
- [ ] Integrate Inngest or BullMQ for webhook job processing
- [ ] Add message processing worker
- [ ] Implement token refresh logic
- [ ] Add user authentication (session management)
- [ ] Build channel connection management UI
- [ ] Add rich message types (images, videos, reactions)
- [ ] Implement conversation assignment
- [ ] Add search and filtering

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run db:generate` - Generate migrations from schema
- `bun run db:migrate` - Run pending migrations
- `bun run db:studio` - Open Drizzle Studio

## License

MIT
