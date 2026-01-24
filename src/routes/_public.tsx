// Public authentication layout

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "~/stores/auth-store";

export const Route = createFileRoute("/_public")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();

    // Redirect to inbox if already authenticated
    if (isAuthenticated) {
      throw redirect({ to: "/inbox" });
    }
  },
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">MissionX</h1>
          <p className="text-muted-foreground mt-2">
            Customer Experience Platform
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
