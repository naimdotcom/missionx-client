import { useAppChannels, type Channel } from "@/api/services/channels";
import { useAuthStore } from "@/stores/auth-store";
import { useSearch } from "@tanstack/react-router";
import { Facebook, Instagram, Loader2, Radio } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { ChannelCard } from "./components/ChannelCard";
import { ConnectChannelDialog } from "./components/ConnectChannelDialog";
import { OAUTH_CHANNEL_NAME } from "./const";

export default function ChannelsPage() {
  const selectedApp = useAuthStore((s) => s.selectedApp);
  const appId = selectedApp?.id ?? "";
  const { success } = useSearch({ from: "/_private/channels" });

  const {
    data,
    isLoading,
    refetch: refetchChannels,
  } = useAppChannels({ appId });

  // OAuth popup callback — broadcasts result to opener and closes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("success")) return;

    try {
      const bc = new BroadcastChannel(OAUTH_CHANNEL_NAME);
      bc.postMessage({
        type: success ? "oauth_success" : "oauth_error",
        success: !!success,
      });
      bc.close();

      window.opener?.postMessage(
        { type: success ? "oauth_success" : "oauth_error", success: !!success },
        window.location.origin,
      );

      setTimeout(() => window.close(), 150);
    } catch {
      try {
        window.close();
      } catch {
        /* stay on page */
      }
    }
  }, [success]);

  const { facebookChannels, instagramChannels } = useMemo(() => {
    const channels = data?.channels ?? [];
    return {
      facebookChannels: channels.filter((c) => c.platform === "facebook"),
      instagramChannels: channels.filter((c) => c.platform === "instagram"),
    };
  }, [data?.channels]);

  const handleConnected = useCallback(() => {
    refetchChannels();
  }, [refetchChannels]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        <p className="text-sm">Loading channels…</p>
      </div>
    );
  }

  const totalChannels = (data?.channels ?? []).length;

  return (
    <div className="grid h-full grid-rows-[auto_1fr] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Radio className="size-4 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight">Channels</h1>
            <p className="text-xs text-muted-foreground">
              {totalChannels > 0
                ? `${totalChannels} channel${totalChannels !== 1 ? "s" : ""} connected`
                : "Connect your Facebook & Instagram channels"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 overflow-auto px-6 py-6">
        <ChannelSection
          platform="facebook"
          label="Facebook Pages"
          description="Receive and reply to messages from your Facebook Pages."
          icon={<Facebook className="size-4 text-[#1877F2]" />}
          iconBg="bg-[#1877F2]/10"
          accentColor="text-[#1877F2]"
          channels={facebookChannels}
          appId={appId}
          onConnected={handleConnected}
        />

        <ChannelSection
          platform="instagram"
          label="Instagram Accounts"
          description="Handle DMs from your Instagram Business accounts."
          icon={<Instagram className="size-4 text-[#E1306C]" />}
          iconBg="bg-[#E1306C]/10"
          accentColor="text-[#E1306C]"
          channels={instagramChannels}
          appId={appId}
          onConnected={handleConnected}
        />
      </div>
    </div>
  );
}

// ─── Per-platform section ─────────────────────────────────────────

interface ChannelSectionProps {
  platform: "facebook" | "instagram";
  label: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  accentColor: string;
  channels: Channel[];
  appId: string;
  onConnected: () => void;
}

function ChannelSection({
  platform,
  label,
  description,
  icon,
  iconBg,
  accentColor,
  channels,
  appId,
  onConnected,
}: ChannelSectionProps) {
  const urlType = platform === "facebook" ? "meta" : "instagram";

  return (
    <section className="space-y-3">
      {/* Section heading row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex size-7 shrink-0 items-center justify-center rounded-md ${iconBg}`}
          >
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold">{label}</h2>
              {channels.length > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${iconBg} ${accentColor}`}
                >
                  {channels.length}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>

        <ConnectChannelDialog
          type={urlType}
          appId={appId}
          onConnected={onConnected}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Channel grid or empty state */}
      {channels.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed py-10 text-center">
          <div
            className={`flex size-10 items-center justify-center rounded-full ${iconBg}`}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium">
              No{" "}
              {platform === "facebook"
                ? "Facebook pages"
                : "Instagram accounts"}{" "}
              connected
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Click "Connect Channel" to get started
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {channels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      )}
    </section>
  );
}
