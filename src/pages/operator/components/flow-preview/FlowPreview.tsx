import { Activity, Layers } from "lucide-react";
import { FlowData, NodeData } from "@/api/services/operator/operator.type";
import { MetaMessagePreview } from "../meta-preview";
import { FlowNodeCard } from "./FlowNodeCard";

interface FlowPreviewProps {
  flow?: FlowData;
  node?: NodeData;
}

export function FlowPreview({ flow, node }: FlowPreviewProps) {
  // Single node created/updated — show a message preview card
  if (node && !flow) {
    return (
      <div className="ml-10 flex flex-col gap-1.5">
        <p className="text-xs text-muted-foreground">
          Node <code className="font-mono">{node.node_slug}</code>
        </p>
        <MetaMessagePreview
          payload={node.payload as Record<string, unknown> | null}
          payloads={node.payloads as Record<string, unknown>[] | null}
        />
      </div>
    );
  }

  // Full flow with nodes
  if (flow && flow.nodes && flow.nodes.length > 0) {
    const sorted = [...flow.nodes].sort((a, b) => a.position - b.position);

    return (
      <div className="ml-10 flex flex-col gap-3 overflow-x-auto">
        {/* Header */}
        {flow.name && (
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">{flow.name}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                flow.is_active
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {flow.is_active ? "active" : "inactive"}
            </span>
            <span className="text-xs text-muted-foreground">
              {sorted.length} node{sorted.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Node chain */}
        <div className="flex flex-col gap-0">
          {sorted.map((n, idx) => (
            <div key={n.id || idx} className="flex flex-col">
              <FlowNodeCard node={n} />
              {/* Connector line between nodes */}
              {idx < sorted.length - 1 && (
                <div className="ml-5 h-6 w-px border-l-2 border-dashed border-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Compact flow card (create_flow / update_flow — no nodes yet)
  if (flow && flow.id) {
    return (
      <div className="ml-10 flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
        <Activity className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">{flow.name}</span>
        <code className="text-xs text-muted-foreground font-mono">{flow.slug}</code>
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
            flow.is_active
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {flow.is_active ? "active" : "inactive"}
        </span>
      </div>
    );
  }

  // Compact listing (list_flows summary)
  if (flow && flow.name && !flow.id) {
    return (
      <div className="ml-10 flex items-center gap-2 text-xs text-muted-foreground">
        <Layers className="size-3.5" />
        <span>{flow.name}</span>
        {typeof flow.total === "number" && flow.total > 0 && (
          <span>· {flow.total} total</span>
        )}
      </div>
    );
  }

  return null;
}
