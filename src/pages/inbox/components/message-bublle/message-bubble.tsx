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
    if (html) return null;
    if (!text) return null;
    return linkifyText(text, isCustomer);
  }, [text, html, isCustomer]);

  return (
    <div
      className={cn(
        "flex gap-2.5 items-end max-w-full group",
        !isCustomer && "flex-row-reverse",
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {showAvatar && (
          <Avatar className="h-7 w-7 ring-2 ring-background shadow-sm">
            <AvatarImage src={avatarUrl} alt={senderName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Name + Bubble */}
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[72%]",
          isCustomer ? "items-start" : "items-end",
        )}
      >
        {/* Sender name — only shown when avatar is visible */}
        {senderName && (
          <span className={cn("text-[11px] font-semibold tracking-wide px-1")}>
            {senderName}
          </span>
        )}

        {/* Attachments (outside bubble) */}
        {hasAttachments && (
          <div className="flex flex-col gap-1.5">
            {attachments!.map((attachment, idx) => {
              const attachmentType = getAttachmentType(
                attachment.content_type || attachment.type,
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
        {(hasText || (!hasText && !hasAttachments)) && (
          <div
            className={cn(
              "relative px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
              "rounded-2xl",
              isCustomer
                ? [
                    "bg-white dark:bg-muted/60",
                    "text-foreground",
                    "border border-border/50",
                    "rounded-bl-sm",
                    "shadow-[0_1px_4px_0_rgba(0,0,0,0.06)]",
                  ]
                : [
                    "bg-gradient-to-br from-primary to-primary/80",
                    "text-primary-foreground",
                    "rounded-br-sm",
                    "shadow-[0_2px_8px_0_rgba(var(--primary)/0.35)]",
                  ],
            )}
          >
            {hasText ? (
              html ? (
                <div
                  className="prose prose-sm max-w-none [&_a]:underline [&_a]:text-inherit [&_img]:max-w-full [&_img]:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <p className="whitespace-pre-wrap break-words">
                  {renderedText}
                </p>
              )
            ) : (
              <p className="italic opacity-50">No content</p>
            )}

            {/* Inline timestamp */}
            <span
              className={cn(
                "block text-right text-[10px] mt-1 leading-none select-none",
                isCustomer
                  ? "text-muted-foreground/70"
                  : "text-primary-foreground/60",
              )}
            >
              {formatTime(time)}
            </span>
          </div>
        )}

        {/* Standalone time when there's only an attachment (no text bubble) */}
        {hasAttachments && !hasText && (
          <span className="text-[10px] text-muted-foreground/70 px-1">
            {formatTime(time)}
          </span>
        )}
      </div>
    </div>
  );
};
