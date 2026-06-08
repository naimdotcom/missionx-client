import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

function OperatorEmptyState() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="size-6" />
      </div>
      <div>
        <p className="font-medium text-foreground">Your assistant</p>
        <p className="text-sm">
          Start a new chat to manage your account by messaging.
        </p>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_private/operator/")({
  component: OperatorEmptyState,
});
