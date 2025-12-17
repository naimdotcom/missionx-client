# Authentication API Client

A comprehensive Next.js application for interacting with the Authentication API, featuring user registration, login, session management, profile management, and customer data handling.

## Features

- 🔐 **User Registration** - Create new user accounts with email, password, and phone
- 🔑 **Login** - Secure authentication with JWT tokens
- 🔒 **Session Management** - Real-time session monitoring with countdown timer, auto-refresh, and multi-device management
- 👤 **Profile Management** - Create and update user profiles
- 👥 **Users List** - View all users with detailed information
- 🏢 **Customer Management** - Manage customer profiles and data

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **localStorage** - Client-side token management

## Getting Started

### Prerequisites

- Node.js 18+ or compatible runtime
- Backend API running on `http://localhost:8000` (or configure custom URL)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Create a `.env.local` file (optional):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

If not set, the app will default to `http://localhost:8000/api`.

### Development

Run the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Routes

- `/` - Home (redirects to `/register`)
- `/register` - User registration
- `/login` - User login
- `/session` - Session management and monitoring
- `/profile` - User profile management
- `/users` - View all users
- `/customers` - Customer profile management

## Features in Detail

### Session Management

The session page includes:
- **Real-time countdown timer** showing when your token expires
- **Auto-refresh toggle** to automatically refresh tokens before expiration
- **Multi-device session management** to view and revoke sessions on other devices
- **Visual warnings** when token is about to expire

### Token Storage

Tokens are stored in localStorage:
- `authToken` - JWT access token
- `refreshToken` - Refresh token for getting new access tokens
- `sessionId` - Current session identifier
- `tokenExpiresAt` - Timestamp when access token expires
- `refreshExpiresAt` - Timestamp when refresh token expires
- `autoRefresh` - Boolean for auto-refresh preference

### API Integration

All API calls are centralized in `/src/lib/api.ts` with:
- Token management utilities
- Automatic token refresh on 401 responses
- Type-safe API methods

## Project Structure

```
src/
├── app/
│   ├── register/page.tsx      # Registration page
│   ├── login/page.tsx         # Login page
│   ├── session/page.tsx       # Session management
│   ├── profile/page.tsx       # Profile management
│   ├── users/page.tsx         # Users list
│   ├── customers/page.tsx     # Customer management
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page (redirects)
│   └── globals.css            # Global styles
├── components/
│   ├── Navigation.tsx         # Navigation tabs
│   ├── PageContainer.tsx      # Page wrapper with gradient
│   └── ResponseBox.tsx        # API response display
└── lib/
    └── api.ts                 # API service layer
```

## Styling

The app uses a purple gradient theme matching the original HTML design:
- Primary color: `#667eea`
- Secondary color: `#764ba2`
- Gradient backgrounds
- Smooth transitions and hover effects
- Responsive design

## Backend API

This client expects a backend API with the following endpoints:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/session` - Get current session info
- `GET /api/auth/sessions` - Get all active sessions
- `DELETE /api/auth/sessions/:id` - Revoke a session
- `POST /api/auth/logout` - Logout current session
- `POST /api/auth/logout/all` - Logout all sessions
- `POST /api/users/profile` - Create/update user profile
- `GET /api/users/` - Get all users
- `GET /api/customers/` - Get all customers
- `GET /api/customers/me/full` - Get current user's customer profile
- `PUT /api/customers/me` - Update customer profile

## License

MIT
