// Individual ticket card component

import { ConversationTicket } from "@/api/services/inbox/inbox.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, isToday } from "date-fns";
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
  const platform = ticket.platform?.toLowerCase();
  const channelName = ticket.channel?.account_name;
  const isUnread = (ticket.unread_count ?? 0) > 0;

  // Format last_message_time
  const lastMessageTime = ticket.last_message_time
    ? new Date(ticket.last_message_time)
    : null;
  const timeDisplay = lastMessageTime
    ? isToday(lastMessageTime)
      ? format(lastMessageTime, "p")
      : format(lastMessageTime, "MMM d")
    : "";

  return (
    <div
      onClick={onClick}
      className={cn(
        "group rounded-lg w-full px-3 py-3 text-left cursor-pointer last:border-b-0",
        "transition-colors duration-200 relative",
        "hover:bg-accent/40 active:bg-accent/60",
        isSelected && "bg-accent",
      )}
    >
      <div className="flex gap-3">
        {/* Avatar Section */}
        <div className="relative shrink-0">
          <Avatar className={cn("h-11 w-11 border-2 border-border/60")}>
            <AvatarImage
              src={ticket.customer_profile_pic}
              alt={ticket.customer_name}
            />
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
              {ticket.customer_name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="absolute bottom-0 -right-1.5 ring-2 ring-background rounded-full overflow-hidden shadow-sm">
            <PlatformIcon platform={platform || ""} size="xs" />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "text-[13px] font-semibold truncate leading-none transition-colors",
                isUnread ? "text-foreground" : "text-foreground/80",
                isSelected && "text-primary",
              )}
            >
              {ticket.customer_name}
            </span>
            <span
              className={cn(
                "text-[10px] whitespace-nowrap font-medium",
                isUnread
                  ? "text-primary font-semibold"
                  : "text-muted-foreground/70",
              )}
            >
              {timeDisplay}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 min-h-5">
            <p
              className={cn(
                "text-[12px] truncate line-clamp-1 leading-normal",
                isUnread
                  ? "text-foreground/90 font-medium"
                  : "text-muted-foreground/80",
              )}
            >
              {ticket.last_message_text || "No messages"}
            </p>
            {isUnread && (
              <div className="shrink-0 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
            )}
          </div>
        </div>
        {/* Metadata */}
      </div>

      {channelName && (
        <Badge
          variant="secondary"
          className="self-start mt-1.5 font-normal text-muted-foreground h-5"
        >
          <span className="truncate max-w-30">{channelName}</span>
        </Badge>
      )}
    </div>
  );
};

interface PlatformIconProps {
  platform: string;
  size?: "xs" | "sm" | "md";
}

const PlatformIcon = ({ platform, size = "md" }: PlatformIconProps) => {
  const iconSize =
    size === "xs"
      ? "w-[10px] h-[10px]"
      : size === "sm"
        ? "w-2.5 h-2.5"
        : "w-4 h-4";
  const containerPadding =
    size === "xs" ? "p-[3px]" : size === "sm" ? "p-1" : "p-1.5";

  switch (platform?.toLowerCase()) {
    case "facebook":
      return (
        <div className={cn("bg-[#1877F2] text-white", containerPadding)}>
          <Facebook className={cn(iconSize, "fill-current")} />
        </div>
      );
    case "instagram":
      return (
        <div
          className={cn(
            "bg-linear-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white",
            containerPadding,
          )}
        >
          <Instagram className={iconSize} />
        </div>
      );
    case "whatsapp":
      return (
        <div className={cn("bg-[#25D366] text-white", containerPadding)}>
          <MessageCircle className={cn(iconSize, "fill-current")} />
        </div>
      );
    default:
      return (
        <div className={cn("bg-muted text-muted-foreground", containerPadding)}>
          <MessageCircle className={iconSize} />
        </div>
      );
  }
};
