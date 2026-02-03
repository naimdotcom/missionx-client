/**
 * OAuth Callback Handler Page
 *
 * This page is loaded in the OAuth popup window.
 * After the OAuth flow completes, this page:
 * 1. Receives success/error message from URL
 * 2. Sends message to parent window (via postMessage)
 * 3. Closes the popup
 */

"use client";

import { useEffect } from "react";

export default function OAuthCallbackPage() {
  useEffect(() => {
    // Get query parameters from URL
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success") === "true";
    const message = params.get("message") || "OAuth completed";
    const error = params.get("error");

    // Prepare message for parent window
    const messageData = {
      type: "oauth-complete",
      success: success && !error,
      message: error || message,
    };

    // Send message to parent window
    window.opener?.postMessage(messageData, window.location.origin);

    // Close popup after a short delay
    setTimeout(() => {
      window.close();
    }, 1000);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ fontSize: "24px", marginBottom: "16px" }}>
          ✅ Authorization Complete
        </div>
        <div style={{ fontSize: "14px", color: "#666" }}>
          This window will close automatically...
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#999",
            marginTop: "16px",
            fontFamily: "monospace",
          }}
        >
          Do not close this window manually
        </div>
      </div>
    </div>
  );
}
