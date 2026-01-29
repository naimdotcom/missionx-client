import InboxPage from "@/features/inbox/InboxPage";
import { createFileRoute } from "@tanstack/react-router";

type InboxSearch = {
  status?: "active" | "closed";
};

export const Route = createFileRoute("/_private/inbox")({
  component: InboxPage,
  validateSearch: (search: Record<string, unknown>): InboxSearch => {
    return {
      status: (search.status as "active" | "closed" | undefined) ?? "active",
    };
  },
});
