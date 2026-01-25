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
        <Outlet />
      </div>
    </div>
  );
}
