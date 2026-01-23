// TanStack Query hooks for tickets

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "~/services/api-client";
import { Ticket, TicketFilters } from "~/types/ticket";

// Fetch tickets for a workspace with filters
export const useTickets = (
  workspaceId: string | undefined,
  filters: TicketFilters = {},
) => {
  return useQuery({
    queryKey: ["tickets", workspaceId, filters],
    queryFn: async () => {
      if (!workspaceId) return [];

      const params: Record<string, any> = { workspaceId };

      if (filters.status && filters.status !== "all") {
        params.status = filters.status;
      }
      if (filters.channel && filters.channel !== "all") {
        params.channelConnectionId = filters.channel;
      }
      if (filters.assignee) {
        if (filters.assignee === "me") {
          params.assignedToMe = true;
        } else if (filters.assignee === "unassigned") {
          params.unassigned = true;
        } else if (filters.assignee !== "all") {
          params.assignedTo = filters.assignee;
        }
      }
      if (filters.sort) {
        params.sort = filters.sort;
      }

      const response = await apiClient.get<Ticket[]>("/tickets", params);
      return response.data;
    },
    enabled: !!workspaceId,
    staleTime: 10_000, // 10 seconds
  });
};

// Fetch a single ticket by ID
export const useTicket = (ticketId: string | undefined) => {
  return useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
      if (!ticketId) return null;
      const response = await apiClient.get<Ticket>(`/tickets/${ticketId}`);
      return response.data;
    },
    enabled: !!ticketId,
  });
};

// Update ticket status
export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      status,
    }: {
      ticketId: string;
      status: Ticket["status"];
    }) => {
      const response = await apiClient.patch<Ticket>(`/tickets/${ticketId}`, {
        status,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket", data.id] });
    },
  });
};

// Assign ticket to agent
export const useAssignTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      agentId,
    }: {
      ticketId: string;
      agentId: string | null;
    }) => {
      const response = await apiClient.patch<Ticket>(
        `/tickets/${ticketId}/assign`,
        { agentId },
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket", data.id] });
    },
  });
};

// Update ticket priority
export const useUpdateTicketPriority = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      priority,
    }: {
      ticketId: string;
      priority: Ticket["priority"];
    }) => {
      const response = await apiClient.patch<Ticket>(`/tickets/${ticketId}`, {
        priority,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket", data.id] });
    },
  });
};
