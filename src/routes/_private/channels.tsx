import ChannelsPage from "@/pages/channels/ChannelsPage";
import { createFileRoute } from "@tanstack/react-router";

type ChannelSearch = {
  success?: boolean;
};

export const Route = createFileRoute("/_private/channels")({
  component: ChannelsPage,
  validateSearch: (search: Record<string, unknown>): ChannelSearch => {
    // Only include success in the returned object if it's explicitly provided
    if (search.success !== undefined) {
      return {
        success: search.success === "true" || search.success === true,
      };
    }
    // Return empty object if success param is not in the URL
    return {};
  },
});
