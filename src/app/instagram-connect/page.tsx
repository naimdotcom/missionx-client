"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface MetaAccount {
  id: string;
  page_id: string;
  instagram_business_account_id: string | null;
  platform: string;
  page_name: string;
  instagram_username: string | null;
  is_active: boolean;
  connected_at: string;
}

export default function InstagramConnectPage() {
  const [accounts, setAccounts] = useState<MetaAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Check for OAuth callback
  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const errorParam = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (errorParam) {
      setError(`OAuth Error: ${errorParam} - ${errorDescription}`);
      return;
    }

    if (code && state) {
      handleOAuthCallback(code, state);
    }
  }, [searchParams]);

  // Load connected accounts on mount
  useEffect(() => {
    loadAccounts();
  }, []);

  const handleOAuthCallback = async (code: string, state: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://localhost:8000/api/v1/auth/instagram/oauth/callback?code=${code}&state=${state}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Failed to connect Instagram account",
        );
      }

      const data = await response.json();
      setSuccess(`Successfully connected ${data.accounts_added} account(s)!`);

      // Reload accounts
      await loadAccounts();

      // Clear URL params
      window.history.replaceState({}, "", "/instagram-connect");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAccounts = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/instagram/accounts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load accounts");
      }

      const data = await response.json();
      setAccounts(data.accounts || []);
    } catch (err: any) {
      console.error("Failed to load accounts:", err);
    }
  };

  const initiateOAuth = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/instagram/oauth/initiate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to initiate OAuth");
      }

      const data = await response.json();

      // Redirect to Meta authorization page
      window.location.href = data.authorization_url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const disconnectAccount = async (accountId: string) => {
    if (!confirm("Are you sure you want to disconnect this account?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://localhost:8000/api/v1/auth/instagram/accounts/${accountId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to disconnect account");
      }

      setSuccess("Account disconnected successfully");
      await loadAccounts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-2">Instagram Connection</h1>
          <p className="text-gray-600 mb-6">
            Connect your Instagram Business account to start receiving messages
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Connect Button */}
          <div className="mb-8">
            <button
              onClick={initiateOAuth}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Connecting..." : "Connect Instagram Account"}
            </button>
          </div>

          {/* Connected Accounts */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Connected Accounts ({accounts.length})
            </h2>

            {accounts.length === 0 ? (
              <p className="text-gray-500 italic">
                No accounts connected yet. Click the button above to connect
                your Instagram.
              </p>
            ) : (
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {account.page_name}
                        </h3>

                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Platform:</span>{" "}
                            <span className="capitalize">
                              {account.platform}
                            </span>
                          </p>

                          <p>
                            <span className="font-medium">Page ID:</span>{" "}
                            <code className="bg-gray-100 px-1 rounded">
                              {account.page_id}
                            </code>
                          </p>

                          {account.instagram_business_account_id && (
                            <p>
                              <span className="font-medium">Instagram ID:</span>{" "}
                              <code className="bg-gray-100 px-1 rounded">
                                {account.instagram_business_account_id}
                              </code>
                            </p>
                          )}

                          {account.instagram_username && (
                            <p>
                              <span className="font-medium">
                                Instagram Username:
                              </span>{" "}
                              <span className="text-purple-600">
                                @{account.instagram_username}
                              </span>
                            </p>
                          )}

                          <p>
                            <span className="font-medium">Status:</span>{" "}
                            <span
                              className={
                                account.is_active
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {account.is_active ? "Active" : "Inactive"}
                            </span>
                          </p>

                          <p>
                            <span className="font-medium">Connected:</span>{" "}
                            {new Date(account.connected_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => disconnectAccount(account.id)}
                        className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors text-sm"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 border-t pt-6">
            <h3 className="font-semibold mb-2">Setup Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>
                Ensure you have set{" "}
                <code className="bg-gray-100 px-1 rounded">
                  INSTAGRAM_APP_ID
                </code>
                ,{" "}
                <code className="bg-gray-100 px-1 rounded">
                  INSTAGRAM_APP_SECRET
                </code>
                , and{" "}
                <code className="bg-gray-100 px-1 rounded">
                  INSTAGRAM_REDIRECT_URI
                </code>{" "}
                in your auth service .env
              </li>
              <li>
                Configure your Meta App webhook URL to:{" "}
                <code className="bg-gray-100 px-1 rounded">
                  https://your-domain.com/webhooks/meta
                </code>
              </li>
              <li>
                Set{" "}
                <code className="bg-gray-100 px-1 rounded">
                  META_WEBHOOK_VERIFY_TOKEN
                </code>{" "}
                in your webhook service .env
              </li>
              <li>
                Make sure you&apos;re logged in (have an access_token in
                localStorage)
              </li>
              <li>
                Click &quot;Connect Instagram Account&quot; to start the OAuth
                flow
              </li>
              <li>
                You&apos;ll be redirected to Meta to authorize your Business
                account
              </li>
              <li>
                After authorization, you&apos;ll be redirected back here with
                your connected accounts
              </li>
            </ol>
          </div>

          {/* Webhook Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              📡 Webhook Architecture
            </h3>
            <p className="text-sm text-blue-800">
              This implementation uses a{" "}
              <strong>unified webhook endpoint</strong> at{" "}
              <code className="bg-blue-100 px-1 rounded">/webhooks/meta</code>.
              Both Facebook and Instagram messages will be sent to this single
              endpoint. The webhook service automatically identifies which
              account the message belongs to using the{" "}
              <code className="bg-blue-100 px-1 rounded">page_id</code> from the
              webhook payload.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
