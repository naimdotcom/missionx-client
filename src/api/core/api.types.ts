// Core API type definitions for request/response handling

export interface APIResponse<T> {
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "APIError";
  }

  static fromResponse(status: number, data?: unknown): APIError {
    const message = APIError.getMessageForStatus(status);
    const code =
      typeof data === "object" && data !== null && "code" in data
        ? String(data.code)
        : undefined;

    return new APIError(message, status, code, data);
  }

  private static getMessageForStatus(status: number): string {
    switch (status) {
      case 400:
        return "Bad request. Please check your input.";
      case 401:
        return "Unauthorized. Please log in again.";
      case 403:
        return "Access denied. You don't have permission.";
      case 404:
        return "Resource not found.";
      case 409:
        return "Conflict. This resource already exists.";
      case 422:
        return "Validation failed. Please check your input.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Server error. Please try again.";
      case 502:
        return "Bad gateway. Service temporarily unavailable.";
      case 503:
        return "Service unavailable. Please try again later.";
      default:
        return `Request failed with status ${status}`;
    }
  }
}

export interface RequestOptions {
  signal?: AbortSignal;
  headers?: Record<string, string>;
  onUploadProgress?: (progressEvent: any) => void;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryParams = Record<string, any>;
