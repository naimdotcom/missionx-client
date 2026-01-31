import { useVerifyToken } from "@/api";
import { useUserProfileFull } from "@/api/services/users/users.hooks";
import { AppSidebar } from "@/components/nav-menu/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/stores/auth-store";
import { Outlet } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { useEffect } from "react";
import { UserMenu } from "../user-menu";

function PrivateLayout() {
  const { setUserProfile } = useAuthStore();
  const verifyTokenQuery = useVerifyToken(true);
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
          <header className="flex justify-between w-full px-4 py-1.5 border-b shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-2" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Inbox</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div>
              <UserMenu />
            </div>
          </header>
          <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
            <Outlet />
          </div>
        </SidebarInset>
      </NuqsAdapter>
    </SidebarProvider>
  );
}
export default PrivateLayout;
