import { Volume2 } from "lucide-react";

function AudioAttachment({ attachmentUrl }: { attachmentUrl: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 min-w-[220px]">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Volume2 className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{"Audio"}</p>
        <audio
          src={attachmentUrl}
          controls
          className="w-full h-8 mt-1"
          preload="metadata"
        />
      </div>
    </div>
  );
}

export default AudioAttachment;
