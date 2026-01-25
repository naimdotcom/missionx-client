// TanStack Query hooks for messages with optimistic updates

import { useMutation } from "@tanstack/react-query";
import type { LoginRequest, RegisterRequest } from "~/api";
import { authService } from "~/api";
import { mutationKeys } from "./api/query-keys";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const response = await authService.login(payload);
      return response.data;
    },
    mutationKey: mutationKeys.auth.login,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: RegisterRequest) => {
      const response = await authService.register(payload);
      return response.data;
    },
    mutationKey: mutationKeys.auth.register,
  });
};
