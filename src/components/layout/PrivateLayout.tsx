import { useVerifyToken } from "@/api";
import { useUserProfileFull } from "@/api/services/users/users.hooks";
import { AppSidebar } from "@/components/nav-menu/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { env } from "@/lib/env";
import { useAuthStore } from "@/stores/auth-store";
import { Outlet } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { useEffect, useMemo } from "react";
import TopBar from "../top-bar";

function PrivateLayout() {
  // const refreshTokenMutation = useRefreshToken();
  const { setUserProfile, refreshToken } = useAuthStore();

  const openAllRoutes = env.isOpenAllRoutes === "true";
  const verifyTokenQuery = useVerifyToken(!openAllRoutes);

  const isValidToken = useMemo(() => {
    if (
      verifyTokenQuery.isSuccess &&
      verifyTokenQuery.data?.status === "valid"
    ) {
      return true;
    } else return false;
  }, [verifyTokenQuery.data?.status, verifyTokenQuery.isSuccess]);

  // verifyTokenQuery.isSuccess, verifyTokenQuery.data?.status
  const userQuery = useUserProfileFull(isValidToken);

  //If the token is not valid and there is a refresh token, then call the refresh token API to get a new access token
  useEffect(() => {
    if (!isValidToken && refreshToken) {
      // refreshTokenMutation.mutate({ refresh_token: refreshToken });
    }
  }, [isValidToken, refreshToken]);
  // First verify if the token is valid. If valid then call the yser profile API
  useEffect(() => {
    if (userQuery.isSuccess && verifyTokenQuery.isSuccess) {
      setUserProfile(userQuery.data);
    }
  }, [
    userQuery.isSuccess,
    verifyTokenQuery.isSuccess,
    userQuery.data,
    setUserProfile,
  ]);

  if (verifyTokenQuery.isLoading) {
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
