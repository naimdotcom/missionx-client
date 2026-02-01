import { useVerifyToken } from "@/api";
import { useUserProfileFull } from "@/api/services/users/users.hooks";
import { AppSidebar } from "@/components/nav-menu/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { env } from "@/lib/env";
import { useAuthStore } from "@/stores/auth-store";
import { Outlet } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { useEffect } from "react";
import TopBar from "../top-bar";

function PrivateLayout() {
  const openAllRoutes = env.isOpenAllRoutes === "true";
  const { setUserProfile } = useAuthStore();
  const verifyTokenQuery = useVerifyToken(openAllRoutes ? false : true);
  const userQuery = useUserProfileFull(verifyTokenQuery.isSuccess);

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
