// Authentication service

import type { RequestOptions } from "../../api-service/api.types";
import { BaseAPIService } from "../../api-service/services/base.service";
import { API_ENDPOINTS } from "../endpoints";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
} from "./auth.types";

export class AuthService extends BaseAPIService {
  /**
   * Login user with email and password
   */
  login = (credentials: LoginRequest, options?: RequestOptions) =>
    this.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials, options);

  /**
   * Register new user
   */
  register = (payload: RegisterRequest, options?: RequestOptions) =>
    this.post(API_ENDPOINTS.AUTH.REGISTER, payload, options);

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

  googleLogin = (
    request: { firebase_token: string },
    options?: RequestOptions,
  ) => this.post<LoginResponse>(API_ENDPOINTS.AUTH.GOOGLE, request, options);

  /**
   * Get current user profile
   */
  // getCurrentUser = (options?: RequestOptions) =>
  //   this.get<User>(API_ENDPOINTS.AUTH.ME, undefined, options);
}

// Export singleton instance
export const authService = new AuthService();
