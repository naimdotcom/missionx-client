// TanStack Query hooks for messages with optimistic updates

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { apiClient } from "~/services/api-client";
import { wsService } from "~/services/websocket";
import { MessagePayload, UnifiedMessage } from "~/types/message";

// Fetch messages for a ticket
export const useMessages = (ticketId: string | undefined) => {
  return useQuery({
    queryKey: ["messages", ticketId],
    queryFn: async () => {
      if (!ticketId) return [];
      const response = await apiClient.get<UnifiedMessage[]>(
        `/tickets/${ticketId}/messages`,
      );
      return response.data;
    },
    enabled: !!ticketId,
    staleTime: 30_000, // 30 seconds
  });
};

// Send a new message with optimistic updates
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: MessagePayload) => {
      const response = await apiClient.post<UnifiedMessage>(
        `/tickets/${payload.ticketId}/messages`,
        {
          text: payload.text,
          attachments: payload.attachments,
          replyToId: payload.replyToId,
        },
      );
      return response.data;
    },
    onMutate: async (payload: MessagePayload) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["messages", payload.ticketId],
      });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData<UnifiedMessage[]>([
        "messages",
        payload.ticketId,
      ]);

      // Optimistically update the cache
      const optimisticMessage: UnifiedMessage = {
        id: `temp-${Date.now()}`,
        ticketId: payload.ticketId,
        channelType: "facebook_page", // TODO: Get from context
        direction: "outbound",
        sender: {
          id: "current-user", // TODO: Get from auth store
          name: "You",
          type: "agent",
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
        ["messages", payload.ticketId],
        (old) => [...(old || []), optimisticMessage],
      );

      return { previousMessages };
    },
    onError: (err, payload, context) => {
      // Rollback to previous state on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", payload.ticketId],
          context.previousMessages,
        );
      }
      console.error("Failed to send message:", err);
    },
    onSettled: (_data, _error, payload) => {
      // Refetch to sync with server
      queryClient.invalidateQueries({
        queryKey: ["messages", payload.ticketId],
      });
      queryClient.invalidateQueries({ queryKey: ["tickets"] }); // Update ticket list
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
      const response = await apiClient.post(
        `/tickets/${ticketId}/messages/read`,
        { messageIds },
      );
      return response.data;
    },
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

// Hook to listen to real-time messages via WebSocket
export const useRealtimeMessages = (ticketId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!ticketId) return;

    const unsubscribe = wsService.onMessage((newMessage: UnifiedMessage) => {
      // Only add message if it belongs to the current ticket
      if (newMessage.ticketId === ticketId) {
        queryClient.setQueryData<UnifiedMessage[]>(
          ["messages", ticketId],
          (old) => {
            // Avoid duplicates
            if (old?.some((msg) => msg.id === newMessage.id)) {
              return old;
            }
            return [...(old || []), newMessage];
          },
        );
      }

      // Update ticket list to reflect new message
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    });

    return unsubscribe;
  }, [ticketId, queryClient]);
};
