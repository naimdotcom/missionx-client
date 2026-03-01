import { queryKeys } from "@/api";
import {
  ConversationHistoryMessage,
  ConversationHistoryResponse,
} from "@/api/services/inbox/inbox.type";
import { useAuthStore } from "@/stores/auth-store";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { soketiService } from "./soketi.service";
import {
  SoketiCustomerUpdatedPayload,
  SoketiMessageReadPayload,
  SoketiNewMessagePayload,
} from "./soketi.type";

/**
 * Inbox module Soketi hook.
 *
 * Registers handlers for inbox-related events (new_message, message_read,
 * customer_updated). Mount this inside any inbox component — it only adds
 * and removes listeners, never touches the WebSocket connection itself.
 *
 * The connection is managed by useSoketi() in PrivateLayout.
 */
export function useInboxSoketi() {
  const queryClient = useQueryClient();
  const selectedApp = useAuthStore((s) => s.selectedApp);

  // ── new_message ────────────────────────────────────────────────────────────
  const handleNewMessage = useCallback(
    (payload: SoketiNewMessagePayload) => {
      console.debug("[Soketi][Inbox] new_message:", payload);

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

      queryClient.setQueryData<InfiniteData<ConversationHistoryResponse>>(
        queryKeys.inboxKeys.conversationHistory(convId),
        (old) => {
          // If conversation isn't in cache yet, bootstrap an initial page
          // so the message is never silently dropped
          if (!old || !old.pages.length) {
            return {
              pages: [
                {
                  messages: [newMsg],
                  channel: {},
                  has_more: false,
                } satisfies ConversationHistoryResponse,
              ],
              pageParams: [1],
            };
          }
          const firstPage = old.pages[0];
          // Deduplicate by id
          if (firstPage.messages.some((m) => m.id === newMsg.id)) return old;
          // API returns newest-first within each page. Prepend so the new
          // message is at index 0 of the first page. The conversation view does
          // .flatMap().reverse(), so it will appear at the bottom of the list.
          return {
            ...old,
            pages: [
              { ...firstPage, messages: [newMsg, ...firstPage.messages] },
              ...old.pages.slice(1),
            ],
          };
        },
      );

      // Refresh conversation list so unread counts update
      queryClient.invalidateQueries({
        queryKey: queryKeys.inboxKeys.conversationList,
      });
    },
    [queryClient],
  );

  // ── message_read ──────────────────────────────────────────────────────────
  const handleMessageRead = useCallback(
    (payload: SoketiMessageReadPayload) => {
      console.debug("[Soketi][Inbox] message_read:", payload);
      // Invalidate the specific conversation so unseen_count refreshes
      queryClient.invalidateQueries({
        queryKey: queryKeys.inboxKeys.conversationHistory(
          payload.conversation_id,
        ),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.inboxKeys.conversationList,
      });
    },
    [queryClient],
  );

  // ── customer_updated ──────────────────────────────────────────────────────
  const handleCustomerUpdated = useCallback(
    (payload: SoketiCustomerUpdatedPayload) => {
      console.debug("[Soketi][Inbox] customer_updated:", payload);
      // Refresh conversation list so avatar/name/status updates appear
      queryClient.invalidateQueries({
        queryKey: queryKeys.inboxKeys.conversationList,
      });
    },
    [queryClient],
  );

  // ── Register / unregister handlers ────────────────────────────────────────
  useEffect(() => {
    if (!selectedApp?.id) return;

    const unsubs = [
      soketiService.on("new_message", handleNewMessage),
      soketiService.on("message_read", handleMessageRead),
      soketiService.on("customer_updated", handleCustomerUpdated),
    ];

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [
    selectedApp?.id,
    handleNewMessage,
    handleMessageRead,
    handleCustomerUpdated,
  ]);
}
