// // Error interceptor - transforms Axios errors into APIError instances

// import type { AxiosError } from "axios";
// import { APIError } from "../types/api.types";

// /**
//  * Determines if error is a network error (no response from server)
//  */
// const isNetworkError = (error: AxiosError): boolean => {
//   return !error.response && !!error.request;
// };

// /**
//  * Extracts error message from response data
//  */
// const getErrorMessage = (error: AxiosError): string => {
//   const data = error.response?.data as any;

//   // Check for common error message fields
//   if (data?.message) return data.message;
//   if (data?.error) return data.error;
//   if (typeof data === "string") return data;

//   // Fallback to status-based message
//   return error.response
//     ? APIError.fromResponse(error.response.status).message
//     : "Network error. Please check your connection.";
// };

// /**
//  * Extracts rate limit retry time from headers (if available)
//  */
// const getRateLimitRetryAfter = (error: AxiosError): string | undefined => {
//   if (error.response?.status === 429) {
//     const retryAfter = error.response.headers["retry-after"];
//     if (retryAfter) {
//       return `Please retry in ${retryAfter} seconds`;
//     }
//   }
//   return undefined;
// };

// /**
//  * Error response interceptor - transforms errors into APIError
//  */
// export const errorInterceptor = (error: unknown): Promise<never> => {
//   // Handle non-Axios errors
//   if (!(error as any).isAxiosError) {
//     console.error("[API] Non-Axios error:", error);
//     return Promise.reject(new APIError("An unexpected error occurred", 500));
//   }

//   const axiosError = error as AxiosError;

//   // Handle network errors
//   if (isNetworkError(axiosError)) {
//     console.error("[API] Network error:", axiosError);
//     return Promise.reject(
//       new APIError("Network error. Please check your connection.", 0),
//     );
//   }

//   // Handle timeout errors
//   if (axiosError.code === "ECONNABORTED") {
//     console.error("[API] Request timeout:", axiosError);
//     return Promise.reject(
//       new APIError("Request timeout. Please try again.", 0),
//     );
//   }

//   // Handle HTTP error responses
//   if (axiosError.response) {
//     const { status, data } = axiosError.response;
//     const message = getErrorMessage(axiosError);
//     const code = (data as any)?.code;
//     const retryAfterMessage = getRateLimitRetryAfter(axiosError);

//     console.error(`[API] HTTP ${status} error:`, {
//       url: axiosError.config?.url,
//       method: axiosError.config?.method,
//       status,
//       message,
//       code,
//       data,
//     });

//     return Promise.reject(
//       new APIError(retryAfterMessage || message, status, code, data),
//     );
//   }

//   // Fallback for unknown errors
//   console.error("[API] Unknown error:", axiosError);
//   return Promise.reject(new APIError("An unexpected error occurred", 500));
// };

import axios from "axios";

/**
 * Error response interceptor - logs errors and returns the raw AxiosError
 * This gives consumers full flexibility to handle status codes and data.
 */
export const errorInterceptor = (error: unknown): Promise<never> => {
  if (!axios.isAxiosError(error)) {
    console.error("[API] Non-Axios error:", error);
    return Promise.reject(error);
  }

  const { response, config } = error;

  // Log error details for debugging
  console.error(
    `[API] ${config?.method?.toUpperCase()} ${config?.url} error:`,
    {
      status: response?.status,
      data: response?.data,
      message: error.message,
    },
  );

  return Promise.reject(error);
};
