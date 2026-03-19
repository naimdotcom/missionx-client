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
    FACEBOOK_LOGIN: "/api/auth/login/facebook/sdk",
    SOKETI: "api/auth/soketi/auth",
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
    MARK_AS_READ: (id: string) => `/api/v1/inbox/${id}/mark-as-read`,
  },

  //CHANNELS
  CHANNELS: {
    CHANNEL_CONNECT: "/api/v1/channels/connect",
    CHANNELS_LIST: "/api/v1/channels/accounts",
    SUBSCRIBE_CHANNEL: "/api/v1/channels/subscribe",
    UNSUBSCRIBE_CHANNEL: "/api/v1/channels/unsubscribe",
    APP_CHANNEL_DISCONNECT: "/api/v1/channels/disconnect",
    DELETE_CHANNEL: (id: string) => `/api/v1/channels/${id}`,
  },

  // Upload
  UPLOAD: {
    FILE: "/api/v1/media/upload",
    ALL_MEDIA: "/api/v1/media",
    DELETE: "/api/v1/media",
  },

  // CRM (Customer Service)
  CRM: {
    CREATE_CUSTOMER: "/api/v1/customers/",
    CUSTOMERS: "/api/v1/customers/",
    CUSTOMER_BY_ID: (id: string) => `/api/v1/customers/${id}`,
    CUSTOMER_TAGS: (id: string) => `/api/v1/customers/${id}/tags`,
    CUSTOMER_NOTES: (id: string) => `/api/v1/customers/${id}/notes`,
    CUSTOMER_ATTRIBUTES: (id: string) => `/api/v1/customers/${id}/attributes`,
    CUSTOMER_BULK_ATTRIBUTES: (id: string) =>
      `/api/v1/customers/${id}/bulk-attributes`,
    QUERY: "/api/v1/customers/query",
    EXPORT: "/api/v1/customers/export",

    ///Segment
    SEGMENT: "/api/v1/segments/",
    SEGMENT_BY_ID: (id: string) => `/api/v1/segments/${id}`,
  },
} as const;

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  API_ENDPOINTS.AUTH.LOGIN,
  API_ENDPOINTS.AUTH.REGISTER,
] as const;
