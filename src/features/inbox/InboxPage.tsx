// Simple inbox page with mock data

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Inbox } from "lucide-react";
import { useState } from "react";
import { SimplifiedReplier } from "../replier";
import { DetailsPanel } from "./components/DetailsPanel";
import { TicketCard } from "./components/ticket-card";
import {
  CustomerInfoWidget,
  NotesWidget,
  OrderHistoryWidget,
} from "./components/widgets";
import { mockMessages, mockTickets } from "./const";

// Mock data

function InboxPage() {
  const [selectedTicket, setSelectedTicket] = useState("1");
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(true);

  const handleSendMessage = async (message: string, attachments?: File[]) => {
    console.log("Sending message:", message, "Attachments:", attachments);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleAddNote = (content: string) => {
    console.log("Adding note:", content);
  };

  // Mock customer data
  const mockCustomerData = {
    name: "Sarah Johnson",
    avatar: "https://github.com/shadcn.png",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinedDate: "Jan 2024",
    tags: ["VIP", "Returning Customer", "Newsletter"],
    totalOrders: 12,
    totalSpent: "$1,245.00",
  };

  const mockOrders = [
    {
      id: "ORD-001",
      date: "Jan 25, 2026",
      amount: "$89.99",
      status: "delivered" as const,
      items: 2,
    },
    {
      id: "ORD-002",
      date: "Jan 20, 2026",
      amount: "$149.99",
      status: "pending" as const,
      items: 1,
    },
    {
      id: "ORD-003",
      date: "Jan 15, 2026",
      amount: "$59.99",
      status: "delivered" as const,
      items: 3,
    },
  ];

  const mockNotes = [
    {
      id: "n1",
      content: "Customer prefers email communication over phone calls.",
      timestamp: "2 hours ago",
      author: "John Doe",
    },
    {
      id: "n2",
      content: "Interested in bulk order discounts for future purchases.",
      timestamp: "1 day ago",
      author: "Jane Smith",
    },
  ];

  return (
    <div className="grid grid-cols-[2fr_3fr_auto] h-full min-h-0">
      {/* Ticket List Sidebar */}
      <TicketsList
        selectedTicket={selectedTicket}
        setSelectedTicket={setSelectedTicket}
      />

      {/* Main Content Area - Conversation */}
      <ConversationArea
        selectedTicket={selectedTicket}
        handleSendMessage={handleSendMessage}
      />

      {/* Right Details Panel */}
      <DetailsPanel
        isOpen={isDetailsPanelOpen}
        onToggle={() => setIsDetailsPanelOpen(!isDetailsPanelOpen)}
      >
        <CustomerInfoWidget customer={mockCustomerData} />
        <OrderHistoryWidget orders={mockOrders} />
        <NotesWidget notes={mockNotes} onAddNote={handleAddNote} />
      </DetailsPanel>
    </div>
  );
}

export default InboxPage;

type TicketListProps = {
  selectedTicket?: string;
  setSelectedTicket?: (ticketId: string) => void;
};
function TicketsList(props: TicketListProps) {
  return (
    <div className="border-r grid grid-rows-[auto_1fr] h-full">
      <Tabs defaultValue="active" className="flex flex-col h-full">
        <div className="flex flex-col gap-4 px-4 py-2 border-b shrink-0">
          {/* <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 h-9 bg-muted/50 border-none transition-colors focus-visible:bg-background"
              />
            </div> */}

          <TabsList className="w-full grid grid-cols-2 p-1 rounded-md bg-muted/50">
            <TabsTrigger
              value="active"
              className="flex items-center justify-center gap-2"
            >
              <Inbox className="size-4" />
              <span>Active</span>
            </TabsTrigger>

            <TabsTrigger
              value="closed"
              className="flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="size-4" />
              <span>Closed</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabsContent
            value="active"
            className="m-0 p-2 space-y-1 overflow-auto h-full"
          >
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
          </TabsContent>

          <TabsContent value="closed" className="m-0 p-2 space-y-1">
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <CheckCircle2 className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm">No closed tickets</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

type ConversationAreaProps = {
  selectedTicket?: string;
  handleSendMessage: (message: string, attachments?: File[]) => Promise<void>;
};
function ConversationArea(props: ConversationAreaProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0">
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
