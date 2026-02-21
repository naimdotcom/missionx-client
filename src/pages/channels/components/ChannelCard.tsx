import type { Channel } from "@/api/services/channels";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { BadgeCheck, RefreshCw } from "lucide-react";
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
    await new Promise((r) => setTimeout(r, 800)); // placeholder until sync API exists
    setSyncing(false);
    toast.success("Channel synced successfully");
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Platform color accent strip */}
      <div
        className={cn(
          "h-1 w-full",
          platform === "facebook"
            ? "bg-[#1877F2]"
            : "bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888]",
        )}
      />

      <div className="flex flex-col gap-4 p-4">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <ChannelIcon
            variant="boxed"
            type={platform}
            className="mt-0.5 rounded-xl p-2.5 transition-transform duration-300 group-hover:scale-105"
            iconClassName="size-5"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-snug">
              {channel.account_name ?? "Unnamed Channel"}
            </p>
            {channel.instagram_username && (
              <p className="truncate text-xs text-muted-foreground">
                @{channel.instagram_username}
              </p>
            )}
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  channel.is_active
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-destructive/10 text-destructive",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    channel.is_active ? "bg-green-500" : "bg-destructive",
                  )}
                />
                {channel.is_active ? "Active" : "Expired"}
              </span>
              {channel.is_verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                  <BadgeCheck className="size-2.5" />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Meta info */}
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-[11px] space-y-1",
            config.bgColor.replace("/10", "/5"),
          )}
        >
          {channel.platform_page_id && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Page ID</span>
              <span className="font-mono font-medium text-foreground/80 truncate max-w-[140px]">
                {channel.platform_page_id}
              </span>
            </div>
          )}
          {channel.created_at && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Connected</span>
              <span className="font-medium text-foreground/80">
                {format(new Date(channel.created_at), "MMM d, yyyy")}
              </span>
            </div>
          )}
          {channel.granted_permissions !== undefined && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Permissions</span>
              <span
                className={cn(
                  "font-semibold",
                  channel.granted_permissions
                    ? "text-green-600"
                    : "text-destructive",
                )}
              >
                {channel.granted_permissions ? "Granted" : "Missing"}
              </span>
            </div>
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
