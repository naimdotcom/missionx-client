import { cn } from "@/lib/utils";
import { CircleCheck, CircleX } from "lucide-react";

const TOOL_LABELS: Record<string, string> = {
  create_app: "Created app",
  update_profile: "Updated profile",
  list_meta_accounts: "Checked connected pages",
  subscribe_page: "Connected page",
  unsubscribe_page: "Disconnected page",
  remember: "Saved a note",
};

function friendly(tool: string, ok: boolean) {
  const base = TOOL_LABELS[tool] ?? tool.replace(/_/g, " ");
  return ok ? base : `${base} failed`;
}

interface ToolResultItemProps {
  tool: string;
  ok: boolean;
  error?: string | null;
}

export function ToolResultItem({ tool, ok, error }: ToolResultItemProps) {
  return (
    <div className="flex items-start gap-2 pl-10 text-xs">
      {ok ? (
        <CircleCheck className="mt-px size-3.5 text-[hsl(var(--sla-safe))]" />
      ) : (
        <CircleX className="mt-px size-3.5 text-destructive" />
      )}
      <span className={cn("text-muted-foreground", !ok && "text-destructive")}>
        {friendly(tool, ok)}
        {!ok && error ? ` — ${error}` : ""}
      </span>
    </div>
  );
}
