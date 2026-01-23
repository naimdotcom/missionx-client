// Individual ticket card component

import { Badge } from "@/components/ui/badge";
import { cn } from "~/lib/utils";
import { Ticket } from "~/types/ticket";

interface TicketCardProps {
  ticket: Ticket;
  isSelected: boolean;
  onClick: () => void;
}

export const TicketCard = ({
  ticket,
  isSelected,
  onClick,
}: TicketCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 text-left transition-colors",
        "hover:bg-muted/50",
        "focus:outline-none focus:bg-muted",
        isSelected && "bg-muted border-l-4 border-primary",
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {/* {ticket ? (
            <img
              src={ticket.contactAvatarUrl}
              alt={ticket.contactName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
              {ticket.contactName.charAt(0).toUpperCase()}
            </div>
          )} */}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-sm truncate">
              {ticket.contactName}
            </h3>
            {ticket.unread > 0 && (
              <span className="flex-shrink-0 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                {ticket.unread}
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground truncate mb-2">
            {ticket.lastMessage}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-2 flex-wrap">
            {ticket.channel && (
              <Badge variant={"secondary"} color="blue">
                {ticket.channel}
              </Badge>
            )}
            {/* {ticket.sentiment && (
              <SentimentBadge sentiment={ticket.sentiment} size="sm" />
            )} */}
            {/* {ticket.sla && <SLATimerComponent sla={ticket.sla} size="sm" />} */}
            <span className="text-xs text-muted-foreground">
              {ticket.timestamp}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};
