import { AppsPage } from "@/features/apps";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/apps")({
  component: AppsPage,
  validateSearch: (search) => search as Record<string, any>,
});
