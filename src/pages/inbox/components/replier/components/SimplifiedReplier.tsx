import { useUpdateConversationStatus } from "@/api/services/inbox/inbox.hook";
import { Conversation } from "@/api/services/inbox/inbox.type";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Paperclip } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { DEFAULT_REPLIER_CONFIG, ReplierConfig } from "../replier.config";
import { AttachmentItem } from "./AttachmentItem";
import { ReplyPreview } from "./ReplyPreview";
import { SendActions } from "./SendActions";
import { EmojiPicker } from "./emoji-picker";
import { useFileAttachments } from "./useFileAttachments";

interface SimplifiedReplierProps {
  onSend: (
    message: string,
    attachments?: { type: string; url: string; attachment_id: string }[],
  ) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  conversationId?: string;
  ticketStatus?: string;
  replyTo?: Conversation | null;
  onCancelReply?: () => void;
  selectedTicketId?: string;
  config?: ReplierConfig;
}

export interface SimplifiedReplierHandle {
  focus: () => void;
}

export const SimplifiedReplier = forwardRef<
  SimplifiedReplierHandle,
  SimplifiedReplierProps
>(function SimplifiedReplier(
  {
    onSend,
    placeholder = "Type a message...",
    disabled = false,
    maxLength = 2000,
    conversationId,
    ticketStatus,
    replyTo,
    onCancelReply,
    selectedTicketId,
    config = DEFAULT_REPLIER_CONFIG,
  },
  ref,
) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    attachments,
    addFiles,
    retryUpload,
    removeAttachment,
    clearAll,
    hasUploading,
    uploaded,
  } = useFileAttachments(selectedTicketId);

  const updateStatusMutation = useUpdateConversationStatus();

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
  }));

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const charCount = message.length;
  const isOverLimit = charCount > maxLength;
  const showCounter = charCount > maxLength * 0.8;
  const isTicketClosed = ticketStatus === "DONE" || ticketStatus === "closed";
  const hasContent = !!(message.trim() || uploaded.length > 0);

  const canSend =
    hasContent &&
    !isSending &&
    !disabled &&
    !config.disableSend &&
    !isOverLimit &&
    !hasUploading;

  const handleSend = useCallback(async () => {
    if (!canSend) return;

    setIsSending(true);
    try {
      const attachmentPayload = uploaded.map((a) => ({
        type: a.file.type.startsWith("image/") ? "image" : "file",
        url: a.uploadedUrl || "",
        attachment_id: a.attachmentId || a.id,
      }));

      await onSend(
        message.trim(),
        attachmentPayload.length > 0 ? attachmentPayload : undefined,
      );
      setMessage("");
      clearAll();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }, [canSend, uploaded, onSend, message, clearAll]);

  const handleSendAndUpdateStatus = useCallback(
    async (status: "done" | "ongoing") => {
      if (!conversationId) return;
      if (hasContent) await handleSend();
      await updateStatusMutation.mutateAsync({
        conversationId,
        status,
      });
    },
    [conversationId, hasContent, handleSend, updateStatusMutation],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) addFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="border-t bg-background shrink-0">
      <div className="p-4">
        {/* Warning Message */}
        {config.warningMessage && (
          <div className="mb-2 rounded text-sm bg-destructive/10 text-destructive p-2">
            {config.warningMessage}
          </div>
        )}

        {/* Reply-to Preview */}
        {replyTo && <ReplyPreview replyTo={replyTo} onCancel={onCancelReply} />}

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <AttachmentItem
                key={attachment.id}
                attachment={attachment}
                onRetry={retryUpload}
                onRemove={removeAttachment}
              />
            ))}
          </div>
        )}

        {/* Input Container */}
        <div
          className={cn(
            "relative rounded-lg border bg-background transition-colors",
            "focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
            isOverLimit && "border-destructive focus-within:ring-destructive",
          )}
        >
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSending || config.disableInput}
            className={cn(
              "min-h-20 max-h-50 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              "pr-28 pb-12",
            )}
          />

          {/* Character Counter */}
          {showCounter && (
            <div
              className={cn(
                "absolute top-2 right-2 text-xs",
                isOverLimit
                  ? "text-destructive font-medium"
                  : "text-muted-foreground",
              )}
            >
              {charCount}/{maxLength}
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <EmojiPicker
              onSelect={(emoji) => {
                setMessage((prev) => prev + emoji);
                textareaRef.current?.focus();
              }}
              disabled={disabled || isSending || config.disableEmoji}
            />

            {/* File Upload */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isSending || config.disableAttachments}
              title="Attach files"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <SendActions
              canSend={canSend}
              isSending={isSending}
              disabled={disabled}
              disableSend={config.disableSend}
              conversationId={conversationId}
              isTicketClosed={isTicketClosed}
              hasMessage={!!message.trim()}
              onSend={handleSend}
              onSendAndClose={() => handleSendAndUpdateStatus("done")}
              onSendAndKeepOpen={() => handleSendAndUpdateStatus("ongoing")}
            />
          </div>

          {/* Keyboard Hint */}
          <div className="absolute bottom-2 left-3 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 bg-muted border rounded text-xs">
              Ctrl
            </kbd>
            {" + "}
            <kbd className="px-1.5 py-0.5 bg-muted border rounded text-xs">
              Enter
            </kbd>
            {" to send"}
          </div>
        </div>
      </div>
    </div>
  );
});
