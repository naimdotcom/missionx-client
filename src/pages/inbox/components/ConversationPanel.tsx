import {
  useConversationHistory,
  useMarkAsRead,
  useSendMessage,
} from "@/api/services/inbox/inbox.hook";
import {
  Conversation,
  ConversationHistory,
} from "@/api/services/inbox/inbox.type";
import ConversationLoading from "@/components/shared/ConversationLoading";
import InfiniteScroll from "@/components/shared/InfinityScroll";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Route } from "@/routes";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown, Info, PanelRight } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useStickToBottom } from "use-stick-to-bottom";
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
 * ConversationHeader Component
 */
const ConversationHeader = React.memo(
  ({
    customer,
    channel,
    onBack,
    onShowDetails,
    onShowSidebar,
  }: {
    customer?: ConversationHistory["customer"];
    channel?: ConversationHistory["channel"];
    onBack: () => void;
    onShowDetails?: () => void;
    onShowSidebar?: () => void;
  }) => {
    return (
      <div className="border-b px-4 py-2 flex items-center justify-between shrink-0 h-14 bg-background z-10">
        <div className="flex items-center gap-2 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0 md:hidden"
          >
            <ArrowLeft className="size-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={customer?.profile_pic_url}
                alt={customer?.display_name || "Avatar"}
              />
              <AvatarFallback>
                {customer?.display_name?.split(" ")[0]?.charAt(0).toUpperCase()}
                {customer?.display_name?.split(" ")[1]?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h2 className="truncate font-medium text-sm sm:text-base">
                {customer?.display_name}
              </h2>
              <span className="capitalize text-[10px] sm:text-xs text-muted-foreground truncate">
                {channel?.platform}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="xl:hidden"
            onClick={onShowDetails}
          >
            <Info className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="hidden xl:flex"
            onClick={onShowSidebar}
          >
            <PanelRight className="size-4" />
          </Button>
        </div>
      </div>
    );
  },
);

ConversationHeader.displayName = "ConversationHeader";

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
  const replierRef = useRef<SimplifiedReplierHandle>(null);
  const savedScrollHeightRef = useRef(0);
  const prevPageCountRef = useRef(0);

  // Memos
  const messages = useMemo(() => {
    if (!isSuccess || !data) return [];
    return data.pages.flatMap((page) => page.items).reverse();
  }, [data, isSuccess]);

  const firstPage = data?.pages[0];
  const customerDetails = firstPage?.customer;
  const pageCount = data?.pages.length ?? 0;

  // ── Scroll Management ──────────────────────────────────────────────────

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollButton(distanceFromBottom > 200);
  }, []);

  // Restore scroll position after loading older messages
  useLayoutEffect(() => {
    if (pageCount > 1 && pageCount !== prevPageCountRef.current) {
      const container = scrollRef.current;
      if (container && savedScrollHeightRef.current > 0) {
        // Restore scroll position exactly where it was before the prepend
        container.scrollTop =
          container.scrollHeight - savedScrollHeightRef.current;
        savedScrollHeightRef.current = 0;
      }
    }
    prevPageCountRef.current = pageCount;
  }, [pageCount, scrollRef]);

  // Handle switching conversations
  useEffect(() => {
    if (isSuccess) {
      scrollToBottom();
      replierRef.current?.focus();
    }
  }, [selectedTicket, isSuccess, scrollToBottom]);

  // Handle Fetch Next Page with scroll preservation
  const handleFetchOlder = useCallback(() => {
    if (scrollRef.current) {
      savedScrollHeightRef.current = scrollRef.current.scrollHeight;
    }
    fetchNextPage();
  }, [fetchNextPage, scrollRef]);

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
          <InfiniteScroll
            hasMore={hasNextPage}
            isLoading={isFetchingNextPage}
            next={handleFetchOlder}
            threshold={0.5}
            reverse
          >
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            )}
          </InfiniteScroll>

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
