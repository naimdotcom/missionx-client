"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { tokenStore } from "@/store/api/tokenStore";
import { setAuthenticated } from "@/store/authSlice";
import type { AppDispatch } from "@/store/store";

/**
 * Auth Initializer
 * 
 * Handles basic authentication setup on app load:
 * - Restores session from stored token (session persistence)
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Check if user was previously authenticated (session persistence)
    const token = tokenStore.getAccessToken();
    if (token) {
      dispatch(setAuthenticated(true));
      console.log("[Auth] Session restored from previous login");
    }
  }, [dispatch]);

  return <>{children}</>;
}
