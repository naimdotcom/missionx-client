import { UserProfileFull } from "@/api/services/users/users.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  logout: () => void;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userProfile: UserProfileFull | null;
  setUserProfile: (profile: UserProfileFull | null) => void;
  setAuth: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userProfile: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken, isAuthenticated: !!accessToken }),

      logout: () =>
        set({ accessToken: null, refreshToken: null, isAuthenticated: false }),

      setUserProfile: (profile) => set({ userProfile: profile }),
    }),
    { name: "auth-storage" },
  ),
);
