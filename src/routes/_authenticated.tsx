// Protected layout for authenticated routes

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { GlobalSidebar } from "~/components/layout/global-sidebar";
import { useAuthStore } from "~/stores/auth-store";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <GlobalSidebar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
