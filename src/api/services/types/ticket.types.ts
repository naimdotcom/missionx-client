// Ticket service types

export type ChannelType = "facebook_page" | "instagram_business";
export type TicketStatus = "open" | "pending" | "resolved" | "closed";
export type TicketPriority = "low" | "normal" | "high" | "urgent";
export type SentimentType = "positive" | "neutral" | "negative";

export interface Ticket {
  id: string;
  workspaceId: string;
  channelType: ChannelType;
  status: TicketStatus;
  priority: TicketPriority;
  subject: string;
  customer: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  sentiment?: SentimentType;
  unreadCount: number;
  lastMessageAt: string; // ISO 8601
  createdAt: string;
  updatedAt: string;
  sla?: {
    firstResponseTime?: number; // seconds
    resolutionTime?: number; // seconds
    firstResponseDue?: string; // ISO 8601
    resolutionDue?: string; // ISO 8601
    state?: "safe" | "warning" | "critical" | "breached";
    remainingSeconds?: number;
  };

  // Legacy properties for backward compatibility
  contactName?: string;
  unread?: number;
  lastMessage?: string;
  channel?: string;
  timestamp?: string;
}

export interface TicketFilters {
  workspaceId?: string;
  status?: TicketStatus | TicketStatus[];
  priority?: TicketPriority | TicketPriority[];
  channelType?: ChannelType | ChannelType[];
  assignedTo?: string;
  search?: string;
  sortBy?: "lastMessageAt" | "createdAt" | "priority";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CreateTicketRequest {
  workspaceId: string;
  channelType: ChannelType;
  customerId: string;
  subject: string;
  priority?: TicketPriority;
}

export interface UpdateTicketRequest {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
  subject?: string;
}

export interface AssignTicketRequest {
  userId: string;
}
