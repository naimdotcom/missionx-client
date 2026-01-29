// Simple inbox page with mock data

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { CheckCircle2, Inbox } from "lucide-react";
import { useState } from "react";
import { SimplifiedReplier } from "../replier";
import { DetailsPanel } from "./components/DetailsPanel";
import { TicketCard } from "./components/ticket-card";
import { mockMessages, mockTickets } from "./const";

function InboxPage() {
  const [selectedTicket, setSelectedTicket] = useState("1");

  const handleSendMessage = async (message: string, attachments?: File[]) => {
    console.log("Sending message:", message, "Attachments:", attachments);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] overflow-hidden">
      <TicketsPanel
        selectedTicket={selectedTicket}
        setSelectedTicket={setSelectedTicket}
      />

      <ConversationArea
        selectedTicket={selectedTicket}
        handleSendMessage={handleSendMessage}
      />

      <DetailsPanel />
    </div>
  );
}

export default InboxPage;

type TicketsPanelProps = {
  selectedTicket?: string;
  setSelectedTicket?: (ticketId: string) => void;
};
function TicketsPanel(props: TicketsPanelProps) {
  const navigate = useNavigate();
  const { status } = useSearch({ from: "/_private/inbox" });

  const handleTicketStatus = (status: "active" | "closed") => {
    navigate({ search: { status } as any });
  };

  return (
    <div className="grid grid-rows-[auto_1fr] h-full border-r p-2 gap-1 overflow-hidden">
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
                isSelected={ticket.id === props.selectedTicket}
                onClick={() =>
                  props.setSelectedTicket && props.setSelectedTicket(ticket.id)
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
};
function ConversationArea(props: ConversationAreaProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden min-w-0 border-r">
      {props.selectedTicket ? (
        <>
          {/* Header */}
          <div className="border-b px-4 py-1.5 flex flex-col shrink-0">
            <h2 className="font-normal">
              {
                mockTickets.find((t) => t.id === props.selectedTicket)
                  ?.contactName
              }
            </h2>
            <p className="text-xs text-muted-foreground">
              {mockTickets.find((t) => t.id === props.selectedTicket)
                ?.channel === "facebook"
                ? "Facebook Messenger"
                : "Instagram Direct"}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/30">
            {(
              mockMessages[props.selectedTicket as keyof typeof mockMessages] ||
              []
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
            onSend={props.handleSendMessage}
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
