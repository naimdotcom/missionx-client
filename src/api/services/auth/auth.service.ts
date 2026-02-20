// Authentication service

import { env } from "@/lib/env";
import type { RequestOptions } from "../../core/api.types";
import { BaseAPIService } from "../../core/base.service";
import { API_ENDPOINTS } from "../../endpoints";
import type {
  LoginRequest,
  LoginResponse,
  MetaLoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
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
  refreshToken = (options?: RequestOptions) =>
    this.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      undefined,
      options,
    );

  googleLogin = (
    request: { firebase_token: string },
    options?: RequestOptions,
  ) =>
    this.post<LoginResponse>(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, request, options);

  verifyToken = (options?: RequestOptions) => {
    return this.get<VerifyToken>(API_ENDPOINTS.AUTH.VERIFY, undefined, options);
  };

  metaLogin = (options?: RequestOptions) => {
    return this.post<MetaLoginResponse>(
      API_ENDPOINTS.AUTH.META_LOGIN,
      { customer_id: 0 },
      options,
    );
  };
}

// Export singleton instance
export const authService = new AuthService(env.authUrl || "");
