// Simple inbox page with mock data

import { createFileRoute } from "@tanstack/react-router";
import { Inbox, Paperclip, Send, Smile } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/_authenticated/inbox/ws-1")({
  component: InboxPage,
});

// Mock data
const mockTickets = [
  {
    id: "1",
    contactName: "Sarah Johnson",
    lastMessage: "Hey! I have a question about your product...",
    timestamp: "2 min ago",
    unread: 2,
    channel: "facebook",
  },
  {
    id: "2",
    contactName: "Mike Chen",
    lastMessage: "Thanks for your help!",
    timestamp: "1 hour ago",
    unread: 0,
    channel: "instagram",
  },
  {
    id: "3",
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
  const [selectedTicket, setSelectedTicket] = useState("1");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="h-full flex">
      {/* Ticket List Sidebar */}
      <div className="w-80 border-r flex flex-col bg-background">
        <div className="border-b p-4">
          <h2 className="font-semibold text-lg">Inbox</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Support Workspace
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockTickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket.id)}
              className={`w-full p-4 text-left border-b hover:bg-muted/50 transition-colors ${
                selectedTicket === ticket.id
                  ? "bg-muted border-l-4 border-primary"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {ticket.contactName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {ticket.contactName}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {ticket.lastMessage}
                    </p>
                  </div>
                </div>
                {ticket.unread > 0 && (
                  <span className="flex-shrink-0 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {ticket.unread}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    ticket.channel === "facebook"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-pink-100 text-pink-700"
                  }`}
                >
                  {ticket.channel === "facebook" ? "Facebook" : "Instagram"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {ticket.timestamp}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedTicket ? (
          <>
            {/* Header */}
            <div className="border-b px-6 py-4 bg-background">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-lg">
                    {
                      mockTickets.find((t) => t.id === selectedTicket)
                        ?.contactName
                    }
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {mockTickets.find((t) => t.id === selectedTicket)
                      ?.channel === "facebook"
                      ? "Facebook Messenger"
                      : "Instagram Direct"}
                  </p>
                </div>
                <select className="text-sm border rounded px-3 py-1.5">
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
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
