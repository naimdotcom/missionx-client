"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useGetSessionInfoQuery } from "@/store/api/authApi";
import { logout, setUser } from "@/store/authSlice";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  // App Selection logic is now deferred to AppInitializer
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // 1. Fetch User Data (Background)
  // This hook automatically handles loading, errors, and refetching
  const { data: user, isError } = useGetSessionInfoQuery(undefined, {
    skip: !isAuthenticated, // Only fetch if we think we are logged in
  });

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  // Handle Session Error (e.g. Backend down or token invalid)
  useEffect(() => {
    if (isError) {
      console.error("[AuthGuard] Session check failed (isError=true). Normally I would logout, but I am PAUSED for debugging.");
      // dispatch(logout()); 
    }
  }, [isError, dispatch]);

  useEffect(() => {
    // 2. Client-Side Protection Logic
    // This mirrors the Middleware logic to handle SPA navigation
    const isPublicPath = [
      "/login",
      "/signup",
      "/auth/facebook/callback",
      "/",
      "/terms",
      "/privacy",
      "/docs",
      "/auth",
    ].some((path) => pathname === path || pathname.startsWith(path + "/"));

    // Case A: User is NOT authenticated
    if (!isAuthenticated) {
      if (!isPublicPath) {
        router.push("/login");
      }
      return;
    }

    // Case B: User IS authenticated
    if (isAuthenticated) {
      // 1. Handle Login/Signup/Root for authenticated users
      // This is mostly handled by Middleware, but good for client-side navigation
      if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
        // Let AppInitializer handle where to go (Dashboard or Select Workspace)
        // We just essentially "pass" here, or strictly go to dashboard and let AppInitializer kick back if needed.

        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
