import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { CheckCircle2, Inbox } from "lucide-react";
import { mockTickets } from "../const";
import { TicketCard } from "./ticket-card";

type TicketsPanelProps = {
  className?: string;
  selectedTicket?: number;
  setSelectedTicket: (ticketId?: number) => void;
};
function TicketsPanel({
  selectedTicket,
  setSelectedTicket,
  className,
}: TicketsPanelProps) {
  const navigate = useNavigate();
  const { status } = useSearch({ from: "/_private/inbox" });

  const handleTicketStatus = (status: "active" | "closed") => {
    navigate({ to: "/inbox", search: { status } });
  };

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

      {status === "active" && (
        <ScrollArea className="h-full min-h-0 w-full overflow-auto">
          <div>
            {mockTickets.map((ticket) => (
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

export default TicketsPanel;
