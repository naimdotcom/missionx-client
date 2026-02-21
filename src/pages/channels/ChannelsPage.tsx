import { useAppChannels, type Channel } from "@/api/services/channels";
import { useAuthStore } from "@/stores/auth-store";
import { useSearch } from "@tanstack/react-router";
import { Facebook, Instagram, Loader2 } from "lucide-react";
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

  return (
    <div className="grid h-full grid-rows-[auto_1fr] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-3">
        <div>
          <h1 className="text-lg font-semibold">Channels</h1>
          <p className="text-sm text-muted-foreground">
            Connect and manage your Facebook & Instagram channels.
          </p>
        </div>
      </div>

      {/* Content — two platform sections */}
      <div className="overflow-auto px-6 py-6 space-y-8">
        <ChannelSection
          platform="facebook"
          label="Facebook Pages"
          description="Connect your Facebook Pages to receive and reply to messages."
          icon={<Facebook className="size-5 text-[#1877F2]" />}
          iconBg="bg-[#1877F2]/10"
          channels={facebookChannels}
          appId={appId}
          onConnected={handleConnected}
        />

        <ChannelSection
          platform="instagram"
          label="Instagram Accounts"
          description="Connect your Instagram Business accounts for DMs and comments."
          icon={<Instagram className="size-5 text-[#E1306C]" />}
          iconBg="bg-[#E1306C]/10"
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
  channels,
  appId,
  onConnected,
}: ChannelSectionProps) {
  const urlType = platform === "facebook" ? "meta" : "instagram";

  return (
    <section className="rounded-xl border bg-card">
      {/* Section header */}
      <div className="flex flex-col gap-4 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
          >
            {icon}
          </div>
          <div>
            <h2 className="text-sm font-semibold">{label}</h2>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>

        <ConnectChannelDialog
          type={urlType}
          appId={appId}
          onConnected={onConnected}
        />
      </div>

      {/* Channel list or empty state */}
      {channels.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <div
            className={`flex size-12 items-center justify-center rounded-full ${iconBg}`}
          >
            {icon}
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            No{" "}
            {platform === "facebook" ? "Facebook pages" : "Instagram accounts"}{" "}
            connected yet
          </p>
          <p className="text-xs text-muted-foreground/70">
            Click "Connect Channel" above to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {channels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      )}
    </section>
  );
}
