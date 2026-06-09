import { ArrowRight } from "lucide-react";
import { NodeData } from "@/api/services/operator/operator.type";
import { MetaMessagePreview } from "../meta-preview";

interface FlowNodeCardProps {
  node: NodeData;
}

export function FlowNodeCard({ node }: FlowNodeCardProps) {
  const nextLogic = node.next_logic as Record<string, unknown> | null | undefined;
  const defaultNext = nextLogic?.default as string | undefined;
  const buttonMatch = nextLogic?.button_payload_match as Record<string, string> | undefined;

  return (
    <div className="relative flex flex-col gap-2">
      {/* Node card */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <code className="text-xs font-mono text-muted-foreground">{node.node_slug}</code>
        </div>

        {/* Message preview */}
        <div className="p-3">
          <MetaMessagePreview
            payload={node.payload as Record<string, unknown> | null}
            payloads={node.payloads as Record<string, unknown>[] | null}
          />
        </div>

        {/* Routing */}
        {(defaultNext || (buttonMatch && Object.keys(buttonMatch).length > 0)) && (
          <div className="flex flex-wrap gap-1.5 border-t border-border px-3 py-2">
            {defaultNext && (
              <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                <ArrowRight className="size-3" />
                {defaultNext}
              </span>
            )}
            {buttonMatch &&
              Object.entries(buttonMatch).map(([payload, target]) => (
                <span
                  key={payload}
                  className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                  title={`When "${payload}" tapped → ${target}`}
                >
                  <ArrowRight className="size-3" />
                  {target}
                </span>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
