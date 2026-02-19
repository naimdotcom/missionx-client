# Channel API Client Usage Guide

## Overview
The `ChannelAPIClient` is a TypeScript utility class that provides type-safe methods for interacting with the Channel API. It handles authentication, error handling, and request formatting automatically.

## Installation

The client is available at:
```
src/lib/channel-api-client.ts
```

## Basic Usage

```typescript
import ChannelAPIClient from '@/lib/channel-api-client';

const client = new ChannelAPIClient({
  baseUrl: 'http://localhost:8600',
  accessToken: 'your-jwt-token',
  userId: 'user-123',
  appId: 'app-456',
});

// Make a request
const response = await client.getMyChannels();
console.log(response);
// Output: { success: true, data: {...}, statusCode: 200 }
```

## API Methods

### OAuth Endpoints

#### Initiate Meta OAuth
```typescript
const response = await client.initiateMeta('app-id', false);
// collectOnly: false = full sync, true = discovery only
```

#### Initiate Instagram Direct OAuth
```typescript
const response = await client.initiateInstagram('app-id', false);
```

### Channel Management

#### Get All My Channels
```typescript
const response = await client.getMyChannels();
// Returns: All channels owned by authenticated user
```

#### Get Channels Connected to an App
```typescript
const response = await client.getAppChannels('app-id');
// Returns: Channels that have been subscribed to this app
```

#### Subscribe Channel to App
```typescript
const response = await client.subscribeChannel('channel-id', 'app-id');
// Binds channel to app and subscribes to webhooks
```

#### Unsubscribe Channel from App
```typescript
const response = await client.unsubscribeChannel('channel-id');
// Unbinds channel from app and unsubscribes from webhooks
```

### Webhook Management

#### Check Subscription Status
```typescript
const response = await client.checkSubscriptionStatus('channel-id');
// Returns: Current webhook subscription status
```

#### Subscribe to Webhooks
```typescript
const response = await client.subscribeWebhook('channel-id');
// Manually subscribe to Meta webhooks
```

#### Unsubscribe from Webhooks
```typescript
const response = await client.unsubscribeWebhook('channel-id');
// Manually unsubscribe from Meta webhooks
```

### Account Management

#### Disconnect Channel
```typescript
const response = await client.disconnectAccount('channel-id');
// Removes channel from all apps
```

#### Disconnect Integration
```typescript
const response = await client.disconnectIntegration('app-id');
// Removes all channels for an app integration
```

## Response Format

All methods return a standardized response object:

```typescript
interface APIResponse<T> {
  success: boolean;        // true if request succeeded
  data?: T;               // Response data (if successful)
  error?: string;         // Error message (if failed)
  statusCode?: number;    // HTTP status code
}
```

### Success Response
```typescript
{
  success: true,
  data: {
    channels: [...]
  },
  statusCode: 200
}
```

### Error Response
```typescript
{
  success: false,
  error: 'Invalid app_id',
  statusCode: 400
}
```

## Helper Methods

### Get All Channels with Details
```typescript
const channels = await client.getAllChannelsForApp('app-id');
// Returns just the array of channels
```

### Find Parent Channel
```typescript
const parentId = await client.findParentChannel('instagram-channel-id');
// Helpful for linked FB page + IG account relationships
```

## Usage in React Components

```typescript
import { useState, useEffect } from 'react';
import ChannelAPIClient from '@/lib/channel-api-client';

export function ChannelManager() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadChannels = async () => {
      setLoading(true);
      const client = new ChannelAPIClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8600',
        accessToken: localStorage.getItem('accessToken') || '',
      });
      
      const response = await client.getMyChannels();
      if (response.success) {
        setChannels(response.data?.channels || []);
      }
      setLoading(false);
    };

    loadChannels();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {channels.map((ch) => (
        <div key={ch.id}>{ch.name}</div>
      ))}
    </div>
  );
}
```

## Error Handling

```typescript
const response = await client.getMyChannels();

if (!response.success) {
  console.error('Failed to fetch channels:', response.error);
  // Handle error: show toast, retry, etc.
} else {
  // Process channels
  const channels = response.data?.channels || [];
}
```

## Configuration Tips

### Environment Variables
For production, set API URL via environment:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
```

Then use:
```typescript
const client = new ChannelAPIClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8600',
  accessToken: token,
});
```

### Token Refresh
For token refresh logic, extend the client:

```typescript
class ExtendedChannelAPIClient extends ChannelAPIClient {
  async requestWithRefresh<T>(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: unknown) {
    let response = await this.request<T>(endpoint, method, body);
    
    if (response.statusCode === 401) {
      // Refresh token logic here
      // Retry request
    }
    
    return response;
  }
}
```

## Common Workflows

### 1. Connect a Meta Page and Subscribe to App

```typescript
// Step 1: Start oauth collection (collect_only=true)
await client.initiateMeta('app-id', true);

// Step 2: User completes OAuth in popup
// [User logs in to Meta, authorizes page access]

// Step 3: List chapters discovered
const myChannels = await client.getMyChannels();
const fbPage = myChannels.data?.channels?.find(ch => ch.platform === 'facebook');

// Step 4: Subscribe to app
await client.subscribeChannel(fbPage.id, 'app-id');
```

### 2. Manage Connected Channels

```typescript
// Get current connections
const appChannels = await client.getAppChannels('app-id');

// Unsubscribe one
await client.unsubscribeChannel(channelId);

// Check webhook status
const status = await client.checkSubscriptionStatus(channelId);
```

### 3. Bulk Disconnect

```typescript
// Remove all channels for an app
await client.disconnectIntegration('app-id');
```

## Debugging

Enable verbose logging by wrapping the client:

```typescript
class DebugChannelAPIClient extends ChannelAPIClient {
  async request(endpoint, method, body) {
    console.log('🔵', method, endpoint, body);
    const response = await super.request(endpoint, method, body);
    console.log('✅', response);
    return response;
  }
}
```

## Related Files

- **Testing UI**: `src/app/channel-api-test/page.tsx` - Full interactive test interface
- **Documentation**: `src/app/channel-api-docs/page.tsx` - Complete API documentation
- **Backend API**: `authentications/app/api/v1/endpoints/channel_management.py`
