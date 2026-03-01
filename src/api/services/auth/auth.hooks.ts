import { mutationKeys, queryKeys } from "@/api";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { toast } from "sonner";
import { authService } from "./auth.service";
import type { LoginRequest, RegisterRequest } from "./auth.types";

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
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthStore();
  return useMutation({
    mutationFn: async (payload: { firebase_token: string }) => {
      const response = await authService.googleLogin(payload);
      return response;
    },
    mutationKey: mutationKeys.authKeys.google,
    onSuccess: (data) => {
      if (data.access_token && data.refresh_token) {
        setIsAuthenticated(true);
        toast.success("Login successful with Google");
      }
      navigate({ to: "/inbox" });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.detail);
      }
    },
  });
}

export function useVerifyToken() {
  return useQuery({
    queryKey: queryKeys.authKeys.verifyToken,
    queryFn: async () => {
      const response = await authService.verifyToken();
      return response;
    },
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationKey: mutationKeys.authKeys.refreshToken,
    mutationFn: () => authService.refreshToken(),
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

export function useMetaLogin() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthStore();
  return useMutation({
    mutationKey: mutationKeys.authKeys.facebook,
    mutationFn: (access_token: string) =>
      authService.facebookLogin(access_token),
    onSuccess: (data) => {
      if (data.access_token && data.refresh_token) {
        setIsAuthenticated(true);
        toast.success("Login successful with Facebook");
      }
      navigate({ to: "/inbox" });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.detail);
      }
    },
  });
}
