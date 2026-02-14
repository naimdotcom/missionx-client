import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  text: string;
  time: string;
  senderName: string;
  isAgent?: boolean;
  avatarUrl?: string;
  showAvatar?: boolean;
}

export const MessageBubble = ({
  text,
  time,
  senderName,
  isAgent = false,
  avatarUrl,
  showAvatar = true,
}: MessageBubbleProps) => {
  const initials = senderName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "flex gap-3 max-w-full group",
        isAgent ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 flex items-end mb-1">
        {showAvatar ? (
          <Avatar className="h-8 w-8 border shadow-sm">
            <AvatarImage src={avatarUrl} alt={senderName} />
            <AvatarFallback className="text-[10px] bg-muted">
              {initials}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-8" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[80%]",
          isAgent ? "items-end" : "items-start",
        )}
      >
        {!isAgent && (
          <span className="text-[11px] font-medium text-muted-foreground ml-1">
            {senderName}
          </span>
        )}

        <div
          className={cn(
            "relative px-4 py-2.5 rounded-2xl text-sm shadow-sm",
            isAgent
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-muted/80 text-foreground rounded-tl-none",
          )}
        >
          <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
        </div>

        <span
          className={cn(
            "text-[10px] text-muted-foreground px-1 transition-opacity",
            isAgent ? "text-right" : "text-left",
          )}
        >
          {time}
        </span>
      </div>
    </div>
  );
};
