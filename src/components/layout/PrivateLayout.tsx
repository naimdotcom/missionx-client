import { useRefreshToken, useVerifyToken } from "@/api";
import { useListMyApps } from "@/api/services/apps/apps.hook";
import { useSoketi } from "@/api/services/soketi/use-soketi";
import { useUserProfileFull } from "@/api/services/user/user.hooks";
import { AppSidebar } from "@/components/nav-menu/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { env } from "@/lib/env";
import { useSaveAppField } from "@/pages/crm/hook/useSaveAppField";
import { useAuthStore } from "@/stores/auth-store";
import { Outlet } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { CreateFirstApp } from "../onboarding/CreateFirstApp";
import TopBar from "../top-bar";
import { PageLoader } from "../ui/loader";

function PrivateLayout() {
  const { setUserProfile, selectedApp, setSelectedApp } = useAuthStore();
  useSaveAppField();

  const refreshTokenMutation = useRefreshToken();
  const verifyTokenQuery = useVerifyToken();
  const isValidToken = verifyTokenQuery.data?.status === "valid";

  useEffect(() => {
    if (!isValidToken && verifyTokenQuery.isSuccess) {
      refreshTokenMutation.mutate(undefined, {
        onSuccess: () => verifyTokenQuery.refetch(),
        onError: () => {
          toast.error("Session expired. Please log in again.");
        },
      });
    }
  }, [isValidToken, verifyTokenQuery.isSuccess]);

  const userQuery = useUserProfileFull(isValidToken);

  useEffect(() => {
    if (userQuery.isSuccess && userQuery.data) {
      setUserProfile(userQuery.data);
    }
  }, [userQuery.isSuccess, userQuery.data, setUserProfile]);

  // Step 4: Check if user has any apps
  const myAppsQuery = useListMyApps({ page: 1, page_size: 10 });

  // Step 5: Connect to Soketi real-time channel
  const { connected: soketiConnected } = useSoketi();

  useEffect(() => {
    if (soketiConnected) {
      console.log("[Soketi] Real-time connection active");
    }
  }, [soketiConnected]);

  const hasApps = (myAppsQuery.data?.apps?.length ?? 0) > 0;
  const firstApp = myAppsQuery.data?.apps?.[0];

  // Auto-select first app if none selected
  useEffect(() => {
    if (hasApps && !selectedApp && firstApp) {
      setSelectedApp(firstApp);
    }
  }, [hasApps, selectedApp, firstApp, setSelectedApp]);

  if (
    verifyTokenQuery.isLoading ||
    myAppsQuery.isLoading ||
    refreshTokenMutation.isPending
  ) {
    return <PageLoader />;
  }

  // Onboarding flow: No apps → Show create app screen
  if (!hasApps && env.isOpenAllRoutes !== "true") {
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
