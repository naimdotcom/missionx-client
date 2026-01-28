// Public authentication layout

import PublicLayout from "@/components/layout/PublicLayout";
import { createFileRoute, redirect } from "@tanstack/react-router";
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
