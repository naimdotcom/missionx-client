// Authentication interceptor - injects Bearer token and handles 401 responses

import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "~/stores/auth-store";
import { PUBLIC_ROUTES } from "../types/endpoints";

/**
 * Request interceptor to inject Bearer token for authenticated routes
 */
export const authRequestInterceptor = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const { user } = useAuthStore.getState();

  // Skip token injection for public routes
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    config.url?.includes(route),
  );

  if (!isPublicRoute && user) {
    // TODO: Replace with actual JWT token once backend implements it
    const token = user.id; // Temporary: using user ID as token
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

/**
 * Response interceptor to handle 401 Unauthorized
 * Attempts token refresh, or logs out on failure
 */
export const authResponseInterceptor = async (
  response: AxiosResponse,
): Promise<AxiosResponse> => {
  return response;
};

/**
 * Error interceptor for 401 Unauthorized responses
 * TODO: Implement token refresh logic when backend supports it
 */
export const authErrorInterceptor = async (error: unknown): Promise<never> => {
  // For now, just logout on 401
  // In production, attempt token refresh first
  if ((error as any)?.response?.status === 401) {
    const { logout } = useAuthStore.getState();
    logout();

    // Redirect to login if not already there
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
  }

  return Promise.reject(error);
};
