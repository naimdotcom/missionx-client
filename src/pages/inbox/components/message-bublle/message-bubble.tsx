import {
  ConversationAttachment,
  ConversationTicketStatus,
  ReplyToConversation,
} from "@/api/services/inbox/inbox.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Reply } from "lucide-react";
import { useMemo } from "react";
import AudioAttachment from "./AudioAttachment";
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
  onReply?: () => void;
  repliedTo?: ReplyToConversation;
  status?: ConversationTicketStatus;
  attachments?: ConversationAttachment[];
}

function Attachment({
  attachment,
  total,
}: {
  attachment: ConversationAttachment;
  total: number;
}) {
  const type = getAttachmentType(attachment.type || "", attachment.payload.url);

  const url = attachment.payload.url
    ? (env.mediaUrl ?? "") + attachment.payload.url
    : attachment.meta_url;
  console.log(env.mediaUrl);

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
  status,
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

  const renderedText = useMemo(() => {
    if (!text) return null;
    return linkifyText(text, isCustomer);
  }, [text, isCustomer]);

  return (
    <div
      data-msg-id={msgId}
      className={cn(
        "flex gap-2 items-end max-w-full group",
        !isCustomer && "flex-row-reverse",
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
          !isCustomer ? "items-end" : "items-start",
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
            !isCustomer &&
              "bg-primary/90 rounded-br-sm text-primary-foreground",
            isCustomer && "bg-white dark:bg-muted/70 rounded-bl-sm",
          )}
        >
          {/* Replied-to quote — click to scroll to the original message */}
          {(repliedTo?.content?.text ||
            (repliedTo?.content?.attachments?.length ?? 0) > 0) && (
            <div
              onClick={scrollToReplied}
              className={cn(
                "mx-2 mt-2 rounded-lg overflow-hidden cursor-pointer border-l-[3px] transition-opacity hover:opacity-80",
                !isCustomer
                  ? "bg-black/20 border-primary-foreground/60"
                  : "bg-black/5 border-primary/50",
              )}
            >
              <div className="px-2.5 py-2">
                <p
                  className={cn(
                    "text-[10px] font-semibold mb-1 uppercase tracking-wide",
                    !isCustomer
                      ? "text-primary-foreground/60"
                      : "text-primary/70",
                  )}
                >
                  Replied to
                </p>
                {repliedTo?.content?.text ? (
                  <p className="line-clamp-2 text-xs leading-relaxed wrap-break-word opacity-80">
                    {repliedTo.content.text}
                  </p>
                ) : (
                  <p className="text-xs italic opacity-50">📎 Attachment</p>
                )}
              </div>
            </div>
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
                !isCustomer
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
      {onReply && status !== "done" && (
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
