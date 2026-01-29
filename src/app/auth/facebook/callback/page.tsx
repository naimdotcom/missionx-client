"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "@/store/authSlice";
import { useLazyGetAppsQuery } from "@/store/api";

function FacebookCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [getApps] = useLazyGetAppsQuery();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Processing Facebook login...");

  useEffect(() => {
    const processCallback = async () => {
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        setStatus("error");
        setMessage(errorDescription || error || "Facebook login failed");
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      const accessToken = searchParams.get("access_token");

      if (!accessToken) {
        setStatus("error");
        setMessage("No access token received");
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      // Note: Backend already sets cookies for accessToken and refreshToken
      // So we don't need to manually store them in localStorage anymore.

      dispatch(setAuthenticated(true));
      setStatus("success");
      setMessage("Login successful! Checking workspaces...");

      try {
        // Check for apps
        await getApps({}).unwrap();
        // Redirect to workspace selection (which could be the root if it handles it)
        // Or directly to a dedicated page
        router.push("/select-workspace");
      } catch (err) {
        console.error("Failed to fetch apps:", err);
        router.push("/");
      }
    };

    processCallback();
  }, [searchParams, router, dispatch, getApps]);

  return (
    <div className="flex flex-col items-center justify-center min-h-100">
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
  );
}

export default function FacebookCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <FacebookCallbackContent />
    </Suspense>
  );
}
