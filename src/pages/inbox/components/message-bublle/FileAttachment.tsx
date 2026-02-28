import { Download, FileIcon, FileText } from "lucide-react";
import { getFileExtension } from "./utill";

function FileAttachment({
  attachmentUrl,
  type,
}: {
  attachmentUrl: string;
  type: string;
}) {
  const ext = getFileExtension(attachmentUrl || "");
  const isPdf = type === "application/pdf" || ext === "PDF";

  return (
    <a
      href={attachmentUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group min-w-[200px] max-w-[280px]"
    >
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 relative">
        {isPdf ? (
          <FileText className="h-5 w-5 text-red-500" />
        ) : (
          <FileIcon className="h-5 w-5 text-primary" />
        )}
        {ext && (
          <span className="absolute -bottom-1 -right-1 text-[8px] font-bold bg-background border rounded px-1 text-muted-foreground">
            {ext}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{"File"}</p>
        {/* {attachment.file_size && (
          <p className="text-[10px] text-muted-foreground">
            {formatFileSize(attachment.file_size)}
          </p>
        )} */}
      </div>
      <Download className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </a>
  );
}
export default FileAttachment;
