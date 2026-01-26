// Authentication service

import type { RequestOptions } from "../../core/api.types";
import { BaseAPIService } from "../../core/base.service";
import { API_ENDPOINTS } from "../../endpoints";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  UserInfo,
  VerifyToken,
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
  refreshToken = (request: RefreshTokenRequest, options?: RequestOptions) =>
    this.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      request,
      options,
    );

  googleLogin = (
    request: { firebase_token: string },
    options?: RequestOptions,
  ) => this.post<LoginResponse>(API_ENDPOINTS.AUTH.GOOGLE, request, options);

  verifyToken = (options?: RequestOptions) => {
    return this.get<VerifyToken>(API_ENDPOINTS.AUTH.VERIFY, undefined, options);
  };

  getCurrentUser = (options?: RequestOptions) =>
    this.get<UserInfo>(API_ENDPOINTS.AUTH.ME, undefined, options);
}

// Export singleton instance
export const authService = new AuthService();
