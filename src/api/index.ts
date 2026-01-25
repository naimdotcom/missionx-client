// Main API module - exports all services and types

// Services
export { authService } from "./services/auth.service";

// Service classes (for testing/mocking)
export { AuthService } from "./services/auth.service";
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
} from "./types/api.types";

export type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  User,
} from "./services/types/auth.types";

// Axios instance (for advanced usage)
export { axiosInstance, createScopedAxiosInstance } from "./axios-instance";

// Endpoint constants
export { API_ENDPOINTS, PUBLIC_ROUTES } from "./types/endpoints";
