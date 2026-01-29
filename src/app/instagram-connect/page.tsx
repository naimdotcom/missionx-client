"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  useGetInstagramAccountsQuery,
  useInitiateInstagramOAuthMutation,
  useHandleInstagramOAuthCallbackMutation,
  useDisconnectInstagramAccountMutation,
} from "@/store/api/instagramApi";

export default function InstagramConnectPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Redux Query hooks
  const {
    data: accountsData,
    isLoading: isLoadingAccounts,
    refetch: refetchAccounts,
  } = useGetInstagramAccountsQuery();
  const [initiateOAuth, { isLoading: isInitiating }] =
    useInitiateInstagramOAuthMutation();
  const [handleOAuthCallback, { isLoading: isProcessingCallback }] =
    useHandleInstagramOAuthCallbackMutation();
  const [disconnectAccount, { isLoading: isDisconnecting }] =
    useDisconnectInstagramAccountMutation();

  const accounts = accountsData?.accounts || [];

  // Listen for messages from popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from our own origin for security
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === "INSTAGRAM_OAUTH_SUCCESS") {
        setSuccess(
          `Successfully connected ${event.data.accounts_added} account(s)!`,
        );
        // Refresh the accounts list
        refetchAccounts();
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 5000);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [refetchAccounts]);

  // Check for OAuth callback
  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const errorParam = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (errorParam) {
      setError(`OAuth Error: ${errorParam} - ${errorDescription}`);
      // If in popup, close after showing error
      if (window.opener) {
        setTimeout(() => {
          window.close();
        }, 3000);
      }
      return;
    }

    if (code && state) {
      // Make direct fetch call to backend (no Redux needed since state identifies user)
      fetch(
        `http://localhost:8000/api/v1/auth/instagram/oauth/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
        {
          credentials: "include",
        },
      )
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.detail || "OAuth callback failed");
            });
          }
          return response.json();
        })
        .then((data) => {
          setSuccess(
            `Successfully connected ${data.accounts_added || data.total_accounts || 1} account(s)!`,
          );
          // Clear URL params
          window.history.replaceState({}, "", "/instagram-connect");

          // If in popup, close the window after success
          if (window.opener) {
            // Notify parent window about success
            window.opener.postMessage(
              {
                type: "INSTAGRAM_OAUTH_SUCCESS",
                accounts_added: data.accounts_added || data.total_accounts || 1,
              },
              "*",
            );
            // Close popup after 1 second
            setTimeout(() => {
              window.close();
            }, 1000);
          }
        })
        .catch((err: any) => {
          const errorMsg = err.message || "Failed to connect Instagram account";
          setError(errorMsg);

          // If in popup, close after showing error
          if (window.opener) {
            setTimeout(() => {
              window.close();
            }, 3000);
          }
        });
    }
  }, [searchParams]);

  const handleInitiateOAuth = async () => {
    setError(null);
    setSuccess(null);

    try {
      const data = await initiateOAuth().unwrap();

      // Open OAuth in a popup window instead of redirecting
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        data.authorization_url,
        "InstagramOAuth",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
      );

      if (!popup) {
        setError(
          "Popup window was blocked. Please enable popups for this site.",
        );
        return;
      }

      // Poll for popup closure
      const pollInterval = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollInterval);
          // Refresh accounts after popup closes
          // The callback should have already updated the data if successful
        }
      }, 1000);
    } catch (err: any) {
      setError(err.data?.detail || err.message || "Failed to initiate OAuth");
    }
  };

  const handleDisconnectAccount = async (accountId: string) => {
    if (!confirm("Are you sure you want to disconnect this account?")) {
      return;
    }

    try {
      await disconnectAccount(accountId).unwrap();
      setSuccess("Account disconnected successfully");
    } catch (err: any) {
      setError(
        err.data?.detail || err.message || "Failed to disconnect account",
      );
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
              onClick={handleInitiateOAuth}
              disabled={isInitiating}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isInitiating ? "Connecting..." : "Connect Instagram Account"}
            </button>
          </div>

          {/* Connected Accounts */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Connected Accounts ({accounts.length})
            </h2>

            {isLoadingAccounts ? (
              <p className="text-gray-500">Loading accounts...</p>
            ) : accounts.length === 0 ? (
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
                        onClick={() => handleDisconnectAccount(account.id)}
                        disabled={isDisconnecting}
                        className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        {isDisconnecting ? "Disconnecting..." : "Disconnect"}
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
