import { cn } from "@/lib/utils";
import { CircleCheck, CircleX } from "lucide-react";

const TOOL_LABELS: Record<string, string> = {
  create_app: "Created app",
  update_profile: "Updated profile",
  list_meta_accounts: "Checked connected pages",
  subscribe_page: "Connected page",
  unsubscribe_page: "Disconnected page",
  remember: "Saved a note",
  create_flow: "Created flow",
  update_flow: "Updated flow",
  delete_flow: "Deleted flow",
  list_flows: "Listed flows",
  create_flow_node: "Created node",
  update_flow_node: "Updated node",
  delete_flow_node: "Deleted node",
  list_flow_nodes: "Listed nodes",
  get_template_schemas: "Loaded template guide",
  list_saved_templates: "Checked your templates",
  // Inventory tools
  inspect_inventory_file: "Inspected file",
  stage_inventory_import: "Staged import",
  stage_inventory_update: "Staged bulk update",
  get_changeset_preview: "Loaded changeset preview",
  request_changeset_approval: "Requested approval",
  apply_inventory_changeset: "Applied changeset",
  cancel_changeset: "Cancelled changeset",
  search_inventory: "Searched inventory",
};

function friendly(tool: string, ok: boolean) {
  const base = TOOL_LABELS[tool] ?? tool.replace(/_/g, " ");
  return ok ? base : `${base} failed`;
}

function applyResultDetail(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  const parts: string[] = [];
  if (typeof d.applied === "number") parts.push(`${d.applied} created`);
  if (typeof d.skipped === "number") parts.push(`${d.skipped} skipped`);
  if (typeof d.failed === "number") parts.push(`${d.failed} failed`);
  return parts.length ? parts.join(" · ") : null;
}

interface ToolResultItemProps {
  tool: string;
  ok: boolean;
  data?: unknown;
  error?: string | null;
}

export function ToolResultItem({ tool, ok, data, error }: ToolResultItemProps) {
  const detail =
    ok && tool === "apply_inventory_changeset" ? applyResultDetail(data) : null;

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
        {detail && (
          <span className="ml-1 text-muted-foreground/70">— {detail}</span>
        )}
      </span>
    </div>
  );
}
