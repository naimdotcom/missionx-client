// TanStack Query hooks for messages with optimistic updates

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { SendMessagePayload, UnifiedMessage } from "~/api";
import { messagesService } from "~/api";
import { useAuthStore } from "~/stores/auth-store";
import { queryKeys } from "./api/query-keys";

// Legacy types for backward compatibility
export interface MessagePayload {
  ticketId: string;
  text?: string;
  attachments?: any[];
  replyToId?: string;
}

// Fetch messages for a ticket
export const useMessages = (ticketId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.messages.byTicket(ticketId!),
    queryFn: async ({ signal }) => {
      if (!ticketId) return [];
      const response = await messagesService.getByTicket(ticketId, { signal });
      return response.data;
    },
    enabled: !!ticketId,
    staleTime: 30_000, // 30 seconds
  });
};

// Send a new message with optimistic updates
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: MessagePayload) => {
      const apiPayload: SendMessagePayload = {
        text: payload.text,
        attachmentIds: [], // TODO: Handle attachments
      };

      const response = await messagesService.sendMessage(
        payload.ticketId,
        apiPayload,
      );
      return response.data;
    },
    onMutate: async (payload: MessagePayload) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.messages.byTicket(payload.ticketId),
      });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData<UnifiedMessage[]>(
        queryKeys.messages.byTicket(payload.ticketId),
      );

      // Optimistically update the cache
      const optimisticMessage: UnifiedMessage = {
        id: `temp-${Date.now()}`,
        ticketId: payload.ticketId,
        channelType: "facebook_page", // TODO: Get from context
        direction: "outbound",
        sender: {
          id: user?.id || "current-user",
          name: user?.name || "You",
        },
        contentType:
          payload.attachments && payload.attachments.length > 0
            ? payload.attachments[0].type
            : "text",
        text: payload.text,
        attachments: payload.attachments || [],
        timestamp: new Date().toISOString(),
        isRead: true,
        isOptimistic: true,
      };

      queryClient.setQueryData<UnifiedMessage[]>(
        queryKeys.messages.byTicket(payload.ticketId),
        (old) => [...(old || []), optimisticMessage],
      );

      return { previousMessages };
    },
    onError: (err, payload, context) => {
      // Rollback to previous state on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          queryKeys.messages.byTicket(payload.ticketId),
          context.previousMessages,
        );
      }
      console.error("Failed to send message:", err);
    },
    onSettled: (_data, _error, payload) => {
      // Refetch to sync with server
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.byTicket(payload.ticketId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all }); // Update ticket list
    },
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
