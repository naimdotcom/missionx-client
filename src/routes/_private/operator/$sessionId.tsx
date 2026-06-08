import { createFileRoute } from "@tanstack/react-router";
import { ChatPanel } from "@/pages/operator/components/ChatPanel";
import { useOperatorSessions } from "@/api/services/operator/operator.hook";
import { Loader2 } from "lucide-react";

function OperatorSessionRoute() {
  const { sessionId } = Route.useParams();
  const sessions = useOperatorSessions();

  if (sessions.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  const session = sessions.data?.find((s) => s.id === sessionId) ?? null;
  return <ChatPanel session={session} />;
}

export const Route = createFileRoute("/_private/operator/$sessionId")({
  component: OperatorSessionRoute,
});
