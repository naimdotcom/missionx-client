import Settings from "@/pages/settings/Settings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/settings")({
  component: Settings,
});
