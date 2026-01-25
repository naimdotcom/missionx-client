// Abstract base service class with generic HTTP methods and AbortController support

import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type {
  APIResponse,
  PaginatedResponse,
  QueryParams,
  RequestOptions,
} from "./api.types";
import { axiosInstance } from "./axios-instance";

/**
 * Abstract base service class providing common HTTP methods with:
 * - Type-safe generic responses
 * - AbortController support for request cancellation
 * - Automatic response data extraction
 */
export abstract class BaseAPIService {
  protected axios: AxiosInstance;

  constructor(axios: AxiosInstance = axiosInstance) {
    this.axios = axios;
  }

  /**
   * Build Axios config from options
   */
  protected buildConfig(options?: RequestOptions): AxiosRequestConfig {
    return {
      signal: options?.signal,
      headers: options?.headers,
    };
  }

  /**
   * Build query string from params object
   */
  protected buildQueryString(params?: QueryParams): string {
    if (!params) return "";

    const filteredParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const searchParams = new URLSearchParams(
      filteredParams as Record<string, string>,
    );

    const query = searchParams.toString();
    return query ? `?${query}` : "";
  }

  /**
   * GET request with type-safe response
   */
  protected async get<T>(
    endpoint: string,
    params?: QueryParams,
    options?: RequestOptions,
  ): Promise<APIResponse<T>> {
    const queryString = this.buildQueryString(params);
    const response = await this.axios.get<APIResponse<T>>(
      `${endpoint}${queryString}`,
      this.buildConfig(options),
    );
    return response.data;
  }

  /**
   * GET request for paginated data
   */
  protected async getPaginated<T>(
    endpoint: string,
    params?: QueryParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<T>> {
    const queryString = this.buildQueryString(params);
    const response = await this.axios.get<PaginatedResponse<T>>(
      `${endpoint}${queryString}`,
      this.buildConfig(options),
    );
    return response.data;
  }

  /**
   * POST request with type-safe request/response
   */
  protected async post<TResponse, TRequest = any>(
    endpoint: string,
    data: TRequest,
    options?: RequestOptions,
  ): Promise<TResponse> {
    const response = await this.axios.post<TResponse>(
      endpoint,
      data,
      this.buildConfig(options),
    );
    return response.data;
  }

  /**
   * PUT request with type-safe request/response
   */
  protected async put<TResponse, TRequest = any>(
    endpoint: string,
    data: TRequest,
    options?: RequestOptions,
  ): Promise<APIResponse<TResponse>> {
    const response = await this.axios.put<APIResponse<TResponse>>(
      endpoint,
      data,
      this.buildConfig(options),
    );
    return response.data;
  }

  /**
   * PATCH request with type-safe request/response
   */
  protected async patch<TResponse, TRequest = any>(
    endpoint: string,
    data: Partial<TRequest>,
    options?: RequestOptions,
  ): Promise<APIResponse<TResponse>> {
    const response = await this.axios.patch<APIResponse<TResponse>>(
      endpoint,
      data,
      this.buildConfig(options),
    );
    return response.data;
  }

  /**
   * DELETE request with type-safe response
   */
  protected async delete<T = void>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<APIResponse<T>> {
    const response = await this.axios.delete<APIResponse<T>>(
      endpoint,
      this.buildConfig(options),
    );
    return response.data;
  }

  /**
   * Upload file with progress tracking support
   */
  protected async upload<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestOptions & {
      onUploadProgress?: (progressEvent: {
        loaded: number;
        total?: number;
      }) => void;
    },
  ): Promise<APIResponse<T>> {
    const response = await this.axios.post<APIResponse<T>>(endpoint, formData, {
      ...this.buildConfig(options),
      headers: {
        ...options?.headers,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: options?.onUploadProgress,
    });
    return response.data;
  }
}
