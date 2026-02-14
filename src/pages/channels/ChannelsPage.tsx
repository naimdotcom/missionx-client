import { useChannels, type Channel } from "@/api/services/channels";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/auth-store";
import {
  FacebookIcon,
  InstagramIcon,
  MessageSquare,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";
import { ChannelCard } from "./components/ChannelCard";
import { ChannelIcon, getChannelColor } from "./components/ChannelIcons";
import { ConnectDialog } from "./components/ConnectDialog";
import { StatCard } from "./components/StatCard";

export default function ChannelsPage() {
  const selectedApp = useAuthStore((state) => state.selectedApp);
  const { data, isLoading } = useChannels(selectedApp?.id || "");
  const [activeTab, setActiveTab] = useState("all");
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedChannelType, setSelectedChannelType] = useState<
    "facebook" | "instagram" | null
  >(null);

  // Ensure channels is always an array
  const channels = Array.isArray(data) ? data : [];

  const filteredChannels = channels.filter((channel: Channel) => {
    const matchesTab = activeTab === "all" || channel.type === activeTab;
    return matchesTab;
  });

  const stats = [
    {
      icon: FacebookIcon,
      title: "Facebook Pages",
      desc: "Connected pages",
      color: getChannelColor("facebook"),
      value: channels.filter((c: Channel) => c.type === "facebook").length,
    },
    {
      icon: InstagramIcon,
      title: "Instagram Accounts",
      value: channels.filter((c: Channel) => c.type === "instagram").length,
      desc: "Connected accounts",
      color: getChannelColor("instagram"),
    },
    {
      icon: MessageSquare,
      title: "Total Messages",
      value: channels
        .reduce((sum: number, c: Channel) => sum + (c.messageCount || 0), 0)
        .toLocaleString(),
      desc: "All time messages",
      color: "text-primary",
    },
    {
      icon: Users,
      title: "Total Reach",
      value: `${(channels.reduce((sum: number, c: Channel) => sum + (c.followers || 0), 0) / 1000).toFixed(1)}K`,
      desc: "Total followers",
      color: "text-primary",
    },
  ];

  const openConnectDialog = (type: "facebook" | "instagram") => {
    setSelectedChannelType(type);
    setConnectDialogOpen(true);
  };

  return (
    <div className="grid grid-rows-[auto_1fr] h-full gap-2 overflow-hidden">
      <div className="border-b px-4 md:px-6 py-1.5 shrink-0 flex items-center justify-between">
        <div className="flex flex-col ">
          <h1 className="text-lg">Channels</h1>
          <p className="text-muted-foreground">
            Manage and monitor your omnichannel presence.
          </p>
        </div>

        <AddChannelButton onOpenConnectDialog={openConnectDialog} />
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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
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

          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">Loading channels...</div>
              </div>
            ) : filteredChannels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 h-full overflow-y-auto pr-2 gap-6">
                {filteredChannels.map((channel) => (
                  <div
                    key={channel.id}
                    style={{ animationDelay: "50ms" }}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                  >
                    <ChannelCard channel={channel} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in duration-700">
                <div className="w-24 h-24 rounded-full bg-muted/40 flex items-center justify-center relative">
                  <Search className="w-10 h-10 text-muted-foreground/40" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary/20 animate-ping" />
                </div>
                <div className="max-w-xs space-y-2">
                  <h3 className="text-xl font-black tracking-tight">
                    No channels discovered
                  </h3>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ConnectDialog
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        channelType={selectedChannelType}
        appId={selectedApp?.id || ""}
      />
    </div>
  );
}

type AddChannelButtonProps = {
  onOpenConnectDialog: (type: "facebook" | "instagram") => void;
};
function AddChannelButton({ onOpenConnectDialog }: AddChannelButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"secondary"}>
          <Plus className="size-4" />
          Add New Channel
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onOpenConnectDialog("facebook")}
          className="flex items-center gap-2"
        >
          <ChannelIcon type="facebook" variant="boxed" />
          <span className="font-bold">Facebook Page</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onOpenConnectDialog("instagram")}
          className="flex items-center gap-2"
        >
          <ChannelIcon type="instagram" variant="boxed" />
          <span className="font-bold">Instagram Account</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
