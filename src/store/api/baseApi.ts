import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout } from "../authSlice";

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
      // Cookies are automatically handled by the browser
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

  // 2. Check for 401
  if (result.error && result.error.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      console.log("[API] Access token expired, attempting refresh...");

      // Create a shared promise for the refresh process
      refreshPromise = (async () => {
        try {
          // We call the refresh endpoint from the auth service WITHOUT using the customBaseQuery to avoid recursion loops
          const refreshResult = await baseQuery(SERVICE_URLS.auth)(
            {
              url: "/api/auth/refresh",
              method: "POST",
            },
            api,
            extraOptions
          );
          if (refreshResult.data) {
            console.log("[API] Refreshed successfully.");
            return true;
          } else {
            console.log("[API] Refresh failed.");
            return false;
          }
        } catch (e) {
          console.error("Refresh error", e);
          return false;
        }
      })();

      const success = await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;

      if (success) {
        // Retry the initial query
        result = await rawBaseQuery(queryArgs, api, extraOptions);
      } else {
        console.log("[API] Refresh failed, logging out.");
        api.dispatch(logout());
      }
    } else {
      // If refresh is already in progress, wait for it
      if (refreshPromise) {
        const success = await refreshPromise;
        if (success) {
          result = await rawBaseQuery(queryArgs, api, extraOptions);
        }
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["Profile", "Apps", "Sessions"],
  endpoints: () => ({}),
});
