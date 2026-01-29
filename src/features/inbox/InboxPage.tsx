// Simple inbox page with mock data

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Inbox, Info } from "lucide-react";
import { useState } from "react";
import { SimplifiedReplier } from "../replier";
import { TicketCard } from "./components/ticket-card";
import {
  CustomerInfoWidget,
  NotesWidget,
  OrderHistoryWidget,
} from "./components/widgets";
import {
  mockCustomerData,
  mockMessages,
  mockNotes,
  mockOrders,
  mockTickets,
} from "./const";

function InboxPage() {
  const isMobile = useIsMobile();
  const [selectedTicket, setSelectedTicket] = useState<string | null>("1");
  const [showDetails, setShowDetails] = useState(false);

  const handleSendMessage = async (message: string, attachments?: File[]) => {
    console.log("Sending message:", message, "Attachments:", attachments);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-full w-full overflow-hidden bg-background">
        {!selectedTicket ? (
          <TicketsPanel
            selectedTicket={selectedTicket || undefined}
            setSelectedTicket={setSelectedTicket}
            className="w-full border-r-0"
          />
        ) : (
          <ConversationArea
            selectedTicket={selectedTicket}
            handleSendMessage={handleSendMessage}
            onBack={() => setSelectedTicket(null)}
            onShowDetails={() => setShowDetails(true)}
          />
        )}

        <Sheet open={showDetails} onOpenChange={setShowDetails}>
          <SheetContent side="right" className="w-[90%] sm:w-[400px] p-0 pt-10">
            <DetailsPanel className="w-full border-0" />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[400px_1fr_400px] h-full overflow-hidden bg-background">
      <TicketsPanel
        selectedTicket={selectedTicket || undefined}
        setSelectedTicket={setSelectedTicket}
        className="border-r"
      />

      <ConversationArea
        selectedTicket={selectedTicket || undefined}
        handleSendMessage={handleSendMessage}
      />

      <DetailsPanel className="border-l" />
    </div>
  );
}

export default InboxPage;

type TicketsPanelProps = {
  selectedTicket?: string;
  setSelectedTicket?: (ticketId: string) => void;
  className?: string;
};
function TicketsPanel({
  selectedTicket,
  setSelectedTicket,
  className,
}: TicketsPanelProps) {
  const navigate = useNavigate();
  const { status } = useSearch({ from: "/_private/inbox" });

  const handleTicketStatus = (status: "active" | "closed") => {
    navigate({ search: { status } as any });
  };

  return (
    <div
      className={cn(
        "grid grid-rows-[auto_1fr] h-full p-2 gap-1 overflow-hidden",
        className,
      )}
    >
      <Tabs value={status}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger
            value="active"
            onClick={() => handleTicketStatus("active")}
            className="flex items-center justify-center gap-2"
          >
            <Inbox className="size-4" />
            <span>Active</span>
          </TabsTrigger>

          <TabsTrigger
            value="closed"
            onClick={() => handleTicketStatus("closed")}
            className="flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="size-4" />
            <span>Closed</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {status === "active" && (
        <ScrollArea className="h-full min-h-0 w-full overflow-auto">
          <div>
            {mockTickets.map((ticket) => (
              <TicketCard
                ticket={ticket}
                key={ticket.id}
                isSelected={ticket.id === selectedTicket}
                onClick={() =>
                  setSelectedTicket && setSelectedTicket(ticket.id)
                }
              />
            ))}
          </div>
        </ScrollArea>
      )}

      {status === "closed" && (
        <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground">
          <CheckCircle2 className="w-8 h-8 mb-2 opacity-20" />
          <p className="text-sm">No closed tickets</p>
        </div>
      )}
    </div>
  );
}

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
                  className="shrink-0"
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

            {onShowDetails && (
              <Button variant="ghost" size="icon" onClick={onShowDetails}>
                <Info className="size-4" />
              </Button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/30">
            {(
              mockMessages[selectedTicket as keyof typeof mockMessages] || []
            ).map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isAgent ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] ${msg.isAgent ? "order-1" : "order-2"}`}
                >
                  {!msg.isAgent && (
                    <p className="text-xs font-medium text-muted-foreground mb-1 px-3">
                      {msg.sender}
                    </p>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      msg.isAgent
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-3">
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
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

export function DetailsPanel({ className }: { className?: string }) {
  const handleAddNote = (content: string) => {
    console.log("Adding note:", content);
  };
  return (
    <div
      className={cn("flex flex-col h-full min-h-0 overflow-hidden", className)}
    >
      <ScrollArea className="h-full w-full">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4">
            <CustomerInfoWidget customer={mockCustomerData} />
            <OrderHistoryWidget orders={mockOrders} />
            <NotesWidget notes={mockNotes} onAddNote={handleAddNote} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
