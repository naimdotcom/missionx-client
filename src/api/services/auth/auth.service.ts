// Authentication service

import type { RequestOptions } from "../../core/api.types";
import { API_ENDPOINTS } from "../../endpoints";
import type {
  FacebookLoginResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  VerifyToken,
} from "./auth.types";
import { authClient } from "@/api/core/init";

/**
 * Login user with email and password
 */
export const login = (credentials: LoginRequest, options?: RequestOptions) =>
  authClient.post<LoginResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials,
    options,
  );

/**
 * Register new user
 */
export const register = (payload: RegisterRequest, options?: RequestOptions) =>
  authClient.post(API_ENDPOINTS.AUTH.REGISTER, payload, options);

/**
 * Logout current user
 */
export const logout = (options?: RequestOptions) =>
  authClient.post(API_ENDPOINTS.AUTH.LOGOUT, {}, options);

/**
 * Refresh access token
 */
export const refreshToken = (options?: RequestOptions) =>
  authClient.post<RefreshTokenResponse>(
    API_ENDPOINTS.AUTH.REFRESH,
    undefined,
    options,
  );

export const googleLogin = (
  request: { firebase_token: string },
  options?: RequestOptions,
) =>
  authClient.post<LoginResponse>(
    API_ENDPOINTS.AUTH.GOOGLE_LOGIN,
    request,
    options,
  );

export const verifyToken = (options?: RequestOptions) => {
  return authClient.get<VerifyToken>(
    API_ENDPOINTS.AUTH.VERIFY,
    undefined,
    options,
  );
};

export const facebookLogin = (
  access_token: string,
  options?: RequestOptions,
) => {
  return authClient.post<FacebookLoginResponse>(
    API_ENDPOINTS.AUTH.FACEBOOK_LOGIN,
    { access_token },
    options,
  );
};
