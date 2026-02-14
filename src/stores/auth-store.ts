import { App } from "@/api/services/apps/apps.type";
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
  selectedApp: App | null;
  setSelectedApp: (app: App) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      selectedApp: null,
      userProfile: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken, isAuthenticated: !!accessToken }),

      logout: () => {
        // Clear state
        set({
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          userProfile: null,
        });

        // Clear all storage manually to ensure cleanup
        localStorage.removeItem("auth-storage");
        // localStorage.removeItem("ui-storage");

        // Note: theme storage is intentionally kept for better UX
        // Remove the line below if you want to also clear theme preference
        // localStorage.removeItem("vite-ui-theme");
      },

      setUserProfile: (profile) => set({ userProfile: profile }),

      setSelectedApp: (app) => set({ selectedApp: app }),
    }),
    { name: "auth-storage" },
  ),
);
