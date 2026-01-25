// Tickets service

import type { RequestOptions } from "../types/api.types";
import { API_ENDPOINTS } from "../types/endpoints";
import { BaseAPIService } from "./base.service";
import type {
  AssignTicketRequest,
  CreateTicketRequest,
  Ticket,
  TicketFilters,
  UpdateTicketRequest,
} from "./types/ticket.types";

export class TicketsService extends BaseAPIService {
  /**
   * Get paginated list of tickets with filters
   */
  getTickets = (filters?: TicketFilters, options?: RequestOptions) =>
    this.getPaginated<Ticket>(
      API_ENDPOINTS.TICKETS.LIST,
      filters as any,
      options,
    );

  /**
   * Get single ticket by ID
   */
  getTicket = (ticketId: string, options?: RequestOptions) =>
    this.get<Ticket>(
      API_ENDPOINTS.TICKETS.DETAIL(ticketId),
      undefined,
      options,
    );

  /**
   * Create new ticket
   */
  createTicket = (data: CreateTicketRequest, options?: RequestOptions) =>
    this.post<Ticket>(API_ENDPOINTS.TICKETS.CREATE, data, options);

  /**
   * Update existing ticket
   */
  updateTicket = (
    ticketId: string,
    data: UpdateTicketRequest,
    options?: RequestOptions,
  ) =>
    this.patch<Ticket>(API_ENDPOINTS.TICKETS.UPDATE(ticketId), data, options);

  /**
   * Delete ticket
   */
  deleteTicket = (ticketId: string, options?: RequestOptions) =>
    this.delete<void>(API_ENDPOINTS.TICKETS.DELETE(ticketId), options);

  /**
   * Assign ticket to user
   */
  assignTicket = (
    ticketId: string,
    data: AssignTicketRequest,
    options?: RequestOptions,
  ) => this.post<Ticket>(API_ENDPOINTS.TICKETS.ASSIGN(ticketId), data, options);

  /**
   * Close ticket
   */
  closeTicket = (ticketId: string, options?: RequestOptions) =>
    this.post<Ticket>(
      API_ENDPOINTS.TICKETS.CLOSE(ticketId),
      undefined,
      options,
    );
}

// Export singleton instance
export const ticketsService = new TicketsService();
