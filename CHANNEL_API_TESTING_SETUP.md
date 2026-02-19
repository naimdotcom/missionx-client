# Channel API Testing UI - Setup & Navigation Guide

## 🚀 Quick Start

The frontend testing UI is now ready at two routes:

### 1. **Testing Interface** (Interactive)
```
http://localhost:3000/channel-api-test
```
Use this to test all channel API functionality interactively.

### 2. **Documentation** (Reference)
```
http://localhost:3000/channel-api-docs
```
Complete API documentation, workflows, and examples.

## 📋 What's Included

### Testing UI Features (`/channel-api-test`)

#### 🔧 Configuration Tab
- Set API Base URL (default: `http://localhost:8600`)
- App ID (your Meta app ID)
- Access Token (JWT bearer token)
- User ID (optional)
- All settings auto-save to browser localStorage

#### 🔐 OAuth & Connect Tab
- **Start Meta OAuth**: Initiates OAuth flow with Meta
- **Start Instagram OAuth**: Direct Instagram connection
- Collect-only mode for discovery without subscribing

#### 📱 Channels & Manage Tab
- **View My Channels**: All channels owned by authenticated user
- **View App Channels**: Channels currently subscribed to the app
- **Subscribe Channel**: Bind channel to app and enable webhooks
- **Check Subscription Status**: Verify webhook status on Meta
- **Unsubscribe Channel**: Remove channel from app and webhooks
- **Disconnect Channel**: Remove from all apps

#### 📝 Response Log
- Last 20 API responses displayed
- Success/error indicators
- Full request/response bodies
- Easy debugging and validation

### Documentation (`/channel-api-docs`)

#### 📖 Overview Tab
- System architecture explanation
- Channel, App, and Parent-Child relationships
- Key concepts and terminology

#### 🔑 OAuth Flow Tab
- Meta OAuth flow (5 steps)
- Instagram Direct OAuth flow
- Detailed step-by-step guides
- Authorization scope requirements

#### 🔌 Endpoints Tab
- All 8 core endpoints documented
- Request/response examples
- Required parameters and permissions
- Error codes and handling

#### 🎯 Workflow Tab
- 6-phase testing workflow
- Step-by-step instructions
- Validation checkpoints
- Expected results

#### ❓ FAQ Tab
- 8 common questions and answers
- Troubleshooting tips
- Best practices
- Edge case handling

## 🔗 Reusable Client Library

A TypeScript client is available for use in other components:

```typescript
import ChannelAPIClient from '@/lib/channel-api-client';

const client = new ChannelAPIClient({
  baseUrl: 'http://localhost:8600',
  accessToken: myJWT,
});

const result = await client.getMyChannels();
```

See `src/lib/CHANNEL_API_CLIENT_GUIDE.md` for full documentation.

## 🎮 Testing Workflow

### Phase 1: Setup
1. Navigate to `/channel-api-test`
2. Enter your API URL, App ID, and JWT token in Configuration tab
3. Verify connection by clicking any endpoint

### Phase 2: OAuth & Discovery
1. Go to OAuth & Connect tab
2. Click "Start Meta OAuth" or "Start Instagram OAuth"
3. Complete login in popup window
4. System discovers and syncs your channels

### Phase 3: Verification
1. Switch to Channels & Manage tab
2. Click "View My Channels" to see discovered channels
3. Verify information in the channel details panel

### Phase 4: Subscription
1. Select a channel from the list
2. Click "Subscribe Channel to App" in the app selector
3. Verify success in Response Log
4. Click "View App Channels" to confirm subscription

### Phase 5: Validation
1. Click "Check Subscription Status" on the subscribed channel
2. Verify webhook subscription is active on Meta
3. Check Response Log for details

### Phase 6: Management
1. To unsubscribe: Select channel and click "Unsubscribe"
2. To disconnect: Click "Disconnect Channel"
3. To remove integration: Click "Disconnect Integration"

## 📊 API Integration Points

The testing UI connects to these backend endpoints:

