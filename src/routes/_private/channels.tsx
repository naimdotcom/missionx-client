import ChannelsPage from "@/pages/channels/ChannelsPage";
import { createFileRoute } from "@tanstack/react-router";

type ChannelSearch = {
  success?: boolean;
};
export const Route = createFileRoute("/_private/channels")({
  component: ChannelsPage,
  validateSearch: (search: Record<string, unknown>): ChannelSearch => {
    return {
      success: search.success as boolean | undefined,
    };
  },
});
