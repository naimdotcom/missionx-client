import {
  useCreateSession,
  useOperatorSessions,
} from "@/api/services/operator/operator.hook";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Loader2, MessageSquarePlus } from "lucide-react";

const STATUS_DOT: Record<string, string> = {
  running: "bg-[hsl(var(--sla-warning))]",
  queued: "bg-[hsl(var(--sla-warning))]",
  awaiting_input: "bg-primary",
};

export function SessionSidebar() {
  const selectedApp = useAuthStore((s) => s.selectedApp);
  const sessions = useOperatorSessions();
  const createSession = useCreateSession();
  const navigate = useNavigate();
  const { sessionId } = useParams({ strict: false }) as {
    sessionId?: string;
  };

  const handleNew = () => {
    createSession.mutate(
      { app_id: selectedApp?.id ?? null, title: null },
      {
        onSuccess: (session) => {
          navigate({
            to: "/_private/operator/$sessionId",
            params: { sessionId: session.id },
          });
        },
      },
    );
  };

  return (
    <div className="flex h-full w-72 shrink-0 flex-col border-r bg-sidebar">
      <div className="p-3">
        <Button
          className="w-full justify-start gap-2"
          onClick={handleNew}
          disabled={createSession.isPending}
        >
          {createSession.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <MessageSquarePlus className="size-4" />
          )}
          New chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-0.5 px-2 pb-3">
          {sessions.isLoading && (
            <div className="flex justify-center py-6 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
            </div>
          )}

          {sessions.data?.length === 0 && !sessions.isLoading && (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground">
              No chats yet. Start a new one.
            </p>
          )}

          {sessions.data?.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() =>
                navigate({
                  to: "/_private/operator/$sessionId",
                  params: { sessionId: session.id },
                })
              }
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                session.id === sessionId
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/60",
              )}
            >
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  STATUS_DOT[session.status] ?? "bg-transparent",
                )}
              />
              <span className="truncate">
                {session.title || "Untitled chat"}
              </span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
