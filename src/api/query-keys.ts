// Query key factory for TanStack Query

export const queryKeys = {
  authKeys: {
    verifyToken: ["verify", "auth"] as const,
  },
  usersQueryKeys: {
    userProfileFull: ["user-profile", "full"] as const,
  },
} as const;

export const mutationKeys = {
  authMutationKeys: {
    login: ["auth", "login"] as const,
    register: ["auth", "register"] as const,
    logout: ["auth", "logout"] as const,
    google: ["auth", "google"] as const,
    meta: ["auth", "meta"] as const,
    refreshToken: ["auth", "refreshToken"] as const,
    verify: ["auth", "verify"] as const,
    userInfo: ["auth", "userInfo"] as const,
  },
} as const;
