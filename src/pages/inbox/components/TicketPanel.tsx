import { useConversationTickets } from "@/api/services/inbox/inbox.hook";
import { ConversationTicket } from "@/api/services/inbox/inbox.type";
import InfiniteScroll from "@/components/shared/InfinityScroll";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Route } from "@/routes";
import { useAuthStore } from "@/stores/auth-store";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { CheckCircle2, Inbox } from "lucide-react";
import { useEffect, useMemo } from "react";
import { TicketCard } from "./ticket-card";

type TicketsPanelProps = {
  className?: string;
  selectedTicket?: string;
  setSelectedTicket?: (ticket?: ConversationTicket) => void;
};
function TicketsPanel({
  setSelectedTicket,
  className,
  selectedTicket,
}: TicketsPanelProps) {
  const { selectedApp } = useAuthStore();
  const navigate = useNavigate({ from: Route.fullPath });
  const { status } = useSearch({ from: "/_private/inbox" });

  const ticketsQuery = useConversationTickets({
    app_id: selectedApp?.id || "",
    status: status === "active" ? "ongoing" : "done",
  });

  const handleTicketStatus = (status: "active" | "closed") => {
    navigate({ to: "/inbox", search: (prev) => ({ ...prev, status }) });
  };

  const flattenedTickets = useMemo(() => {
    if (ticketsQuery.isSuccess) {
      return ticketsQuery.data?.pages.flatMap((page) => page.conversations);
    } else return [];
  }, [ticketsQuery.data?.pages, ticketsQuery.isSuccess]);

  useEffect(() => {
    if (selectedTicket) {
      const ticketExists = flattenedTickets?.find(
        (ticket) => ticket.id === selectedTicket,
      );

      if (ticketExists) {
        setSelectedTicket?.(ticketExists);
      }
    }
  }, [flattenedTickets, navigate, selectedTicket, setSelectedTicket]);

  const hasAvailableTickets = Number(flattenedTickets?.length) > 0;

  return (
    <div
      className={cn(
        "grid grid-rows-[auto_1fr] h-full p-2 gap-1 overflow-hidden",
        "border-r-0 md:border-r",
        selectedTicket ? "hidden md:grid" : "w-full",
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
            <Badge className="h-5 min-w-5 flex items-center justify-center px-1 rounded-full tabular-nums">
              {ticketsQuery.data?.pages[0]?.counts?.ongoing ?? 0}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="closed"
            onClick={() => handleTicketStatus("closed")}
            className="flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="size-4" />
            <span>Closed</span>
            <Badge className="h-5 min-w-5 flex items-center justify-center px-1 rounded-full tabular-nums">
              {ticketsQuery.data?.pages[0]?.counts?.done ?? 0}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {!ticketsQuery.isPending && (
        <div className="h-full min-h-0 w-full overflow-y-auto">
          <div>
            {hasAvailableTickets &&
              flattenedTickets?.map((ticket) => (
                <TicketCard
                  ticket={ticket}
                  key={ticket.id}
                  isSelected={ticket.id === selectedTicket}
                  onClick={() => {
                    if (selectedTicket === ticket.id) {
                      setSelectedTicket?.(undefined);
                      navigate({
                        search: (prev) => ({ ...prev, case: undefined }),
                      });
                    } else {
                      setSelectedTicket?.(ticket);
                      navigate({
                        to: "/inbox",
                        search: (prev) => ({ ...prev, case: ticket.id }),
                      });
                    }
                  }}
                />
              ))}

            <InfiniteScroll
              hasMore={ticketsQuery.hasNextPage}
              isLoading={ticketsQuery.isFetchingNextPage}
              next={ticketsQuery.fetchNextPage}
              threshold={0.5}
            >
              {ticketsQuery.isFetchingNextPage && <Spinner />}
            </InfiniteScroll>

            {!hasAvailableTickets && (
              <div className="flex flex-col h-96 items-center justify-center flex-1 text-muted-foreground">
                <Inbox className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">
                  No {status === "active" ? "active" : "closed"} tickets
                </p>
              </div>
            )}
          </div>
        </div>
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
