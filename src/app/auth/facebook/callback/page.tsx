"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageContainer from "@/components/PageContainer";

export default function FacebookCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing Facebook login...");

  useEffect(() => {
    const processCallback = () => {
      // Check for errors
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        setStatus("error");
        setMessage(errorDescription || error || "Facebook login failed");
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      // Get tokens from URL
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");
      const sessionId = searchParams.get("session_id");
      const expiresIn = searchParams.get("expires_in");
      const refreshExpiresIn = searchParams.get("refresh_expires_in");

      if (!accessToken) {
        setStatus("error");
        setMessage("No access token received");
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      // Store tokens in localStorage
      localStorage.setItem("authToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      if (sessionId) localStorage.setItem("sessionId", sessionId);
      
      // Calculate and store expiration times
      const now = Date.now();
      if (expiresIn) {
        const tokenExpiresAt = now + parseInt(expiresIn) * 1000;
        localStorage.setItem("tokenExpiresAt", tokenExpiresAt.toString());
      }
      if (refreshExpiresIn) {
        const refreshExpiresAt = now + parseInt(refreshExpiresIn) * 1000;
        localStorage.setItem("refreshExpiresAt", refreshExpiresAt.toString());
      }

      setStatus("success");
      setMessage("Login successful! Redirecting...");
      
      // Redirect to home or dashboard
      setTimeout(() => router.push("/"), 1500);
    };

    processCallback();
  }, [searchParams, router]);

  return (
    <PageContainer title="Facebook Login">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        {status === "loading" && (
          <>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-muted-foreground">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <p className="text-lg text-green-600 dark:text-green-400 font-semibold">
              {message}
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">❌</span>
            </div>
            <p className="text-lg text-red-600 dark:text-red-400 font-semibold">
              {message}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Redirecting to login page...
            </p>
          </>
        )}
      </div>
    </PageContainer>
  );
}
