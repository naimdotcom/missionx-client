// Simple inbox page with mock data

import { ThemeToggle } from "@/components/theme-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Inbox, Paperclip, Send, Smile } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { TicketCard } from "./components/ticket-card";

// Mock data
const mockTickets = [
  {
    id: "1",
    workspaceId: "ws-1",
    channelType: "facebook_page",
    status: "open",
    priority: "normal",
    subject: "Product inquiry",
    customer: {
      id: "c1",
      name: "Sarah Johnson",
    },
    sentiment: "neutral",
    unreadCount: 2,
    lastMessageAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    // Legacy properties
    contactName: "Sarah Johnson",
    lastMessage: "Hey! I have a question about your product...",
    timestamp: "2 min ago",
    unread: 2,
    channel: "facebook",
  },
  {
    id: "2",
    workspaceId: "ws-1",
    channelType: "instagram_business",
    status: "pending",
    priority: "normal",
    subject: "Thank you message",
    customer: {
      id: "c2",
      name: "Mike Chen",
    },
    sentiment: "positive",
    unreadCount: 0,
    lastMessageAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    // Legacy properties
    contactName: "Mike Chen",
    lastMessage: "Thanks for your help!",
    timestamp: "1 hour ago",
    unread: 0,
    channel: "instagram",
  },
  {
    id: "3",
    workspaceId: "ws-1",
    channelType: "facebook_page",
    status: "open",
    priority: "high",
    subject: "Details request",
    customer: {
      id: "c3",
      name: "Emma Wilson",
    },
    sentiment: "neutral",
    unreadCount: 1,
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    // Legacy properties
    contactName: "Emma Wilson",
    lastMessage: "Can you send me more details?",
    timestamp: "2 hours ago",
    unread: 1,
    channel: "facebook",
  },
];

const mockMessages = {
  "1": [
    {
      id: "m1",
      sender: "Sarah Johnson",
      text: "Hey! I have a question about your product...",
      time: "10:30 AM",
      isAgent: false,
    },
    {
      id: "m2",
      sender: "Sarah Johnson",
      text: "Is it available in different colors?",
      time: "10:31 AM",
      isAgent: false,
    },
  ],
  "2": [
    {
      id: "m3",
      sender: "Mike Chen",
      text: "Hi, I need help with my order",
      time: "9:15 AM",
      isAgent: false,
    },
    {
      id: "m4",
      sender: "You",
      text: "Of course! What can I help you with?",
      time: "9:16 AM",
      isAgent: true,
    },
    {
      id: "m5",
      sender: "Mike Chen",
      text: "Thanks for your help!",
      time: "9:20 AM",
      isAgent: false,
    },
  ],
  "3": [
    {
      id: "m6",
      sender: "Emma Wilson",
      text: "Can you send me more details?",
      time: "8:45 AM",
      isAgent: false,
    },
  ],
};

function InboxPage() {
  const [message, setMessage] = useState("");
  const [selectedTicket, setSelectedTicket] = useState("1");

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="grid grid-cols-5 h-full overflow-hidden">
      {/* Ticket List Sidebar */}
      <div className="border-r col-span-1 overflow-hidden">
        <Tabs defaultValue="active">
          <div className="flex flex-col gap-4 px-4 py-4 border-b">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Inbox</h1>
              <div className="flex items-center gap-1">
                <ThemeToggle />
              </div>
            </div>

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
            <TabsContent value="active" className="m-0 p-2 space-y-1">
              {mockTickets.map((ticket) => (
                <TicketCard
                  ticket={ticket}
                  key={ticket.id}
                  isSelected={ticket.id === selectedTicket}
                  onClick={() => setSelectedTicket(ticket.id)}
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

      {/* Main Content Area */}
      <div className="col-span-4 flex flex-col">
        {selectedTicket ? (
          <>
            {/* Header */}
            <div className="border-b px-4 py-1.5 flex flex-col">
              <h2 className="font-normal">
                {mockTickets.find((t) => t.id === selectedTicket)?.contactName}
              </h2>
              <p className="text-xs text-muted-foreground">
                {mockTickets.find((t) => t.id === selectedTicket)?.channel ===
                "facebook"
                  ? "Facebook Messenger"
                  : "Instagram Direct"}
              </p>
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

            {/* Message Input */}
            <div className="border-t bg-background p-4">
              <div className="flex gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                />
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="icon" title="Attach file">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Add emoji">
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button onClick={handleSend} size="icon" title="Send message">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press <kbd className="px-1 rounded bg-muted">Ctrl+Enter</kbd> to
                send
              </p>
            </div>
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
    </div>
  );
}

export default InboxPage;
