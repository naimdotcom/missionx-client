import { ChannelPlatform, useChannelsList } from "@/api/services/channels";
import { Loader } from "@/components/ui/loader";
import { useAuthStore } from "@/stores/auth-store";
import { Radio } from "lucide-react";
import { ChannelCard } from "./components/ChannelCard";
import ChannelHead from "./components/ChannelHead";
import { ChannelIcon } from "./components/ChannelIcons";
import { ConnectChannelDialog } from "./components/ConnectChannelDialog";

export default function ChannelsPage() {
  return (
    <div className="grid h-full grid-rows-[auto_1fr] overflow-hidden">
      {/* Header */}
      <Header />

      {/* Content */}
      <div className="space-y-8 overflow-auto px-6 py-6">
        <ChannelSection
          platform="facebook"
          label="Facebook Pages"
          description="Receive and reply to messages from your Facebook Pages."
        />

        <ChannelSection
          platform="instagram"
          label="Instagram Accounts"
          description="Handle DMs from your Instagram Business accounts."
        />
      </div>
    </div>
  );
}

interface ChannelSectionProps {
  label: string;
  description: string;
  platform: ChannelPlatform;
}

function ChannelSection(props: ChannelSectionProps) {
  const selectedApp = useAuthStore((s) => s.selectedApp);
  const appId = selectedApp?.id ?? "";
  const channelsQuery = useChannelsList({
    app_id: selectedApp?.id,
    platform: props.platform,
  });
  const channels = channelsQuery.data?.accounts ?? [];
  const hasChannels = channels.length > 0;

  if (channelsQuery.isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader />
        <p className="text-sm">Loading channels...</p>
      </div>
    );
  }
  return (
    <section className="space-y-3">
      {/* Section heading row */}
      <div className="flex items-center ">
        <ChannelHead
          label={props.label}
          platform={props.platform}
          description={props.description}
        />
        <ConnectChannelDialog
          appId={appId}
          type={props.platform}
          refetchChannels={channelsQuery.refetch}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Channel grid or empty state */}
      {!hasChannels && (
        <div className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed py-10 text-center">
          <ChannelIcon platform={props.platform} />
          <div>
            <p className="text-sm font-medium">No {props.label} connected</p>
            <p className="text-xs text-muted-foreground">
              Click "Connect Channel" to get started
            </p>
          </div>
        </div>
      )}

      {hasChannels && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {channels.map((channel) => (
            <ChannelCard key={channel.channel_id} channel={channel} />
          ))}
        </div>
      )}
    </section>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between border-b bg-card px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
          <Radio className="size-4 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-semibold leading-tight">Channels</h1>
          <p className="text-xs text-muted-foreground">
            Connect your Facebook & Instagram channels
          </p>
        </div>
      </div>
    </div>
  );
}
