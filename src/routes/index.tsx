import { env } from "@/lib/env";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "~/stores/auth-store";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();

    if (env.openAllRoutes) {
      throw redirect({ to: "/inbox" });
    }

    if (isAuthenticated) {
      throw redirect({ to: "/inbox" });
    } else {
      throw redirect({ to: "/login" });
    }
  },
});
