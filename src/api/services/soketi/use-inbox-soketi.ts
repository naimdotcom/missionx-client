import { queryKeys } from "@/api";
import { ConversationHistory } from "@/api/services/inbox/inbox.type";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { useAuthStore } from "@/stores/auth-store";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
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
  const search: any = useSearch({ strict: false });
  const activeCase = search?.case;

  // ── new_message ────────────────────────────────────────────────────────────
  const handleNewMessage = useCallback(
    (payload: SoketiNewMessagePayload) => {
      console.debug("[Soketi][Inbox] new_message:", payload);

      if (!payload.message.conversation_id) return;

      // Show toast if message is from customer and NOT in the active conversation
      const isFromCustomer = payload.message.sender === "customer";
      const isOtherTicket = payload.message.conversation_id !== activeCase;

      if (isFromCustomer && isOtherTicket) {
        const customerName = payload.customer?.display_name || "Customer";
        const channelPlatform = payload.channel?.platform || "Channel";
        const messageText =
          payload.message.content?.text ||
          (payload.message.content?.attachments?.length
            ? "Sent an attachment"
            : "New message");

        gooeyToast(`${customerName} (${channelPlatform})`, {
          description: messageText,
        });
      }

      queryClient.setQueryData<InfiniteData<ConversationHistory>>(
        queryKeys.inboxKeys.conversationHistory(
          payload.message.conversation_id,
        ),
        (old) => {
          // No cache yet — create a minimal first page so the message is not lost
          if (!old || !old.pages.length) {
            return {
              pages: [
                { items: [payload.message] } satisfies ConversationHistory,
              ],
              pageParams: [undefined],
            };
          }

          const [firstPage, ...restPages] = old.pages;

          // Skip if the message is already in cache (deduplication)
          if (firstPage.items?.some((m) => m.id === payload.message.id))
            return old;

          // Prepend the new message to the first page.
          // The conversation view flattens pages and reverses them,
          // so prepending here makes it appear at the bottom of the chat.
          return {
            ...old,
            pages: [
              {
                ...firstPage,
                items: [payload.message, ...(firstPage.items ?? [])],
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
    [queryClient, activeCase],
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
