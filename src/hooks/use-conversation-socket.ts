import { queryKeys } from "@/api";
import { ConversationHistoryMessage } from "@/api/services/inbox/inbox.type";
import {
  SocketNewMessagePayload,
  socketService,
} from "@/services/socket.service";
import { useAuthStore } from "@/stores/auth-store";
import { useQueryClient } from "@tanstack/react-query";
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

      queryClient.setQueryData<{
        messages: ConversationHistoryMessage[];
        [key: string]: unknown;
      }>(queryKey, (old) => {
        if (!old) return old;
        // Avoid duplicates (e.g. optimistic vs real)
        const exists = old.messages.some((m) => m.id === newMsg.id);
        if (exists) return old;
        return { ...old, messages: [...old.messages, newMsg] };
      });
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
