import { mutationKeys, queryKeys } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "./auth.service";
import type {
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from "./auth.types";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const response = await authService.login(payload);
      return response;
    },
    mutationKey: mutationKeys.authKeys.login,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: RegisterRequest) => {
      const response = await authService.register(payload);
      return response;
    },
    mutationKey: mutationKeys.authKeys.register,
  });
};

export function useGoogleLogin() {
  return useMutation({
    mutationFn: async (payload: { firebase_token: string }) => {
      const response = await authService.googleLogin(payload);
      return response;
    },
    mutationKey: mutationKeys.authKeys.google,
  });
}

export function useVerifyToken(enable: boolean) {
  return useQuery({
    enabled: !!enable,
    queryKey: queryKeys.authKeys.verifyToken,
    queryFn: async () => {
      const response = await authService.verifyToken();
      return response;
    },
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: async (payload: RefreshTokenRequest) => {
      const response = await authService.refreshToken(payload);
      return response;
    },
    mutationKey: mutationKeys.authKeys.refreshToken,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const response = await authService.logout();
      return response;
    },
    mutationKey: mutationKeys.authKeys.logout,
  });
}
