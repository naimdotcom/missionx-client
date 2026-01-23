// Inbox layout component

import InboxPage from "@/features/inbox/InboxPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/inbox")({
  component: InboxLayout,
});

function InboxLayout() {
  return <InboxPage />;
}
