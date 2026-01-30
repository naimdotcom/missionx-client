// Configured Axios instance with interceptors for the MissionX API

import { env } from "@/lib/env";
import axios, { type AxiosInstance } from "axios";
import {
  authErrorInterceptor,
  authRequestInterceptor,
  authResponseInterceptor,
} from "./interceptors/auth.interceptor";
import { errorInterceptor } from "./interceptors/error.interceptor";
import {
  loggingErrorInterceptor,
  loggingRequestInterceptor,
  loggingResponseInterceptor,
} from "./interceptors/logging.interceptor";

// Configuration from environment variables
const BASE_URL = env.authUrl;

const TIMEOUT = env.apiTimeout;

/**
 * Creates and configures the Axios instance with interceptors
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request interceptors (executed in order)
  instance.interceptors.request.use(
    loggingRequestInterceptor, // Log first (dev only)
    undefined,
  );

  instance.interceptors.request.use(
    authRequestInterceptor, // Then inject auth token
    undefined,
  );

  // Response interceptors (executed in reverse order)
  instance.interceptors.response.use(
    authResponseInterceptor, // Handle auth response
    authErrorInterceptor, // Handle 401 errors
  );

  instance.interceptors.response.use(
    loggingResponseInterceptor, // Log successful response (dev only)
    loggingErrorInterceptor, // Log errors (dev only)
  );

  instance.interceptors.response.use(
    undefined,
    errorInterceptor, // Transform all errors to APIError
  );

  return instance;
};

/**
 * Singleton Axios instance used by all services
 */
export const axiosInstance = createAxiosInstance();

/**
 * Factory function to create scoped instances (for testing or channel-specific configs)
 */
export const createScopedAxiosInstance = (
  config?: Partial<{
    baseURL: string;
    timeout: number;
    headers: Record<string, string>;
  }>,
): AxiosInstance => {
  const instance = axios.create({
    baseURL: config?.baseURL || BASE_URL,
    timeout: config?.timeout || TIMEOUT,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...config?.headers,
    },
  });

  // Apply same interceptors as main instance
  instance.interceptors.request.use(loggingRequestInterceptor, undefined);
  instance.interceptors.request.use(authRequestInterceptor, undefined);
  instance.interceptors.response.use(
    authResponseInterceptor,
    authErrorInterceptor,
  );
  instance.interceptors.response.use(
    loggingResponseInterceptor,
    loggingErrorInterceptor,
  );
  instance.interceptors.response.use(undefined, errorInterceptor);

  return instance;
};
