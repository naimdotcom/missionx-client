// Timeline normalizer — the single source of truth that makes live streaming
// and persisted replay render identically and unbroken.
//
// The backend persists BOTH display `event` rows and `assistant` canonical rows.
// To avoid double-rendering, replay uses the `event` rows for the assistant side
// (identical to what was streamed live) and skips `assistant` canonical rows.

import {
  ChoiceOption,
  ContentBlock,
  FeedMessage,
  FlowData,
  NodeData,
  OperatorEvent,
} from "@/api/services/operator/operator.type";

export type TimelineItem =
  | { kind: "user"; id: string; text: string }
  | { kind: "assistant"; id: string; text: string }
  | {
      kind: "status";
      id: string;
      label: string;
      tool: string;
      denied?: boolean;
      done?: boolean;
    }
  | {
      kind: "tool_result";
      id: string;
      tool: string;
      ok: boolean;
      data?: unknown;
      error?: string | null;
    }
  | {
      kind: "flow_result";
      id: string;
      tool: string;
      flow?: FlowData;
      node?: NodeData;
    }
  | {
      kind: "choice";
      id: string;
      choiceId: string;
      prompt: string;
      options: ChoiceOption[];
      multi: boolean;
      confirm: boolean;
      answered: boolean;
      selection?: string[];
    }
  | { kind: "queued"; id: string; position: number }
  | { kind: "error"; id: string; error: string };

let _seq = 0;
const uid = (kind: string) => `${kind}-${Date.now()}-${_seq++}`;

// Flow tools whose successful results get a rich visual card.
const FLOW_TOOLS = new Set([
  "create_flow",
  "update_flow",
  "list_flows",
  "create_flow_node",
  "update_flow_node",
  "list_flow_nodes",
]);

function extractFlowResult(
  tool: string,
  data: unknown,
): { flow?: FlowData; node?: NodeData } | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  // Single node (create_flow_node / update_flow_node)
  if (typeof d.node_slug === "string") {
    return { node: d as unknown as NodeData };
  }

  // List of nodes (list_flow_nodes) — attach to a synthetic flow wrapper
  if (Array.isArray(d.nodes)) {
    return {
      flow: {
        id: "",
        name: "",
        slug: "",
        is_active: true,
        nodes: d.nodes as NodeData[],
        total: typeof d.total === "number" ? d.total : d.nodes.length,
      },
    };
  }

  // List of flows (list_flows)
  if (Array.isArray(d.flows)) {
    return {
      flow: {
        id: "",
        name: `${d.flows.length} flow${d.flows.length !== 1 ? "s" : ""}`,
        slug: "",
        is_active: true,
        nodes: [],
        total: typeof d.total === "number" ? d.total : d.flows.length,
      },
    };
  }

  // Single flow (create_flow / update_flow)
  if (typeof d.id === "string" && typeof d.slug === "string" && !d.node_slug) {
    return { flow: d as unknown as FlowData };
  }

  void tool;
  return null;
}

function isEvent(value: unknown): value is OperatorEvent {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { type?: unknown }).type === "string"
  );
}

/** Mark the most recent unanswered choice as answered (used on choice replies). */
export function markChoiceAnswered(
  items: TimelineItem[],
  selection: string[],
  choiceId?: string,
): TimelineItem[] {
  const next = [...items];
  for (let i = next.length - 1; i >= 0; i--) {
    const it = next[i];
    if (it.kind === "choice" && !it.answered) {
      if (choiceId && it.choiceId !== choiceId) continue;
      next[i] = { ...it, answered: true, selection };
      break;
    }
  }
  return next;
}

/** Resolve any pending status/queued indicators once a turn produces output. */
function settleTransient(items: TimelineItem[], tool?: string): TimelineItem[] {
  return items.map((it) => {
    if (it.kind === "status" && !it.done && (!tool || it.tool === tool)) {
      return { ...it, done: true };
    }
    return it;
  });
}

