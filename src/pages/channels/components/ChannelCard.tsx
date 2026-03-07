import type { Channel } from "@/api/services/channels";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteUrlChannelBtn } from "./DeleteDialog";

interface ChannelCardProps {
  channel: Channel;
}

export function ChannelCard({ channel }: ChannelCardProps) {
  const [syncing, setSyncing] = useState(false);

  const platform = channel.platform ?? "facebook";
  const isFacebook = platform === "facebook";
  const name = channel.account_name ?? "Unnamed Channel";
  const username = channel.instagram_username;
  const isActive = channel.is_subscribed;

  const handleSync = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 800));
    setSyncing(false);
    toast.success(`${name} synced successfully`);
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-colors hover:bg-muted/40">
      {/* Avatar */}
      <Avatar className="size-9 shrink-0">
        <AvatarImage src={channel.profile_pic_url ?? undefined} alt={name} />
        <AvatarFallback
          className={cn(
            "text-xs font-bold text-white",
            isFacebook
              ? "bg-[#1877F2]"
              : "bg-linear-to-br from-[#f09433] via-[#e6683c] to-[#bc1888]",
          )}
        >
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {username
            ? `@${username}`
            : isFacebook
              ? "Facebook Page"
              : "Instagram Account"}
        </p>
      </div>

      {/* Status */}
      <Badge
        variant="outline"
        className={cn(
          "shrink-0 gap-1 border-none px-1.5 text-[10px] font-semibold",
          isActive
            ? "bg-emerald-500/10 text-emerald-600"
            : "bg-rose-500/10 text-rose-500",
        )}
      >
        {isActive ? (
          <CheckCircle2 className="size-3" />
        ) : (
          <XCircle className="size-3" />
        )}
        {isActive ? "Active" : "Inactive"}
      </Badge>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          disabled={syncing}
          onClick={handleSync}
          title="Sync channel"
        >
          <RefreshCw className={cn("size-3.5", syncing && "animate-spin")} />
        </Button>
        <DeleteUrlChannelBtn channel={channel} />
      </div>
    </div>
  );
}
