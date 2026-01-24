// Main API module - exports all services and types

// Services
export { authService } from "./services/auth.service";
export { channelsService } from "./services/channels.service";
export { messagesService } from "./services/messages.service";
export { ticketsService } from "./services/tickets.service";

// Service classes (for testing/mocking)
export { AuthService } from "./services/auth.service";
export { BaseAPIService } from "./services/base.service";
export { ChannelsService } from "./services/channels.service";
export { MessagesService } from "./services/messages.service";
export { TicketsService } from "./services/tickets.service";

// Types
export type {
  APIError,
  APIResponse,
  PaginatedResponse,
  PaginationParams,
  QueryParams,
  RequestOptions,
  SortParams,
} from "./types/api.types";

export type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  User,
} from "./services/types/auth.types";

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
} from "./services/types/ticket.types";

export type {
  Attachment,
  ContentType,
  MarkReadRequest,
  MessageDirection,
  SendMessagePayload,
  SendMessageRequest,
  UnifiedMessage,
} from "./services/types/message.types";

export type {
  ChannelConnection,
  ConnectChannelRequest,
} from "./services/types/channel.types";

// Axios instance (for advanced usage)
export { axiosInstance, createScopedAxiosInstance } from "./axios-instance";

// Endpoint constants
export { API_ENDPOINTS, PUBLIC_ROUTES } from "./types/endpoints";
