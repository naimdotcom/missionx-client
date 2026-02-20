import { useAppChannels } from "@/api/services/channels";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ConnectFirstChannel } from "@/pages/channels/components/ConnectFirstChannel";

import { useAuthStore } from "@/stores/auth-store";
import { useSearch } from "@tanstack/react-router";
import { LoaderIcon } from "lucide-react";
import { useEffect } from "react";
import { ChannelCard } from "./components/ChannelCard";
import { ConnectDialog } from "./components/ConnectDialog";
import { StatCard } from "./components/StatCard";
import { CHANNEL_STAT, OAUTH_CHANNEL_NAME } from "./const";

export default function ChannelsPage() {
  const selectedApp = useAuthStore((state) => state.selectedApp);
  const { data, isLoading } = useAppChannels(selectedApp?.id || "");
  const { success } = useSearch({ from: "/_private/channels" });

  // Handle OAuth popup callback — only runs when ?success param is in the URL
  useEffect(() => {
    // Only handle OAuth callback when the success param is explicitly present
    // (i.e., this page was loaded from a backend OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has("success")) return;

    try {
      // Use BroadcastChannel to reliably communicate with the parent window.
      // window.opener is lost during cross-origin OAuth flows (Facebook → backend → frontend),
      // so we cannot rely on window.opener.postMessage.
      const bc = new BroadcastChannel(OAUTH_CHANNEL_NAME);

      if (success === true) {
        bc.postMessage({ type: "oauth_success", success: true });
      } else {
        bc.postMessage({ type: "oauth_error", success: false });
      }

      bc.close();

      // Also try window.opener.postMessage as a fallback (works if opener is still available)
      if (window.opener && window.opener !== window) {
        window.opener.postMessage(
          {
            type: success ? "oauth_success" : "oauth_error",
            success: !!success,
          },
          window.location.origin,
        );
      }

      // Close this popup window
      setTimeout(() => {
        window.close();
      }, 150);
    } catch (error) {
      console.error("OAuth callback error:", error);
      try {
        window.close();
      } catch {
        // If we can't close, just stay on the page — it's the channels page anyway
      }
    }
  }, [success]);

  const channels = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <LoaderIcon
          role="status"
          aria-label="Loading"
          className={cn("size-4 animate-spin")}
        />
        Please wait while we fetch your channels...
      </div>
    );
  }

  if (channels.length === 0 && selectedApp?.id) {
    return (
      <div>
        <ConnectFirstChannel />;
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[auto_1fr] h-full gap-2 overflow-hidden">
      <div className="border-b px-4 md:px-6 py-1.5 shrink-0 flex items-center justify-between">
        <div className="flex flex-col ">
          <h1 className="text-lg">Channels</h1>
          <p className="text-muted-foreground">
            Manage and monitor your omnichannel presence.
          </p>
        </div>

        <ConnectDialog appId={selectedApp?.id || ""} />
      </div>

      <div className="px-4 py-2 flex flex-col h-full gap-4 overflow-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          {CHANNEL_STAT.map((stat, i) => (
            <StatCard
              key={i}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              description={stat.desc}
              iconColor={stat.color}
            />
          ))}
        </div>

        <Tabs>
          <TabsList>
            {["all", "facebook", "instagram"].map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="px-6 rounded-xl font-bold capitalize transition-all data-[state=active]:bg-background data-[state=active]:shadow-lg"
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 h-full overflow-y-auto pr-2 gap-6">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  style={{ animationDelay: "50ms" }}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                >
                  <ChannelCard channel={channel} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
