import { App } from "@/api/services/apps/apps.type";
import { UserProfileFull } from "@/api/services/users/users.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  logout: () => void;
  selectedApp: App | null;
  isAuthenticated: boolean;
  userProfile: UserProfileFull | null;

  setSelectedApp: (app: App) => void;
  setIsAuthenticated: (value: boolean) => void;
  setUserProfile: (profile: UserProfileFull | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      selectedApp: null,
      userProfile: null,
      isAuthenticated: false,

      setSelectedApp: (app) => set({ selectedApp: app }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),

      logout: () => {
        set({ isAuthenticated: false, userProfile: null });
        localStorage.removeItem("auth-storage");
      },
    }),
    { name: "auth-storage" },
  ),
);
