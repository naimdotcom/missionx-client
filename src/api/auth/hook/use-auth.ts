// TanStack Query hooks for messages with optimistic updates

import type { LoginRequest, RegisterRequest } from "@/api-service";
import { authService } from "@/api-service";
import { useMutation } from "@tanstack/react-query";
import { mutationKeys } from "../../../api-service/query-keys";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const response = await authService.login(payload);
      return response;
    },
    mutationKey: mutationKeys.auth.login,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: RegisterRequest) => {
      const response = await authService.register(payload);
      return response;
    },
    mutationKey: mutationKeys.auth.register,
  });
};

export function useGoogleLogin() {
  return useMutation({
    mutationFn: async (payload: { firebase_token: string }) => {
      const response = await authService.googleLogin(payload);
      return response;
    },
    mutationKey: mutationKeys.auth.google,
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: async (payload: { refreshToken: string }) => {
      const response = await authService.refreshToken(payload);
      return response;
    },
    mutationKey: mutationKeys.auth.refreshToken,
  });
}
