import { useUpdateConversationStatus } from "@/api/services/inbox/inbox.hook";
import { Conversation } from "@/api/services/inbox/inbox.type";
import { useFileUpload } from "@/api/services/upload/upload.hook";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import {
  CheckCircle2,
  ChevronUp,
  FileIcon,
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  Paperclip,
  RefreshCw,
  Reply,
  Send,
  Video,
  X,
} from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { EmojiPicker } from "./emoji-picker";

type UploadStatus = "pending" | "uploading" | "uploaded" | "failed";

interface AttachmentUpload {
  id: string;
  file: File;
  previewUrl?: string;
  status: UploadStatus;
  progress: number;
  uploadedUrl?: string;
  attachmentId?: string;
  error?: string;
}

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
}

export interface SimplifiedReplierHandle {
  focus: () => void;
}

function getFileIcon(file: File) {
  if (file.type.startsWith("image/")) return ImageIcon;
  if (file.type.startsWith("video/")) return Video;
  return FileIcon;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
  },
  ref,
) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentUpload[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { selectedApp } = useAuthStore();
  const updateStatusMutation = useUpdateConversationStatus();
  const fileUploadMutation = useFileUpload();

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

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      attachments.forEach((a) => {
        if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadFile = useCallback(
    async (attachment: AttachmentUpload) => {
      if (!selectedApp?.id) return;

      // Set uploading state
      setAttachments((prev) =>
        prev.map((a) =>
          a.id === attachment.id
            ? { ...a, status: "uploading" as UploadStatus, progress: 0 }
            : a,
        ),
      );

      try {
        const result = await fileUploadMutation.mutateAsync({
          apiPayload: {
            context_type: "conv",
            file: attachment.file,
            context_id: selectedTicketId,
          },
          options: {
            onUploadProgress: (progressEvent: ProgressEvent) => {
              const progress = progressEvent.total
                ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                : 0;
              setAttachments((prev) =>
                prev.map((a) =>
                  a.id === attachment.id ? { ...a, progress } : a,
                ),
              );
            },
          },
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = result;
        setAttachments((prev) =>
          prev.map((a) =>
            a.id === attachment.id
              ? {
                  ...a,
                  progress: 100,
                  attachmentId: data?.id,
                  uploadedUrl: data?.public_url,
                  status: "uploaded" as UploadStatus,
                }
              : a,
          ),
        );
      } catch (error) {
        console.error("Upload failed:", error);
        setAttachments((prev) =>
          prev.map((a) =>
            a.id === attachment.id
              ? {
                  ...a,
                  status: "failed" as UploadStatus,
                  error: "Upload failed. Click to retry.",
                }
              : a,
          ),
        );
      }
    },
    [fileUploadMutation, selectedApp?.id],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);

      const newAttachments: AttachmentUpload[] = files.map((file) => {
        const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const previewUrl = file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined;

        return {
          id,
          file,
          previewUrl,
          status: "pending" as UploadStatus,
          progress: 0,
        };
      });

      setAttachments((prev) => [...prev, ...newAttachments]);

      // Start uploading each file
      newAttachments.forEach((a) => uploadFile(a));

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [uploadFile],
  );

  const retryUpload = useCallback(
    (id: string) => {
      const attachment = attachments.find((a) => a.id === id);
      if (attachment) {
        uploadFile(attachment);
      }
    },
    [attachments, uploadFile],
  );

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => {
      const attachment = prev.find((a) => a.id === id);
      if (attachment?.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
      return prev.filter((a) => a.id !== id);
    });
  }, []);

  const hasUploadingAttachments = attachments.some(
    (a) => a.status === "uploading" || a.status === "pending",
  );

  const uploadedAttachments = attachments.filter(
    (a) => a.status === "uploaded",
  );

  const handleSend = async () => {
    if (
      (!message.trim() && uploadedAttachments.length === 0) ||
      isSending ||
      disabled ||
      hasUploadingAttachments
    ) {
      return;
    }

    setIsSending(true);
    try {
      const attachmentPayload = uploadedAttachments.map((a) => ({
        type: a.file.type.startsWith("image/") ? "image" : "file",
        url: a.uploadedUrl || "",
        attachment_id: a.attachmentId || a.id,
      }));

      await onSend(
        message.trim(),
        attachmentPayload.length > 0 ? attachmentPayload : undefined,
      );
      setMessage("");
      // Clean up previews
      attachments.forEach((a) => {
        if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
      });
      setAttachments([]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  const charCount = message.length;
  const isOverLimit = charCount > maxLength;
  const showCounter = charCount > maxLength * 0.8;

  const handleSendAndClose = async () => {
    if (conversationId) {
      if (message.trim() || uploadedAttachments.length > 0) {
        await handleSend();
      }
      await updateStatusMutation.mutateAsync({
        conversationId,
        status: "closed",
      });
    }
  };

  const handleSendAndKeepOpen = async () => {
    if (conversationId) {
      if (message.trim() || uploadedAttachments.length > 0) {
        await handleSend();
      }
      await updateStatusMutation.mutateAsync({
        conversationId,
        status: "open",
      });
    }
  };

  const isTicketClosed = ticketStatus === "DONE" || ticketStatus === "closed";

  const canSend =
    (message.trim() || uploadedAttachments.length > 0) &&
    !isSending &&
    !disabled &&
    !isOverLimit &&
    !hasUploadingAttachments;

  return (
    <div className="border-t bg-background shrink-0">
      <div className="p-4">
        {/* Reply-to preview banner */}
        {replyTo && (
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
            <Reply className="size-3.5 shrink-0 text-primary" />
            <p className="flex-1 truncate text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {replyTo.sender === "customer"
                  ? "Customer"
                  : replyTo.sender === "meta_suite"
                    ? "Meta Business Suite"
                    : replyTo.attendant?.name || "Agent"}
              </span>
              {" — "}
              {replyTo.content?.text || "Attachment"}
            </p>
            <button
              onClick={onCancelReply}
              className="shrink-0 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((attachment) => {
              const FileTypeIcon = getFileIcon(attachment.file);
              return (
                <div
                  key={attachment.id}
                  className={cn(
                    "relative group rounded-lg border overflow-hidden",
                    attachment.status === "failed" && "border-destructive",
                    attachment.previewUrl ? "w-20 h-20" : "max-w-50",
                  )}
                >
                  {/* Image preview */}
                  {attachment.previewUrl ? (
                    <img
                      src={attachment.previewUrl}
                      alt={attachment.file.name}
                      className={cn(
                        "w-full h-full object-cover",
                        attachment.status !== "uploaded" && "opacity-60",
                      )}
                    />
                  ) : (
                    <div
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-xs",
                        attachment.status === "failed"
                          ? "bg-destructive/10"
                          : "bg-muted",
                      )}
                    >
                      <FileTypeIcon className="h-4 w-4 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {attachment.file.name}
                        </p>
                        <p className="text-muted-foreground">
                          {formatFileSize(attachment.file.size)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Upload progress overlay */}
                  {(attachment.status === "uploading" ||
                    attachment.status === "pending") && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60">
                      <Loader2 className="h-4 w-4 animate-spin text-primary mb-1" />
                      <span className="text-[10px] font-medium">
                        {attachment.progress}%
                      </span>
                      <Progress
                        value={attachment.progress}
                        className="w-3/4 h-1 mt-1"
                      />
                    </div>
                  )}

                  {/* Upload success indicator */}
                  {attachment.status === "uploaded" && (
                    <div className="absolute top-1 left-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 drop-shadow-xs" />
                    </div>
                  )}

                  {/* Failed overlay with retry */}
                  {attachment.status === "failed" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10">
                      <button
                        onClick={() => retryUpload(attachment.id)}
                        className="flex flex-col items-center gap-1 text-destructive hover:text-destructive/80"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span className="text-[10px] font-medium">Retry</span>
                      </button>
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className={cn(
                      "absolute top-1 right-1 rounded-full p-0.5 bg-background/80 text-muted-foreground hover:text-foreground shadow-xs",
                      "opacity-0 group-hover:opacity-100 transition-opacity",
                    )}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
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
            disabled={disabled || isSending}
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

          {/* Action Buttons Container */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            {/* Emoji Picker */}
            <EmojiPicker
              onSelect={handleEmojiSelect}
              disabled={disabled || isSending}
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
              disabled={disabled || isSending}
              title="Attach files"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {/* Send Button with Status Dropdown */}
            <div className="flex items-center">
              <Button
                onClick={handleSend}
                disabled={!canSend}
                size="icon"
                className={cn(
                  "h-8 w-8",
                  conversationId ? "rounded-r-none" : "",
                )}
                title="Send message (Ctrl+Enter)"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>

              {conversationId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      className="h-8 w-6 rounded-l-none border-l border-primary-foreground/20"
                      disabled={disabled || isSending}
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem onClick={handleSend} disabled={!canSend}>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {!isTicketClosed && (
                      <DropdownMenuItem onClick={handleSendAndClose}>
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        {message.trim()
                          ? "Send & Close Ticket"
                          : "Close Ticket"}
                      </DropdownMenuItem>
                    )}
                    {isTicketClosed && (
                      <DropdownMenuItem onClick={handleSendAndKeepOpen}>
                        <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                        {message.trim()
                          ? "Send & Reopen Ticket"
                          : "Reopen Ticket"}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
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
