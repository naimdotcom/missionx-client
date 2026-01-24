// Tickets service

import type {
  APIResponse,
  PaginatedResponse,
  RequestOptions,
} from "../types/api.types";
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
  async getTickets(
    filters?: TicketFilters,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<Ticket>> {
    return this.getPaginated<Ticket>(
      API_ENDPOINTS.TICKETS.LIST,
      filters as any,
      options,
    );
  }

  /**
   * Get single ticket by ID
   */
  async getTicket(
    ticketId: string,
    options?: RequestOptions,
  ): Promise<APIResponse<Ticket>> {
    return this.get<Ticket>(
      API_ENDPOINTS.TICKETS.DETAIL(ticketId),
      undefined,
      options,
    );
  }

  /**
   * Create new ticket
   */
  async createTicket(
    data: CreateTicketRequest,
    options?: RequestOptions,
  ): Promise<APIResponse<Ticket>> {
    return this.post<CreateTicketRequest, Ticket>(
      API_ENDPOINTS.TICKETS.CREATE,
      data,
      options,
    );
  }

  /**
   * Update existing ticket
   */
  async updateTicket(
    ticketId: string,
    data: UpdateTicketRequest,
    options?: RequestOptions,
  ): Promise<APIResponse<Ticket>> {
    return this.patch<UpdateTicketRequest, Ticket>(
      API_ENDPOINTS.TICKETS.UPDATE(ticketId),
      data,
      options,
    );
  }

  /**
   * Delete ticket
   */
  async deleteTicket(
    ticketId: string,
    options?: RequestOptions,
  ): Promise<APIResponse<void>> {
    return this.delete<void>(API_ENDPOINTS.TICKETS.DELETE(ticketId), options);
  }

  /**
   * Assign ticket to user
   */
  async assignTicket(
    ticketId: string,
    data: AssignTicketRequest,
    options?: RequestOptions,
  ): Promise<APIResponse<Ticket>> {
    return this.post<AssignTicketRequest, Ticket>(
      API_ENDPOINTS.TICKETS.ASSIGN(ticketId),
      data,
      options,
    );
  }

  /**
   * Close ticket
   */
  async closeTicket(
    ticketId: string,
    options?: RequestOptions,
  ): Promise<APIResponse<Ticket>> {
    return this.post<void, Ticket>(
      API_ENDPOINTS.TICKETS.CLOSE(ticketId),
      undefined as any,
      options,
    );
  }
}

// Export singleton instance
export const ticketsService = new TicketsService();
