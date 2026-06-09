// Types for the operator harness (chat-driven platform control).
// Mirrors the apps_service contract under /api/v1/operator/*.

export type OperatorSessionStatus =
  | "idle"
  | "queued"
  | "running"
  | "awaiting_input"
  | "closed";

export interface OperatorSession {
  id: string;
  app_id: string | null;
  title: string | null;
  status: OperatorSessionStatus;
  /** Soketi channel: `private-operator.{app_id|none}.{session_id}` */
  channel: string;
  created_at: string;
}

export interface CreateSessionPayload {
  app_id?: string | null;
  title?: string | null;
}

/** A choice option presented inline for human-in-the-loop selection. */
export interface ChoiceOption {
  id: string;
  label: string;
  subtitle?: string | null;
}

// ── Live activity events (Soketi `activity` event payloads) ──────────────────
// Each event is a plain object discriminated by `type`. The same shapes are
// persisted (see FeedMessage.content) so replay matches live streaming exactly.

export interface QueuedEvent {
  type: "queued";
  position: number;
}
export interface StatusEvent {
  type: "status";
  label: string;
  tool: string;
  denied?: boolean;
}
export interface TextEvent {
  type: "text";
  text: string;
}
export interface ToolResultEvent {
  type: "tool_result";
  tool: string;
  ok: boolean;
  data?: unknown;
  error?: string | null;
}
export interface ChoiceEvent {
  type: "choice" | "awaiting_input";
  choice_id: string;
  tool_use_id: string;
  prompt: string;
  options: ChoiceOption[];
  multi: boolean;
  confirm: boolean;
}
export interface ErrorEvent {
  type: "error";
  error: string;
}
export interface DoneEvent {
  type: "done";
}
export interface UsageEvent {
  type: "usage";
  input_tokens: number;
  output_tokens: number;
}

export type OperatorEvent =
  | QueuedEvent
  | StatusEvent
  | TextEvent
  | ToolResultEvent
  | ChoiceEvent
  | ErrorEvent
  | DoneEvent
  | UsageEvent;

// ── Persisted feed rows (GET /sessions/{id}/messages) ────────────────────────

export type FeedRole = "user" | "assistant" | "event";

/** Anthropic content blocks stored on canonical (user/assistant) rows. */
export interface ContentBlock {
  type: string; // "text" | "tool_use" | "tool_result" | ...
  text?: string;
  [k: string]: unknown;
}

export interface FeedMessage {
  seq: number;
  role: FeedRole;
  event_type: string | null;
  /** string or ContentBlock[] for canonical rows; an OperatorEvent for event rows. */
  content: string | ContentBlock[] | OperatorEvent | Record<string, unknown>;
  created_at: string | null;
}

// ── POST /sessions/{id}/messages ─────────────────────────────────────────────

export interface SendChatBody {
  message: string;
}
export interface SendChoiceBody {
  choice_id: string;
  selection: string[];
}
export type PostMessageBody = SendChatBody | SendChoiceBody;

export interface MessageAccepted {
  position: number;
  channel: string;
  session_id: string;
}

// ── Flow / Node data shapes (from flow tool_result events) ────────────────────

export interface FlowData {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  channel_id?: string | null;
  nodes?: NodeData[];
  total?: number;
}

export interface NodeData {
  id: string;
  flow_id: string;
  node_slug: string;
  position: number;
  payload?: Record<string, unknown> | null;
  payloads?: Record<string, unknown>[] | null;
  next_logic?: Record<string, unknown> | null;
  pre_conditions?: Record<string, unknown> | null;
  actions?: Record<string, unknown>[] | null;
}
