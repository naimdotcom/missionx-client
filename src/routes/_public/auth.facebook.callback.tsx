import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_public/auth/facebook/callback")({
  component: FacebookCallbackPage,
});

function FacebookCallbackPage() {
  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const sessionId = params.get("session_id");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    // Send message to parent window (opener)
    if (window.opener) {
      if (error) {
        window.opener.postMessage(
          {
            type: "FACEBOOK_AUTH_ERROR",
            error,
            errorDescription,
          },
          window.location.origin
        );
      } else if (accessToken && refreshToken) {
        window.opener.postMessage(
          {
            type: "FACEBOOK_AUTH_SUCCESS",
            accessToken,
            refreshToken,
            sessionId,
          },
          window.location.origin
        );
      }
      
      // Close popup window
      window.close();
    } else {
      // If not in popup, show error
      console.error("This page should be opened in a popup window");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Completing Facebook login...
        </p>
      </div>
    </div>
  );
}
