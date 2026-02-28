import {
  useConversationHistory,
  useSendMessage,
} from "@/api/services/inbox/inbox.hook";
import ConversationLoading from "@/components/shared/ConversationLoading";
import InfiniteScroll from "@/components/shared/InfinityScroll";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useConversationSocket } from "@/hooks/use-conversation-socket";
import { cn } from "@/lib/utils";
import { Route } from "@/routes";
import { useNavigate } from "@tanstack/react-router";
import { format, isToday, parseISO } from "date-fns";
import { ArrowLeft, Info, PanelRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { MessageBubble } from "./message-bublle/message-bubble";
import {
  SimplifiedReplier,
  SimplifiedReplierHandle,
} from "./replier/components/SimplifiedReplier";

type ConversationAreaProps = {
  className?: string;
  selectedTicket: string;
  onShowDetails?: () => void;
  onShowSidebar?: () => void;
};

function ConversationArea(props: ConversationAreaProps) {
  const navigate = useNavigate({ from: Route.fullPath });
  const conversationHistoryQuery = useConversationHistory(props.selectedTicket);
  const sendMessageMutation = useSendMessage();

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replierRef = useRef<SimplifiedReplierHandle>(null);
  const isInitialLoad = useRef(true);

  // Real-time socket updates for this conversation
  useConversationSocket(props.selectedTicket);

  // Flatten all pages of messages (API returns newest-first, so reverse to show oldest at top)
  const messageHistory = useMemo(() => {
    if (conversationHistoryQuery.isSuccess) {
      const allMessages = conversationHistoryQuery.data?.pages
        .flatMap((page) => page.messages)
        .reverse();
      return allMessages ?? [];
    }
    return [];
  }, [
    conversationHistoryQuery.data?.pages,
    conversationHistoryQuery.isSuccess,
  ]);

  // Extract data from the first page (contains metadata)
  const firstPageData = conversationHistoryQuery.data?.pages[0];

  // Group messages by calendar date for separators
  const groupedMessages = useMemo(() => {
    const groups: {
      dateKey: string;
      label: string;
      messages: typeof messageHistory;
    }[] = [];
    const seenDates = new Map<string, number>();

    for (const msg of messageHistory) {
      const date = parseISO(msg.created_at);
      const dateKey = format(date, "yyyy-MM-dd");
      const label = isToday(date) ? "Today" : format(date, "MMMM d, yyyy");

      if (!seenDates.has(dateKey)) {
        seenDates.set(dateKey, groups.length);
        groups.push({ dateKey, label, messages: [] });
      }
      groups[seenDates.get(dateKey)!].messages.push(msg);
    }
    return groups;
  }, [messageHistory]);

  const customerDetails = useMemo(() => {
    if (conversationHistoryQuery.isSuccess && firstPageData) {
      return firstPageData.customer;
    }
    return null;
  }, [firstPageData, conversationHistoryQuery.isSuccess]);

  // Auto-scroll to bottom on initial load & new messages
  useEffect(() => {
    if (isInitialLoad.current && messageHistory.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
      isInitialLoad.current = false;
    } else if (!conversationHistoryQuery.isFetchingNextPage) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageHistory, conversationHistoryQuery.isFetchingNextPage]);

  // Reset initial load flag when conversation changes
  useEffect(() => {
    isInitialLoad.current = true;
  }, [props.selectedTicket]);

  // Auto-focus replier when conversation changes
  useEffect(() => {
    if (conversationHistoryQuery.isSuccess) {
      replierRef.current?.focus();
    }
  }, [props.selectedTicket, conversationHistoryQuery.isSuccess]);

  const handleSend = useCallback(
    async (
      text: string,
      attachments?: { type: string; url: string; attachment_id: string }[],
    ) => {
      if (!text.trim() && (!attachments || attachments.length === 0)) return;
      await sendMessageMutation.mutateAsync({
        conversation_id: props.selectedTicket,
        message_type: "standard",
        payload: {
          text: text.trim() || undefined,
          ...(attachments && attachments.length > 0 && { attachments }),
        },
        reply_to_mid: "",
      });
      // Focus back to replier after send (use rAF to wait for re-render)
      requestAnimationFrame(() => {
        replierRef.current?.focus();
      });
    },
    [props.selectedTicket, sendMessageMutation],
  );

  if (conversationHistoryQuery.isLoading) {
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
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="flex flex-col justify-end min-h-full p-4 space-y-6">
          {/* Load older messages */}
          <InfiniteScroll
            hasMore={conversationHistoryQuery.hasNextPage}
            isLoading={conversationHistoryQuery.isFetchingNextPage}
            next={conversationHistoryQuery.fetchNextPage}
            threshold={0.5}
            reverse
          >
            {conversationHistoryQuery.isFetchingNextPage && (
              <div className="flex justify-center py-2">
                <Spinner />
              </div>
            )}
          </InfiniteScroll>

          {groupedMessages.map((group) => (
            <div key={group.dateKey} className="space-y-4">
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs border text-muted-foreground bg-muted/50 rounded-full py-0.5 px-3">
                  {group.label}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {group.messages.map((msg) => {
                const isCustomer = msg.sender === "customer";
                const name = isCustomer
                  ? customerDetails?.display_name
                  : msg.attendant?.name || "Agent";
                const avatarUrl = isCustomer
                  ? customerDetails?.profile_pic_url
                  : undefined;
                return (
                  <MessageBubble
                    key={msg.id}
                    senderName={name}
                    time={msg.created_at}
                    avatarUrl={avatarUrl}
                    isCustomer={isCustomer}
                    showAvatar={isCustomer}
                    text={msg.content?.text}
                    html={msg.content?.html}
                    attachments={msg.content?.attachments}
                  />
                );
              })}
            </div>
          ))}
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
      />
    </div>
  );
}

export default ConversationArea;
