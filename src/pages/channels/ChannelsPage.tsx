import { ChannelPlatform, useChannelsList } from "@/api/services/channels";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2, Radio } from "lucide-react";
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

  const channels =
    channelsQuery.data?.pages.flatMap((p) => p.accounts ?? []) ?? [];
  const total = channelsQuery.data?.pages[0]?.total ?? channels.length;
  const hasChannels = channels.length > 0;
  const isLoading = channelsQuery.isLoading;

  return (
    <section className="space-y-3">
      {/* Section heading */}
      <div className="flex items-center gap-2">
        <ChannelHead
          label={props.label}
          platform={props.platform}
          description={props.description}
        />
        {hasChannels && (
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            {channels.length}
            {channelsQuery.hasNextPage ? `+` : ""} / {total}
          </span>
        )}
        <ConnectChannelDialog
          appId={appId}
          type={props.platform}
          refetchChannels={channelsQuery.refetch}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !hasChannels && (
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

      {/* Channel list */}
      {hasChannels && (
        <div className="space-y-2">
          {channels.map((channel) => (
            <ChannelCard key={channel.channel_id} channel={channel} />
          ))}

          {/* Load more */}
          {channelsQuery.hasNextPage && (
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 text-xs"
              disabled={channelsQuery.isFetchingNextPage}
              onClick={() => channelsQuery.fetchNextPage()}
            >
              {channelsQuery.isFetchingNextPage ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Loading...
                </>
              ) : (
                `Load more (${total - channels.length} remaining)`
              )}
            </Button>
          )}
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
            Connect your Facebook &amp; Instagram channels
          </p>
        </div>
      </div>
    </div>
  );
}
