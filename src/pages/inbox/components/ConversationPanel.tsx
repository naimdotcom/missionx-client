import {
  Conversation,
} from "@/api/services/inbox/inbox.type";
import ConversationLoading from "@/components/shared/ConversationLoading";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Route } from "@/routes";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { useStickToBottom } from "use-stick-to-bottom";
import { ConversationHeader } from "./conversation-panel/ConversationHeader";
import { useConversationScroll } from "./conversation-panel/useConversationScroll";
import { MessageBubble } from "./message-bublle/message-bubble";
import {
  SimplifiedReplier,
  SimplifiedReplierHandle,
} from "./replier/components/SimplifiedReplier";

interface ConversationAreaProps {
  className?: string;
  unreadCount?: number;
  selectedTicket: string;
  onShowDetails?: () => void;
  onShowSidebar?: () => void;
}
/**
 * Main ConversationArea Component
 */
function ConversationArea({
  className,
  unreadCount,
  selectedTicket,
  onShowDetails,
  onShowSidebar,
}: ConversationAreaProps) {
  const navigate = useNavigate({ from: Route.fullPath });
  const { scrollRef, contentRef, isAtBottom, scrollToBottom } =
    useStickToBottom();

  // API Hooks & State Management via Custom Hook
  const {
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
    pageCount,
  } = useConversationScroll(selectedTicket);

  const replierRef = useRef<SimplifiedReplierHandle>(null);
  const savedScrollHeightRef = useRef(0);
  const prevPageCountRef = useRef(0);

  // ── Initial Load & Scroll To Bottom ─────────────────────────────────────

  // Handle switching conversations
  useEffect(() => {
    setIsChatReady(false); // Disable pagination while loading
    if (isSuccess) {
      scrollToBottom();
      // Mark chat as ready after waiting for scrollToBottom to finish (approx 300ms)
      const timeout = setTimeout(() => setIsChatReady(true), 300);
      replierRef.current?.focus();
      return () => clearTimeout(timeout);
    }
  }, [selectedTicket, isSuccess, scrollToBottom]);

  // ── Scroll Management (Pagination) ───────────────────────────────────────

  // Determine when to fetch older messages
  const handleFetchOlder = useCallback(() => {
    if (scrollRef.current) {
      // Save current scroll height so we can restore position after loading older messages
      savedScrollHeightRef.current = scrollRef.current.scrollHeight;
    }
    fetchNextPage();
  }, [fetchNextPage, scrollRef]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    
    // Show "scroll down" button if we scroll up
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollButton(distanceFromBottom > 200);

    // Auto-fetch older messages when scrolling to the top
    // isChatReady prevents this from triggering on initial load (when scrollTop is briefly 0)
    if (isChatReady && el.scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
      handleFetchOlder();
    }
  }, [isChatReady, hasNextPage, isFetchingNextPage, handleFetchOlder]);

  // Restore scroll position so screen doesn't jump to top when older messages load
  useLayoutEffect(() => {
    if (pageCount > 1 && pageCount !== prevPageCountRef.current) {
      const container = scrollRef.current;
      if (container && savedScrollHeightRef.current > 0) {
        container.scrollTop = container.scrollHeight - savedScrollHeightRef.current;
        savedScrollHeightRef.current = 0;
      }
    }
    prevPageCountRef.current = pageCount;
  }, [pageCount, scrollRef]);

  // ── Message Actions ────────────────────────────────────────────────────

  const handleReply = useCallback((msg: Conversation) => {
    setReplyTo(msg);
    requestAnimationFrame(() => replierRef.current?.focus());
  }, []);

  const handleSend = useCallback(
    async (
      text: string,
      attachments?: {
        type: string;
        url: string;
        attachment_id: string;
        is_reusable?: boolean;
      }[],
    ) => {
      if (!text.trim() && (!attachments || attachments.length === 0)) return;
      await sendMessageMutation.mutateAsync({
        conversation_id: selectedTicket,
        message_type: "message",
        payload: {
          text: text.trim() || undefined,
          ...(attachments && attachments.length > 0 && { attachments }),
        },
        reply_to_mid: replyTo?.mid ?? "",
      });
      setReplyTo(null);
      requestAnimationFrame(() => replierRef.current?.focus());
    },
    [selectedTicket, sendMessageMutation, replyTo],
  );

  // Mark unread as read
  useEffect(() => {
    if (selectedTicket && Number(unreadCount) > 0) {
      markAsRead(selectedTicket);
    }
  }, [selectedTicket, unreadCount, markAsRead]);

  if (isLoading) return <ConversationLoading />;

  return (
    <div
      className={cn(
        "flex flex-col h-full overflow-hidden min-w-0 relative bg-background",
        className,
      )}
    >
      <ConversationHeader
        customer={customerDetails}
        channel={firstPage?.channel}
        onBack={() =>
          navigate({ search: (prev) => ({ ...prev, case: undefined }) })
        }
        onShowDetails={onShowDetails}
        onShowSidebar={onShowSidebar}
      />

      {/* Messages Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-muted/30 relative"
      >
        <div
          ref={contentRef}
          className="flex flex-col justify-end min-h-full p-4 space-y-6 "
        >
          {/* Pagination Loader or Manual Load Button */}
          {hasNextPage && (
            <div className="flex justify-center py-4">
              {isFetchingNextPage ? (
                <Spinner />
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleFetchOlder} 
                  className="text-muted-foreground text-xs"
                >
                  Load older messages
                </Button>
              )}
            </div>
          )}

          {messages.map((msg) => {
            const isCustomer = msg?.sender === "customer";
            const name = isCustomer
              ? customerDetails?.display_name
              : msg?.sender === "meta_suite"
                ? "Meta Business Suite"
                : msg?.attendant?.name || "Agent";

            return (
              <MessageBubble
                key={msg?.id}
                msgId={msg?.id}
                senderName={name}
                avatarUrl={
                  isCustomer ? customerDetails?.profile_pic_url : undefined
                }
                time={msg?.created_at}
                isCustomer={isCustomer}
                showAvatar={isCustomer}
                text={msg?.content?.text}
                repliedTo={msg?.replied_to_content}
                onReply={() => msg && handleReply(msg)}
                attachments={msg?.content?.attachments}
              />
            );
          })}
        </div>
        {/* Scroll to bottom button (Directly implemented to avoid Context error) */}
      </div>

      {showScrollButton && !isAtBottom && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-35 left-1/2 -translate-x-1/2 z-20 h-10 w-10 rounded-full shadow-lg border-primary/20 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={() => scrollToBottom()}
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      )}

      <SimplifiedReplier
        ref={replierRef}
        selectedTicketId={selectedTicket}
        maxLength={2000}
        placeholder="Type a message..."
        disabled={sendMessageMutation.isPending}
        onSend={handleSend}
        conversationId={selectedTicket}
        ticketStatus={firstPage?.conversation?.status}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}

export default ConversationArea;