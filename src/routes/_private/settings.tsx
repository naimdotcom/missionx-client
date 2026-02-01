import Settings from "@/features/settings/Settings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Settings />;
}
