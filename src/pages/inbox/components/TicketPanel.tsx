import { useConversationTickets } from "@/api/services/inbox/inbox.hook";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { CheckCircle2, Inbox } from "lucide-react";
import { TicketCard } from "./ticket-card";

type TicketsPanelProps = {
  className?: string;
  selectedTicket?: string;
  setSelectedTicket: (ticketId?: string) => void;
};
function TicketsPanel({
  selectedTicket,
  setSelectedTicket,
  className,
}: TicketsPanelProps) {
  const navigate = useNavigate();
  const { selectedApp } = useAuthStore();
  const { status } = useSearch({ from: "/_private/inbox" });

  const ticketsQuery = useConversationTickets({
    app_id: selectedApp?.id || "",
    status: status === "active" ? "ONGOING" : "DONE",
  });

  const handleTicketStatus = (status: "active" | "closed") => {
    navigate({ to: "/inbox", search: { status } });
  };

  const hasAvailableTickets =
    Number(ticketsQuery.data?.conversations.length) > 0;

  return (
    <div
      className={cn(
        "grid grid-rows-[auto_1fr] h-full p-2 gap-1 overflow-hidden",
        className,
      )}
    >
      <Tabs value={status}>
        <TabsList className="grid grid-cols-2 mb-2">
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

      {!ticketsQuery.isPending && (
        <ScrollArea className="h-full min-h-0 w-full overflow-auto">
          <div>
            {hasAvailableTickets &&
              ticketsQuery?.data?.conversations?.map((ticket) => (
                <TicketCard
                  ticket={ticket}
                  key={ticket.id}
                  isSelected={ticket.id === selectedTicket}
                  onClick={() => {
                    if (selectedTicket === ticket.id) {
                      setSelectedTicket?.(undefined);
                    } else {
                      setSelectedTicket?.(ticket.id);
                    }
                  }}
                />
              ))}

            {!hasAvailableTickets && (
              <div className="flex flex-col h-96 items-center justify-center flex-1 text-muted-foreground">
                <Inbox className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">
                  No {status === "active" ? "active" : "closed"} tickets
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      )}

      {ticketsQuery.isPending && (
        <div className="flex flex-col gap-1">
          {Array.from({ length: 20 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-md" />
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketsPanel;
