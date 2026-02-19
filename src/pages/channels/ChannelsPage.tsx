import { useAppChannels } from "@/api/services/channels";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ConnectFirstChannel } from "@/pages/channels/components/ConnectFirstChannel";
import { useAuthStore } from "@/stores/auth-store";
import { useSearch } from "@tanstack/react-router";
import {
  CheckCircle2,
  FacebookIcon,
  InstagramIcon,
  LoaderIcon,
  MessageSquare,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { ChannelCard } from "./components/ChannelCard";
import { getChannelColor } from "./components/ChannelIcons";
import { ConnectDialog } from "./components/ConnectDialog";
import { StatCard } from "./components/StatCard";

// Minimal screen rendered inside the OAuth popup before it self-closes.
function PopupSuccessScreen() {
  useEffect(() => {
    // Signal the opener and close as soon as this component mounts.
    if (window.opener) {
      (
        window.opener as Window & { __channelConnectSuccess?: boolean }
      ).__channelConnectSuccess = true;
    }
    window.close();
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-7 w-7 text-green-600" />
      </div>
      <div className="text-center">
        <p className="text-base font-semibold">Connected!</p>
        <p className="text-sm text-muted-foreground">Closing window…</p>
      </div>
    </div>
  );
}

export default function ChannelsPage() {
  const selectedApp = useAuthStore((state) => state.selectedApp);
  const { data, isLoading, refetch } = useAppChannels(selectedApp?.id || "");
  const { success } = useSearch({ from: "/_private/channels" });

  // Detect popup context synchronously — render minimal screen, skip full app.
  const isPopup = typeof window !== "undefined" && !!window.opener;

  useEffect(() => {
    if (!success || isPopup) return;
    // Main window received success=true (e.g. same-tab redirect) — just refetch.
    refetch();
  }, [success, isPopup, refetch]);

  // If we're inside the OAuth popup, skip the full app entirely.
  if (isPopup && success) return <PopupSuccessScreen />;

  // Ensure channels is always an array
  const channels = Array.isArray(data) ? data : [];

  const stats = [
    {
      icon: FacebookIcon,
      title: "Facebook Pages",
      desc: "Connected pages",
      color: getChannelColor("facebook"),
      value: channels.filter((c: any) => c.type === "facebook").length,
    },
    {
      icon: InstagramIcon,
      title: "Instagram Accounts",
      value: channels.filter((c: any) => c.type === "instagram").length,
      desc: "Connected accounts",
      color: getChannelColor("instagram"),
    },
    {
      icon: MessageSquare,
      title: "Total Messages",
      value: channels
        .reduce((sum: number, c: any) => sum + (c.messageCount || 0), 0)
        .toLocaleString(),
      desc: "All time messages",
      color: "text-primary",
    },
    {
      icon: Users,
      title: "Total Reach",
      value: `${(channels.reduce((sum: number, c: any) => sum + (c.followers || 0), 0) / 1000).toFixed(1)}K`,
      desc: "Total followers",
      color: "text-primary",
    },
  ];

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
          {stats.map((stat, i) => (
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
