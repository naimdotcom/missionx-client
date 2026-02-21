import type { Channel } from "@/api/services/channels";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ChannelIcon } from "./ChannelIcons";
import { DeleteUrlChannelBtn } from "./DeleteDialog";

interface ChannelCardProps {
  channel: Channel;
}

export function ChannelCard({ channel }: ChannelCardProps) {
  const handleSync = async () => {
    try {
      // await syncChannel();
      toast.success("Channel synced");
    } catch {
      toast.error("Sync failed");
    }
  };

  return (
    <div className="group relative rounded-2xl border bg-card p-4 flex flex-col gap-4 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3">
        {channel.platform && (
          <ChannelIcon
            variant="boxed"
            type={channel.platform}
            className="p-2.5 rounded-xl group-hover:scale-105 transition-transform duration-300"
            iconClassName="size-5"
          />
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate leading-tight">
            {channel.account_name}
          </p>
          {channel.instagram_username && (
            <p className="text-xs text-muted-foreground truncate">
              @{channel.instagram_username}
            </p>
          )}
        </div>

        <span
          className={cn(
            "shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full",
            channel.is_active
              ? "bg-green-500/10 text-green-600 dark:text-green-400"
              : "bg-destructive/10 text-destructive",
          )}
        >
          {channel.is_active ? "Active" : "Expired"}
        </span>
      </div>

      <div className="h-px bg-border" />

      {/* Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <ActionBtn label="Sync" onClick={handleSync}>
            <RefreshCw className="size-4" />
          </ActionBtn>

          {/* {channel.is_active ? (
            <ActionBtn
              label="Disconnect"
              onClick={handleDisconnect}
              loading={disconnect.isPending}
            >
              <Unplug className="size-4" />
            </ActionBtn>
          ) : (
            <ActionBtn label="Reconnect" onClick={handleReconnect}>
              <PlugZap className="size-4" />
            </ActionBtn>
          )} */}
        </div>

        <DeleteUrlChannelBtn channel={channel} />
      </div>
    </div>
  );
}

function ActionBtn({
  label,
  children,
  onClick,
  loading,
}: {
  label: string;
  loading?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  type?: "sync" | "disconnect" | "reconnect";
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          onClick={onClick}
          disabled={loading}
          className="size-9 rounded-xl"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