/** Apply a single live (or persisted) event to the timeline. */
export function applyLiveEvent(
  items: TimelineItem[],
  event: OperatorEvent,
): TimelineItem[] {
  switch (event.type) {
    case "queued": {
      // Keep a single queued pill; replace if one already exists.
      const without = items.filter((it) => it.kind !== "queued");
      return [
        ...without,
        { kind: "queued", id: uid("queued"), position: event.position },
      ];
    }
    case "status": {
      const without = items.filter((it) => it.kind !== "queued");
      return [
        ...without,
        {
          kind: "status",
          id: uid("status"),
          label: event.label,
          tool: event.tool,
          denied: event.denied,
        },
      ];
    }
    case "text": {
      const text = event.text ?? "";
      if (!text.trim()) return items;
      const settled = settleTransient(items);
      const last = settled[settled.length - 1];
      // Merge consecutive assistant text within the same turn (no broken bubbles).
      if (last && last.kind === "assistant") {
        const merged = [...settled];
        merged[merged.length - 1] = {
          ...last,
          text: `${last.text}\n\n${text}`,
        };
        return merged;
      }
      return [...settled, { kind: "assistant", id: uid("assistant"), text }];
    }
    case "tool_result": {
      const settled = settleTransient(items, event.tool);
      // Flow tools with successful results get a rich visual card instead of a
      // plain tool_result row. On error, fall through to the standard label+icon.
      if (event.ok && FLOW_TOOLS.has(event.tool)) {
        const extracted = extractFlowResult(event.tool, event.data);
        if (extracted) {
          return [
            ...settled,
            {
              kind: "flow_result" as const,
              id: uid("flow"),
              tool: event.tool,
              ...extracted,
            },
          ];
        }
      }
      return [
        ...settled,
        {
          kind: "tool_result",
          id: uid("tool"),
          tool: event.tool,
          ok: event.ok,
          data: event.data,
          error: event.error ?? null,
        },
      ];
    }
    case "choice":
    case "awaiting_input": {
      const settled = settleTransient(items);
      // awaiting_input duplicates choice — don't add twice.
      const already = settled.some(
        (it) => it.kind === "choice" && it.choiceId === event.choice_id,
      );
      if (already) return settled;
      return [
        ...settled,
        {
          kind: "choice",
          id: uid("choice"),
          choiceId: event.choice_id,
          prompt: event.prompt,
          options: event.options ?? [],
          multi: !!event.multi,
          confirm: !!event.confirm,
          answered: false,
        },
      ];
    }
    case "error": {
      const settled = settleTransient(items).filter(
        (it) => it.kind !== "queued",
      );
      return [
        ...settled,
        { kind: "error", id: uid("error"), error: event.error },
      ];
    }
    case "done": {
      return settleTransient(items).filter((it) => it.kind !== "queued");
    }
    case "usage":
    default:
      return items;
  }
}

/** Apply a canonical user row: a typed message, or a choice-reply tool_result. */
function applyUserCanonical(
  items: TimelineItem[],
  content: FeedMessage["content"],
): TimelineItem[] {
  if (typeof content === "string") {
    if (!content.trim()) return items;
    return [...items, { kind: "user", id: uid("user"), text: content }];
  }
  if (Array.isArray(content)) {
    const toolResult = (content as ContentBlock[]).find(
      (b) => b.type === "tool_result",
    );
    if (toolResult) {
      // A choice reply — reflect the selection on the open choice card.
      let selection: string[] = [];
      try {
        const raw = (toolResult as { content?: unknown }).content;
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (parsed && Array.isArray(parsed.selected))
          selection = parsed.selected;
      } catch {
        /* best-effort */
      }
      return markChoiceAnswered(items, selection);
    }
    // Plain text blocks (rare for user rows).
    const text = (content as ContentBlock[])
      .filter((b) => b.type === "text" && b.text)
      .map((b) => b.text as string)
      .join("\n")
      .trim();
    if (text) return [...items, { kind: "user", id: uid("user"), text }];
  }
  return items;
}

/** Build the full timeline from the persisted feed (replay == live). */
export function feedToTimeline(rows: FeedMessage[]): TimelineItem[] {
  let items: TimelineItem[] = [];
  for (const row of rows) {
    if (row.role === "user") {
      items = applyUserCanonical(items, row.content);
    } else if (row.role === "event") {
      if (isEvent(row.content)) items = applyLiveEvent(items, row.content);
    }
    // assistant canonical rows are intentionally skipped.
  }
  return items;
}

export function appendUserMessage(
  items: TimelineItem[],
  text: string,
): TimelineItem[] {
  return [...items, { kind: "user", id: uid("user"), text }];
}
