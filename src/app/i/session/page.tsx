"use client";
import { useState, useEffect, useCallback } from "react";
import PageContainer from "@/components/PageContainer";
import ResponseBox from "@/components/ResponseBox";
import { tokenManager } from "@/lib/api";
import {
  useLazyGetSessionInfoQuery,
  useLazyGetAllSessionsQuery,
  useRefreshTokenMutation,
  useRevokeSessionMutation,
  useLogoutMutation,
  useLogoutAllMutation,
} from "@/store/api";
import { Session } from "@/lib/types";

export default function SessionPage() {
  const [response, setResponse] = useState<unknown>(null);
  const [isError, setIsError] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tokenStatus, setTokenStatus] = useState("No token stored");
  const [sessionId, setSessionId] = useState("-");
  const [refreshStatus, setRefreshStatus] = useState("Not available");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState("--:--");
  const [isWarning, setIsWarning] = useState(false);
  const [timerStatus, setTimerStatus] = useState("");

  const [getSessionInfo] = useLazyGetSessionInfoQuery();
  const [getAllSessions] = useLazyGetAllSessionsQuery();
  const [refreshToken] = useRefreshTokenMutation();
  const [revokeSession] = useRevokeSessionMutation();
  const [logout] = useLogoutMutation();
  const [logoutAll] = useLogoutAllMutation();

  const updateTokenStatus = useCallback(() => {
    const token = tokenManager.getAuthToken();
    const refresh = tokenManager.getRefreshToken();
    const sid = tokenManager.getSessionId();
    const autoRef = tokenManager.getAutoRefresh();

    setAutoRefresh(autoRef);

    if (token) {
      setTokenStatus("✅ Access token active");
      setSessionId(sid || "Unknown");
      setRefreshStatus(refresh ? "✅ Available" : "❌ Not available");
    } else {
      setTokenStatus("❌ No token stored");
      setSessionId("-");
      setRefreshStatus("❌ Not available");
    }
  }, []);

  const updateCountdown = useCallback(() => {
    const now = Date.now();
    const expiresAt = tokenManager.getTokenExpiresAt();
    const remaining = Math.max(0, expiresAt - now);
    const seconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    setCountdown(
      `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    );

    // Read autoRefresh directly from tokenManager to avoid dependency on React state
    const currentAutoRefresh = tokenManager.getAutoRefresh();

    if (seconds < 120 && seconds > 0) {
      setIsWarning(true);
      setTimerStatus("⚠️ Token expiring soon!");
    } else if (seconds === 0) {
      setIsWarning(true);
      setTimerStatus("🔴 Token expired - Please login again");
    } else {
      setIsWarning(false);
      setTimerStatus(
        currentAutoRefresh
          ? "🔄 Auto-refresh enabled"
          : "⏸️ Auto-refresh disabled"
      );
    }
  }, []);

  useEffect(() => {
    updateTokenStatus();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [updateTokenStatus, updateCountdown]);

  const handleGetSessionInfo = async () => {
    setResponse("Loading...");
    try {
      const data = await getSessionInfo(undefined).unwrap();
      setResponse({
        message: "📋 Current Session Details:",
        session_id: data.session_id,
        user_id: data.user_id,
        email: data.email,
        created_at: new Date(data.created_at).toLocaleString(),
        last_activity: new Date(data.last_activity).toLocaleString(),
        expires_in: `${Math.floor(data.expires_in / 60)} minutes`,
        device: data.user_agent || "Unknown",
        ip: data.ip_address || "Unknown",
      });
      setIsError(false);
    } catch (err: unknown) {
      const errorObj = err as { data?: unknown; message?: string };
      setResponse(
        errorObj.data || errorObj.message || "Error fetching session details"
      );
      setIsError(true);
    }
  };

  const handleGetAllSessions = async () => {
    setResponse("Loading...");
    try {
      const data = await getAllSessions(undefined).unwrap();
      setSessions(data.sessions || []);
      setResponse({ message: `Found ${data.total} active session(s)` });
      setIsError(false);
    } catch (err: unknown) {
      const errorObj = err as { data?: unknown; message?: string };
      setResponse(
        errorObj.data || errorObj.message || "Error fetching sessions"
      );
      setIsError(true);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    if (
      !confirm(
        "Are you sure you want to revoke this session? The device will be logged out."
      )
    ) {
      return;
    }

    try {
      await revokeSession(sessionId).unwrap();
      handleGetAllSessions();
    } catch (err: unknown) {
      const errorObj = err as { data?: { detail?: string }; message?: string };
      alert(errorObj.data?.detail || "Failed to revoke session");
    }
  };

  const handleRefreshToken = async () => {
    setResponse("Refreshing token...");
    try {
      const refreshTokenValue = tokenManager.getRefreshToken();
      if (!refreshTokenValue) throw new Error("No refresh token available");

      const data = await refreshToken({
        refresh_token: refreshTokenValue,
      }).unwrap();

      // Store new tokens
      tokenManager.storeTokens(data);

      updateTokenStatus();
      setResponse({
        message: "Token refreshed successfully!",
        new_expires_in: `${Math.floor((tokenManager.getTokenExpiresAt() - Date.now()) / 1000)} seconds`,
      });
      setIsError(false);
    } catch (err: unknown) {
      const errorObj = err as { data?: { detail?: string }; message?: string };
      setResponse({
        error:
          "Failed to refresh token: " +
          (errorObj.data?.detail || errorObj.message || "Unknown error"),
      });
      setIsError(true);
    }
  };

  const handleLogout = async () => {
    setResponse("Logging out...");
    try {
      await logout(undefined).unwrap();
    } catch (e) {
      // Ignore logout errors, proceeed to clear
      console.warn("Logout failed", e);
    }
    tokenManager.clearSession();
    updateTokenStatus();
    setResponse({ message: "Logged out successfully. Session invalidated." });
    setIsError(false);
  };

  const handleLogoutAll = async () => {
    if (!confirm("This will log you out from ALL devices. Continue?")) {
      return;
    }

    setResponse("Logging out from all devices...");
    try {
      const data = await logoutAll(undefined).unwrap();
      tokenManager.clearSession();
      updateTokenStatus();
      setResponse(data);
      setIsError(false);
    } catch (err: unknown) {
      const errorObj = err as { data?: { detail?: string }; message?: string };
      setResponse({
        error: errorObj.data?.detail || errorObj.message || "Logout failed",
      });
      setIsError(true);
    }
  };

  const toggleAutoRefresh = () => {
    const newValue = !autoRefresh;
    setAutoRefresh(newValue);
    tokenManager.setAutoRefresh(newValue);
  };

  return (
    <PageContainer title="Authentication API">
      <h2 className="text-foreground mb-5 pb-2.5 border-b-2 border-primary text-2xl font-semibold">
        🔒 Secure Session Management
      </h2>

      {/* Session Timer */}
      {tokenManager.getAuthToken() && (
        <div
          className={`p-5 rounded-xl mb-5 text-center border-2 ${
            isWarning
              ? "bg-red-50 dark:bg-red-900/20 border-destructive animate-pulse"
              : "bg-amber-50 dark:bg-amber-900/20 border-amber-400 dark:border-amber-700"
          }`}
        >
          <div className="text-base font-semibold text-foreground">
            ⏱️ Session Expires In
          </div>
          <div
            className={`text-5xl font-bold font-mono my-2 ${
              isWarning
                ? "text-destructive"
                : "text-amber-600 dark:text-amber-500"
            }`}
          >
            {countdown}
          </div>
          <div className="text-sm text-muted-foreground">{timerStatus}</div>
        </div>
      )}

      {/* Auto Refresh Toggle */}
      <div className="flex items-center gap-2.5 my-4 p-2.5 bg-muted rounded-lg">
        <label className="relative inline-block w-[50px] h-[26px]">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={toggleAutoRefresh}
            className="opacity-0 w-0 h-0 peer"
          />
          <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-input transition-all duration-400 rounded-[26px] before:absolute before:content-[''] before:h-5 before:w-5 before:left-[3px] before:bottom-[3px] before:bg-background before:transition-all before:duration-400 before:rounded-full peer-checked:bg-emerald-500 peer-checked:before:translate-x-6"></span>
        </label>
        <span className="text-sm text-foreground">
          🔄 Auto-refresh tokens (keeps you logged in)
        </span>
      </div>

      {/* Session Info */}
      <div className="bg-sky-50 dark:bg-sky-900/20 p-5 rounded-lg mb-5 text-foreground">
        <p className="mb-2">
          <strong>Token Status:</strong> <span>{tokenStatus}</span>
        </p>
        <p className="mb-2">
          <strong>Session ID:</strong> <span>{sessionId}</span>
        </p>
        <p>
          <strong>Refresh Token:</strong> <span>{refreshStatus}</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2.5 flex-wrap mb-5">
        <button
          onClick={handleGetSessionInfo}
          className="bg-linear-to-br from-[#667eea] to-[#764ba2] text-white px-7 py-3.5 rounded-lg text-base cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          📋 Session Details
        </button>
        <button
          onClick={handleGetAllSessions}
          className="bg-linear-to-br from-[#667eea] to-[#764ba2] text-white px-7 py-3.5 rounded-lg text-base cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          📱 All Devices
        </button>
        <button
          onClick={handleRefreshToken}
          className="bg-emerald-500 text-white px-7 py-3.5 rounded-lg text-base cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          🔄 Refresh Token Now
        </button>
        <button
          onClick={handleLogout}
          className="bg-amber-500 text-white px-7 py-3.5 rounded-lg text-base cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          🚪 Logout
        </button>
        <button
          onClick={handleLogoutAll}
          className="bg-destructive text-white px-7 py-3.5 rounded-lg text-base cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          🚫 Logout All Devices
        </button>
      </div>

      <ResponseBox response={response} isError={isError} />

      {/* Active Sessions List */}
      {sessions.length > 0 && (
        <div className="mt-5">
          <h3 className="text-xl font-semibold mb-4 text-foreground">
            📱 Active Sessions
          </h3>
          {sessions.map((session) => (
            <div
              key={session.session_id}
              className={`bg-card border rounded-lg p-4 mb-2.5 ${
                session.is_current
                  ? "border-emerald-500 border-2 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-border"
              }`}
            >
              <div className="flex justify-between items-center text-foreground">
                <div>
                  <strong>
                    {session.is_current
                      ? "✅ Current Session"
                      : "📱 Other Device"}
                  </strong>
                  <br />
                  <small className="text-muted-foreground">
                    🌐{" "}
                    {session.user_agent
                      ? session.user_agent.substring(0, 50) + "..."
                      : "Unknown Device"}
                  </small>
                  <br />
                  <small className="text-muted-foreground">
                    📍 IP: {session.ip_address || "Unknown"} | ⏰ Last active:{" "}
                    {new Date(session.last_activity).toLocaleString()}
                  </small>
                </div>
                {!session.is_current && (
                  <button
                    onClick={() => handleRevokeSession(session.session_id)}
                    className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                  >
                    🚫 Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
