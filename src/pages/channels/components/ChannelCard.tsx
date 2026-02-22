import type { Channel } from "@/api/services/channels";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { BadgeCheck, Calendar, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CHANNEL_CONFIG, ChannelIcon } from "./ChannelIcons";
import { DeleteUrlChannelBtn } from "./DeleteDialog";

interface ChannelCardProps {
  channel: Channel;
}

export function ChannelCard({ channel }: ChannelCardProps) {
  const [syncing, setSyncing] = useState(false);
  const platform = channel.platform ?? "facebook";
  const config = CHANNEL_CONFIG[platform];

  const handleSync = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 800));
    setSyncing(false);
    toast.success("Channel synced successfully");
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <ChannelIcon variant="boxed" type={platform} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {channel.account_name ?? "Unnamed Channel"}
            </p>
            {channel.instagram_username ? (
              <p className="truncate text-xs text-muted-foreground">
                @{channel.instagram_username}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">{config.label}</p>
            )}
          </div>

          {/* Status badge */}
          <StatusBadge
            className="shrink-0 border-none"
            status={channel.is_active ? "active" : "expired"}
          />
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t pt-3 text-xs text-muted-foreground">
          {channel.created_at && (
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {format(new Date(channel.created_at), "MMM d, yyyy")}
            </span>
          )}
          {channel.is_verified && (
            <StatusBadge
              showDot={false}
              status="verified"
              className="border-none"
            >
              <BadgeCheck className="size-3" />
              Verified
            </StatusBadge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 text-xs"
            disabled={syncing}
            onClick={handleSync}
          >
            <RefreshCw className={cn("size-3.5", syncing && "animate-spin")} />
            {syncing ? "Syncing…" : "Sync"}
          </Button>
          <DeleteUrlChannelBtn channel={channel} />
        </div>
      </div>
    </div>
  );
}
