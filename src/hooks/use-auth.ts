// TanStack Query hooks for messages with optimistic updates

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { LoginRequest } from "~/api";
import { authService, messagesService } from "~/api";
import { queryKeys } from "./api/query-keys";

// Legacy types for backward compatibility
export interface MessagePayload {
  ticketId: string;
  text?: string;
  attachments?: any[];
  replyToId?: string;
}

// Fetch messages for a ticket
// export const useLogin = (ticketId: string | undefined) => {
//   return useQuery({
//     queryKey: queryKeys.messages.byTicket(ticketId!),
//     queryFn: async ({ signal }) => {
//       if (!ticketId) return [];
//       const response = await messagesService.getByTicket(ticketId, { signal });
//       return response.data;
//     },
//     enabled: !!ticketId,
//     staleTime: 30_000, // 30 seconds
//   });
// };

// Send a new message with optimistic updates
export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const response = await authService.login(payload);
      return response.data;
    },
    onMutate: async (payload: LoginRequest) => {},
  });
};

// Mark messages as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      messageIds,
    }: {
      ticketId: string;
      messageIds: string[];
    }) => {
      const response = await messagesService.markAsRead(ticketId, messageIds);
      return response.data;
    },
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.byTicket(ticketId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
    },
  });
};

// Hook to listen to real-time messages via WebSocket
export const useRealtimeMessages = (ticketId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!ticketId) return;

    // TODO: Uncomment when WebSocket service is implemented
    // const unsubscribe = wsService.onMessage((newMessage: UnifiedMessage) => {
    //   // Only add message if it belongs to the current ticket
    //   if (newMessage.ticketId === ticketId) {
    //     queryClient.setQueryData<UnifiedMessage[]>(
    //       queryKeys.messages.byTicket(ticketId),
    //       (old) => {
    //         // Avoid duplicates
    //         if (old?.some((msg) => msg.id === newMessage.id)) {
    //           return old;
    //         }
    //         return [...(old || []), newMessage];
    //       },
    //     );
    //   }

    //   // Update ticket list to reflect new message
    //   queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
    // });

    // return unsubscribe;
  }, [ticketId, queryClient]);
};
