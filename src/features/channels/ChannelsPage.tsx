import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Facebook,
  Instagram,
  MessageSquare,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ChannelCard } from "./components/ChannelCard";
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
  const [searchQuery, setSearchQuery] = useState("");
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
    const matchesSearch = channel.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || channel.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = [
    {
      icon: Facebook,
      title: "Facebook Pages",
      value: channels.filter((c) => c.type === "facebook").length,
      desc: "Connected pages",
      color: "text-[#1877F2]",
    },
    {
      icon: Instagram,
      title: "Instagram Accounts",
      value: channels.filter((c) => c.type === "instagram").length,
      desc: "Connected accounts",
      color: "text-[#E1306C]",
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

  const handleToggleAutoReply = (channelId: string, value: boolean) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === channelId ? { ...c, autoReply: value } : c)),
    );
    toast.success(`Auto-reply ${value ? "enabled" : "disabled"}`);
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
    <div className="h-full flex flex-col overflow-hidden bg-background/50 backdrop-blur-3xl p-6 gap-8 relative">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 pt-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1.5 bg-primary rounded-full" />
            <h1 className="text-3xl font-black tracking-tighter md:text-4xl">
              Channels
            </h1>
          </div>
          <p className="text-muted-foreground font-medium text-sm md:text-base pl-3.5">
            Manage and monitor your omnichannel presence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-11 px-6 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 active:scale-95">
                <Plus className="w-5 h-5 mr-2 stroke-[3]" />
                Add New Channel
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
              <DropdownMenuItem
                onClick={() => openConnectDialog("facebook")}
                className="rounded-xl p-3 cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-[#1877F2]/10 mr-3 group-hover:bg-[#1877F2]/20">
                  <Facebook className="w-4 h-4 text-[#1877F2]" />
                </div>
                <span className="font-bold">Facebook Page</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openConnectDialog("instagram")}
                className="rounded-xl p-3 cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-[#E1306C]/10 mr-3 group-hover:bg-[#E1306C]/20">
                  <Instagram className="w-4 h-4 text-[#E1306C]" />
                </div>
                <span className="font-bold">Instagram Account</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
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
      </section>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col min-h-0 min-w-0"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
          <TabsList className="h-12 p-1.5 bg-muted/40 backdrop-blur rounded-2xl border border-muted-foreground/10 shrink-0">
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

          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Filter channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 bg-muted/40 border-muted-foreground/10 rounded-2xl focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary transition-all font-medium"
            />
          </div>
        </div>

        <TabsContent
          value={activeTab}
          className="flex-1 min-h-0 mt-4 overflow-hidden outline-none"
        >
          {filteredChannels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 h-full overflow-y-auto pr-2 gap-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
              {filteredChannels.map((channel) => (
                <div
                  key={channel.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                  style={{ animationDelay: "50ms" }}
                >
                  <ChannelCard
                    channel={channel}
                    onConfigure={handleConfigure}
                    onDisconnect={handleDisconnect}
                    onDelete={handleDelete}
                    onReconnect={handleReconnect}
                    onRefresh={handleRefresh}
                    onToggleAutoReply={handleToggleAutoReply}
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
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                  We couldn&apos;t find any channels matching{" "}
                  <span className="text-primary font-bold">
                    &quot;{searchQuery}&quot;
                  </span>
                  . Try adjusting your search.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="rounded-xl h-10 px-6 font-bold"
              >
                Clear Search
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

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
