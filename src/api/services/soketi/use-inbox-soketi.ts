import { queryKeys } from "@/api";
import { ConversationHistory } from "@/api/services/inbox/inbox.type";
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
    (message: SoketiNewMessagePayload) => {
      console.debug("[Soketi][Inbox] new_message:", message);

      if (!message.message.conversation_id) return;

      queryClient.setQueryData<InfiniteData<ConversationHistory>>(
        queryKeys.inboxKeys.conversationHistory(
          message.message.conversation_id,
        ),
        (old) => {
          // No cache yet — create a minimal first page so the message is not lost
          if (!old || !old.pages.length) {
            return {
              pages: [
                { items: [message.message] } satisfies ConversationHistory,
              ],
              pageParams: [undefined],
            };
          }

          const [firstPage, ...restPages] = old.pages;

          // Skip if the message is already in cache (deduplication)
          if (firstPage.items?.some((m) => m.id === message.message.id))
            return old;

          // Prepend the new message to the first page.
          // The conversation view flattens pages and reverses them,
          // so prepending here makes it appear at the bottom of the chat.
          return {
            ...old,
            pages: [
              {
                ...firstPage,
                items: [message.message, ...(firstPage.items ?? [])],
              },
              ...restPages,
            ],
          };
        },
      );

      // Refresh conversation list so unread counts / last message update
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

      // Refresh both the conversation history (unseen_count) and the list
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

      // Refresh conversation list so avatar / name / status changes appear
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

    return () => unsubs.forEach((unsub) => unsub());
  }, [
    selectedApp?.id,
    handleNewMessage,
    handleMessageRead,
    handleCustomerUpdated,
  ]);
}
