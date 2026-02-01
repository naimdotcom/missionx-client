// Protected layout for authenticated routes

import PrivateLayout from "@/components/layout/PrivateLayout";
import { env } from "@/lib/env";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "~/stores/auth-store";

export const Route = createFileRoute("/_private")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();

    // Skip authentication if environment variable is set
    if (env.isOpenAllRoutes === "true") {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: PrivateLayout,
});
