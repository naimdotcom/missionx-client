// Authentication service

import type { APIResponse, RequestOptions } from "../types/api.types";
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
  async login(
    credentials: LoginRequest,
    options?: RequestOptions,
  ): Promise<APIResponse<LoginResponse>> {
    return this.post<LoginRequest, LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
      options,
    );
  }

  /**
   * Register new user
   */
  async register(
    userData: RegisterRequest,
    options?: RequestOptions,
  ): Promise<APIResponse<LoginResponse>> {
    return this.post<RegisterRequest, LoginResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData,
      options,
    );
  }

  /**
   * Logout current user
   */
  async logout(options?: RequestOptions): Promise<APIResponse<void>> {
    return this.post<void, void>(
      API_ENDPOINTS.AUTH.LOGOUT,
      undefined as any,
      options,
    );
  }

  /**
   * Refresh access token
   */
  async refreshToken(
    request: RefreshTokenRequest,
    options?: RequestOptions,
  ): Promise<APIResponse<RefreshTokenResponse>> {
    return this.post<RefreshTokenRequest, RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      request,
      options,
    );
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(options?: RequestOptions): Promise<APIResponse<User>> {
    return this.get<User>(API_ENDPOINTS.AUTH.ME, undefined, options);
  }
}

// Export singleton instance
export const authService = new AuthService();
