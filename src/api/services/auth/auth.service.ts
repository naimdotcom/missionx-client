// Authentication service

import type { RequestOptions } from "../../core/api.types";
import { API_ENDPOINTS } from "../../endpoints";
import type {
  FacebookLoginResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  UpdateUserProfilePayload,
  UserProfileFull,
  VerifyToken,
} from "./auth.types";
import { authClient } from "@/api/core/init";

export const authService = {
  login: (credentials: LoginRequest) =>
    authClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials),

  register: (payload: RegisterRequest, options?: RequestOptions) =>
    authClient.post(API_ENDPOINTS.AUTH.REGISTER, payload, options),

  logout: (options?: RequestOptions) =>
    authClient.post(API_ENDPOINTS.AUTH.LOGOUT, {}, options),

  refreshToken: () =>
    authClient.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH),

  googleLogin: (request: { firebase_token: string }) =>
    authClient.post<LoginResponse>(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, request),

  verifyToken: () => {
    return authClient.get<VerifyToken>(API_ENDPOINTS.AUTH.VERIFY);
  },

  facebookLogin: (access_token: string) => {
    return authClient.post<FacebookLoginResponse>(
      API_ENDPOINTS.AUTH.FACEBOOK_LOGIN,
      { access_token },
    );
  },

  getUserProfileFull: () => {
    return authClient.get<UserProfileFull>(API_ENDPOINTS.USER.FULL_PROFILE);
  },

  updateUserProfile: (payload: UpdateUserProfilePayload) => {
    return authClient.put(API_ENDPOINTS.USER.UPDATE_PROFILE, payload);
  },
};
