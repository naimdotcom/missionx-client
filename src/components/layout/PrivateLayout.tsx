import { useRefreshToken, useVerifyToken } from "@/api";
import { useUserProfileFull } from "@/api/services/users/users.hooks";
import { AppSidebar } from "@/components/nav-menu/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { env } from "@/lib/env";
import { useAuthStore } from "@/stores/auth-store";
import { Outlet } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { useEffect, useRef } from "react";
import TopBar from "../top-bar";

function PrivateLayout() {
  const { setUserProfile, refreshToken, setAuth } = useAuthStore();
  const openAllRoutes = env.isOpenAllRoutes === "true";
  const hasTriggeredRefresh = useRef(false);

  // Step 1: Verify current access token
  const verifyTokenQuery = useVerifyToken(!openAllRoutes);

  const isValidToken = verifyTokenQuery.data?.status === "valid";

  // Step 2: Refresh token if verification failed
  const refreshTokenMutation = useRefreshToken();

  // Handle refresh token success - update auth store with new tokens
  useEffect(() => {
    if (refreshTokenMutation.isSuccess && refreshTokenMutation.data) {
      const { token, refreshToken: newRefreshToken } =
        refreshTokenMutation.data;
      if (token) {
        setAuth(token, newRefreshToken || refreshToken || "");
        hasTriggeredRefresh.current = false; // Reset for potential future refreshes
      }
    }
  }, [
    refreshTokenMutation.isSuccess,
    refreshTokenMutation.data,
    setAuth,
    refreshToken,
  ]);

  // Handle refresh token error
  useEffect(() => {
    if (refreshTokenMutation.isError) {
      hasTriggeredRefresh.current = false;
    }
  }, [refreshTokenMutation.isError]);

  // Trigger refresh token when verification fails (only once)
  useEffect(() => {
    if (
      verifyTokenQuery.isSuccess &&
      !isValidToken &&
      refreshToken &&
      !hasTriggeredRefresh.current &&
      !refreshTokenMutation.isPending
    ) {
      hasTriggeredRefresh.current = true;
      refreshTokenMutation.mutate({ refresh_token: refreshToken });
    }
  }, [
    verifyTokenQuery.isSuccess,
    isValidToken,
    refreshToken,
    refreshTokenMutation,
  ]);

  // Determine if we should fetch user profile
  const canFetchUserProfile = isValidToken || refreshTokenMutation.isSuccess;

  // Step 3: Fetch user profile only when token is valid
  const userQuery = useUserProfileFull(canFetchUserProfile);

  // Store user profile when query succeeds
  useEffect(() => {
    if (userQuery.isSuccess && userQuery.data) {
      setUserProfile(userQuery.data);
    }
  }, [userQuery.isSuccess, userQuery.data, setUserProfile]);

  // Show loading state during initial verification or token refresh
  if (verifyTokenQuery.isLoading || refreshTokenMutation.isPending) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Spinner />
      </div>
    );
  }
  return (
    <SidebarProvider>
      <NuqsAdapter>
        <AppSidebar />
        <SidebarInset>
          <TopBar />
          <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
            <Outlet />
          </div>
        </SidebarInset>
      </NuqsAdapter>
    </SidebarProvider>
  );
}
export default PrivateLayout;
