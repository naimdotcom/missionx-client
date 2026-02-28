import { Play } from "lucide-react";
import { useState } from "react";

function VideoAttachment({ attachmentUrl }: { attachmentUrl: string }) {
  const [showPlayer, setShowPlayer] = useState(false);

  if (showPlayer) {
    return (
      <video
        src={attachmentUrl}
        controls
        className="max-w-[280px] max-h-[300px] rounded-lg"
        autoPlay
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <button
      onClick={() => setShowPlayer(true)}
      className="relative w-[280px] h-40 rounded-lg bg-muted flex items-center justify-center group"
    >
      <div className="absolute inset-0 rounded-lg bg-black/20 group-hover:bg-black/30 transition-colors" />
      <div className="relative z-10 h-12 w-12 rounded-full bg-background/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
        <Play className="h-5 w-5 text-foreground ml-0.5" />
      </div>
      <span className="absolute bottom-2 left-2 text-xs text-white/80 bg-black/40 px-2 py-0.5 rounded">
        {"Video"}
      </span>
    </button>
  );
}
export default VideoAttachment;
