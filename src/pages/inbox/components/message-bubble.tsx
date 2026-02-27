import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  text?: string;
  time: string;
  avatarUrl?: string;
  senderName?: string;
  showAvatar?: boolean;
  isCustomer?: boolean;
}

export const MessageBubble = ({
  text,
  time,
  senderName,
  avatarUrl,
  showAvatar = true,
  isCustomer = true,
}: MessageBubbleProps) => {
  const initials = senderName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "flex gap-2 items-start max-w-full group",
        !isCustomer && "flex-row-reverse",
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {showAvatar ? (
          <Avatar className="h-8 w-8 border shadow-sm">
            <AvatarImage src={avatarUrl} alt={senderName} />
            <AvatarFallback className="text-[10px] bg-muted">
              {initials}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-0" />
        )}
      </div>

      {/* Name + Bubble + Time */}
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[75%]",
          isCustomer ? "items-start" : "items-end",
        )}
      >
        {/* Name inline with avatar row */}
        <span className="text-[11px] font-medium text-muted-foreground leading-none">
          {senderName}
        </span>

        {/* Bubble */}
        <div
          className={cn(
            "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
            isCustomer
              ? "bg-muted/80 text-foreground rounded-tl-none"
              : "bg-primary text-primary-foreground rounded-tr-none",
          )}
        >
          <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
        </div>

        {/* Time — just HH:MM, right after the bubble */}
        <span className="text-[10px] text-muted-foreground px-0.5">
          {formatTime(time)}
        </span>
      </div>
    </div>
  );
};
