import { FileText } from "lucide-react";

interface MediaPreviewProps {
  type: "image" | "video" | "file" | string;
  url: string;
}

export function MediaPreview({ type, url }: MediaPreviewProps) {
  if (type === "image") {
    return (
      <div className="max-w-64 overflow-hidden rounded-xl border border-border shadow-sm">
        <img
          src={url}
          alt="Image attachment"
          className="block w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  if (type === "video") {
    return (
      <div className="max-w-64 overflow-hidden rounded-xl border border-border shadow-sm">
        <video controls className="block w-full" src={url} />
      </div>
    );
  }

  // file or unknown
  const filename = url.split("/").pop() ?? "file";
  return (
    <div className="flex max-w-xs items-center gap-2.5 rounded-xl border border-border bg-white px-3.5 py-2.5 shadow-sm dark:bg-gray-900">
      <FileText className="size-5 shrink-0 text-muted-foreground" />
      <span className="truncate text-sm text-gray-800 dark:text-gray-100">{filename}</span>
    </div>
  );
}
