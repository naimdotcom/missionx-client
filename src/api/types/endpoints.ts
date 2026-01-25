// Type-safe API endpoint constants

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    ME: "/api/auth/me",
  },

  // Tickets
  TICKETS: {
    LIST: "/tickets",
    DETAIL: (id: string) => `/tickets/${id}`,
    CREATE: "/tickets",
    UPDATE: (id: string) => `/tickets/${id}`,
    DELETE: (id: string) => `/tickets/${id}`,
    ASSIGN: (id: string) => `/tickets/${id}/assign`,
    CLOSE: (id: string) => `/tickets/${id}/close`,
  },

  // Messages
  MESSAGES: {
    BY_TICKET: (ticketId: string) => `/tickets/${ticketId}/messages`,
    SEND: (ticketId: string) => `/tickets/${ticketId}/messages`,
    DETAIL: (ticketId: string, messageId: string) =>
      `/tickets/${ticketId}/messages/${messageId}`,
    MARK_READ: (ticketId: string) => `/tickets/${ticketId}/messages/mark-read`,
  },

  // Channels
  CHANNELS: {
    LIST: "/channels",
    CONNECT: "/channels/connect",
    DISCONNECT: (id: string) => `/channels/${id}/disconnect`,
    DETAIL: (id: string) => `/channels/${id}`,
  },

  // Workspaces
  WORKSPACES: {
    LIST: "/workspaces",
    CREATE: "/workspaces",
    DETAIL: (id: string) => `/workspaces/${id}`,
    UPDATE: (id: string) => `/workspaces/${id}`,
    DELETE: (id: string) => `/workspaces/${id}`,
  },

  // Users
  USERS: {
    LIST: "/users",
    DETAIL: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
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
