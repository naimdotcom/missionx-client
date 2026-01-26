import InboxPage from "@/features/inbox/InboxPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/inbox")({
  component: InboxPage,
});
