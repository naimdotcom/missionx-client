"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";

interface Channel {
  id: string;
  platform: string;
  platform_page_id: string;
  account_name: string | null;
  instagram_username: string | null;
  parent_page_id: string | null;
  app_id: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string | null;
  updated_at: string | null;
}

interface ApiResponse {
  success: boolean;
  data: unknown;
  error?: string;
  timestamp: string;
}

export default function ChannelAPITestPage() {
  // Configuration state
  const [apiUrl, setApiUrl] = useState("http://localhost:8600");
  const [appId, setAppId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<ApiResponse[]>([]);
  const [activeTab, setActiveTab] = useState("config");

  // Channel data
  const [myChannels, setMyChannels] = useState<Channel[]>([]);
  const [appChannels, setAppChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  // Load config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem("channelApiTestConfig");
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setApiUrl(config.apiUrl || apiUrl);
        setAppId(config.appId || "");
        setAccessToken(config.accessToken || "");
        setUserId(config.userId || "");
      } catch (e) {
        console.error("Failed to load config:", e);
      }
    }
  }, []);

  // Save config to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "channelApiTestConfig",
      JSON.stringify({ apiUrl, appId, accessToken, userId }),
    );
  }, [apiUrl, appId, accessToken, userId]);

  const addResponse = (success: boolean, data: unknown, error?: string) => {
    const response: ApiResponse = {
      success,
      data,
      error,
      timestamp: new Date().toLocaleTimeString(),
    };
    setResponses((prev) => [response, ...prev].slice(0, 20)); // Keep last 20
  };

  const makeRequest = async (
    endpoint: string,
    method: "GET" | "POST" | "DELETE" = "GET",
    body?: unknown,
  ) => {
    if (!apiUrl || !accessToken) {
      addResponse(false, null, "API URL and Access Token required");
      return null;
    }

    setLoading(true);
    try {
      const url = `${apiUrl}${endpoint}`;
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        addResponse(true, data);
        return data;
      } else {
        addResponse(false, data, data.detail || "Request failed");
        return null;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      addResponse(false, null, errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Endpoint handlers
  const handleInitiateMeta = async () => {
    if (!appId) {
      addResponse(false, null, "App ID required");
      return;
    }

    const result = await makeRequest(
      "/api/v1/channels/meta/oauth/initiate",
      "POST",
      {
        app_id: appId,
        collect_only: false,
      },
    );

    if (result?.authorization_url) {
      addResponse(true, {
        ...result,
        message: "OAuth URL generated. Opening in new window...",
      });
      window.open(
        result.authorization_url,
        "oauth-popup",
        "width=800,height=600",
      );
    }
  };

  const handleInitiateInstagram = async () => {
    if (!appId) {
      addResponse(false, null, "App ID required");
      return;
    }

    const result = await makeRequest(
      "/api/v1/channels/instagram/oauth/initiate",
      "POST",
      {
        app_id: appId,
        collect_only: false,
      },
    );

    if (result?.authorization_url) {
      addResponse(true, {
        ...result,
        message: "OAuth URL generated. Opening in new window...",
      });
      window.open(
        result.authorization_url,
        "oauth-popup",
        "width=800,height=600",
      );
    }
  };

  const handleGetMyChannels = async () => {
    const result = await makeRequest("/api/v1/channels/my");
    if (result?.channels) {
      setMyChannels(result.channels);
    }
  };

  const handleGetAppChannels = async () => {
    if (!appId) {
      addResponse(false, null, "App ID required");
      return;
    }

    const result = await makeRequest(`/api/v1/channels/by-app/${appId}`);
    if (result?.channels) {
      setAppChannels(result.channels);
    }
  };

  const handleSubscribe = async (channelId: string) => {
    if (!appId) {
      addResponse(false, null, "App ID required");
      return;
    }

    const result = await makeRequest("/api/v1/channels/subscribe", "POST", {
      channel_id: channelId,
      app_id: appId,
    });

    if (result) {
      // Refresh both lists
      await handleGetMyChannels();
      await handleGetAppChannels();
    }
  };

  const handleUnsubscribe = async (channelId: string) => {
    const result = await makeRequest("/api/v1/channels/unsubscribe", "POST", {
      channel_id: channelId,
    });

    if (result) {
      // Refresh both lists
      await handleGetMyChannels();
      await handleGetAppChannels();
    }
  };

  const handleCheckSubscriptionStatus = async (channelId: string) => {
    const result = await makeRequest(
      `/api/v1/channels/meta/accounts/${channelId}/subscription-status`,
    );
    if (result) {
      addResponse(true, result);
    }
  };

  const handleDisconnectChannel = async (channelId: string) => {
    const result = await makeRequest(
      `/api/v1/channels/meta/accounts/${channelId}`,
      "DELETE",
    );

    if (result) {
      // Refresh lists
      await handleGetMyChannels();
      await handleGetAppChannels();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Channel API Tester
          </h1>
          <p className="text-slate-300">
            Test Meta/Instagram connections, subscriptions, and channel
            management
          </p>
        </div>

        {/* Main tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="oauth">OAuth & Connect</TabsTrigger>
            <TabsTrigger value="channels">Channels & Manage</TabsTrigger>
          </TabsList>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">API Configuration</CardTitle>
                <CardDescription>
                  Set up your channel API endpoint details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="apiUrl" className="text-slate-200">
                      Channel API URL
                    </Label>
                    <Input
                      id="apiUrl"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="http://localhost:8600"
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                    <p className="text-xs text-slate-400">
                      Base URL of your channel API service
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appId" className="text-slate-200">
                      App ID (UUID)
                    </Label>
                    <Input
                      id="appId"
                      value={appId}
                      onChange={(e) => setAppId(e.target.value)}
                      placeholder="550e8400-e29b-41d4-a716-446655440000"
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                    <p className="text-xs text-slate-400">
                      The app you want to connect channels to
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accessToken" className="text-slate-200">
                      Access Token (JWT)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="accessToken"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        placeholder="eyJhbGciOiJSUzI1NiIs..."
                        type="password"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                      <Button
                        onClick={() => copyToClipboard(accessToken)}
                        variant="outline"
                        size="sm"
                        className="border-slate-600"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400">
                      Your JWT authentication token (sent via Authorization
                      header)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userId" className="text-slate-200">
                      User ID (from token)
                    </Label>
                    <Input
                      id="userId"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="user@example.com"
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                    <p className="text-xs text-slate-400">
                      Reference - extracted from your JWT token
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <p className="text-sm text-slate-300 mb-2">
                    💡 <strong>Quick Setup:</strong>
                  </p>
                  <ol className="text-xs text-slate-400 space-y-1 ml-4 list-decimal">
                    <li>Get your JWT token from your auth service</li>
                    <li>Extract your user_id from the token payload</li>
                    <li>Create or select an app and copy its UUID</li>
                    <li>Fill in the fields above and save</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OAuth Tab */}
          <TabsContent value="oauth" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Meta OAuth */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-2xl">f</span> Meta / Facebook
                  </CardTitle>
                  <CardDescription>
                    Connect Facebook Pages and linked Instagram accounts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 bg-slate-700 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-slate-200">
                      What happens:
                    </h4>
                    <ul className="text-xs text-slate-400 space-y-1 list-disc ml-4">
                      <li>Initiates Meta OAuth flow (Facebook login popup)</li>
                      <li>Discovers all your Facebook Pages</li>
                      <li>Checks for linked Instagram Business accounts</li>
                      <li>
                        Syncs channels with app_id=NULL (not yet connected to
                        app)
                      </li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleInitiateMeta}
                    disabled={loading || !appId}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Start Meta OAuth
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-slate-400">
                    App ID required to initialize OAuth flow
                  </p>
                </CardContent>
              </Card>

              {/* Instagram OAuth */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span className="text-2xl">📷</span> Instagram Direct
                  </CardTitle>
                  <CardDescription>
                    Connect Instagram accounts without Facebook
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 bg-slate-700 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-slate-200">
                      What happens:
                    </h4>
                    <ul className="text-xs text-slate-400 space-y-1 list-disc ml-4">
                      <li>Initiates direct Instagram OAuth flow</li>
                      <li>Instagram Business/Creator account required</li>
                      <li>No Facebook Page connection needed</li>
                      <li>
                        Syncs standalone Instagram account with app_id=NULL
                      </li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleInitiateInstagram}
                    disabled={loading || !appId}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Start Instagram OAuth
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-slate-400">
                    App ID required to initialize OAuth flow
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* My Channels */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">My Channels</CardTitle>
                      <CardDescription>
                        All channels you own (any app_id state)
                      </CardDescription>
                    </div>
                    <Button
                      onClick={handleGetMyChannels}
                      disabled={loading}
                      size="sm"
                      variant="outline"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {myChannels.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400">No channels found</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Connect a Meta or Instagram account to see channels
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {myChannels.map((channel) => (
                        <div
                          key={channel.id}
                          className="p-3 bg-slate-700 rounded-lg border border-slate-600 hover:border-slate-500 cursor-pointer transition"
                          onClick={() => setSelectedChannel(channel)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  channel.platform === "facebook"
                                    ? "bg-blue-900 text-blue-200"
                                    : "bg-purple-900 text-purple-200"
                                }`}
                              >
                                {channel.platform}
                              </span>
                              {channel.app_id ? (
                                <span className="px-2 py-1 rounded text-xs bg-green-900 text-green-200">
                                  Connected
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded text-xs bg-yellow-900 text-yellow-200">
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-sm font-medium text-white truncate">
                            {channel.account_name ||
                              channel.instagram_username ||
                              "Unknown"}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            ID: {channel.platform_page_id}
                          </p>

                          {channel.app_id && (
                            <p className="text-xs text-slate-400 mt-1">
                              App: {channel.app_id}
                            </p>
                          )}

                          <div className="flex gap-2 mt-3">
                            {!channel.app_id ? (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSubscribe(channel.id);
                                }}
                                disabled={loading || !appId}
                                size="sm"
                                className="text-xs bg-green-600 hover:bg-green-700"
                              >
                                Subscribe
                              </Button>
                            ) : (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnsubscribe(channel.id);
                                }}
                                disabled={loading}
                                size="sm"
                                className="text-xs bg-orange-600 hover:bg-orange-700"
                              >
                                Unsubscribe
                              </Button>
                            )}

                            {channel.platform === "facebook" &&
                              channel.app_id && (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCheckSubscriptionStatus(channel.id);
                                  }}
                                  disabled={loading}
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                >
                                  Status
                                </Button>
                              )}

                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDisconnectChannel(channel.id);
                              }}
                              disabled={loading}
                              size="sm"
                              variant="destructive"
                              className="text-xs"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* App Channels */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">App Channels</CardTitle>
                      <CardDescription>
                        Connected to{" "}
                        {appId ? appId.slice(0, 8) + "..." : "no app"}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={handleGetAppChannels}
                      disabled={loading || !appId}
                      size="sm"
                      variant="outline"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {appChannels.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400">No channels connected</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {appId
                          ? 'Select channels from "My Channels" and click Subscribe'
                          : "Set App ID first"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {appChannels.map((channel) => (
                        <div
                          key={channel.id}
                          className="p-3 bg-slate-700 rounded-lg border border-green-600"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  channel.platform === "facebook"
                                    ? "bg-blue-900 text-blue-200"
                                    : "bg-purple-900 text-purple-200"
                                }`}
                              >
                                {channel.platform}
                              </span>
                              <CheckCircle2 className="h-4 w-4 text-green-400" />
                            </div>
                          </div>

                          <p className="text-sm font-medium text-white truncate">
                            {channel.account_name ||
                              channel.instagram_username ||
                              "Unknown"}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            ID: {channel.platform_page_id}
                          </p>

                          {channel.is_verified && (
                            <p className="text-xs text-green-400 mt-1">
                              ✓ Webhook verified
                            </p>
                          )}

                          <div className="flex gap-2 mt-3">
                            <Button
                              onClick={() => handleUnsubscribe(channel.id)}
                              disabled={loading}
                              size="sm"
                              className="text-xs bg-red-600 hover:bg-red-700 flex-1"
                            >
                              Unsubscribe
                            </Button>

                            {channel.platform === "facebook" && (
                              <Button
                                onClick={() =>
                                  handleCheckSubscriptionStatus(channel.id)
                                }
                                disabled={loading}
                                size="sm"
                                variant="outline"
                                className="text-xs flex-1"
                              >
                                Check Status
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Selected Channel Details */}
            {selectedChannel && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Channel Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm">
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">
                        ID
                      </p>
                      <p className="text-white break-all">
                        {selectedChannel.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">
                        Platform
                      </p>
                      <p className="text-white">{selectedChannel.platform}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">
                        Platform Page ID
                      </p>
                      <p className="text-white">
                        {selectedChannel.platform_page_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">
                        Account Name
                      </p>
                      <p className="text-white">
                        {selectedChannel.account_name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">
                        App ID
                      </p>
                      <p className="text-white">
                        {selectedChannel.app_id || "NULL (not connected)"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">
                        is_verified
                      </p>
                      <p
                        className={
                          selectedChannel.is_verified
                            ? "text-green-400"
                            : "text-yellow-400"
                        }
                      >
                        {selectedChannel.is_verified ? "true" : "false"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">
                        Created At
                      </p>
                      <p className="text-white text-xs">
                        {selectedChannel.created_at
                          ? new Date(
                              selectedChannel.created_at,
                            ).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">
                        Updated At
                      </p>
                      <p className="text-white text-xs">
                        {selectedChannel.updated_at
                          ? new Date(
                              selectedChannel.updated_at,
                            ).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Response Log */}
        <Card className="mt-8 bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Response Log</CardTitle>
              <Button
                onClick={() => setResponses([])}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-xs">
              {responses.length === 0 ? (
                <p className="text-slate-400 text-center py-4">
                  No responses yet
                </p>
              ) : (
                responses.map((response, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded border ${
                      response.success
                        ? "bg-green-900 border-green-700"
                        : "bg-red-900 border-red-700"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {response.success ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-200">{response.timestamp}</p>
                        {response.error && (
                          <p className="text-red-200 mt-1">{response.error}</p>
                        )}
                        {(response.data as any) && (
                          <pre className="text-slate-300 mt-2 overflow-x-auto bg-slate-900 p-2 rounded max-w-2xl">
                            {JSON.stringify(response.data, null, 2).substring(
                              0,
                              500,
                            )}
                            {JSON.stringify(response.data, null, 2).length >
                              500 && "..."}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
