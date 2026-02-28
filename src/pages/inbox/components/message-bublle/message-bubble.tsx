import { MessageAttachment } from "@/api/services/inbox/inbox.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import AudioAttachment from "./AudiAttachment";
import FileAttachment from "./FileAttachment";
import ImageAttachment from "./ImageAttachment";
import linkifyText from "./LinkifyText";
import { getAttachmentType } from "./utill";
import VideoAttachment from "./VideoAttachment";

interface MessageBubbleProps {
  text?: string;
  html?: string;
  time: string;
  avatarUrl?: string;
  senderName?: string;
  showAvatar?: boolean;
  isCustomer?: boolean;
  attachments?: MessageAttachment[];
}

export const MessageBubble = ({
  text,
  html,
  time,
  senderName,
  avatarUrl,
  showAvatar = true,
  isCustomer = true,
  attachments,
}: MessageBubbleProps) => {
  const initials = senderName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const hasText = !!(text?.trim() || html?.trim());
  const hasAttachments = !!(attachments && attachments.length > 0);

  const renderedText = useMemo(() => {
    if (html) return null; // HTML content handled separately
    if (!text) return null;
    return linkifyText(text, isCustomer);
  }, [text, html, isCustomer]);

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
        {/* Name */}
        <span className="text-[11px] font-medium text-muted-foreground leading-none">
          {senderName}
        </span>

        {/* Message content */}
        <div className="flex flex-col gap-1.5">
          {/* Attachments */}
          {hasAttachments && (
            <div className="flex flex-col gap-1.5">
              {attachments!.map((attachment, idx) => {
                const attachmentType = getAttachmentType(
                  attachment.content_type,
                  attachment.payload.url,
                );
                return (
                  <div key={attachment.stored_at || idx}>
                    {attachmentType === "image" && (
                      <ImageAttachment attachmentUrl={attachment.payload.url} />
                    )}
                    {attachmentType === "video" && (
                      <VideoAttachment attachmentUrl={attachment.payload.url} />
                    )}
                    {attachmentType === "audio" && (
                      <AudioAttachment attachmentUrl={attachment.payload.url} />
                    )}
                    {attachmentType === "file" && (
                      <FileAttachment
                        type={attachment.content_type}
                        attachmentUrl={attachment.payload.url}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Text bubble */}
          {hasText && (
            <div
              className={cn(
                "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                isCustomer
                  ? "bg-muted/80 text-foreground rounded-tl-none"
                  : "bg-primary text-primary-foreground rounded-tr-none",
              )}
            >
              {html ? (
                <div
                  className="prose prose-sm max-w-none leading-relaxed [&_a]:underline [&_a]:text-inherit [&_img]:max-w-full [&_img]:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed break-words">
                  {renderedText}
                </p>
              )}
            </div>
          )}

          {/* Fallback if no content */}
          {!hasText && !hasAttachments && (
            <div
              className={cn(
                "px-4 py-2.5 rounded-2xl text-sm shadow-sm italic text-muted-foreground",
                isCustomer
                  ? "bg-muted/80 rounded-tl-none"
                  : "bg-primary/80 rounded-tr-none",
              )}
            >
              <p className="leading-relaxed">No content</p>
            </div>
          )}
        </div>

        {/* Time */}
        <span className="text-[10px] text-muted-foreground px-0.5">
          {formatTime(time)}
        </span>
      </div>
    </div>
  );
};
