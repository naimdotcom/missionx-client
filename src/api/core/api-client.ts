// API Client factory for creating standardized HTTP clients

import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
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
import type { APIResponse, PaginatedResponse, QueryParams, RequestOptions } from "./api.types";

export interface APIClientConfig {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
  headers?: Record<string, string>;
}

/**
 * Standardized API Client with typed HTTP methods
 */
export class APIClient {
  private instance: AxiosInstance;

  constructor(config: APIClientConfig) {
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout ?? 30000,
      withCredentials: config.withCredentials ?? true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  /**
   * Get the underlying Axios instance (for advanced usage)
   */
  getInstance(): AxiosInstance {
    return this.instance;
  }

  /**
   * Setup all interceptors (auth, logging, error handling)
   */
  private setupInterceptors(): void {
    // Request interceptors
    this.instance.interceptors.request.use(loggingRequestInterceptor, undefined);
    this.instance.interceptors.request.use(authRequestInterceptor, undefined);

    // Response interceptors (executed in reverse order)
    this.instance.interceptors.response.use(
      authResponseInterceptor,
      authErrorInterceptor,
    );
    this.instance.interceptors.response.use(
      loggingResponseInterceptor,
      loggingErrorInterceptor,
    );
    this.instance.interceptors.response.use(undefined, errorInterceptor);
  }

  /**
   * Build query string from params object
   */
  private buildQueryString(params?: QueryParams): string {
    if (!params) return "";

    const filteredParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: String(value) }), {});

    const searchParams = new URLSearchParams(filteredParams);
    const query = searchParams.toString();
    return query ? `?${query}` : "";
  }

  /**
   * Build Axios config from options
   */
  private buildConfig(options?: RequestOptions): AxiosRequestConfig {
    return {
      signal: options?.signal,
      headers: options?.headers,
      onUploadProgress: options?.onUploadProgress,
    };
  }

  /**
   * GET request with type-safe response
   */
  async get<T>(
    endpoint: string,
    params?: QueryParams,
    options?: RequestOptions,
  ): Promise<T> {
    const queryString = this.buildQueryString(params);
    const response = await this.instance.get<T>(`${endpoint}${queryString}`, this.buildConfig(options));
    return response.data;
  }

  /**
   * GET request for paginated data
   */
  async getPaginated<T>(
    endpoint: string,
    params?: QueryParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<T>> {
    const queryString = this.buildQueryString(params);
    const response = await this.instance.get<PaginatedResponse<T>>(
      `${endpoint}${queryString}`,
      this.buildConfig(options),
    );
    return response.data;
  }

  /**
   * POST request with type-safe response
   */
  async post<TResponse, TRequest = unknown>(
    endpoint: string,
    data?: TRequest,
    options?: RequestOptions,
  ): Promise<TResponse> {
    const response = await this.instance.post<TResponse>(
      endpoint,
      data,
      this.buildConfig(options),
    );
    return response.data;
  }

  /**
   * PUT request with type-safe response
   */
  async put<TResponse, TRequest = unknown>(
    endpoint: string,
    data: TRequest,
    options?: RequestOptions,
  ): Promise<APIResponse<TResponse>> {
    const response = await this.instance.put<APIResponse<TResponse>>(
      endpoint,
      data,
      this.buildConfig(options),
    );
    return response.data;
  }

  /**
   * PATCH request with type-safe response
   */
  async patch<TResponse, TRequest = unknown>(
    endpoint: string,
    data: Partial<TRequest>,
    options?: RequestOptions,
  ): Promise<APIResponse<TResponse>> {
    const response = await this.instance.patch<APIResponse<TResponse>>(
      endpoint,
      data,
      this.buildConfig(options),
    );
    return response.data;
  }

  /**
   * DELETE request with type-safe response
   */
  async delete<T = void>(
    endpoint: string,
    params?: QueryParams,
    options?: RequestOptions,
  ): Promise<APIResponse<T>> {
    const queryString = this.buildQueryString(params);
    const response = await this.instance.delete<APIResponse<T>>(
      `${endpoint}${queryString}`,
      this.buildConfig(options),
    );
    return response.data;
  }

  /**
   * Upload file with progress tracking
   */
  async upload<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestOptions,
  ): Promise<T> {
    const config = this.buildConfig(options);
    const response = await this.instance.post<T>(endpoint, formData, {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": undefined, // Let Axios handle it for FormData
      },
      onUploadProgress: options?.onUploadProgress,
    });
    return response.data;
  }
}
