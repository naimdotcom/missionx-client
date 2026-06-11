import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ArrowUp, FileText, Loader2, Paperclip, X } from "lucide-react";
import { mediaService } from "@/api/services/media/media.service";

interface AttachmentPill {
  mediaId: string;
  fileName: string;
}

interface ChatComposerProps {
  onSend: (text: string, attachments?: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatComposer({
  onSend,
  disabled,
  placeholder = "Message the assistant…",
}: ChatComposerProps) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<AttachmentPill[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUploading = uploadProgress !== null;

  // Auto-resize up to a max height.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text, attachments.map((a) => a.mediaId));
    setValue("");
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // allow re-selecting the same file

    setUploadProgress(0);
    try {
      const result = await mediaService.fileUpload(
        { file },
        { onUploadProgress: (pct) => setUploadProgress(pct) },
      );
      const mediaId = result?.id;
      if (mediaId) {
        setAttachments((prev) => [...prev, { mediaId, fileName: file.name }]);
      }
    } catch {
      // silently drop — user can retry
    } finally {
      setUploadProgress(null);
    }
  };

  const removeAttachment = (mediaId: string) => {
    setAttachments((prev) => prev.filter((a) => a.mediaId !== mediaId));
  };

  return (
    <div className="border-t bg-background p-3">
      {/* Attachment pills */}
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {attachments.map((a) => (
            <span
              key={a.mediaId}
              className="inline-flex max-w-[200px] items-center gap-1.5 rounded-full border bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground"
            >
              <FileText className="size-3 shrink-0 text-muted-foreground" />
              <span className="truncate">{a.fileName}</span>
              <button
                type="button"
                className="ml-0.5 shrink-0 rounded-full text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => removeAttachment(a.mediaId)}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Upload progress bar */}
      {isUploading && (
        <Progress value={uploadProgress ?? 0} className="mb-2 h-1" />
      )}

      <div
        className={cn(
          "relative flex items-end rounded-xl border bg-background transition-colors",
          "focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
          disabled && "opacity-60",
        )}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".csv,.json,.xlsx,.xls"
          onChange={handleFileChange}
        />

        {/* Attach button */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute bottom-1.5 left-1.5 size-8 shrink-0 rounded-lg text-muted-foreground hover:text-foreground"
          disabled={disabled || isUploading}
          onClick={() => fileInputRef.current?.click()}
          title="Attach a file (CSV, JSON, or Excel)"
        >
          {isUploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Paperclip className="size-4" />
          )}
        </Button>

        <Textarea
          ref={textareaRef}
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="max-h-50 min-h-11 resize-none border-0 bg-transparent px-10 pr-12 shadow-none focus-visible:ring-0"
          rows={1}
        />

        <Button
          size="icon"
          className="absolute bottom-1.5 right-1.5 size-8 rounded-lg"
          disabled={disabled || !value.trim()}
          onClick={submit}
        >
          <ArrowUp className="size-4" />
        </Button>
      </div>

      <p className="mt-1 px-1 text-[11px] text-muted-foreground">
        <kbd className="rounded border bg-muted px-1 py-0.5">Ctrl</kbd> +{" "}
        <kbd className="rounded border bg-muted px-1 py-0.5">Enter</kbd> to
        send &middot;{" "}
        <Paperclip className="mb-0.5 inline size-2.5" /> attach CSV, JSON, or
        Excel
      </p>
    </div>
  );
}
