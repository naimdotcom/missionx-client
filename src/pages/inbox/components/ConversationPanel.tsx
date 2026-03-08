import {
  useConversationHistory,
  useMarkAsRead,
  useSendMessage,
} from "@/api/services/inbox/inbox.hook";
import { Conversation } from "@/api/services/inbox/inbox.type";
import ConversationLoading from "@/components/shared/ConversationLoading";
import InfiniteScroll from "@/components/shared/InfinityScroll";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Route } from "@/routes";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Info, PanelRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MessageBubble } from "./message-bublle/message-bubble";
import {
  SimplifiedReplier,
  SimplifiedReplierHandle,
} from "./replier/components/SimplifiedReplier";

type ConversationAreaProps = {
  className?: string;
  unreadCount?: number;
  selectedTicket: string;
  onShowDetails?: () => void;
  onShowSidebar?: () => void;
};

function ConversationArea(props: ConversationAreaProps) {
  const sendMessageMutation = useSendMessage();
  const { mutate: markAsRead } = useMarkAsRead();
  const navigate = useNavigate({ from: Route.fullPath });
  const conversationsQuery = useConversationHistory(props.selectedTicket);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const replierRef = useRef<SimplifiedReplierHandle>(null);
  // Scroll height captured just before fetchNextPage fires — used to restore
  // the user's position after older messages are prepended.
  const savedScrollHeightRef = useRef(0);

  // Reply-to state — the message the agent is replying to
  const [replyTo, setReplyTo] = useState<Conversation | null>(null);

  // Flatten all pages of messages (API returns newest-first, so reverse to show oldest at top)
  const messages = useMemo(() => {
    if (conversationsQuery.isSuccess) {
      return (
        conversationsQuery.data?.pages
          .flatMap((page) => page.items)
          .reverse() ?? []
      );
    } else return [];
  }, [conversationsQuery.data?.pages, conversationsQuery.isSuccess]);

  // Extract metadata from the first page
  const firstPageData = conversationsQuery.data?.pages[0];

  const customerDetails = useMemo(() => {
    if (conversationsQuery.isSuccess && firstPageData) {
      return firstPageData.customer;
    }
    return null;
  }, [firstPageData, conversationsQuery.isSuccess]);

  const pageCount = conversationsQuery.data?.pages.length ?? 0;

  // ── Scroll: initial load & new message ──────────────────────────────────
  // Runs synchronously after every paint so there's no visible jump.
  // On the very first load (pageCount === 1) or when a new message arrives
  // while the user is near the bottom, scroll to the anchor.
  useLayoutEffect(() => {
    if (pageCount === 1) {
      // Initial load — jump straight to the bottom
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [pageCount]);

  // Scroll to bottom when a new message is appended (send / realtime WebSocket)
  // We detect this by checking if the last message id changed while pageCount
  // didn't increase (i.e. it wasn't a pagination fetch).
  const lastMsgId = messages[messages.length - 1]?.id;
  const prevLastMsgIdRef = useRef<string | undefined>(undefined);
  const prevPageCountRef = useRef(pageCount);
  useLayoutEffect(() => {
    const isNewMessage =
      lastMsgId !== prevLastMsgIdRef.current &&
      pageCount === prevPageCountRef.current;
    prevLastMsgIdRef.current = lastMsgId;
    prevPageCountRef.current = pageCount;
    if (isNewMessage) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  });

  // ── Scroll: pagination (older messages prepended) ────────────────────────
  // After a new page is added, restore the scroll offset so the user stays
  // at the same visual position they were at before loading.
  useLayoutEffect(() => {
    if (pageCount <= 1) return; // skip initial single-page load
    const container = scrollContainerRef.current;
    if (!container || savedScrollHeightRef.current === 0) return;
    container.scrollTop = container.scrollHeight - savedScrollHeightRef.current;
    savedScrollHeightRef.current = 0;
  }, [pageCount]);

  // Reset state and scroll when switching conversations
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [props.selectedTicket]);

  // Mark conversation as read when it is opened or when the selected ticket changes
  useEffect(() => {
    if (props.selectedTicket && Number(props.unreadCount) > 0) {
      markAsRead(props.selectedTicket);
    }
  }, [props.selectedTicket, props.unreadCount, markAsRead]);

  // Mark as read when a new inbound (customer) message arrives
  const lastMsgSender = messages[messages.length - 1]?.sender;
  useEffect(() => {
    if (
      props.selectedTicket &&
      lastMsgSender === "customer" &&
      Number(props.unreadCount) > 0
    ) {
      markAsRead(props.selectedTicket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMsgId, props.unreadCount]);

  // Reset replyTo when the ticket changes using the React recommended pattern:
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevTicket, setPrevTicket] = useState(props.selectedTicket);
  if (prevTicket !== props.selectedTicket) {
    setPrevTicket(props.selectedTicket);
    setReplyTo(null);
  }

  // Auto-focus replier when conversation changes
  useEffect(() => {
    if (conversationsQuery.isSuccess) {
      replierRef.current?.focus();
    }
  }, [props.selectedTicket, conversationsQuery.isSuccess]);

  // Wrap fetchNextPage to save scroll height first — must happen synchronously
  // before the query fires so we can restore position after the new page renders.
  const fetchOlderMessages = useCallback(() => {
    if (scrollContainerRef.current) {
      savedScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
    }
    conversationsQuery.fetchNextPage();
  }, [conversationsQuery]);

  const handleReply = useCallback((msg: Conversation) => {
    setReplyTo(msg);
    // Focus the replier so the agent can immediately type
    requestAnimationFrame(() => replierRef.current?.focus());
  }, []);

  const handleSend = useCallback(
    async (
      text: string,
      attachments?: { type: string; url: string; attachment_id: string }[],
    ) => {
      if (!text.trim() && (!attachments || attachments.length === 0)) return;
      await sendMessageMutation.mutateAsync({
        conversation_id: props.selectedTicket,
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
    [props.selectedTicket, sendMessageMutation, replyTo],
  );

  if (conversationsQuery.isLoading) {
    return <ConversationLoading />;
  }
  return (
    <div
      className={cn(
        "flex flex-col h-full overflow-hidden min-w-0",
        props.className,
      )}
    >
      {/* Header */}
      <div className="border-b px-4 py-2 flex items-center justify-between shrink-0 h-14 bg-background z-10">
        <div className="flex items-center gap-2 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              navigate({ search: (prev) => ({ ...prev, case: undefined }) })
            }
            className="shrink-0 md:hidden"
          >
            <ArrowLeft className="size-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={customerDetails?.profile_pic_url}
                alt={customerDetails?.display_name || "Avatar"}
              />
              <AvatarFallback>
                {customerDetails?.display_name
                  ?.split(" ")[0]
                  .charAt(0)
                  .toUpperCase()}
                {customerDetails?.display_name
                  ?.split(" ")[1]
                  .charAt(0)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <h2 className="truncate">{customerDetails?.display_name}</h2>
              <span className="capitalize text-xs text-muted-foreground truncate">
                {firstPageData?.channel?.platform}
              </span>
            </div>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="xl:hidden"
          onClick={props.onShowDetails}
        >
          <Info className="size-4" />
        </Button>

        <Button
          size={"icon"}
          variant={"ghost"}
          className="hidden xl:flex"
          onClick={props.onShowSidebar}
        >
          <PanelRight className="size-4" />
        </Button>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto bg-muted/30"
      >
        <div className="flex flex-col justify-end min-h-full p-4 space-y-6">
          {/* Load older messages */}
          <InfiniteScroll
            hasMore={conversationsQuery.hasNextPage}
            isLoading={conversationsQuery.isFetchingNextPage}
            next={fetchOlderMessages}
            threshold={0.5}
            reverse
          >
            {conversationsQuery.isFetchingNextPage && (
              <div className="flex justify-center py-2">
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
            const avatarUrl = isCustomer
              ? customerDetails?.profile_pic_url
              : undefined;
            return (
              <MessageBubble
                key={msg?.id}
                msgId={msg?.id}
                senderName={name}
                avatarUrl={avatarUrl}
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
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <SimplifiedReplier
        ref={replierRef}
        maxLength={2000}
        placeholder="Type a message..."
        disabled={sendMessageMutation.isPending}
        onSend={handleSend}
        conversationId={props.selectedTicket}
        ticketStatus={firstPageData?.conversation?.status}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}

export default ConversationArea;
