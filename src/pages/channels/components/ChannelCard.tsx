import type { Channel, UrlChannelType } from "@/api/services/channels";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { CHANNEL_CONFIG, ChannelIcon } from "./ChannelIcons";
import { DeleteUrlChannelBtn } from "./DeleteDialog";

interface ChannelCardProps {
  channel: Channel;
}

export function ChannelCard({ channel }: ChannelCardProps) {
  const selectedApp = useAuthStore((s) => s.selectedApp);
  const type: UrlChannelType =
    channel.platform === "facebook" ? "meta" : "instagram";
  const config = channel.platform ? CHANNEL_CONFIG[channel.platform] : null;

  // const disconnect = useMetaDisconnect(type);
  // const { refetch: syncChannel, isFetching: isSyncing } =
  //   useMetaSubscriptionStatus(channel.id);

  // const handleDisconnect = async () => {
  //   try {
  //     await disconnect.mutateAsync();
  //     toast.success(`${channel.account_name} disconnected`);
  //   } catch {
  //     toast.error("Failed to disconnect channel");
  //   }
  // };

  // const handleReconnect = async () => {
  //   try {
  //     const { channelsService } = await import("@/api/services/channels");
  //     const res = await channelsService.channelConnectUrl({
  //       type,
  //       appId: selectedApp?.id,
  //     });
  //     if (res.authorization_url) window.location.href = res.authorization_url;
  //   } catch {
  //     toast.error("Failed to get reconnect URL");
  //   }
  // };

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
          {config && (
            <p className={cn("text-xs font-medium mt-0.5", config.textColor)}>
              {config.label}
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
