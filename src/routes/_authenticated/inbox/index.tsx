// Inbox index - redirects to workspace

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/inbox/")({
  beforeLoad: () => {
    throw redirect({ to: "/inbox/ws-1" });
  },
});
