import InboxPage from "@/pages/inbox/InboxPage";
import { createFileRoute } from "@tanstack/react-router";

type InboxSearch = {
  case?: string;
  status?: "active" | "closed";
};

export const Route = createFileRoute("/_private/inbox")({
  component: InboxPage,
  validateSearch: (search: Record<string, unknown>): InboxSearch => {
    return {
      status: (search.status as "active" | "closed" | undefined) ?? "active",
      case: search.case as string | undefined,
    };
  },
});
