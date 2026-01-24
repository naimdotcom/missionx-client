// Logging interceptor - logs requests and responses in development

import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const isDevelopment =
  import.meta.env.MODE === "development" ||
  import.meta.env.VITE_ENABLE_API_LOGGING === "true";

/**
 * Request interceptor - logs outgoing requests
 */
export const loggingRequestInterceptor = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  if (!isDevelopment) return config;

  const { method, url, params, data } = config;
  const timestamp = new Date().toISOString();

  console.group(`📤 [API Request] ${method?.toUpperCase()} ${url}`);
  console.log("Time:", timestamp);
  if (params) console.log("Params:", params);
  if (data) console.log("Data:", data);
  console.groupEnd();

  // Store request start time for duration calculation
  (config as any).metadata = { startTime: Date.now() };

  return config;
};

/**
 * Response interceptor - logs successful responses
 */
export const loggingResponseInterceptor = (
  response: AxiosResponse,
): AxiosResponse => {
  if (!isDevelopment) return response;

  const { config, status, data } = response;
  const duration = Date.now() - ((config as any).metadata?.startTime || 0);
  const dataSize = JSON.stringify(data).length;

  console.group(
    `📥 [API Response] ${config.method?.toUpperCase()} ${config.url} - ${status}`,
  );
  console.log("Duration:", `${duration}ms`);
  console.log("Size:", `${(dataSize / 1024).toFixed(2)} KB`);
  console.log("Data:", data);
  console.groupEnd();

  return response;
};

/**
 * Error interceptor - logs failed requests
 */
export const loggingErrorInterceptor = (error: AxiosError): Promise<never> => {
  if (!isDevelopment) return Promise.reject(error);

  const { config, response } = error;
  const duration = Date.now() - ((config as any)?.metadata?.startTime || 0);

  console.group(
    `❌ [API Error] ${config?.method?.toUpperCase()} ${config?.url} - ${response?.status || "Network Error"}`,
  );
  console.log("Duration:", `${duration}ms`);
  console.error("Error:", error.message);
  if (response?.data) console.error("Response:", response.data);
  console.groupEnd();

  return Promise.reject(error);
};
