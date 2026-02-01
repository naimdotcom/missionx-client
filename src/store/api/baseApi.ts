"use client";

import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout } from "../authSlice";
import { tokenStore } from "./tokenStore";
import { saveReturnLocation } from "@/lib/locationPersistence";
import { getCookie } from "@/lib/cookies";

const SERVICE_URLS: Record<string, string> = {
  auth: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:8000",
  apps: process.env.NEXT_PUBLIC_APPS_SERVICE_URL || "http://localhost:8500",
  // customer service not in use right now? previous file had it commented or something
  // I will include it if standard
  customer:
    process.env.NEXT_PUBLIC_CUSTOMER_SERVICE_URL || "http://localhost:8007",
  webhook:
    process.env.NEXT_PUBLIC_WEBHOOK_SERVICE_URL || "http://localhost:8006",
};

const baseQuery = (baseUrl: string) =>
  fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // For localhost development with multiple ports, include token in Authorization header
      // This ensures requests to different services (auth:8000, apps:8500, etc) include the token
      const token = tokenStore.getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const state = getState() as { app?: { selectedApp?: { id: string } } };
      const appId = state.app?.selectedApp?.id;
      if (appId) {
        headers.set("X-App-Id", appId);
      }
      return headers;
    },
    credentials: "include",
  });

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

const customBaseQuery: BaseQueryFn<
  string | (FetchArgs & { service?: keyof typeof SERVICE_URLS }),
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const service = typeof args === "string" ? "auth" : args.service || "auth";
  const baseUrl = SERVICE_URLS[service];
  const queryArgs = typeof args === "string" ? args : { ...args };

  if (typeof queryArgs !== "string") {
    delete queryArgs.service;
  }

  // Get raw base query for the specific service
  const rawBaseQuery = baseQuery(baseUrl);

  // 1. Try the initial query
  let result = await rawBaseQuery(queryArgs, api, extraOptions);

  // 2. Check for 401 (access token expired)
  if (result.error && result.error.status === 401) {
    // If a refresh is already in progress, wait for it
    if (isRefreshing && refreshPromise) {
      console.log("[API] Refresh already in progress, waiting...");
      const success = await refreshPromise;

      if (success) {
        // Retry the original request with the new token
        console.log("[API] Retrying original request after refresh");
        result = await rawBaseQuery(queryArgs, api, extraOptions);
      } else {
        // Refresh failed, the logout has already been triggered
        console.log("[API] Refresh failed, request aborted");
      }
    } else {
      // Start a new refresh process
      isRefreshing = true;
      console.log("[API] Access token expired, attempting refresh...");

      // Create a shared promise for the refresh process
      refreshPromise = (async () => {
        try {
          // Call the refresh endpoint WITHOUT using customBaseQuery to avoid recursion
          const refreshResult = await baseQuery(SERVICE_URLS.auth)(
            {
              url: "/api/auth/refresh",
              method: "POST",
              // Include refresh_token in body for cross-domain localhost dev
              // Backend tries body first, then path cookie. Cross-site cookies don't work localhost->ngrok
              body: { refresh_token: getCookie("refresh_token") },
              credentials: "include",
            },
            api,
            extraOptions,
          );

          if (refreshResult.data) {
            console.log("[API] Token refresh successful");
            // Store the new access token
            const data = refreshResult.data as any;
            if (data.access_token) {
              tokenStore.setAccessToken(data.access_token);
              console.log("[API] New access token stored");
            }
            return true;
          } else if (refreshResult.error) {
            // Check if the refresh token itself is expired (401 from refresh endpoint)
            if (refreshResult.error.status === 401) {
              console.log(
                "[API] Refresh token expired - performing hard logout",
              );
            } else {
              console.log(
                "[API] Refresh failed with error:",
                refreshResult.error,
              );
            }
            return false;
          } else {
            console.log("[API] Refresh failed - no data or error returned");
            return false;
          }
        } catch (e) {
          console.error("[API] Refresh error:", e);
          return false;
        }
      })();

      const success = await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;

      if (success) {
        // Retry the original query with the new token
        console.log("[API] Retrying original request with new token");
        result = await rawBaseQuery(queryArgs, api, extraOptions);
      } else {
        // Hard logout: refresh token is expired or invalid
        console.log("[API] Refresh failed, logging out user");

        // Save current location so user can return after re-authentication
        if (typeof window !== "undefined") {
          saveReturnLocation(window.location.pathname);
        }

        // Clear tokens and logout
        tokenStore.clearAccessToken();
        api.dispatch(logout());
      }
    }
  }

  return result;
};

/**
 * Middleware to intercept and handle token extraction from auth responses
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["Profile", "Apps", "Sessions"],
  endpoints: () => ({}),
});

// Intercept successful auth responses to store the token

/**
 * Helper to extract and store token from auth responses
 * Should be called after login/google-login/refresh mutations
 */
export const extractAndStoreToken = (response: any) => {
  if (response?.access_token) {
    tokenStore.setAccessToken(response.access_token);
  }
  return response;
};
