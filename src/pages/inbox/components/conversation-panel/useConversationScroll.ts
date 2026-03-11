import { useConversationHistory, useMarkAsRead, useSendMessage } from "@/api/services/inbox/inbox.hook";
import { Conversation } from "@/api/services/inbox/inbox.type";
import { useMemo, useState } from "react";

export function useConversationScroll(selectedTicket: string) {
  // API Hooks
  const {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useConversationHistory(selectedTicket);
  
  const sendMessageMutation = useSendMessage();
  const { mutate: markAsRead } = useMarkAsRead();

  // State & Refs
  const [replyTo, setReplyTo] = useState<Conversation | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isChatReady, setIsChatReady] = useState(false);

  // Memos
  const messages = useMemo(() => {
    if (!isSuccess || !data) return [];
    return data.pages.flatMap((page) => page.items).reverse();
  }, [data, isSuccess]);

  const firstPage = data?.pages[0];
  const customerDetails = firstPage?.customer;
  const pageCount = data?.pages.length ?? 0;

  return {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    sendMessageMutation,
    markAsRead,
    replyTo,
    setReplyTo,
    showScrollButton,
    setShowScrollButton,
    isChatReady,
    setIsChatReady,
    messages,
    firstPage,
    customerDetails,
    pageCount
  };
}
