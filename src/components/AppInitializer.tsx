"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setApps, setSelectedApp, AppType } from "@/store/appSlice";
import { useRouter, usePathname } from "next/navigation";
import { useGetAppsQuery } from "@/store/api/appsApi";

export function AppInitializer() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { selectedApp } = useSelector((state: RootState) => state.app);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch apps only if authenticated
  const { data: appsData, isLoading } = useGetAppsQuery(
    {},
    { skip: !isAuthenticated }
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    if (isLoading) return;

    const fetchedApps: AppType[] = appsData?.apps || [];

    // Update global apps list
    dispatch(setApps(fetchedApps));

    // Check LocalStorage for saved selection
    const storedAppStr = localStorage.getItem("selectedApp");
    let storedApp: AppType | null = null;
    try {
      storedApp = storedAppStr ? JSON.parse(storedAppStr) : null;
    } catch {
      console.error("Failed to parse stored app");
      localStorage.removeItem("selectedApp");
    }

    // Verify if stored app is still strictly valid (exists in fetched list)
    const isValidApp =
      storedApp && fetchedApps.some((a) => a.id === storedApp.id);

    if (isValidApp && storedApp) {
      // If we differ from Redux state, sync it
      if (!selectedApp || selectedApp.id !== storedApp.id) {
        dispatch(setSelectedApp(storedApp));
      }

      // If we are on app-selection page or root, go to dashboard
      // Also prevent redirect looping if already on dashboard
      if (pathname === "/select-workspace" || pathname === "/") {
        router.push("/dashboard");
      }
    } else {
      // Invalid or no app selected
      // Clear storage
      if (storedAppStr) {
        localStorage.removeItem("selectedApp");
      }
      if (selectedApp) {
        dispatch(setSelectedApp(null));
      }

      // Redirect to selection if we are trying to access app-specific pages
      // Allow auth pages and public pages
      // Assume /dashboard and /apps/... need an app selected
      // Redirect to selection if we are trying to access app-specific pages
      // Allow auth pages and public pages
      // Assume /dashboard and /apps/... need an app selected
      if (
        pathname !== "/select-workspace" &&
        !pathname.startsWith("/login") &&
        !pathname.startsWith("/register") &&
        pathname !== "/" // Let root handle its own redirect or landing
      ) {
        // If we are deep in the app but lost context, go to selection
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/apps")) {
          // Only redirect if we are NOT loading (to avoid premature redirects)
          // and we definitely don't have an app
          if (!selectedApp && !storedApp && !isLoading) {
            router.push("/select-workspace");
          }
        }
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    appsData,
    dispatch,
    pathname,
    router,
    selectedApp,
  ]);

  return null;
}
