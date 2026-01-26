// Auth query and mutation keys

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export const authMutationKeys = {
  login: ["auth", "login"] as const,
  register: ["auth", "register"] as const,
  logout: ["auth", "logout"] as const,
  google: ["auth", "google"] as const,
  refreshToken: ["auth", "refreshToken"] as const,
  verify: ["auth", "verify"] as const,
  userInfo: ["auth", "userInfo"] as const,
};
