import {
  type MetaAccountChannel,
  type UrlChannelType,
  useChannelConnectUrl,
  useChannelSubscribeApp,
  useMetaAccounts,
} from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useAuthStore } from "@/stores/auth-store";
import {
  CheckCircle2,
  ExternalLink,
  LinkIcon,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { CHANNEL_TYPE_CONFIG } from "./const";

// ─── Channel constants ────────────────────────────────────────────

// ─── Main component ───────────────────────────────────────────────

type ChannelListDialogProps = {
  type: UrlChannelType;
};

function ChannelListDialog({ type }: ChannelListDialogProps) {
  const config = CHANNEL_TYPE_CONFIG[type];
  const Icon = config.icon;

  const selectedApp = useAuthStore((state) => state.selectedApp);
  const appId = selectedApp?.id || "";

  const channelsQuery = useMetaAccounts(type);
  const channelConnectUrl = useChannelConnectUrl({ type, appId });
  const subscribeMutation = useChannelSubscribeApp();

  const popupRef = useRef<Window | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const accounts = channelsQuery.data?.accounts || [];

  // Poll the popup for the success redirect
  const startPopupPolling = useCallback(() => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(() => {
      try {
        if (!popupRef.current || popupRef.current.closed) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          popupRef.current = null;
          return;
        }

        const popupUrl = popupRef.current.location.href;
        if (popupUrl && popupUrl.includes("success=true")) {
          popupRef.current.close();
          popupRef.current = null;
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          toast.success("Channel connected successfully!");
          channelsQuery.refetch();
        }
      } catch {
        // Cross-origin — popup is still on external domain, keep polling
      }
    }, 500);
  }, [channelsQuery]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };
  }, []);

  const handleOpenConnectPopup = () => {
    const url = channelConnectUrl.data?.authorization_url;
    if (!url) {
      toast.error("Connect URL not available. Please try again.");
      return;
    }

    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    popupRef.current = window.open(
      url,
      "channel_connect",
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`,
    );

    startPopupPolling();
  };

  const handleSubscribe = (channel: MetaAccountChannel) => {
    if (!channel.id || !appId) {
      toast.error("Missing channel or app information.");
      return;
    }

    subscribeMutation.mutate(
      { channel_id: channel.id, app_id: appId },
      {
        onSuccess: () => {
          toast.success(
            `${channel.account_name || channel.instagram_username || "Channel"} connected to your app!`,
          );
          channelsQuery.refetch();
        },
        onError: () => {
          toast.error("Failed to connect channel. Please try again.");
        },
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className={cn(
            config.cardHoverBorder,
            config.cardHoverBg,
            "group cursor-pointer border transition-all hover:shadow-md active:scale-95",
          )}
        >
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
            <div
              className={cn(
                config.iconIdleBg,
                config.iconIdleText,
                config.iconHoverBg,
                "transition-colors group-hover:text-white",
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="space-y-1 text-start">
              <CardTitle className="text-sm font-medium md:text-base">
                {config.label}
              </CardTitle>
              <CardDescription className="text-xs">
                {config.description}
              </CardDescription>
            </div>
            <div className="ml-auto shrink-0 h-8 w-8 md:h-9 md:w-9 flex items-center justify-center">
              {channelsQuery.isPending && <Spinner />}
              {channelsQuery.isSuccess && (
                <Zap className="h-4 w-4 text-yellow-500" />
              )}
            </div>
          </CardHeader>
        </Card>
      </DialogTrigger>

      <DialogContent className="w-[95vw] sm:max-w-[560px] p-0 gap-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <div className={cn("px-6 py-5 text-white", config.headerBg)}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-white">
                  {config.listLabel}
                </DialogTitle>
                <DialogDescription className="text-sm text-white/80">
                  {accounts.length > 0
                    ? `${accounts.length} account${accounts.length > 1 ? "s" : ""} found — select which to connect`
                    : "Connect your account to get started"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Channel List */}
        <div className="flex flex-col">
          {channelsQuery.isPending && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Spinner className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Loading accounts...
              </p>
            </div>
          )}

          {channelsQuery.isError && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 px-6">
              <div className="rounded-full bg-destructive/10 p-3">
                <RefreshCw className="h-5 w-5 text-destructive" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Failed to load accounts. Please try again.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => channelsQuery.refetch()}
              >
                <RefreshCw className="mr-2 h-3 w-3" />
                Retry
              </Button>
            </div>
          )}

          {channelsQuery.isSuccess && accounts.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 px-6">
              <div className={cn("rounded-full p-3", config.emptyIconBg)}>
                <LinkIcon className={cn("h-5 w-5", config.emptyIconText)} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">No accounts found</p>
                <p className="text-xs text-muted-foreground max-w-[280px]">
                  Connect your {config.platformLabel} account first using the
                  button below, then come back to link your pages.
                </p>
              </div>
            </div>
          )}

          {channelsQuery.isSuccess && accounts.length > 0 && (
            <ScrollArea className="max-h-[360px]">
              <div className="divide-y">
                {accounts.map((account) => (
                  <ChannelAccountRow
                    key={account.id}
                    account={account}
                    config={config}
                    appId={appId}
                    isSubscribing={subscribeMutation.isPending}
                    onConnect={() => handleSubscribe(account)}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer — Connect / Refresh button */}
        <div className="border-t bg-muted/30 px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {accounts.length > 0
                ? "Don't see your page? Reconnect below."
                : `Authorize ${config.platformLabel} to see your accounts.`}
            </p>
            <Button
              size="sm"
              variant={accounts.length > 0 ? "outline" : "default"}
              className={cn(
                "shrink-0 gap-2",
                accounts.length === 0 && config.buttonActiveBg,
              )}
              disabled={channelConnectUrl.isPending || !appId}
              onClick={handleOpenConnectPopup}
            >
              {channelConnectUrl.isPending ? (
                <Spinner className="h-3 w-3" />
              ) : (
                <ExternalLink className="h-3 w-3" />
              )}
              {accounts.length > 0
                ? "Reconnect Account"
                : `Connect ${config.platformLabel}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Individual account row ───────────────────────────────────────

type ChannelAccountRowProps = {
  account: MetaAccountChannel;
  config: (typeof CHANNEL_TYPE_CONFIG)[UrlChannelType];
  appId: string;
  isSubscribing: boolean;
  onConnect: () => void;
};

function ChannelAccountRow({
  account,
  config,
  appId,
  isSubscribing,
  onConnect,
}: ChannelAccountRowProps) {
  const Icon = config.icon;
  const name =
    account.account_name || account.instagram_username || "Unnamed Account";
  const isAlreadyConnected = !!account.app_id && account.app_id === appId;

  return (
    <div className="flex items-center gap-3 px-6 py-3 hover:bg-muted/40 transition-colors">
      {/* Icon */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          config.iconRowBg,
          config.iconRowText,
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {account.platform_page_id && (
            <span className="text-[11px] text-muted-foreground font-mono truncate">
              ID: {account.platform_page_id}
            </span>
          )}
          {account.is_verified && (
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 text-blue-600 border-blue-200"
            >
              Verified
            </Badge>
          )}
        </div>
      </div>

      {/* Action */}
      {isAlreadyConnected ? (
        <Badge
          variant="secondary"
          className="gap-1.5 bg-green-50 text-green-700 border-green-200 shrink-0"
        >
          <CheckCircle2 className="h-3 w-3" />
          Connected
        </Badge>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className={cn(
            "shrink-0 gap-1.5 text-xs font-semibold",
            config.rowHover,
          )}
          disabled={isSubscribing || !appId}
          onClick={onConnect}
        >
          {isSubscribing ? (
            <Spinner className="h-3 w-3" />
          ) : (
            <LinkIcon className="h-3 w-3" />
          )}
          Connect
        </Button>
      )}
    </div>
  );
}

export default ChannelListDialog;
