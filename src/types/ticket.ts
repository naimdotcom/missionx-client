// Ticket and conversation types

export type TicketStatus = "open" | "pending" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type SentimentType = "positive" | "neutral" | "negative";

export interface SLATimer {
  target: string; // ISO 8601 timestamp
  remainingSeconds: number;
  state: "safe" | "warning" | "critical" | "breached";
}

export interface Ticket {
  id: string;
  workspaceId: string;
  channelConnectionId: string;
  contactId: string;
  contactName: string;
  contactAvatarUrl?: string;
  contactUsername?: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string; // Agent ID
  unreadCount: number;
  lastMessagePreview: string;
  lastMessageTimestamp: string;
  sentiment?: SentimentType;
  sla?: SLATimer;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketFilters {
  status?: TicketStatus | "all";
  channel?: string | "all"; // channelConnectionId or "all"
  assignee?: string | "me" | "unassigned" | "all";
  sort?: "newest" | "oldest" | "priority" | "unread";
}
