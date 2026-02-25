import {
  Channel,
  ChannelPlatform,
  useChannelConnect,
  useChannelsList,
  useChannelSubscribe,
  useChannelUnsubscribe,
} from "@/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { ExternalLink, LinkIcon, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ChannelIcon } from "./ChannelIcons";
import { useFacebookSdk } from "./useFacebookSdk";

interface ConnectChannelDialogProps {
  type: ChannelPlatform;
  appId: string;
}

export function ConnectChannelDialog({
  type,
  appId,
}: ConnectChannelDialogProps) {
  const [open, setOpen] = useState(false);
  const chanelLoginMutation = useChannelConnect();
  const channelsQuery = useChannelsList({ platform: type });

  const channels = channelsQuery.data?.accounts ?? [];

  useFacebookSdk();

  const handleConnectFacebook = () => {
    // This automatically opens the Facebook-managed popup!
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          chanelLoginMutation.mutate(
            {
              platform: "facebook",
              access_token: accessToken,
            },
            // { onSuccess: () => accountsQuery.refetch() },
          );
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      {
        scope:
          "pages_show_list,pages_messaging,instagram_basic,instagram_manage_messages",
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="default"
          className="gap-1.5"
          disabled={!appId}
        >
          <Plus className="size-3.5" />
          Connect Channel
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-[540px] gap-0 overflow-hidden rounded-2xl p-0">
        {/* Colored header */}

        <DialogHeader
          className={cn(
            "px-5 py-4",
            type === "facebook" && "bg-[#1877F2]",
            type === "instagram" &&
              "bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <ChannelIcon shape="square" platform={type} />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white">
                {type}
              </DialogTitle>
              <DialogDescription className="text-sm text-white/80">
                {channels.length > 0
                  ? `${channels.length} account${channels.length !== 1 ? "s" : ""} found`
                  : "Connect your account to see available pages"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Account list */}
        <div className="flex flex-col">
          {channelsQuery.isPending && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Spinner className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading accounts…</p>
            </div>
          )}

          {channelsQuery.isError && (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
              <div className="rounded-full bg-destructive/10 p-3">
                <RefreshCw className="size-5 text-destructive" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Failed to load accounts.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => channelsQuery.refetch()}
              >
                <RefreshCw className="mr-2 size-3" /> Retry
              </Button>
            </div>
          )}

          {channelsQuery.isSuccess && channels.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-16">
              <div className={cn("rounded-full p-3")}>
                <LinkIcon className={cn("size-5")} />
              </div>
              <p className="text-sm font-medium">No accounts found</p>
              <p className="max-w-[280px] text-center text-xs text-muted-foreground">
                Connect your {type} account using the button below, then come
                back to link your pages.
              </p>
            </div>
          )}

          {channelsQuery.isSuccess && channels.length > 0 && (
            <ScrollArea className="min-h-[340px] max-h-[340px]">
              <div className="divide-y">
                {channels.map((channel) => (
                  <AccountRow
                    appId={appId}
                    channel={channel}
                    key={channel.channel_id}
                    refetchChannels={channelsQuery.refetch}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer — OAuth connect button */}
        <div className="border-t bg-muted/30 px-4 py-3">
          <div className="flex gap-2 items-center">
            <p className="text-xs text-muted-foreground flex-1">
              Don't see your page? Reconnect below.
            </p>

            <Button
              size="sm"
              onClick={handleConnectFacebook}
              disabled={chanelLoginMutation.isPending}
              variant="default"
            >
              {chanelLoginMutation.isPending ? (
                <Spinner className="size-3" />
              ) : (
                <ExternalLink className="size-3" />
              )}
              {channels.length > 0 ? "Reconnect Account" : `Connect ${type}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Account row ──────────────────────────────────────────────────

interface AccountRowProps {
  appId: string;
  channel: Channel;
  refetchChannels?: () => void;
}

function AccountRow({ channel, appId, refetchChannels }: AccountRowProps) {
  const isConnected = channel.is_subscribed;
  const subscribeMutation = useChannelSubscribe();
  const unSubscribeMutation = useChannelUnsubscribe();

  const handleSubscribe = () => {
    subscribeMutation.mutate(
      { platform_page_id: channel.platform_page_id, app_id: appId },
      {
        onSuccess: (data) => {
          if (data.subscribed) {
            refetchChannels?.();
            toast.success("Channel connected successfully");
          }
        },
      },
    );
  };

  const handleUnsubscribe = () => {
    if (!channel.channel_id) return;

    unSubscribeMutation.mutate(
      { channel_id: channel.channel_id },
      {
        onSuccess: () => {
          refetchChannels?.();
          toast.success("Channel disconnected successfully");
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40">
      <div>
        <Avatar>
          <AvatarImage src={channel.profile_pic_url} alt="channel_img" />
          <AvatarFallback>
            {channel.account_name?.split(" ")[0]?.charAt(0).toUpperCase() ||
              "U"}
            {channel.account_name?.split(" ")[1]?.charAt(0).toUpperCase() ||
              "U"}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="min-w-0 flex flex-col gap-0.5 flex-1">
        <p className="truncate text-sm font-medium">{channel.account_name}</p>
        {channel.platform_page_id && (
          <span className="truncate text-[10px] font-mono text-muted-foreground">
            {channel.platform_page_id}
          </span>
        )}
      </div>

      {!isConnected && (
        <Button
          size="sm"
          variant="secondary"
          onClick={handleSubscribe}
          disabled={subscribeMutation.isPending}
        >
          {subscribeMutation.isPending && <Spinner className="size-3" />}
          {!subscribeMutation.isPending && <LinkIcon className="size-3" />}
          Connect
        </Button>
      )}

      {isConnected && (
        <Button
          size="sm"
          variant="destructive"
          onClick={handleUnsubscribe}
          disabled={unSubscribeMutation.isPending}
        >
          {unSubscribeMutation.isPending && <Spinner className="size-3" />}
          {!unSubscribeMutation.isPending && <Trash2 className="size-3" />}
          {unSubscribeMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
      )}
    </div>
  );
}
