"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Database,
  Lock,
  Server,
  Zap,
} from "lucide-react";

export default function ChannelAPIDocs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Channel API Documentation
          </h1>
          <p className="text-lg text-slate-300">
            Complete guide to connecting and managing Meta/Instagram accounts
            via webhooks
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="oauth">OAuth Flow</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  System Architecture
                </CardTitle>
                <CardDescription>
                  How channels, apps, and webhooks work together
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Zap className="h-6 w-6 text-yellow-400 mt-1" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">
                        Channels
                      </h3>
                      <p className="text-slate-300 text-sm">
                        Individual Facebook Pages or Instagram accounts stored
                        in the database. Each channel has:
                      </p>
                      <ul className="text-slate-400 text-xs mt-2 space-y-1 ml-4">
                        <li>
                          • <code>id</code> - unique identifier
                        </li>
                        <li>
                          • <code>app_id</code> - which app it's connected to
                          (NULL if pending)
                        </li>
                        <li>
                          • <code>platform</code> - 'facebook' or 'instagram'
                        </li>
                        <li>
                          • <code>access_token</code> - API access for webhooks
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Server className="h-6 w-6 text-blue-400 mt-1" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">
                        Apps & Webhooks
                      </h3>
                      <p className="text-slate-300 text-sm">
                        When you subscribe a channel to an app:
                      </p>
                      <ul className="text-slate-400 text-xs mt-2 space-y-1 ml-4">
                        <li>
                          • Channel's <code>app_id</code> is set to the app UUID
                        </li>
                        <li>
                          • A webhook subscription is registered with Meta for
                          that page
                        </li>
                        <li>
                          • Instagram messages flow through parent Facebook page
                          webhooks
                        </li>
                        <li>
                          • Subscription status can be verified at any time
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Lock className="h-6 w-6 text-green-400 mt-1" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">
                        Parent-Child Relationships
                      </h3>
                      <p className="text-slate-300 text-sm">
                        When connecting a Facebook page with a linked Instagram
                        account:
                      </p>
                      <ul className="text-slate-400 text-xs mt-2 space-y-1 ml-4">
                        <li>• Two channels are created: one FB, one IG</li>
                        <li>
                          • IG channel's <code>parent_page_id</code> points to
                          FB channel
                        </li>
                        <li>• Subscribing one automatically subscribes both</li>
                        <li>• Webhook management done at FB page level</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Key Concepts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">
                      Collect vs Connect
                    </h4>
                    <p className="text-slate-300 text-sm">
                      <strong>Collect:</strong> Discover and store channels
                      without subscribing.
                      <code className="bg-slate-600 px-2 py-1 rounded text-xs ml-2">
                        app_id=NULL
                      </code>
                    </p>
                    <p className="text-slate-300 text-sm mt-2">
                      <strong>Connect:</strong> Subscribe channels to an app and
                      activate webhooks.
                      <code className="bg-slate-600 px-2 py-1 rounded text-xs ml-2">
                        app_id=UUID
                      </code>
                    </p>
                  </div>

                  <div className="bg-slate-700 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">
                      Two OAuth Paths
                    </h4>
                    <p className="text-slate-300 text-sm">
                      <strong>Meta (Facebook):</strong> Connect FB pages +
                      linked IG via Facebook Login
                    </p>
                    <p className="text-slate-300 text-sm mt-2">
                      <strong>Instagram Direct:</strong> Connect standalone IG
                      accounts without FB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OAuth Flow Tab */}
          <TabsContent value="oauth" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Meta OAuth Flow</CardTitle>
                <CardDescription>
                  Step-by-step Facebook/Instagram discovery and subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Initiate OAuth",
                    description:
                      "Frontend calls POST /channels/meta/oauth/initiate with app_id",
                    details:
                      "Backend generates CSRF state token, builds OAuth URL, returns to frontend",
                  },
                  {
                    step: 2,
                    title: "User Login",
                    description:
                      "User opens popup, logs into Facebook, grants permissions",
                    details:
                      "Permissions: pages_show_list, pages_messaging, instagram_manage_messages, etc.",
                  },
                  {
                    step: 3,
                    title: "Callback & Discovery",
                    description:
                      "Facebook redirects to backend callback with authorization code",
                    details:
                      "Backend exchanges code for access token, discovers all FB pages and linked IG accounts",
                  },
                  {
                    step: 4,
                    title: "Channel Sync",
                    description: "Backend syncs channels to database",
                    details:
                      "Creates/updates FB channels. For each FB page with linked IG, creates IG channel with parent_page_id pointing to FB channel. All have app_id=NULL initially.",
                  },
                  {
                    step: 5,
                    title: "Popup Closes",
                    description:
                      "Frontend shows success message, user returns to main page",
                    details:
                      'Channels are now available in "My Channels" list to subscribe',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">
                        {item.title}
                      </h4>
                      <p className="text-slate-300 text-sm mb-2">
                        {item.description}
                      </p>
                      <p className="text-slate-400 text-xs">{item.details}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Instagram Direct OAuth Flow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 text-sm">
                  Similar to Meta flow, but simpler: User logs into Instagram
                  directly (no Facebook required). Syncs a single standalone
                  Instagram account with no parent relationship.
                </p>
                <div className="bg-slate-700 p-4 rounded-lg space-y-2">
                  <p className="text-slate-200 font-semibold text-sm">
                    Differences:
                  </p>
                  <ul className="text-slate-400 text-xs space-y-1 list-disc ml-4">
                    <li>
                      Uses Instagram's direct OAuth endpoint (not facebook.com)
                    </li>
                    <li>Only Instagram Business/Creator accounts supported</li>
                    <li>No parent_page_id (standalone account)</li>
                    <li>Direct token exchange for long-lived access</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Endpoints Tab */}
          <TabsContent value="endpoints" className="space-y-6">
            {[
              {
                method: "POST",
                path: "/api/v1/channels/my",
                title: "Get My Channels",
                description:
                  "List all channels owned by the authenticated user (any app_id state)",
                request: "{}",
                response: '{ "user_id": "...", "total": 5, "channels": [...] }',
                notes: "This is the primary popup list endpoint",
              },
              {
                method: "GET",
                path: "/api/v1/channels/by-app/{app_id}",
                title: "Get App Channels",
                description:
                  "List all channels connected to a specific app (app_id is set)",
                request: "No body",
                response: '{ "app_id": "...", "total": 3, "channels": [...] }',
                notes: "Use to check what is currently connected to an app",
              },
              {
                method: "POST",
                path: "/api/v1/channels/subscribe",
                title: "Subscribe Channel",
                description:
                  "Bind a channel (and its FB/IG partner) to an app, subscribe webhooks",
                request: '{ "channel_id": "...", "app_id": "..." }',
                response:
                  '{ "subscribed": true, "app_id": "...", "affected_channel_ids": [...] }',
                notes:
                  "Pass FB or IG channel - service resolves full group and acts on both",
              },
              {
                method: "POST",
                path: "/api/v1/channels/unsubscribe",
                title: "Unsubscribe Channel",
                description:
                  "Unbind a channel (and partner) from app, unsubscribe webhooks",
                request: '{ "channel_id": "..." }',
                response:
                  '{ "subscribed": false, "affected_channel_ids": [...] }',
                notes: "Clears app_id and fires Meta DELETE webhook call",
              },
              {
                method: "POST",
                path: "/api/v1/channels/meta/oauth/initiate",
                title: "Meta OAuth Initiate",
                description: "Start Facebook/Instagram discovery flow",
                request: '{ "app_id": "...", "collect_only": false }',
                response:
                  '{ "authorization_url": "https://...", "state": "..." }',
                notes: "Open authorization_url in popup for user login",
              },
              {
                method: "POST",
                path: "/api/v1/channels/instagram/oauth/initiate",
                title: "Instagram OAuth Initiate",
                description: "Start direct Instagram discovery flow",
                request: '{ "app_id": "...", "collect_only": false }',
                response:
                  '{ "authorization_url": "https://api.instagram.com/oauth/...", "state": "..." }',
                notes: "Instagram Business/Creator account required",
              },
              {
                method: "GET",
                path: "/api/v1/channels/meta/accounts/{account_id}/subscription-status",
                title: "Check Subscription Status",
                description:
                  "Verify current webhook subscription status on Meta for a page",
                request: "No body",
                response:
                  '{ "success": true, "data": [{ "object": "page", "fields": [...] }] }',
                notes: "Returns what webhooks are currently active on the page",
              },
              {
                method: "DELETE",
                path: "/api/v1/channels/meta/accounts/{account_id}",
                title: "Disconnect Channel",
                description: "Soft-deactivate a channel (and children)",
                request: "No body",
                response: '{ "success": true, "message": "..." }',
                notes: "Sets is_active=false, unsubscribes webhooks",
              },
            ].map((endpoint, idx) => (
              <Card key={idx} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-semibold">
                        {endpoint.title}
                      </h3>
                      <p className="text-slate-300 text-sm">
                        {endpoint.description}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        endpoint.method === "GET"
                          ? "bg-blue-900 text-blue-200"
                          : endpoint.method === "POST"
                            ? "bg-green-900 text-green-200"
                            : "bg-red-900 text-red-200"
                      }`}
                    >
                      {endpoint.method}
                    </span>
                  </div>
                  <code className="text-slate-300 text-xs bg-slate-700 px-3 py-2 rounded">
                    {endpoint.path}
                  </code>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                      Request
                    </p>
                    <code className="bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded block overflow-x-auto">
                      {endpoint.request}
                    </code>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                      Response
                    </p>
                    <code className="bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded block overflow-x-auto">
                      {endpoint.response}
                    </code>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                      Notes
                    </p>
                    <p className="text-slate-300 text-xs">{endpoint.notes}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Workflow Tab */}
          <TabsContent value="workflow" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Testing Workflow</CardTitle>
                <CardDescription>
                  Step-by-step guide to test all functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {[
                  {
                    phase: "Phase 1: Setup",
                    steps: [
                      "Navigate to Channel API Tester (Configuration tab)",
                      "Set your Channel API URL (http://localhost:8600)",
                      "Get your access token from auth service",
                      "Create or select an app and copy its UUID",
                      "Save configuration (persists in localStorage)",
                    ],
                  },
                  {
                    phase: "Phase 2: Discover",
                    steps: [
                      "Go to OAuth & Connect tab",
                      'Click "Start Meta OAuth" (or Instagram OAuth)',
                      "Facebook login popup appears",
                      "Grant permissions when prompted",
                      "Popup closes, channels synced automatically",
                      "Check Response Log for success message",
                    ],
                  },
                  {
                    phase: "Phase 3: List & Review",
                    steps: [
                      "Go to Channels & Manage tab",
                      'Click "Refresh" on "My Channels" section',
                      "All discovered channels appear with app_id=NULL (pending)",
                      "Click a channel to see full details (ID, tokens, timestamps)",
                      "Identify FB and IG pairs (IG has parent_page_id pointing to FB)",
                    ],
                  },
                  {
                    phase: "Phase 4: Subscribe",
                    steps: [
                      'In "My Channels", select a channel to subscribe',
                      'Click "Subscribe" button',
                      "Backend calls Meta webhook subscription API",
                      "Channel's app_id is set to your configured app",
                      'Refresh "App Channels" - channel now appears there',
                      "If FB page with linked IG: both subscribed together",
                    ],
                  },
                  {
                    phase: "Phase 5: Verify",
                    steps: [
                      'In "App Channels", select a FB page',
                      'Click "Check Status" button',
                      "Response shows current webhook fields subscribed on Meta",
                      "Verify presence of messages, messaging_postbacks, etc.",
                      "For IG: fields include instagram_manage_messages",
                    ],
                  },
                  {
                    phase: "Phase 6: Manage",
                    steps: [
                      'Unsubscribe a channel: click "Unsubscribe" in "App Channels"',
                      "Backend clears app_id and calls Meta DELETE",
                      'Channel disappears from "App Channels"',
                      'Channel reappears in "My Channels" with app_id=NULL',
                      'Permanently remove: click Trash icon in "My Channels"',
                    ],
                  },
                ].map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-400" />
                      {section.phase}
                    </h3>
                    <ol className="space-y-3 ml-8">
                      {section.steps.map((step, stepIdx) => (
                        <li
                          key={stepIdx}
                          className="flex gap-3 text-slate-300 text-sm"
                        >
                          <span className="text-slate-500 font-semibold w-6">
                            {stepIdx + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-4">
            {[
              {
                q: "What does app_id=NULL mean?",
                a: 'A channel has been discovered (synced from Meta/Instagram) but not yet subscribed to any app. You must click "Subscribe" to bind it to an app and activate webhooks.',
              },
              {
                q: "Can I connect the same FB page to multiple apps?",
                a: "No. Each channel can only have one app_id at a time. If you want to switch, unsubscribe from current app first (clears app_id), then subscribe to a different app.",
              },
              {
                q: "What happens to an IG account if I unsubscribe its parent FB?",
                a: "Both the FB page and its linked IG account are unsubscribed together. Subscribe/unsubscribe always acts on the full parent+child group atomically.",
              },
              {
                q: "How do I test if webhooks are actually working?",
                a: 'Use the "Check Status" button on a FB page in "App Channels". It shows what fields Meta reports as subscribed. If status shows fields, webhooks are active.',
              },
              {
                q: "Can I collect channels without connecting them to an app?",
                a: "Not via the tester UI (it requires app_id), but the backend supports it via collect_only=true parameter. Useful for batch discovery.",
              },
              {
                q: "What if I reconnect a Meta account while channels exist?",
                a: "Channels are updated in-place (tokens refreshed), not duplicated. Existing app_id values are preserved.",
              },
              {
                q: "Is my access token stored securely?",
                a: "The tester stores it in browser localStorage for convenience. Never commit real tokens to version control. In production, use secure token management.",
              },
              {
                q: "What permissions does the channel API need?",
                a: "From Meta: pages_show_list, pages_messaging, instagram_basic, instagram_manage_messages, instagram_manage_comments. Your JWT token must have oauth_manage role for the app.",
              },
            ].map((item, idx) => (
              <Card key={idx} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-base">
                    {item.q}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 p-6 bg-slate-800 border border-slate-700 rounded-lg">
          <p className="text-slate-300 text-sm">
            <strong>API Base URL:</strong> localhost:8600/api/v1/channels
          </p>
          <p className="text-slate-400 text-xs mt-2">
            All endpoints require valid JWT token in Authorization header. See
            Configuration tab in Channel API Tester for setup instructions.
          </p>
        </div>
      </div>
    </div>
  );
}
