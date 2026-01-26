import { useMutation, useQuery } from "@tanstack/react-query";
import { authMutationKeys } from "./auth.keys";
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
    mutationKey: authMutationKeys.login,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: RegisterRequest) => {
      const response = await authService.register(payload);
      return response;
    },
    mutationKey: authMutationKeys.register,
  });
};

export function useGoogleLogin() {
  return useMutation({
    mutationFn: async (payload: { firebase_token: string }) => {
      const response = await authService.googleLogin(payload);
      return response;
    },
    mutationKey: authMutationKeys.google,
  });
}

export function useVerifyToken(enable: boolean) {
  return useQuery({
    enabled: !!enable,
    queryKey: authMutationKeys.verify,
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
    mutationKey: authMutationKeys.refreshToken,
  });
}

export function useUserInfo() {
  return useQuery({
    queryKey: authMutationKeys.userInfo,
    queryFn: async () => {
      const response = await authService.getCurrentUser();
      return response;
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const response = await authService.logout();
      return response;
    },
    mutationKey: authMutationKeys.logout,
  });
}
