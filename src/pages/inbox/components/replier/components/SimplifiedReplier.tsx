import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2, Paperclip, Send } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { EmojiPicker } from "./emoji-picker";

interface SimplifiedReplierProps {
  onSend: (message: string, attachments?: File[]) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
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
  },
  ref,
) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSend = async () => {
    if (
      (!message.trim() && attachments.length === 0) ||
      isSending ||
      disabled
    ) {
      return;
    }

    setIsSending(true);
    try {
      await onSend(message.trim(), attachments);
      setMessage("");
      setAttachments([]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
      // Re-focus the textarea so the agent can keep typing
      textareaRef.current?.focus();
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const charCount = message.length;
  const isOverLimit = charCount > maxLength;
  const showCounter = charCount > maxLength * 0.8;

  return (
    <div className="border-t bg-background shrink-0">
      <div className="p-4">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md text-xs"
              >
                <Paperclip className="h-3 w-3" />
                <span className="max-w-[120px] truncate">{file.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-muted-foreground hover:text-foreground ml-1"
                >
                  ×
                </button>
              </div>
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
            disabled={disabled || isSending}
            className={cn(
              "min-h-[80px] max-h-[200px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
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
            <EmojiPicker onSelect={handleEmojiSelect} />

            {/* File Upload */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx"
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

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={
                (!message.trim() && attachments.length === 0) ||
                isSending ||
                disabled ||
                isOverLimit
              }
              size="icon"
              className="h-8 w-8"
              title="Send message (Ctrl+Enter)"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
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
