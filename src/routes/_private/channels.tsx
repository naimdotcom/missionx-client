import ChannelsPage from "@/pages/channels/ChannelsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/channels")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ChannelsPage />;
}
