// Authentication service

import type { RequestOptions } from "../types/api.types";
import { API_ENDPOINTS } from "../types/endpoints";
import { BaseAPIService } from "./base.service";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  User,
} from "./types/auth.types";

export class AuthService extends BaseAPIService {
  /**
   * Login user with email and password
   */
  login = (credentials: LoginRequest, options?: RequestOptions) =>
    this.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials, options);

  /**
   * Register new user
   */
  register = (userData: RegisterRequest, options?: RequestOptions) =>
    this.post<LoginResponse>(API_ENDPOINTS.AUTH.REGISTER, userData, options);

  /**
   * Logout current user
   */
  logout = (options?: RequestOptions) =>
    this.post(API_ENDPOINTS.AUTH.LOGOUT, {}, options);

  /**
   * Refresh access token
   */
  refreshToken = (request: RefreshTokenRequest) =>
    this.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH, request);

  /**
   * Get current user profile
   */
  getCurrentUser = (options?: RequestOptions) =>
    this.get<User>(API_ENDPOINTS.AUTH.ME, undefined, options);
}

// Export singleton instance
export const authService = new AuthService();
