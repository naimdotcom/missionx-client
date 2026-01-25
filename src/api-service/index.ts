// Main API module - exports all services and types

// Services
export { authService } from "../api/auth/auth.service";

// Service classes (for testing/mocking)
export { AuthService } from "../api/auth/auth.service";
export { BaseAPIService } from "./services/base.service";

// Types
export type {
  APIError,
  APIResponse,
  PaginatedResponse,
  PaginationParams,
  QueryParams,
  RequestOptions,
  SortParams,
} from "./api.types";

export type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
} from "../api/auth/auth.types";

// Axios instance (for advanced usage)
export { axiosInstance, createScopedAxiosInstance } from "./axios-instance";

export { mutationKeys, queryKeys } from "./query-keys";
