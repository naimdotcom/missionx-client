import {
  ConversationAttachment,
  ReplyToConversation,
} from "@/api/services/inbox/inbox.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Reply } from "lucide-react";
import { useMemo } from "react";
import AudioAttachment from "./AudiAttachment";
import FileAttachment from "./FileAttachment";
import ImageAttachment from "./ImageAttachment";
import linkifyText from "./LinkifyText";
import { getAttachmentType } from "./utill";
import VideoAttachment from "./VideoAttachment";

interface MessageBubbleProps {
  msgId?: string;
  text?: string;
  time?: string;
  avatarUrl?: string;
  senderName?: string;
  showAvatar?: boolean;
  isCustomer?: boolean;
  attachments?: ConversationAttachment[];
  repliedTo?: ReplyToConversation;
  onReply?: () => void;
}

function Attachment({
  attachment,
  total,
}: {
  attachment: ConversationAttachment;
  total: number;
}) {
  const type = getAttachmentType(attachment.type || "", attachment.payload.url);
  const url = attachment.payload.url;
  if (!url) return null;
  if (type === "image")
    return <ImageAttachment totalImage={total} attachmentUrl={url} />;
  if (type === "video") return <VideoAttachment attachmentUrl={url} />;
  if (type === "audio") return <AudioAttachment attachmentUrl={url} />;
  return (
    <FileAttachment attachmentUrl={url} type={attachment.type || "file"} />
  );
}

export function MessageBubble({
  msgId,
  text,
  time,
  senderName,
  avatarUrl,
  showAvatar = true,
  isCustomer = true,
  attachments = [],
  repliedTo,
  onReply,
}: MessageBubbleProps) {
  const initials = senderName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const scrollToReplied = () => {
    if (!repliedTo?.id) return;
    document
      .querySelector(`[data-msg-id="${repliedTo.id}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const isAgent = !isCustomer;

  const renderedText = useMemo(() => {
    if (!text) return null;
    return linkifyText(text, isCustomer);
  }, [text, isCustomer]);

  // const hasText = !!text?.trim();
  // const hasAttachments = !!(attachments && attachments.length > 0);

  return (
    <div
      data-msg-id={msgId}
      className={cn(
        "flex gap-2 items-end max-w-full group",
        isAgent && "flex-row-reverse",
      )}
    >
      {/* Avatar */}

      {showAvatar && (
        <Avatar className="h-7 w-7">
          <AvatarImage src={avatarUrl} alt={senderName} />
          <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
        </Avatar>
      )}

      {/* Bubble column */}
      <div
        className={cn(
          "flex flex-col gap-0.5 max-w-lg",
          isAgent ? "items-end" : "items-start",
        )}
      >
        {senderName && (
          <span className="text-[11px] text-muted-foreground px-1">
            {senderName}
          </span>
        )}

        {/* Unified bubble */}
        <div
          className={cn(
            "flex flex-col rounded-2xl overflow-hidden text-sm shadow-md",
            isAgent && "bg-primary/90 rounded-br-sm text-primary-foreground",
            !isAgent && "bg-white dark:bg-muted/70 rounded-bl-sm",
          )}
        >
          {/* Replied-to quote — click to scroll to the original message */}
          {repliedTo?.content?.text && (
            <Button
              onClick={scrollToReplied}
              className={cn(
                "mx-2 mt-2 px-2.5 py-1.5 rounded border-r-2 text-xs hover:bg-inherit",
                isAgent
                  ? "bg-white/10 border-l-white/60 text-primary-foreground/80"
                  : "bg-muted/60 border-r-primary/50 text-muted-foreground",
              )}
            >
              <p className="line-clamp-2 wrap-break-word">
                {repliedTo.content.text}
              </p>
            </Button>
          )}

          {/* Attachments */}
          {attachments.length > 0 && (
            <div
              className={cn(
                "grid gap-1 p-2",
                attachments.length > 1 && "grid-cols-2",
              )}
            >
              {attachments.map((a, i) => (
                <Attachment key={i} attachment={a} total={attachments.length} />
              ))}
            </div>
          )}

          {/* Text + timestamp */}
          <div className="px-3 py-2">
            {renderedText ? (
              <p className="leading-relaxed wrap-break-word whitespace-pre-wrap">
                {renderedText}
              </p>
            ) : (
              attachments.length === 0 && (
                <p className="italic opacity-40">No content</p>
              )
            )}
            <span
              className={cn(
                "block text-right text-[10px] leading-none select-none mt-1",
                isAgent
                  ? "text-primary-foreground/60"
                  : "text-muted-foreground/60",
              )}
            >
              {formatTime(time)}
            </span>
          </div>
        </div>
      </div>

      {/* Reply button — appears on hover */}
      {onReply && (
        <Button
          size="icon"
          title="Reply"
          variant="ghost"
          onClick={onReply}
          className="self-center opacity-0 group-hover:opacity-100 rounded-full"
        >
          <Reply className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
