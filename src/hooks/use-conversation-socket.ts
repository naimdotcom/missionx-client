import { queryKeys } from "@/api";
import {
  ConversationHistoryMessage,
  ConversationHistoryResponse,
} from "@/api/services/inbox/inbox.type";
import {
  SocketNewMessagePayload,
  socketService,
} from "@/services/socket.service";
import { useAuthStore } from "@/stores/auth-store";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

/**
 * Connects to the Socket.io server, joins the given conversation room,
 * and injects incoming `message:new` events directly into the TanStack
 * Query cache so the conversation view updates in real-time.
 */
export function useConversationSocket(conversationId: string | undefined) {
  const queryClient = useQueryClient();
  const userProfile = useAuthStore((s) => s.userProfile);

  const handleNewMessage = useCallback(
    (payload: SocketNewMessagePayload) => {
      if (!conversationId) return;
      if (payload.conversation_id !== conversationId) return;

      // Map socket payload → ConversationHistoryMessage
      const newMsg: ConversationHistoryMessage = {
        id: payload.id,
        type: payload.type,
        sender: payload.sender,
        sender_id: payload.sender_id,
        content: payload.content,
        created_at: payload.created_at,
        conversation_id: payload.conversation_id,
        attendant: payload.attendant,
      };

      const queryKey = queryKeys.inboxKeys.conversationHistory(conversationId);

      queryClient.setQueryData<InfiniteData<ConversationHistoryResponse>>(
        queryKey,
        (old) => {
          if (!old || !old.pages.length) return old;
          // Append new message to the first page (newest messages)
          const firstPage = old.pages[0];
          const exists = firstPage.messages.some((m) => m.id === newMsg.id);
          if (exists) return old;
          return {
            ...old,
            pages: [
              { ...firstPage, messages: [...firstPage.messages, newMsg] },
              ...old.pages.slice(1),
            ],
          };
        },
      );
    },
    [conversationId, queryClient],
  );

  useEffect(() => {
    if (!conversationId) return;

    // Connect (no-op if already connected)
    const token = userProfile?.user.id ?? undefined;
    socketService.connect(token as string | undefined);

    // Join this conversation's room
    socketService.joinConversation(conversationId);

    // Subscribe to new messages
    const unsubscribe = socketService.on<SocketNewMessagePayload>(
      "message:new",
      handleNewMessage,
    );

    return () => {
      unsubscribe();
      socketService.leaveConversation(conversationId);
    };
  }, [conversationId, handleNewMessage, userProfile?.user.id]);
}
