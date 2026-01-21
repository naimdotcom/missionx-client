# MissionX CX Omnichannel Inbox

A unified inbox for managing Facebook and Instagram conversations with OAuth integration, webhook-resilient infrastructure, and real-time messaging capabilities.

## Features

- **Facebook/Instagram OAuth Integration**: Seamless connection with Facebook Pages and Instagram Business accounts
- **Unified Message Stream**: Normalized database schema for consistent message handling across platforms
- **Webhook-Resilient Infrastructure**: High-concurrency webhook handler with signature verification and idempotency
- **Real-Time Updates**: TanStack Query-based infinite scrolling and optimistic updates
- **Modern Stack**: Built with Next.js 16, TypeScript, Tailwind CSS, Drizzle ORM, Zustand, and TanStack Query

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: TanStack Form
- **Styling**: Tailwind CSS v4
- **TypeScript**: Full type safety

## Architecture

### Database Schema

The application uses a normalized database schema with the following core tables:

- `organizations` - Tenant isolation
- `users` - Agent accounts
- `channel_connections` - OAuth tokens per channel (Facebook Page / Instagram Business)
- `contacts` - External customers (deduplicated by platform ID)
- `conversations` - Threads linking contact + channel
- `messages` - Unified message stream with direction, content type, and JSONB payload
- `webhook_events` - Raw event log for idempotency and replay

### Key Components

1. **OAuth Flow** (`/auth/facebook`)
   - Redirects to Facebook OAuth dialog
   - Exchanges authorization code for access tokens
   - Fetches long-lived tokens
   - Stores channel connections in database

2. **Webhook Handler** (`/api/webhooks/meta`)
   - Verifies HMAC signature
   - Immediately returns 200 within 20s SLA
   - Persists raw events with idempotency checks
   - Processes events asynchronously

3. **Inbox UI** (`/inbox`)
   - Infinite scroll conversation list
   - Real-time message thread
   - Message composer with optimistic updates
   - Zustand state management

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Facebook App with required permissions

### Installation

1. Clone the repository:
```bash
git clone https://github.com/naimdotcom/missionx-client.git
cd missionx-client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL=postgresql://localhost:5432/missionx
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/auth/callback/facebook
FACEBOOK_WEBHOOK_VERIFY_TOKEN=missionx_verify_token
```

4. Set up the database:
```bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Facebook App Setup

1. Create a Facebook App at [developers.facebook.com](https://developers.facebook.com)
2. Add the following products:
   - Facebook Login
   - Webhooks
3. Configure OAuth Redirect URIs:
   - Add `http://localhost:3000/api/auth/callback/facebook` (development)
   - Add your production URL (production)
4. Request the following permissions:
   - `pages_messaging`
   - `pages_manage_metadata`
   - `instagram_basic`
   - `instagram_manage_messages`
5. Set up webhooks:
   - Callback URL: `https://your-domain.com/api/webhooks/meta`
   - Verify Token: Match your `FACEBOOK_WEBHOOK_VERIFY_TOKEN`
   - Subscribe to: `messages`, `messaging_postbacks`, `messaging_optins`

## Database Commands

```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema directly to database (dev only)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## API Endpoints

### OAuth
- `GET /auth/facebook` - Initiate Facebook OAuth flow
- `GET /api/auth/callback/facebook` - OAuth callback handler

### Webhooks
- `GET /api/webhooks/meta` - Webhook verification
- `POST /api/webhooks/meta` - Webhook event handler

### Inbox
- `GET /api/inbox/conversations` - Fetch conversations (with pagination)
- `GET /api/inbox/messages?conversationId=xxx` - Fetch messages for a conversation
- `POST /api/inbox/messages` - Send a message

## Further Considerations

### Production Deployment

1. **Database**: Use managed PostgreSQL (e.g., Supabase, Neon, Railway)
2. **Queue Infrastructure**: Implement Inngest or BullMQ for webhook processing
3. **Multi-tenant Isolation**: 
   - Implement proper authentication (NextAuth.js)
   - Use row-level security or application-level filtering
4. **Real-time Updates**: Consider implementing Server-Sent Events or WebSockets
5. **Monitoring**: Add error tracking (Sentry) and analytics

### Security

- All webhook payloads are verified using HMAC SHA-256
- OAuth tokens are stored securely in the database
- Environment variables used for sensitive credentials
- CSRF protection via state parameter in OAuth flow

## Development

```bash
# Run development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Facebook Graph API Documentation](https://developers.facebook.com/docs/graph-api)
- [Instagram Messaging API Documentation](https://developers.facebook.com/docs/messenger-platform/instagram)

## License

This project is licensed under the MIT License.

