import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FacebookIcon,
  InstagramIcon,
  MessageSquare,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ChannelCard } from "./components/ChannelCard";
import { ChannelIcon, getChannelColor } from "./components/ChannelIcons";
import { ConfigureDialog } from "./components/ConfigureDialog";
import { ConnectDialog } from "./components/ConnectDialog";
import { DeleteDialog } from "./components/DeleteDialog";
import { StatCard } from "./components/StatCard";
import { Channel } from "./types";

const mockChannels: Channel[] = [
  {
    id: "1",
    type: "facebook",
    name: "MissionX Official",
    pageId: "fb-123456",
    status: "connected",
    lastSync: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    messageCount: 1247,
    followers: 15420,
    growth: 12.4,
    autoReply: true,
  },
  {
    id: "2",
    type: "instagram",
    name: "MissionX Store",
    pageId: "ig-789012",
    status: "connected",
    lastSync: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    messageCount: 892,
    followers: 28350,
    growth: 18.7,
    autoReply: false,
  },
  {
    id: "3",
    type: "facebook",
    name: "MissionX Support",
    pageId: "fb-345678",
    status: "disconnected",
    messageCount: 0,
    followers: 0,
    growth: 0,
    autoReply: false,
  },
];

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [activeTab, setActiveTab] = useState("all");
  const [configureDialogOpen, setConfigureDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedChannelType, setSelectedChannelType] = useState<
    "facebook" | "instagram" | null
  >(null);
  const [channelToConfigure, setChannelToConfigure] = useState<Channel | null>(
    null,
  );
  const [channelToDelete, setChannelToDelete] = useState<Channel | null>(null);

  const filteredChannels = channels.filter((channel) => {
    const matchesSearch = channel.name.toLowerCase();
    const matchesTab = activeTab === "all" || channel.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = [
    {
      icon: FacebookIcon,
      title: "Facebook Pages",
      desc: "Connected pages",
      color: getChannelColor("facebook"),
      value: channels.filter((c) => c.type === "facebook").length,
    },
    {
      icon: InstagramIcon,
      title: "Instagram Accounts",
      value: channels.filter((c) => c.type === "instagram").length,
      desc: "Connected accounts",
      color: getChannelColor("instagram"),
    },
    {
      icon: MessageSquare,
      title: "Total Messages",
      value: channels
        .reduce((sum, c) => sum + c.messageCount, 0)
        .toLocaleString(),
      desc: "All time messages",
      color: "text-primary",
    },
    {
      icon: Users,
      title: "Total Reach",
      value: `${(channels.reduce((sum, c) => sum + c.followers, 0) / 1000).toFixed(1)}K`,
      desc: "Total followers",
      color: "text-primary",
    },
  ];

  const handleConfigure = (channel: Channel) => {
    setChannelToConfigure(channel);
    setConfigureDialogOpen(true);
  };

  const handleDisconnect = (channel: Channel) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channel.id ? { ...c, status: "disconnected" } : c,
      ),
    );
    toast.success(`${channel.name} has been disconnected`);
  };

  const handleDelete = (channel: Channel) => {
    setChannelToDelete(channel);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = (channel: Channel) => {
    setChannels((prev) => prev.filter((c) => c.id !== channel.id));
    toast.success(`${channel.name} has been deleted`);
  };

  const handleReconnect = (channel: Channel) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channel.id
          ? {
              ...c,
              status: "connected",
              lastSync: new Date().toISOString(),
              messageCount: 1247,
              followers: 15420,
              growth: 12.4,
            }
          : c,
      ),
    );
  };

  const handleRefresh = (channel: Channel) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channel.id ? { ...c, lastSync: new Date().toISOString() } : c,
      ),
    );
  };

  const openConnectDialog = (type: "facebook" | "instagram") => {
    setSelectedChannelType(type);
    setConnectDialogOpen(true);
  };

  const handleConnect = (name: string, pageId: string) => {
    if (selectedChannelType) {
      const newChannel: Channel = {
        id: Date.now().toString(),
        type: selectedChannelType,
        name: name,
        pageId: pageId,
        status: "connected",
        lastSync: new Date().toISOString(),
        messageCount: 0,
        followers: 0,
        growth: 0,
        autoReply: false,
      };
      setChannels((prev) => [...prev, newChannel]);
      toast.success(`${name} connected successfully`);
    }
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
            {filteredChannels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 h-full overflow-y-auto pr-2 gap-6">
                {filteredChannels.map((channel) => (
                  <div
                    key={channel.id}
                    style={{ animationDelay: "50ms" }}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                  >
                    <ChannelCard
                      channel={channel}
                      onConfigure={handleConfigure}
                      onDisconnect={handleDisconnect}
                      onDelete={handleDelete}
                      onReconnect={handleReconnect}
                      onRefresh={handleRefresh}
                    />
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

      <ConfigureDialog
        open={configureDialogOpen}
        onOpenChange={setConfigureDialogOpen}
        channel={channelToConfigure}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        channel={channelToDelete}
        onConfirm={confirmDelete}
      />
      <ConnectDialog
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        channelType={selectedChannelType}
        onConnect={handleConnect}
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
