// Type-safe API endpoint constants

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    REFRESH: "/api/auth/refresh",
    GOOGLE_LOGIN: "/api/auth/login/google",
    ME: "/api/auth/me",
    LOGIN_FORM: "/api/auth/login/form",
    VERIFY: "/api/auth/verify",
    SESSION: "/api/auth/session",
    SESSIONS: "/api/auth/sessions",
    LOGOUT: "/api/auth/logout",
    LOGOUT_ALL: "/api/auth/logout/all",
    DELETE_SESSION: (id: string) => `/api/auth/session/${id}`,
    META_LOGIN: "/api/auth/facebook",
    FACEBOOK_CALLBACK: "/api/auth/facebook/callback",
    FACEBOOK_DATA_DELETE: "/api/auth/facebook/deletion",
  },

  // Users
  USERS: {
    FULL_PROFILE: "/api/v1/users/profile/me",
  },

  // Upload
  UPLOAD: {
    FILE: "/upload/file",
    IMAGE: "/upload/image",
  },
} as const;

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  API_ENDPOINTS.AUTH.LOGIN,
  API_ENDPOINTS.AUTH.REGISTER,
] as const;
