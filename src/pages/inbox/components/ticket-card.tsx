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
        "w-full px-3 py-2.5 text-left border-b cursor-pointer last:border-b-0",
        "transition-all duration-100",
        "hover:bg-muted/50",
        isSelected && "bg-primary/10 border-l-2 border-l-primary shadow-xs",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <Avatar className="h-10 w-10 border shadow-xs">
            <AvatarImage
              src={ticket.customer_profile_pic}
              alt={ticket.customer_name}
            />
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
              {ticket.customer_name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1">
            {!ticket.channel?.account_name && ticket.platform && (
              <ChannelIcon platform={ticket.platform} />
            )}
            {ticket.channel?.account_name && (
              <Avatar className="h-4 w-4">
                <AvatarImage
                  src={ticket.channel.profile_pic_url}
                  alt={ticket.channel.account_name}
                />
                <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
                  {ticket.channel.account_name
                    .split(" ")[0]
                    ?.charAt(0)
                    .toUpperCase()}
                  {ticket.channel.account_name
                    .split(" ")[1]
                    ?.charAt(0)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className={cn("text-sm truncate leading-none")}>
              {ticket.customer_name}
            </span>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {ticket.created_at && format(new Date(ticket.created_at), "Pp")}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p
              className={cn(
                "text-xs text-muted-foreground truncate line-clamp-1 leading-normal",
              )}
            >
              {ticket.last_message_text || "No messages yet"}
            </p>
            {(ticket.unread_count ?? 0) > 0 && (
              <span className="shrink-0 h-4 min-w-4 flex items-center justify-center bg-primary text-[10px] font-bold text-primary-foreground px-1 rounded-full">
                {ticket.unread_count}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

const ChannelIcon = ({ platform }: { platform: string }) => {
  switch (platform?.toLowerCase()) {
    case "facebook":
      return (
        <div className="rounded-full bg-[#1877F2] p-0.5 border border-background shadow-xs">
          <Facebook className="w-2.5 h-2.5 text-white fill-white" />
        </div>
      );
    case "instagram":
      return (
        <div className="rounded-full bg-linear-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-0.5 border border-background shadow-xs">
          <Instagram className="w-2.5 h-2.5 text-white" />
        </div>
      );
    default:
      return (
        <div className="rounded-full bg-muted p-0.5 border border-background shadow-xs">
          <MessageCircle className="w-2.5 h-2.5 text-muted-foreground" />
        </div>
      );
  }
};
