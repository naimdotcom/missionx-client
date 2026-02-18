import { useSearch } from "@tanstack/react-router";
import { useEffect } from "react";

export function OAuthCallbackPage() {
  const { success } = useSearch({ from: "/_public/oauth-callback" });

  useEffect(() => {
    try {
      if (success === true) {
        // Check if this is a popup window
        if (window.opener && window.opener !== window) {
          // Send success message to parent window
          window.opener.postMessage(
            {
              type: "oauth_success",
              success: true,
            },
            window.location.origin,
          );

          // Close popup after a short delay to ensure message is sent
          setTimeout(() => {
            window.close();
          }, 100);
        } else {
          // If not a popup (direct navigation), redirect to inbox
          window.location.href = "/inbox";
        }
      } else {
        // Handle failure case
        if (window.opener && window.opener !== window) {
          window.opener.postMessage(
            {
              type: "oauth_error",
              success: false,
            },
            window.location.origin,
          );
          setTimeout(() => {
            window.close();
          }, 100);
        } else {
          // Redirect back to login
          window.location.href = "/login";
        }
      }
    } catch (error) {
      console.error("OAuth callback error:", error);
      // Try to close popup or redirect
      if (window.opener) {
        window.close();
      } else {
        window.location.href = "/login";
      }
    }
  }, [success]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 animate-spin">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Authentication successful!
        </h1>
        <p className="text-gray-600">Redirecting you now...</p>
      </div>
    </div>
  );
}
