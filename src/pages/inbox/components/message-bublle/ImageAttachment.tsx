import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

function ImageAttachment({ attachmentUrl }: { attachmentUrl: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
        <ImageIcon className="h-5 w-5" />
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <a
      href={attachmentUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative group"
    >
      {!loaded && (
        <div className="w-40 h-40 rounded-lg bg-muted animate-pulse flex items-center justify-center">
          <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
        </div>
      )}
      {attachmentUrl && (
        <img
          src={attachmentUrl}
          alt={"image"}
          className={cn(
            "min-w-40 min-h-40 max-w-[280px] max-h-[300px] rounded-lg object-cover cursor-pointer",
            !loaded && "hidden",
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
      {/* <div
        className={cn(
          "absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/10 transition-colors",
          "flex items-center justify-center opacity-0 group-hover:opacity-100",
        )}
      >
        <ExternalLink
          className={cn(
            "h-5 w-5",
            isCustomer ? "text-foreground" : "text-white",
          )}
        />
      </div> */}
    </a>
  );
}

export default ImageAttachment;
