// Query key factory for TanStack Query

import type { TicketFilters } from "~/api";

/**
 * Centralized query key factory following TanStack Query best practices
 * https://tkdodo.eu/blog/effective-react-query-keys
 */
export const queryKeys = {
  // Auth queries
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },

  // Ticket queries
  tickets: {
    all: ["tickets"] as const,
    lists: () => [...queryKeys.tickets.all, "list"] as const,
    list: (workspaceId: string, filters?: TicketFilters) =>
      [...queryKeys.tickets.lists(), workspaceId, filters] as const,
    details: () => [...queryKeys.tickets.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.tickets.details(), id] as const,
  },

  // Message queries
  messages: {
    all: ["messages"] as const,
    byTicket: (ticketId: string) =>
      [...queryKeys.messages.all, "ticket", ticketId] as const,
  },

  // Channel queries
  channels: {
    all: ["channels"] as const,
    lists: () => [...queryKeys.channels.all, "list"] as const,
    list: () => [...queryKeys.channels.lists()] as const,
    details: () => [...queryKeys.channels.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.channels.details(), id] as const,
  },

  // Workspace queries
  workspaces: {
    all: ["workspaces"] as const,
    lists: () => [...queryKeys.workspaces.all, "list"] as const,
    list: () => [...queryKeys.workspaces.lists()] as const,
    details: () => [...queryKeys.workspaces.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.workspaces.details(), id] as const,
  },
} as const;

/**
 * Mutation keys for tracking mutation states
 */
export const mutationKeys = {
  auth: {
    login: ["auth", "login"] as const,
    register: ["auth", "register"] as const,
    logout: ["auth", "logout"] as const,
  },
  tickets: {
    create: ["tickets", "create"] as const,
    update: ["tickets", "update"] as const,
    delete: ["tickets", "delete"] as const,
    assign: ["tickets", "assign"] as const,
    close: ["tickets", "close"] as const,
  },
  messages: {
    send: ["messages", "send"] as const,
    markRead: ["messages", "markRead"] as const,
  },
  channels: {
    connect: ["channels", "connect"] as const,
    disconnect: ["channels", "disconnect"] as const,
  },
} as const;
