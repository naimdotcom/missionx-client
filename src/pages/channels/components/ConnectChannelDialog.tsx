import {
  type Channel,
  type UrlChannelType,
  useChannelConnectUrl,
  useChannelSubscribeApp,
  useMetaAccounts,
} from "@/api/services/channels";
import { Badge } from "@/components/ui/badge";
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
import {
  CheckCircle2,
  ExternalLink,
  Facebook,
  Instagram,
  LinkIcon,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { OAUTH_CHANNEL_NAME } from "../const";

// ─── Config per platform ──────────────────────────────────────────

const PLATFORM_CONFIG = {
  meta: {
    icon: Facebook,
    label: "Facebook Pages",
    platform: "Facebook",
    headerBg: "bg-[#1877F2]",
    accent: "text-[#1877F2]",
    accentBg: "bg-[#1877F2]/10",
    rowHover: "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300",
    buttonBg: "bg-[#1877F2] hover:bg-[#1877F2]/90 text-white",
  },
  instagram: {
    icon: Instagram,
    label: "Instagram Accounts",
    platform: "Instagram",
    headerBg: "bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]",
    accent: "text-[#E1306C]",
    accentBg: "bg-[#E1306C]/10",
    rowHover: "hover:bg-pink-50 hover:text-pink-600 hover:border-pink-300",
    buttonBg:
      "bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] hover:opacity-90 text-white border-0",
  },
} as const;

// ─── Dialog component ─────────────────────────────────────────────

interface ConnectChannelDialogProps {
  type: UrlChannelType;
  appId: string;
  onConnected: () => void;
}

export function ConnectChannelDialog({
  type,
  appId,
  onConnected,
}: ConnectChannelDialogProps) {
  const config = PLATFORM_CONFIG[type];
  const Icon = config.icon;

  const [open, setOpen] = useState(false);

  // Only fetch accounts when dialog is open
  const accountsQuery = useMetaAccounts(type, open);
  const connectUrlQuery = useChannelConnectUrl({ type, appId });
  const subscribeMutation = useChannelSubscribeApp();

  const accounts = accountsQuery.data?.accounts ?? [];

  // Listen for OAuth popup success → refetch accounts
  const bcRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (!open) return;

    const bc = new BroadcastChannel(OAUTH_CHANNEL_NAME);
    bcRef.current = bc;

    bc.onmessage = (event) => {
      if (event.data?.type === "oauth_success") {
        accountsQuery.refetch();
        onConnected();
      }
    };

    return () => {
      bc.close();
      bcRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubscribe = async (channelId: string) => {
    if (!appId) {
      toast.error("Please select an app first");
      return;
    }
    try {
      await subscribeMutation.mutateAsync({
        channel_id: channelId,
        app_id: appId,
      });
      toast.success("Channel connected!");
      onConnected();
    } catch {
      toast.error("Failed to connect channel");
    }
  };

  const handleOAuthPopup = () => {
    const url = connectUrlQuery.data?.authorization_url;
    if (!url) {
      toast.error("Connect URL not available. Please try again.");
      return;
    }
    window.open(url, "_blank", "width=600,height=600");
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
        <div className={cn("px-5 py-4 text-white", config.headerBg)}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Icon className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-white">
                  {config.label}
                </DialogTitle>
                <DialogDescription className="text-sm text-white/80">
                  {accounts.length > 0
                    ? `${accounts.length} account${accounts.length !== 1 ? "s" : ""} found`
                    : "Connect your account to see available pages"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Account list */}
        <div className="flex flex-col">
          {accountsQuery.isPending && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Spinner className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading accounts…</p>
            </div>
          )}

          {accountsQuery.isError && (
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
                onClick={() => accountsQuery.refetch()}
              >
                <RefreshCw className="mr-2 size-3" /> Retry
              </Button>
            </div>
          )}

          {accountsQuery.isSuccess && accounts.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-16">
              <div className={cn("rounded-full p-3", config.accentBg)}>
                <LinkIcon className={cn("size-5", config.accent)} />
              </div>
              <p className="text-sm font-medium">No accounts found</p>
              <p className="max-w-[280px] text-center text-xs text-muted-foreground">
                Connect your {config.platform} account using the button below,
                then come back to link your pages.
              </p>
            </div>
          )}

          {accountsQuery.isSuccess && accounts.length > 0 && (
            <ScrollArea className="min-h-[340px] max-h-[340px]">
              <div className="divide-y">
                {accounts.map((account) => (
                  <AccountRow
                    key={account.id}
                    account={account}
                    appId={appId}
                    config={config}
                    isSubscribing={subscribeMutation.isPending}
                    onConnect={() => handleSubscribe(account.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer — OAuth connect button */}
        <div className="border-t bg-muted/30 px-4 py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {accounts.length > 0
                ? "Don't see your page? Reconnect below."
                : `Authorize ${config.platform} to see your accounts.`}
            </p>
            <Button
              size="sm"
              variant={accounts.length > 0 ? "outline" : "default"}
              className={cn(
                "w-full shrink-0 gap-2 sm:w-auto",
                accounts.length === 0 && config.buttonBg,
              )}
              disabled={connectUrlQuery.isPending || !appId}
              onClick={handleOAuthPopup}
            >
              {connectUrlQuery.isPending ? (
                <Spinner className="size-3" />
              ) : (
                <ExternalLink className="size-3" />
              )}
              {accounts.length > 0
                ? "Reconnect Account"
                : `Connect ${config.platform}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Account row ──────────────────────────────────────────────────

interface AccountRowProps {
  account: Channel;
  appId: string;
  config: (typeof PLATFORM_CONFIG)[UrlChannelType];
  isSubscribing: boolean;
  onConnect: () => void;
}

function AccountRow({
  account,
  appId,
  config,
  isSubscribing,
  onConnect,
}: AccountRowProps) {
  const Icon = config.icon;
  const name =
    account.account_name || account.instagram_username || "Unnamed Account";
  const isConnected = !!account.app_id && account.app_id === appId;

  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40">
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          config.accentBg,
          config.accent,
        )}
      >
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        {account.platform_page_id && (
          <span className="truncate text-[10px] font-mono text-muted-foreground">
            {account.platform_page_id}
          </span>
        )}
      </div>

      {isConnected ? (
        <Badge
          variant="secondary"
          className="shrink-0 gap-1.5 border-green-200 bg-green-50 text-green-700"
        >
          <CheckCircle2 className="size-3" />
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
            <Spinner className="size-3" />
          ) : (
            <LinkIcon className="size-3" />
          )}
          Connect
        </Button>
      )}
    </div>
  );
}
