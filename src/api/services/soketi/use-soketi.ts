import { queryKeys } from "@/api";
import {
  ConversationHistoryMessage,
  ConversationHistoryResponse,
} from "@/api/services/inbox/inbox.type";
import { useAuthStore } from "@/stores/auth-store";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { soketiService } from "./soketi.service";
import { SoketiNewMessagePayload } from "./soketi.type";

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseSoketiOptions {
  activeConversationId?: string;
}

export function useSoketi({ activeConversationId }: UseSoketiOptions = {}) {
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);
  const selectedApp = useAuthStore((s) => s.selectedApp);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Keep a stable ref to the conversation id so event handlers don't go stale
  const conversationIdRef = useRef(activeConversationId);
  useEffect(() => {
    conversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  // ── New message handler ────────────────────────────────────────────────────
  const handleNewMessage = useCallback(
    (payload: SoketiNewMessagePayload) => {
      console.debug("[Soketi] new_message:", payload);

      const { message, conversation } = payload;
      const convId = message.conversation_id ?? conversation?.id;

      if (!convId) return;

      // Map Soketi payload → ConversationHistoryMessage
      const newMsg: ConversationHistoryMessage = {
        id: message.id,
        type: message.message_type,
        sender: message.sender_type,
        sender_id: message.sender_id,
        content: message.content,
        created_at: message.created_at,
        conversation_id: convId,
      };

      const queryKey = queryKeys.inboxKeys.conversationHistory(convId);

      queryClient.setQueryData<InfiniteData<ConversationHistoryResponse>>(
        queryKey,
        (old) => {
          if (!old || !old.pages.length) return old;
          const firstPage = old.pages[0];
          // Deduplicate by id
          if (firstPage.messages.some((m) => m.id === newMsg.id)) return old;
          return {
            ...old,
            pages: [
              { ...firstPage, messages: [...firstPage.messages, newMsg] },
              ...old.pages.slice(1),
            ],
          };
        },
      );

      // Invalidate conversation list so unread counts refresh
      queryClient.invalidateQueries({
        queryKey: queryKeys.inboxKeys.conversationList,
      });
    },
    [queryClient, selectedApp?.id],
  );

  // ── Connect / disconnect ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !selectedApp?.id) return;

    let unsubNewMessage: (() => void) | null = null;
    let unsubMessageRead: (() => void) | null = null;
    let unsubCustomerUpdated: (() => void) | null = null;
    let cancelled = false;

    const init = () => {
      // Read token from readable cookies; falls back to empty string
      // (Soketi service will use withCredentials so httpOnly cookies are sent automatically)

      const channel = soketiService.connect(selectedApp.id);

      channel.bind("pusher:subscription_succeeded", () => {
        if (!cancelled) setConnected(true);
      });

      channel.bind("pusher:subscription_error", () => {
        if (!cancelled) setConnected(false);
      });

      // new_message
      unsubNewMessage = soketiService.on<SoketiNewMessagePayload>(
        "new_message",
        (data) => {
          if (!cancelled) handleNewMessage(data);
        },
      );

      // message_read
      unsubMessageRead = soketiService.on("message_read", (data) => {
        console.debug("[Soketi] message_read:", data);
        // Optionally invalidate conversation queries here
      });

      // customer_updated
      unsubCustomerUpdated = soketiService.on("customer_updated", (data) => {
        console.debug("[Soketi] customer_updated:", data);
        // Invalidate conversations so avatar/name refreshes
        queryClient.invalidateQueries({
          queryKey: queryKeys.inboxKeys.conversationList,
        });
      });
    };

    init();

    return () => {
      cancelled = true;
      // Only unbind event handlers — do NOT disconnect the WebSocket.
      // The service is a singleton; the connection must survive component
      // remounts (React StrictMode) and route changes for the whole session.
      // Disconnecting here causes "WebSocket closed before connection established".
      unsubNewMessage?.();
      unsubMessageRead?.();
      unsubCustomerUpdated?.();
      setConnected(false);
    };
    // Re-connect when app or auth changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedApp?.id, isAuthenticated]);

  return { connected };
}
