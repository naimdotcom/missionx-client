// Type-safe API endpoint constants

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    REFRESH: "/api/auth/refresh",
    GOOGLE_LOGIN: "/api/auth/login/google",
    LOGIN_FORM: "/api/auth/login/form",
    VERIFY: "/api/auth/verify",
    SESSION: "/api/auth/session",
    SESSIONS: "/api/auth/sessions",
    LOGOUT: "/api/auth/logout",
    LOGOUT_ALL: "/api/auth/logout/all",
    DELETE_SESSION: (id: string) => `/api/auth/session/${id}`,
    META_LOGIN: "/api/v1/meta/initiate",
    FACEBOOK_CALLBACK: "/api/auth/facebook/callback",
    FACEBOOK_DATA_DELETE: "/api/auth/facebook/deletion",
  },

  // Users
  USERS: {
    UPDATE_PROFILE: "/api/v1/users/profile",
    FULL_PROFILE: "/api/v1/users/profile/me",
  },

  //APPS
  APPS: {
    CREATE_APP: "/api/v1/apps", // POST API to create a new app
    LIST_APPS: "/api/v1/apps", // GET API to list all apps
    LIST_MY_APPS: "/api/v1/apps/me", // GET API to list apps of the authenticated user
    APP_CRUD: (id: string) => `/api/v1/apps/${id}`, // Get, Update, Delete a specific app
    APP_USERS: (id: string) => `/api/v1/apps/${id}/users`,
    LIST_ROLES: "/api/v1/me/roles",
    APP_ROLE_CRUD: (id: string) => `/api/v1/apps/${id}/roles`, // Assign, Update, Delete roles for an app
  },

  //INBOX
  INBOX: {
    CONVERSATION_LIST: "/api/v1/inbox",
    CONVERSATION_HISTORY: (id: string) => `/api/v1/inbox/${id}`,
    UPDATE_CONVERSATION_STATUS: (id: string) => `/api/v1/inbox/${id}/status`,
    SEND_MESSAGE: "/api/v1/messaging/send",
    SEND_CSAT_TEMPLATE: "/api/v1/messaging/send-feedback-template",
  },

  //CHANNELS
  CHANNELS: {
    MY_CHANNELS: "/api/v1/channels/my",
    ALL: (id?: string) => `/api/v1/channels/${id}`,
    CHANNEL_CONNECT: (type: string) =>
      `/api/v1/channels/${type}/oauth/initiate`,
    CHANNEL_CALLBACK: (type: string) =>
      `/api/v1/channels/${type}/oauth/callback`,
    CHANNEL_DISCONNECT: (type: string) => `/api/v1/channels/${type}/disconnect`,
    CHANNEL_DELETE: (id: string, type: string) =>
      `/api/v1/channels/${type}/accounts/${id}`,
    META_SUBSCRIPTION_STATUS: (id: string) =>
      `/api/v1/channels/meta/accounts/${id}/subscription-status`,

    META_ACCOUNTS: (type: string) => `/api/v1/channels/${type}/accounts`,
    CHANNEL_SUBSCRIBE_APP: "/api/v1/channels/subscribe",
    CHANNEL_UNSUBSCRIBE_APP: "/api/v1/channels/unsubscribe",
  },

  // Upload
  UPLOAD: {
    FILE: "/api/v1/upload/file",
    IMAGE: "/api/v1/upload/image",
  },
} as const;

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  API_ENDPOINTS.AUTH.LOGIN,
  API_ENDPOINTS.AUTH.REGISTER,
] as const;
