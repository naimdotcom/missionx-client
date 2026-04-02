import type { Customer } from "@/api/services/crm/crm.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
} from "lucide-react";
import { useState } from "react";

interface ConversationTimelineProps {
  customer: Customer;
}

interface Conversation {
  id: string;
  type: "message" | "email" | "call" | "social";
  direction: "inbound" | "outbound";
  content: string;
  timestamp: string;
  channel: string;
  agent?: string;
  status: "delivered" | "read" | "failed" | "pending";
}

// Mock data - replace with actual API call
const mockConversations: Conversation[] = [
  {
    id: "1",
    type: "message",
    direction: "inbound",
    content:
      "Hi, I'm having trouble with my recent order. Can you help me track it?",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    channel: "facebook",
    status: "read",
  },
  {
    id: "2",
    type: "message",
    direction: "outbound",
    content:
      "Hello! I'd be happy to help you track your order. Could you please provide your order number?",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    channel: "facebook",
    agent: "Sarah Johnson",
    status: "read",
  },
  {
    id: "3",
    type: "message",
    direction: "inbound",
    content: "Sure, it's ORD-2024-12345",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    channel: "facebook",
    status: "read",
  },
  {
    id: "4",
    type: "message",
    direction: "outbound",
    content:
      "Thank you! I found your order. It's currently in transit and should arrive by tomorrow, January 25th. You'll receive a tracking number via email shortly.",
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    channel: "facebook",
    agent: "Sarah Johnson",
    status: "delivered",
  },
  {
    id: "5",
    type: "email",
    direction: "inbound",
    content: "Follow-up: Has my order arrived yet?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    channel: "email",
    status: "read",
  },
  {
    id: "6",
    type: "call",
    direction: "outbound",
    content: "Called customer to confirm delivery status",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
    channel: "phone",
    agent: "Mike Chen",
    status: "delivered",
  },
  {
    id: "7",
    type: "social",
    direction: "inbound",
    content: "Thanks for the quick response! Order arrived safely. 🎉",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    channel: "instagram",
    status: "read",
  },
];

const getChannelIcon = (channel: string) => {
  switch (channel.toLowerCase()) {
    case "facebook":
      return <Facebook className="h-3.5 w-3.5" />;
    case "instagram":
      return <Instagram className="h-3.5 w-3.5" />;
    case "email":
      return <Mail className="h-3.5 w-3.5" />;
    case "phone":
      return <Phone className="h-3.5 w-3.5" />;
    default:
      return <MessageCircle className="h-3.5 w-3.5" />;
  }
};

const getChannelColor = (channel: string) => {
  switch (channel.toLowerCase()) {
    case "facebook":
      return "text-[#1877F2]";
    case "instagram":
      return "text-pink-500";
    case "email":
      return "text-blue-500";
    case "phone":
      return "text-green-500";
    default:
      return "text-muted-foreground";
  }
};

const getStatusBadge = (status: Conversation["status"]) => {
  const variants = {
    delivered: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    read: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    failed: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  };

  return (
    <Badge variant="outline" className={`text-[10px] ${variants[status]}`}>
      {status}
    </Badge>
  );
};

export function ConversationTimeline({ customer }: ConversationTimelineProps) {
  const [conversations] = useState<Conversation[]>(mockConversations);

  const groupByDate = (convs: Conversation[]) => {
    const groups: { [key: string]: Conversation[] } = {};
    convs.forEach((conv) => {
      const date = format(new Date(conv.timestamp), "MMMM d, yyyy");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(conv);
    });
    return groups;
  };

  const groupedConversations = groupByDate(conversations);

  return (
    <Card className="border-0 border-t rounded-none shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4" />
          Conversations
          <Badge variant="secondary" className="ml-auto text-xs">
            {conversations.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          {Object.entries(groupedConversations).map(
            ([date, convs], dateIdx) => (
              <div key={date} className="relative">
                {/* Date Header */}
                <div className="sticky top-0 z-10 bg-muted/80 px-4 py-2 backdrop-blur-sm">
                  <span className="text-xs font-medium text-muted-foreground">
                    {date}
                  </span>
                </div>

                {/* Conversations */}
                <div className="space-y-0">
                  {convs.map((conv, idx) => {
                    const isInbound = conv.direction === "inbound";
                    const timeAgo = formatDistanceToNow(
                      new Date(conv.timestamp),
                      { addSuffix: true },
                    );

                    return (
                      <div key={conv.id} className="relative px-4">
                        {/* Timeline Line */}
                        {!(dateIdx === 0 && idx === 0) && (
                          <div className="absolute left-6.75 top-0 h-4 w-px bg-border" />
                        )}

                        <div className="flex gap-3 py-3">
                          {/* Timeline Dot & Avatar */}
                          <div className="relative flex flex-col items-center">
                            <div className="absolute top-4 -ml-px h-px w-3 bg-border" />
                            <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                              {isInbound ? (
                                <>
                                  <AvatarImage
                                    src={
                                      customer.profile_pic_url ||
                                      customer.custom_metadata?.profile_pic ||
                                      ""
                                    }
                                    alt="Customer"
                                  />
                                  <AvatarFallback className="text-[8px]">
                                    {customer.username?.[0]?.toUpperCase() ||
                                      "C"}
                                  </AvatarFallback>
                                </>
                              ) : (
                                <>
                                  <AvatarFallback className="bg-primary text-[8px] text-primary-foreground">
                                    {conv.agent
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("") || "A"}
                                  </AvatarFallback>
                                </>
                              )}
                            </Avatar>
                          </div>

                          {/* Message Content */}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium">
                                {isInbound
                                  ? customer.username || "Customer"
                                  : conv.agent || "Agent"}
                              </span>
                              <span
                                className={`flex items-center gap-1 text-xs ${getChannelColor(
                                  conv.channel,
                                )}`}
                              >
                                {getChannelIcon(conv.channel)}
                              </span>
                              {getStatusBadge(conv.status)}
                            </div>

                            <div
                              className={`rounded-lg p-3 text-sm ${
                                isInbound
                                  ? "bg-muted"
                                  : "bg-primary text-primary-foreground"
                              }`}
                            >
                              {conv.content}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{timeAgo}</span>
                              <span>•</span>
                              <span>
                                {format(new Date(conv.timestamp), "h:mm a")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Connector Line */}
                        {!(
                          dateIdx ===
                            Object.keys(groupedConversations).length - 1 &&
                          idx === convs.length - 1
                        ) && (
                          <div className="absolute bottom-0 left-6.75 h-4 w-px bg-border" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
          )}
        </div>

        {/* View All Button */}
        <div className="border-t p-4">
          <Button variant="outline" size="sm" className="w-full gap-2">
            View All Conversations
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