```
POST   /api/v1/channels/meta/oauth/initiate
POST   /api/v1/channels/instagram/oauth/initiate
GET    /api/v1/channels/my
GET    /api/v1/channels/by-app/{app_id}
POST   /api/v1/channels/subscribe
POST   /api/v1/channels/unsubscribe
GET    /api/v1/channels/meta/accounts/{channel_id}/subscription-status
POST   /api/v1/channels/meta/accounts/{channel_id}/webhook/subscribe
POST   /api/v1/channels/meta/accounts/{channel_id}/webhook/unsubscribe
DELETE /api/v1/channels/meta/accounts/{channel_id}
DELETE /api/v1/channels/meta/disconnect?app_id={app_id}
```

## 🔐 Authentication

The UI uses **Bearer Token (JWT) authentication**:

1. Obtain JWT token from your auth system
2. Enter in Configuration tab
3. Token is sent in `Authorization: Bearer {token}` header
4. Token is persisted in localStorage (dev only - not production safe)

## 🐛 Debugging Tips

### Response Log Not Updating
- Check that Configuration tab has correct API URL
- Verify access token is valid
- Check browser console for CORS errors

### OAuth Popup Not Opening
- Verify popup blocker is not active
- Check browser console for JavaScript errors
- Ensure Meta app credentials are correct

### Channels Not Appearing
- Verify OAuth flow completed successfully
- Check API logs on backend for sync errors
- Confirm user has permission to view channels

### Subscription Failed
- Verify channel ownership (must own to subscribe)
- Check that app_id is correct
- Confirm user has `oauth_manage` role on app
- Verify channel isn't already subscribed to this app

## 📁 File Structure

```
missionx-client/
├── src/
│   ├── app/
│   │   ├── channel-api-test/
│   │   │   ├── page.tsx              # Main testing UI (1000+ LOC)
│   │   │   └── layout.tsx            # Layout & metadata
│   │   └── channel-api-docs/
│   │       ├── page.tsx              # Documentation (900+ LOC)
│   │       └── layout.tsx            # Layout & metadata
│   └── lib/
│       ├── channel-api-client.ts     # Reusable TypeScript client
│       └── CHANNEL_API_CLIENT_GUIDE.md # Client usage guide
```

## 🚦 Status Indicators

### Response Log Colors
- 🟢 **Green**: Success (200-299 status)
- 🔴 **Red**: Error (400-599 status)
- ⚪ **Gray**: Pending/Loading

### Channel Status
- ✅ **Connected**: Channel actively subscribed to app
- ⏳ **Pending**: OAuth in progress
- ❌ **Disconnected**: Channel not subscribed to any app

## 🔄 Next Steps

1. **Start Testing**: Navigate to `/channel-api-test` and configure
2. **Complete OAuth Flow**: Use OAuth & Connect tab to discover channels
3. **Subscribe Channels**: Select channels and subscribe to your app
4. **Verify Webhooks**: Check subscription status with "Check Subscription Status"
5. **Monitor Response Log**: Use log to validate all operations

## 📞 Support

For issues or questions:

1. Check the **Documentation** page (`/channel-api-docs`) for answers
2. Review **Response Log** for error details
3. Check backend logs at `authentications/logs/`
4. Verify database state: `python check_db.py` from `authentications/`

## 🎯 Key Features Summary

| Feature | Location | Purpose |
|---------|----------|---------|
| Configuration | Test UI | Set API credentials |
| OAuth Initiation | Test UI | Start connection flows |
| Channel Discovery | Test UI | List available channels |
| Subscribe Operations | Test UI | Bind channels to apps |
| Response Validation | Test UI | View all API responses |
| API Reference | Docs | Full endpoint documentation |
| Workflow Guide | Docs | Step-by-step testing instructions |
| Client Library | `lib/` | Reusable TypeScript client |

## ✨ Tips & Best Practices

1. **Save Configuration**: First time setup saves to localStorage, persists across sessions
2. **Use Response Log**: Check last 20 responses when debugging
3. **Check Status**: Always verify subscription status before and after operations
4. **OAuth Collect Mode**: Use `collect_only=true` to discover without subscribing
5. **Parent-Child Handling**: System automatically manages FB page + linked IG relationships

---

**Created**: Frontend testing UI and documentation system
**Status**: Ready for use and testing
**Next**: Test against running backend services
