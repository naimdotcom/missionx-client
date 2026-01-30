import { Button } from "@/components/ui/button";
import { SimplifiedReplier } from "@/features/replier";
import { cn } from "@/lib/utils";
import { ArrowLeft, Inbox, Info } from "lucide-react";
import { mockMessages, mockTickets } from "../const";
import { MessageBubble } from "./message-bubble";

type ConversationAreaProps = {
  selectedTicket?: string;
  handleSendMessage: (message: string, attachments?: File[]) => Promise<void>;
  onBack?: () => void;
  onShowDetails?: () => void;
  className?: string;
};

function ConversationArea({
  selectedTicket,
  handleSendMessage,
  onBack,
  onShowDetails,
  className,
}: ConversationAreaProps) {
  return (
    <div
      className={cn("flex flex-col h-full overflow-hidden min-w-0", className)}
    >
      {selectedTicket ? (
        <>
          {/* Header */}
          <div className="border-b px-4 py-2 flex items-center justify-between shrink-0 h-14 bg-background z-10">
            <div className="flex items-center gap-2 overflow-hidden">
              {onBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="shrink-0 md:hidden"
                >
                  <ArrowLeft className="size-4" />
                </Button>
              )}
              <div className="overflow-hidden">
                <h2 className="font-medium truncate">
                  {
                    mockTickets.find((t) => t.id === selectedTicket)
                      ?.contactName
                  }
                </h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                  <span className="truncate">
                    {mockTickets.find((t) => t.id === selectedTicket)
                      ?.channel === "facebook"
                      ? "Facebook Messenger"
                      : "Instagram Direct"}
                  </span>
                </div>
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="xl:hidden"
              onClick={onShowDetails}
            >
              <Info className="size-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/30">
            {(
              mockMessages[selectedTicket as keyof typeof mockMessages] || []
            ).map((msg) => {
              const ticket = mockTickets.find((t) => t.id === selectedTicket);
              return (
                <MessageBubble
                  key={msg.id}
                  text={msg.text}
                  time={msg.time}
                  senderName={msg.sender}
                  isAgent={msg.isAgent}
                  avatarUrl={
                    !msg.isAgent ? ticket?.contactAvatarUrl : undefined
                  }
                />
              );
            })}
          </div>

          {/* Message Input - New SimplifiedReplier */}
          <SimplifiedReplier
            onSend={handleSendMessage}
            placeholder="Type a message..."
            maxLength={2000}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Inbox className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              No conversation selected
            </h3>
            <p className="text-sm text-muted-foreground">
              Select a ticket from the list to view the conversation
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConversationArea;
