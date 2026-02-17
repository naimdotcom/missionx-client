import { App } from "@/api/services/apps/apps.type";
import { UserProfileFull } from "@/api/services/users/users.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  logout: () => void;
  isAuthenticated: boolean;
  selectedApp: App | null;
  setSelectedApp: (app: App) => void;
  userProfile: UserProfileFull | null;
  setIsAuthenticated: (value: boolean) => void;
  setUserProfile: (profile: UserProfileFull | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      selectedApp: null,
      userProfile: null,
      isAuthenticated: false,

      setIsAuthenticated: (value) => set({ isAuthenticated: value }),

      logout: () => {
        // Clear state
        set({ isAuthenticated: false, userProfile: null });

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
