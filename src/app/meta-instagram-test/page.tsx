/**
 * Meta & Instagram OAuth Testing UI Component
 *
 * Tests:
 * 1. Meta OAuth (Facebook Pages with optional linked Instagram)
 * 2. Instagram-Only OAuth (Direct Instagram connection)
 * 3. List connected channels
 * 4. Disconnect channels
 *
 * Deployment: Copy to missionx-client/src/app/meta-instagram-test/page.tsx
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Channel {
  id: string;
  platform: "facebook" | "instagram";
  platform_page_id: string;
  account_name: string;
  instagram_username?: string;
  parent_page_id?: string | null;
  is_active: boolean;
  is_verified: boolean;
  granted_permissions?: string[];
  created_at: string;
}

interface OAuthResponse {
  authorization_url: string;
  state: string;
  message: string;
}

interface ChannelsListResponse {
  channels: Channel[];
  total: number;
}

export default function MetaInstagramTestPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [subscriptionStatuses, setSubscriptionStatuses] = useState<
    Record<string, string>
  >({});
  const [appId, setAppId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState("http://localhost:8600");
  const [activeTab, setActiveTab] = useState<"meta" | "instagram" | "list">(
    "meta",
  );
  const router = useRouter();

  // Load access token from localStorage or get from URL params
  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    const savedAppId = localStorage.getItem("appId");
    if (savedToken) setAccessToken(savedToken);
    if (savedAppId) setAppId(savedAppId);

    // ✅ SECURE: Backend handles OAuth callback, not frontend
    // Backend redirects here after successful OAuth with success=true message
    const params = new URLSearchParams(window.location.search);
    const successMessage = params.get("success");
    const errorMessage = params.get("error");

    if (successMessage) {
      setSuccess(`✅ ${decodeURIComponent(successMessage)}`);
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
      // Reload channels
      setTimeout(() => loadChannels(), 1000);
    }

    if (errorMessage) {
      setError(`❌ ${decodeURIComponent(errorMessage)}`);
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Load channels on mount
    loadChannels();
  }, []);

  const saveSettings = () => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("appId", appId);
    setSuccess("Settings saved!");
    setTimeout(() => setSuccess(null), 3000);
  };

  // ❌ REMOVED: handleOAuthCallback
  // OAuth callback is now handled ONLY by backend
  // Backend validates state token and exchanges code for token
  // Backend stores token securely in database
  // Backend redirects to frontend with success message only
  // Frontend NEVER sees authorization code or state token

  // Popup OAuth Handler
  const openOAuthPopup = (url: string, type: "meta" | "instagram") => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      url,
      `oauth-${type}`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes`,
    );

    if (!popup) {
      setError("Popup blocked. Please allow popups and try again.");
      return;
    }

    // Listen for message from popup
    const handlePopupMessage = (event: MessageEvent) => {
      // Verify message is from our app (security)
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "oauth-complete") {
        if (event.data.success) {
          setSuccess(`✅ ${event.data.message}`);
          setTimeout(() => loadChannels(), 1000);
        } else {
          setError(`❌ ${event.data.message}`);
        }
        window.removeEventListener("message", handlePopupMessage);
      }
    };

    window.addEventListener("message", handlePopupMessage);

    // Poll for popup close (fallback)
    const checkPopupClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopupClosed);
        window.removeEventListener("message", handlePopupMessage);
        loadChannels();
      }
    }, 1000);
  };

  const initiateMetaOAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!appId) {
        setError("Please enter App ID");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${apiBaseUrl}/api/v1/channels/meta/oauth/initiate?app_id=${appId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to initiate OAuth: ${response.statusText}`);
      }

      const data: OAuthResponse = await response.json();
      setSuccess("🔗 Opening Meta OAuth popup...");

      // ✅ SECURE: Open in popup instead of redirecting
      // Backend already included state token in authorization_url
      // State token is handled by backend (stored in Redis, validated on callback)
      openOAuthPopup(data.authorization_url, "meta");
    } catch (err) {
      setError(
        `Meta OAuth Error: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const initiateInstagramOAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!appId) {
        setError("Please enter App ID");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${apiBaseUrl}/api/v1/channels/instagram/oauth/initiate?app_id=${appId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to initiate OAuth: ${response.statusText}`);
      }

      const data: OAuthResponse = await response.json();
      setSuccess("🔗 Opening Instagram OAuth popup...");

      // ✅ SECURE: Open in popup instead of redirecting
      // Backend already included state token in authorization_url
      // State token is handled by backend (stored in Redis, validated on callback)
      openOAuthPopup(data.authorization_url, "instagram");
    } catch (err) {
      setError(
        `Instagram OAuth Error: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const loadChannels = async () => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/v1/channels/meta/accounts`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        // Try Instagram endpoint if Meta fails
        const igResponse = await fetch(
          `${apiBaseUrl}/api/v1/channels/instagram/accounts`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (igResponse.ok) {
          const igData: ChannelsListResponse = await igResponse.json();
          setChannels(igData.channels);
        }
        return;
      }

      const data: ChannelsListResponse = await response.json();
      setChannels(data.channels);
    } catch (err) {
      console.error("Failed to load channels:", err);
    }
  };

  const disconnectChannel = async (channelId: string, platform: string) => {
    try {
      setLoading(true);
      setError(null);

      const endpoint =
        platform === "instagram"
          ? `/api/v1/channels/instagram/accounts/${channelId}`
          : `/api/v1/channels/meta/accounts/${channelId}`;

      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to disconnect: ${response.statusText}`);
      }

      setSuccess("✅ Channel disconnected");
      setTimeout(() => loadChannels(), 500);
    } catch (err) {
      setError(
        `Disconnect Error: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const disconnectIntegration = async (platform: "meta" | "instagram") => {
    try {
      setLoading(true);
      setError(null);

      if (!appId) {
        setError("Please enter App ID for bulk disconnect");
        return;
      }

      const endpoint =
        platform === "instagram"
          ? `/api/v1/channels/instagram/disconnect?app_id=${appId}`
          : `/api/v1/channels/meta/disconnect?app_id=${appId}`;

      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to disconnect integration: ${response.statusText}`,
        );
      }

      const data = await response.json();
      setSuccess(`✅ ${data.message}`);
      setTimeout(() => loadChannels(), 500);
    } catch (err) {
      setError(
        `Bulk Disconnect Error: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const checkSubscriptionStatus = async (channelId: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(
        `${apiBaseUrl}/api/v1/channels/meta/accounts/${channelId}/subscription-status`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to check status: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        const fields = data.data
          .map((item: any) => item.fields.join(", "))
          .join(" | ");
        const statusMsg = `Subscribed: ${fields || "None"}`;
        setSubscriptionStatuses((prev) => ({
          ...prev,
          [channelId]: statusMsg,
        }));
        setSuccess(`✅ Status updated for ${channelId}`);
      } else {
        const errorMsg = `Error: ${data.error}`;
        setSubscriptionStatuses((prev) => ({ ...prev, [channelId]: errorMsg }));
        setError(`❌ Status Check Failed: ${data.error}`);
      }
    } catch (err) {
      const errorMsg = `Error: ${err instanceof Error ? err.message : String(err)}`;
      setSubscriptionStatuses((prev) => ({ ...prev, [channelId]: errorMsg }));
      setError(
        `Status Check Error: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Meta & Instagram OAuth Testing
          </h1>
          <p className="text-gray-600">
            Test Facebook Pages and Instagram Business Account connection
          </p>
        </div>

        {/* Settings Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ⚙️ Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Base URL
              </label>
              <input
                type="text"
                value={apiBaseUrl}
                onChange={(e) => setApiBaseUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="http://localhost:8007"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                App ID (UUID)
              </label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="uuid-of-app"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Token (JWT)
              </label>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="jwt-token"
              />
            </div>
          </div>
          <button
            onClick={saveSettings}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Save Settings to LocalStorage
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 whitespace-pre-wrap">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 whitespace-pre-wrap">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("meta")}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === "meta"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              📱 Meta OAuth (Facebook)
            </button>
            <button
              onClick={() => setActiveTab("instagram")}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === "instagram"
                  ? "bg-pink-50 text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              📸 Instagram OAuth
            </button>
            <button
              onClick={() => {
                setActiveTab("list");
                loadChannels();
              }}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === "list"
                  ? "bg-purple-50 text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              📋 Connected Channels ({channels.length})
            </button>
          </div>

          {/* Meta OAuth Tab */}
          {activeTab === "meta" && (
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Connect Facebook Page with Optional Instagram
              </h3>
              <p className="text-gray-600 mb-6">
                This flow allows you to connect:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>
                  <strong>Facebook Page only</strong> → Creates 1 channel
                </li>
                <li>
                  <strong>Facebook Page + Linked Instagram</strong> → Creates 2
                  channels (FB + IG with parent_page_id)
                </li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">
                  🔐 Requirements:
                </h4>
                <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                  <li>Meta App with Facebook Login product configured</li>
                  <li>
                    Redirect URI:{" "}
                    <code className="bg-white px-2 py-1 rounded">
                      http://localhost:3000/meta-instagram-test
                    </code>
                  </li>
                  <li>
                    Scopes: pages_show_list, pages_messaging, instagram_basic,
                    instagram_manage_messages
                  </li>
                </ul>
              </div>

              <button
                onClick={initiateMetaOAuth}
                disabled={loading || !appId || !accessToken}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition text-lg"
              >
                {loading ? "🔄 Processing..." : "🔗 Connect Facebook Page"}
              </button>

              {/* Flow Diagram */}
              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-4">
                  📊 OAuth Flow:
                </h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      1
                    </div>
                    <span>Click button → Redirects to Facebook OAuth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      2
                    </div>
                    <span>User authorizes → Facebook redirects with code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      3
                    </div>
                    <span>Callback endpoint exchanges code for token</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      4
                    </div>
                    <span>Discovers pages and linked Instagram accounts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      5
                    </div>
                    <span>Creates separate channels for each account</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instagram OAuth Tab */}
          {activeTab === "instagram" && (
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Connect Instagram Business/Creator Account
              </h3>
              <p className="text-gray-600 mb-6">
                Direct Instagram connection without requiring a Facebook account
              </p>

              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-pink-900 mb-2">
                  🔐 Requirements:
                </h4>
                <ul className="list-disc list-inside text-sm text-pink-800 space-y-1">
                  <li>Instagram Business or Creator account (not Personal)</li>
                  <li>Meta App with Instagram Login product configured</li>
                  <li>Separate Instagram App ID & Secret (not Facebook's)</li>
                  <li>
                    Redirect URI:{" "}
                    <code className="bg-white px-2 py-1 rounded">
                      http://localhost:3000/meta-instagram-test
                    </code>
                  </li>
                  <li>
                    Scopes: instagram_business_basic,
                    instagram_business_manage_messages
                  </li>
                </ul>
              </div>

              <button
                onClick={initiateInstagramOAuth}
                disabled={loading || !appId || !accessToken}
                className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition text-lg"
              >
                {loading ? "🔄 Processing..." : "📸 Connect Instagram Account"}
              </button>

              {/* Flow Diagram */}
              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-4">
                  📊 OAuth Flow:
                </h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="bg-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      1
                    </div>
                    <span>Click button → Redirects to Instagram OAuth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      2
                    </div>
                    <span>User authorizes → Instagram redirects with code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      3
                    </div>
                    <span>
                      Uses api.instagram.com (not Facebook's endpoint)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      4
                    </div>
                    <span>Exchanges code for Instagram access token</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      5
                    </div>
                    <span>
                      Creates Instagram-only channel (parent_page_id=null)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Channels List Tab */}
          {activeTab === "list" && (
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Connected Channels ({channels.length})
              </h3>

              {channels.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">No channels connected yet</p>
                  <p className="text-sm">
                    Connect Facebook or Instagram to see them listed here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {channels.map((channel) => (
                    <div
                      key={channel.id}
                      className={`border rounded-lg p-6 ${
                        channel.platform === "facebook"
                          ? "border-blue-200 bg-blue-50"
                          : "border-pink-200 bg-pink-50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">
                            {channel.platform === "facebook" ? "📱" : "📸"}
                          </span>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">
                              {channel.account_name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {channel.platform === "facebook"
                                ? "Facebook Page"
                                : "Instagram Account"}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => checkSubscriptionStatus(channel.id)}
                            disabled={loading}
                            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white font-semibold py-1.5 px-3 rounded text-xs transition"
                          >
                            {loading ? "..." : "Check Hook Status"}
                          </button>
                          {channel.is_active ? (
                            <button
                              onClick={() =>
                                disconnectChannel(channel.id, channel.platform)
                              }
                              disabled={loading}
                              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-1.5 px-3 rounded text-xs transition"
                            >
                              {loading ? "..." : "Disconnect"}
                            </button>
                          ) : (
                            <span className="text-[10px] text-red-500 font-bold text-center border border-red-200 bg-red-50 py-1 rounded">
                              DISCONNECTED
                            </span>
                          )}
                        </div>
                      </div>

                      {subscriptionStatuses[channel.id] && (
                        <div className="mb-4 p-2 bg-indigo-100 border border-indigo-200 rounded text-xs font-mono text-indigo-800">
                          {subscriptionStatuses[channel.id]}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                          <span className="font-semibold">Platform ID:</span>
                          <p className="font-mono text-xs bg-gray-200 p-2 rounded mt-1 break-all">
                            {channel.platform_page_id}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold">Channel ID:</span>
                          <p className="font-mono text-xs bg-gray-200 p-2 rounded mt-1 break-all">
                            {channel.id}
                          </p>
                        </div>
                        {channel.instagram_username && (
                          <div>
                            <span className="font-semibold">
                              Instagram Username:
                            </span>
                            <p className="font-mono text-xs bg-gray-200 p-2 rounded mt-1">
                              @{channel.instagram_username}
                            </p>
                          </div>
                        )}
                        {channel.parent_page_id && (
                          <div>
                            <span className="font-semibold">
                              Linked to Facebook Page:
                            </span>
                            <p className="font-mono text-xs bg-gray-200 p-2 rounded mt-1">
                              {channel.parent_page_id}
                            </p>
                          </div>
                        )}
                        <div>
                          <span className="font-semibold">Status:</span>
                          <p className="mt-1">
                            {channel.is_active ? (
                              <span className="text-green-600">✅ Active</span>
                            ) : (
                              <span className="text-gray-500">⏸ Inactive</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold">Created:</span>
                          <p className="mt-1">
                            {new Date(channel.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {Array.isArray(channel.granted_permissions) &&
                        channel.granted_permissions.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-300">
                            <span className="font-semibold text-sm">
                              Permissions:
                            </span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {channel.granted_permissions.map((perm) => (
                                <span
                                  key={perm}
                                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs"
                                >
                                  {perm}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => loadChannels()}
                  disabled={loading}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  {loading ? "🔄 Refreshing..." : "🔄 Refresh List"}
                </button>
                <button
                  onClick={() => disconnectIntegration("meta")}
                  disabled={loading || !appId}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  {loading ? "..." : "💣 Bulk Disconnect Meta"}
                </button>
                <button
                  onClick={() => disconnectIntegration("instagram")}
                  disabled={loading || !appId}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  {loading ? "..." : "💣 Bulk Disconnect IG"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Documentation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📚 Testing Checklist
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                ✅ Before Testing:
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>
                  Have a Meta App created with Facebook Login or Instagram API
                </li>
                <li>Get a valid JWT access token from auth service</li>
                <li>Have an App ID (UUID) to associate connections with</li>
                <li>Meta/Instagram credentials configured in .env</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                🧪 Test Scenarios:
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>
                  <strong>Scenario 1:</strong> Connect Facebook Page without
                  Instagram → Should create 1 channel
                </li>
                <li>
                  <strong>Scenario 2:</strong> Connect Facebook Page with linked
                  Instagram → Should create 2 channels
                </li>
                <li>
                  <strong>Scenario 3:</strong> Connect Instagram directly →
                  Should create 1 Instagram channel with parent_page_id=null
                </li>
                <li>
                  <strong>Scenario 4:</strong> Disconnect channel → Should
                  soft-delete (is_active=false)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                🔍 Expected Results:
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>
                  Meta OAuth creates channels with platform='facebook' or
                  'instagram'
                </li>
                <li>
                  Instagram OAuth creates channels with platform='instagram' and
                  parent_page_id=null
                </li>
                <li>
                  Linked Instagram accounts have parent_page_id pointing to
                  Facebook Page ID
                </li>
                <li>Access tokens are properly stored for API calls</li>
                <li>Permissions are captured in granted_permissions field</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">
                ⚠️ Troubleshooting:
              </h4>
              <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                <li>
                  If OAuth doesn't redirect: Check redirect URI is exactly
                  matching in Meta Dashboard
                </li>
                <li>If callback fails: Verify JWT token is valid</li>
                <li>
                  If no channels appear: Check database connection and Channel
                  model
                </li>
                <li>
                  If permissions missing: Verify scopes in settings and OAuth
                  requests
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
