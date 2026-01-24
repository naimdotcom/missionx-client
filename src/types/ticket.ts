// Ticket types barrel - re-exports from API module
export type {
  AssignTicketRequest,
  ChannelType,
  CreateTicketRequest,
  SentimentType,
  Ticket,
  TicketFilters,
  TicketPriority,
  TicketStatus,
  UpdateTicketRequest,
} from "~/api/services/types/ticket.types";

// SLA Timer type - extracted from Ticket.sla
export interface SLATimer {
  firstResponseTime?: number; // seconds
  resolutionTime?: number; // seconds
  firstResponseDue?: string; // ISO 8601
  resolutionDue?: string; // ISO 8601
  state: "safe" | "warning" | "critical" | "breached";
  remainingSeconds: number;
}
