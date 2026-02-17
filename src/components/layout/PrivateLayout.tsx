import { useVerifyToken } from "@/api";
import { useListMyApps } from "@/api/services/apps/apps.hook";
import { useUserProfileFull } from "@/api/services/users/users.hooks";
import { AppSidebar } from "@/components/nav-menu/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { env } from "@/lib/env";
import { useAuthStore } from "@/stores/auth-store";
import { Outlet } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { useEffect } from "react";
import { CreateFirstApp } from "../onboarding/CreateFirstApp";
import TopBar from "../top-bar";

function PrivateLayout() {
  const { setUserProfile, selectedApp, setSelectedApp } = useAuthStore();
  const openAllRoutes = env.isOpenAllRoutes === "true";

  // Step 1: Verify current access token
  const verifyTokenQuery = useVerifyToken(!openAllRoutes);
  const isValidToken = verifyTokenQuery.data?.status === "valid";
  const userQuery = useUserProfileFull(isValidToken);

  useEffect(() => {
    if (userQuery.isSuccess && userQuery.data) {
      setUserProfile(userQuery.data);
    }
  }, [userQuery.isSuccess, userQuery.data, setUserProfile]);

  // Step 4: Check if user has any apps
  const myAppsQuery = useListMyApps({ page: 1, page_size: 10 });

  const hasApps = (myAppsQuery.data?.apps?.length ?? 0) > 0;
  const firstApp = myAppsQuery.data?.apps?.[0];

  // Auto-select first app if none selected
  useEffect(() => {
    if (hasApps && !selectedApp && firstApp) {
      setSelectedApp(firstApp);
    }
  }, [hasApps, selectedApp, firstApp, setSelectedApp]);

  // Show loading state during initial verification or token refresh
  if (verifyTokenQuery.isLoading || myAppsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Spinner />
      </div>
    );
  }

  // Onboarding flow: No apps → Show create app screen
  if (!hasApps) {
    return <CreateFirstApp />;
  }

  // Normal app flow: Has app and at least one channel
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
