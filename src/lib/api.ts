import { TokenData } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Token management
export const tokenManager = {
  getAuthToken: () =>
    typeof window !== "undefined"
      ? localStorage.getItem("authToken") || ""
      : "",
  getRefreshToken: () =>
    typeof window !== "undefined"
      ? localStorage.getItem("refreshToken") || ""
      : "",
  getSessionId: () =>
    typeof window !== "undefined"
      ? localStorage.getItem("sessionId") || ""
      : "",
  getTokenExpiresAt: () =>
    typeof window !== "undefined"
      ? parseInt(localStorage.getItem("tokenExpiresAt") || "0")
      : 0,
  getRefreshExpiresAt: () =>
    typeof window !== "undefined"
      ? parseInt(localStorage.getItem("refreshExpiresAt") || "0")
      : 0,
  getAutoRefresh: () =>
    typeof window !== "undefined"
      ? localStorage.getItem("autoRefresh") !== "false"
      : true,

  storeTokens: (data: TokenData) => {
    if (typeof window === "undefined") return;

    const authToken = data.access_token;
    const refreshToken = data.refresh_token || tokenManager.getRefreshToken();
    const sessionId = data.session_id || tokenManager.getSessionId();

    const now = Date.now();
    const tokenExpiresAt = now + data.expires_in * 1000;
    const refreshExpiresAt = data.refresh_expires_in
      ? now + data.refresh_expires_in * 1000
      : tokenManager.getRefreshExpiresAt();

    localStorage.setItem("authToken", authToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("sessionId", sessionId);
    localStorage.setItem("tokenExpiresAt", tokenExpiresAt.toString());
    localStorage.setItem("refreshExpiresAt", refreshExpiresAt.toString());
  },

  clearSession: () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("tokenExpiresAt");
    localStorage.removeItem("refreshExpiresAt");
  },

  setAutoRefresh: (enabled: boolean) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("autoRefresh", enabled.toString());
  },
};

// API functions
export const api = {
  // Auth endpoints
  register: async (email: string, password: string, phone?: string) => {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, phone: phone || null }),
    });
    return { data: await response.json(), ok: response.ok };
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok && data.access_token) {
      tokenManager.storeTokens(data);
    }
    return { data, ok: response.ok };
  },

  refreshToken: async () => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) return { data: null, ok: false };

    const response = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      tokenManager.storeTokens(data);
      return { data, ok: true };
    }
    return { data: await response.json(), ok: false };
  },

  getSessionInfo: async () => {
    const token = tokenManager.getAuthToken();
    const response = await fetch(`${API_BASE}/api/auth/session`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: await response.json(), ok: response.ok };
  },

  getAllSessions: async () => {
    const token = tokenManager.getAuthToken();
    const response = await fetch(`${API_BASE}/api/auth/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: await response.json(), ok: response.ok };
  },

  revokeSession: async (sessionId: string) => {
    const token = tokenManager.getAuthToken();
    const response = await fetch(`${API_BASE}/api/auth/sessions/${sessionId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: await response.json(), ok: response.ok };
  },

  logout: async () => {
    const token = tokenManager.getAuthToken();
    if (token) {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    tokenManager.clearSession();
  },

  logoutAll: async () => {
    const token = tokenManager.getAuthToken();
    const response = await fetch(`${API_BASE}/api/auth/logout/all`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    tokenManager.clearSession();
    return { data: await response.json(), ok: response.ok };
  },

  // Profile endpoints
  createProfile: async (
    firstName?: string,
    lastName?: string,
    timezone?: string
  ) => {
    const token = tokenManager.getAuthToken();
    const response = await fetch(`${API_BASE}/api/users/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        first_name: firstName || null,
        last_name: lastName || null,
        timezone: timezone || null,
        preferences: {},
      }),
    });
    return { data: await response.json(), ok: response.ok };
  },

  // Users endpoints
  fetchUsers: async () => {
    const token = tokenManager.getAuthToken();
    const response = await fetch(`${API_BASE}/api/users/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: await response.json(), ok: response.ok };
  },

  // Customers endpoints
  fetchCustomers: async () => {
    const token = tokenManager.getAuthToken();
    const response = await fetch(`${API_BASE}/api/customers/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: await response.json(), ok: response.ok };
  },

  fetchMyCustomer: async () => {
    const token = tokenManager.getAuthToken();
    const response = await fetch(`${API_BASE}/api/customers/me/full`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: await response.json(), ok: response.ok };
  },

  updateCustomer: async (
    address?: string,
    city?: string,
    country?: string,
    postalCode?: string
  ) => {
    const token = tokenManager.getAuthToken();
    const response = await fetch(`${API_BASE}/api/customers/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        address: address || null,
        city: city || null,
        country: country || null,
        postal_code: postalCode || null,
      }),
    });
    return { data: await response.json(), ok: response.ok };
  },
};
