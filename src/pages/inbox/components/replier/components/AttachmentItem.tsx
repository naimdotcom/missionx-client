import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  FileIcon,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Video,
  X,
} from "lucide-react";
import { AttachmentUpload } from "./useFileAttachments";

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

interface AttachmentItemProps {
  attachment: AttachmentUpload;
  onRetry: (id: string) => void;
  onRemove: (id: string) => void;
}

export function AttachmentItem({
  attachment,
  onRetry,
  onRemove,
}: AttachmentItemProps) {
  const FileTypeIcon = getFileIcon(attachment.file);
  const isInProgress =
    attachment.status === "uploading" || attachment.status === "pending";

  return (
    <div
      className={cn(
        "relative group rounded-lg border overflow-hidden",
        attachment.status === "failed" && "border-destructive",
        attachment.previewUrl ? "w-20 h-20" : "max-w-50",
      )}
    >
      {/* Content: image preview or file info */}
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
            attachment.status === "failed" ? "bg-destructive/10" : "bg-muted",
          )}
        >
          <FileTypeIcon className="h-4 w-4 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{attachment.file.name}</p>
            <p className="text-muted-foreground">
              {formatFileSize(attachment.file.size)}
            </p>
          </div>
        </div>
      )}

      {/* Upload progress overlay */}
      {isInProgress && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60">
          <Loader2 className="h-4 w-4 animate-spin text-primary mb-1" />
          <span className="text-[10px] font-medium">
            {attachment.progress}%
          </span>
          <Progress value={attachment.progress} className="w-3/4 h-1 mt-1" />
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
            onClick={() => onRetry(attachment.id)}
            className="flex flex-col items-center gap-1 text-destructive hover:text-destructive/80"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="text-[10px] font-medium">Retry</span>
          </button>
        </div>
      )}

      {/* Remove button */}
      <button
        onClick={() => onRemove(attachment.id)}
        className={cn(
          "absolute top-1 right-1 rounded-full p-0.5 bg-background/80 text-muted-foreground hover:text-foreground shadow-xs",
          "opacity-0 group-hover:opacity-100 transition-opacity",
        )}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
