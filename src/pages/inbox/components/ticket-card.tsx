// Individual ticket card component

import { ConversationTicket } from "@/api/services/inbox/inbox.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Facebook, Instagram, MessageCircle } from "lucide-react";
import { cn } from "~/lib/utils";

interface TicketCardProps {
  ticket: ConversationTicket;
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
        "w-full px-3 py-2.5 text-left transition-colors border-b",
        "hover:bg-muted/50",
        "focus:outline-none focus:bg-muted font-sans",
        isSelected && "bg-accent/50 px-[9px]",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <Avatar className="h-10 w-10 border shadow-sm">
            <AvatarImage
              src={ticket.customer_profile_pic}
              alt={ticket.customer_name}
            />
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
              {ticket.customer_name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1">
            <ChannelIcon channel={ticket.platform} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="font-semibold text-sm truncate leading-none">
              {ticket.customer_name}
            </span>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {format(new Date(ticket.created_at), "Pp")}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground truncate line-clamp-1 leading-normal">
              {ticket.last_message_text}
            </p>
            {(ticket.unread_count ?? 0) > 0 && (
              <span className="flex-shrink-0 h-4 min-w-[1rem] flex items-center justify-center bg-primary text-[10px] font-bold text-primary-foreground px-1 rounded-full">
                {ticket.unread_count}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

const ChannelIcon = ({ channel }: { channel: string }) => {
  switch (channel?.toLowerCase()) {
    case "facebook":
      return (
        <div className="rounded-full bg-[#1877F2] p-0.5 border border-background shadow-sm">
          <Facebook className="w-2.5 h-2.5 text-white fill-white" />
        </div>
      );
    case "instagram":
      return (
        <div className="rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-0.5 border border-background shadow-sm">
          <Instagram className="w-2.5 h-2.5 text-white" />
        </div>
      );
    default:
      return (
        <div className="rounded-full bg-muted p-0.5 border border-background shadow-sm">
          <MessageCircle className="w-2.5 h-2.5 text-muted-foreground" />
        </div>
      );
  }
};
