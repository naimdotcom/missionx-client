// Individual ticket card component

import { formatDistanceToNow } from "date-fns";
import { ChannelBadge } from "~/components/shared/channel-badge";
import { SentimentBadge } from "~/components/shared/sentiment-badge";
import { SLATimerComponent } from "~/components/shared/sla-timer";
import { cn } from "~/lib/utils";
import { useChannelStore } from "~/stores/channel-store";
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
  const { channels } = useChannelStore();
  const channel = channels.find((c) => c.id === ticket.channelConnectionId);

  const timeAgo = formatDistanceToNow(new Date(ticket.lastMessageTimestamp), {
    addSuffix: true,
  });

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
          {ticket.contactAvatarUrl ? (
            <img
              src={ticket.contactAvatarUrl}
              alt={ticket.contactName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
              {ticket.contactName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-sm truncate">
              {ticket.contactName}
            </h3>
            {ticket.unreadCount > 0 && (
              <span className="flex-shrink-0 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                {ticket.unreadCount}
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground truncate mb-2">
            {ticket.lastMessagePreview}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-2 flex-wrap">
            {channel && (
              <ChannelBadge
                channelType={channel.type}
                platformName={channel.platformName}
                size="sm"
              />
            )}
            {ticket.sentiment && (
              <SentimentBadge sentiment={ticket.sentiment} size="sm" />
            )}
            {ticket.sla && <SLATimerComponent sla={ticket.sla} size="sm" />}
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </div>
      </div>
    </button>
  );
};
