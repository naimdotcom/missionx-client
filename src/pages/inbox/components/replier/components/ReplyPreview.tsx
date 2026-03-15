import { Conversation } from "@/api/services/inbox/inbox.type";
import { Reply, X } from "lucide-react";

interface ReplyPreviewProps {
  replyTo: Conversation;
  onCancel?: () => void;
}

function getSenderName(replyTo: Conversation): string {
  if (replyTo.sender === "customer") return "Customer";
  if (replyTo.sender === "meta_suite") return "Meta Business Suite";
  return replyTo.attendant?.name || "Agent";
}

export function ReplyPreview({ replyTo, onCancel }: ReplyPreviewProps) {
  return (
    <div className="mb-2 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
      <Reply className="size-3.5 shrink-0 text-primary" />
      <p className="flex-1 truncate text-xs text-muted-foreground">
        <span className="font-medium text-foreground">
          {getSenderName(replyTo)}
        </span>
        {" — "}
        {replyTo.content?.text || "Attachment"}
      </p>
      <button
        onClick={onCancel}
        className="shrink-0 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
