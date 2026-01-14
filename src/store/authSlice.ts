import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  // We use a hint cookie to persist the auth state across reloads
  // Actual validation happens via API calls
  isAuthenticated: getCookie("mx_auth_hint") === "true",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      if (action.payload) {
        setCookie("mx_auth_hint", "true");
      } else {
        deleteCookie("mx_auth_hint");
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      deleteCookie("mx_auth_hint");
      // Note: Backend handles deleting auth/refresh token cookies upon calling /logout
    },
  },
});

export const { setUser, setAuthenticated, logout } = authSlice.actions;
export default authSlice.reducer;
