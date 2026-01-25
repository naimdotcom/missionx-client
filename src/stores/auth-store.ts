import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  logout: () => void;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken, isAuthenticated: !!accessToken }),

      logout: () =>
        set({ accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" },
  ),
);
