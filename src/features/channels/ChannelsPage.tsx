import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Facebook,
  Instagram,
  Settings,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  MessageSquare,
  Users,
  TrendingUp,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Channel {
  id: string;
  type: "facebook" | "instagram";
  name: string;
  pageId: string;
  status: "connected" | "disconnected";
  lastSync?: string;
  messageCount: number;
  followers: number;
  growth: number;
  autoReply: boolean;
}

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

function Badge({ className, children, variant = "default" }: { className?: string; children: React.ReactNode; variant?: "default" | "destructive" | "secondary" }) {
  const variantClasses: Record<string, string> = {
    default: "bg-primary text-primary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    secondary: "bg-secondary text-secondary-foreground",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variantClasses[variant]} ${className || ""}`}>
      {children}
    </span>
  );
}

function StatCard({ icon: Icon, title, value, description, iconColor }: { icon: typeof Facebook; title: string; value: string | number; description: string; iconColor: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ChannelCard({ channel, onConfigure, onDelete, onReconnect, onRefresh, onToggleAutoReply }: {
  channel: Channel;
  onConfigure: (channel: Channel) => void;
  onDelete: (channel: Channel) => void;
  onReconnect: (channel: Channel) => void;
  onRefresh: (channel: Channel) => void;
  onToggleAutoReply: (channelId: string, value: boolean) => void;
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const Icon = channel.type === "facebook" ? Facebook : Instagram;
  const iconColor = channel.type === "facebook" ? "text-[#1877F2]" : "text-[#E1306C]";
  const bgColor = channel.type === "facebook" ? "bg-[#1877F2]/10" : "bg-[#E1306C]/10";
  const accentColor = channel.type === "facebook" ? "bg-[#1877F2]" : "bg-[#E1306C]";

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRefreshing(false);
    toast.success(`${channel.name} synced successfully`);
    onRefresh(channel);
  };

  const handleReconnect = async () => {
    setIsReconnecting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsReconnecting(false);
    toast.success(`${channel.name} reconnected successfully`);
    onReconnect(channel);
  };

  const formatLastSync = (isoString?: string) => {
    if (!isoString) return "Never";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
      <div className={`absolute top-0 left-0 w-1 h-full ${accentColor}`} />
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className={`p-2 sm:p-3 rounded-xl ${bgColor}`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg font-semibold truncate">{channel.name}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">ID: {channel.pageId}</CardDescription>
              </div>
            </div>
            <Badge variant={channel.status === "connected" ? "default" : "destructive"} className={channel.status === "connected" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 shrink-0 text-xs whitespace-nowrap"}>
              {channel.status === "connected" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
              {channel.status === "connected" ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {channel.status === "connected" ? (
          <>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm sm:text-lg font-semibold">{channel.messageCount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Messages</p>
              </div>
              <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm sm:text-lg font-semibold">{channel.followers >= 1000 ? `${(channel.followers / 1000).toFixed(1)}K` : channel.followers}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm sm:text-lg font-semibold">+{channel.growth}%</p>
                <p className="text-xs text-muted-foreground">Growth</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last sync: {formatLastSync(channel.lastSync)}
              </span>
            </div>
            <Separator />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <Switch checked={channel.autoReply} id={`auto-reply-${channel.id}`} onCheckedChange={(checked) => onToggleAutoReply(channel.id, checked)} />
                <Label htmlFor={`auto-reply-${channel.id}`} className="text-xs sm:text-sm cursor-pointer">Auto-reply</Label>
              </div>
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isRefreshing} className="h-8 w-8">
                  {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onConfigure(channel)} className="h-8 w-8">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(channel)} className="text-destructive hover:text-destructive h-8 w-8">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">This channel needs to be reconnected</p>
            <Button variant="outline" size="sm" onClick={handleReconnect} disabled={isReconnecting}>
              {isReconnecting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Reconnecting...</> : <><ExternalLink className="w-4 h-4 mr-2" />Reconnect</>}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ConfigureDialog({ open, onOpenChange, channel }: { open: boolean; onOpenChange: (open: boolean) => void; channel: Channel | null }) {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(channel?.autoReply || false);
  const [greetingMessage, setGreetingMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    onOpenChange(false);
    toast.success(`${channel?.name} settings updated successfully`);
  };

  if (!channel) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Configure {channel?.name}</DialogTitle>
          <DialogDescription>Manage settings for this {channel?.type === "facebook" ? "Facebook Page" : "Instagram Account"}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4 overflow-y-auto flex-1 px-1">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4 gap-4">
              <div className="space-y-0.5">
                <Label className="text-base">Auto-reply</Label>
                <p className="text-sm text-muted-foreground">Automatically respond to incoming messages</p>
              </div>
              <Switch checked={autoReplyEnabled} onCheckedChange={setAutoReplyEnabled} />
            </div>
            {autoReplyEnabled && (
              <div className="space-y-2">
                <Label htmlFor="greeting">Greeting Message</Label>
                <Input id="greeting" placeholder="Hi! Thanks for reaching out..." value={greetingMessage} onChange={(e) => setGreetingMessage(e.target.value)} />
                <p className="text-xs text-muted-foreground">This message will be sent automatically when a new message is received.</p>
              </div>
            )}
          </div>
          <Separator />
          <div className="space-y-4">
            <h4 className="font-medium">Sync Settings</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
                <Input id="sync-interval" type="number" defaultValue="5" min="1" max="60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" placeholder="https://..." />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 shrink-0 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Cancel</Button>
          <Button variant="secondary" onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
            {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDialog({ open, onOpenChange, channel, onConfirm }: { open: boolean; onOpenChange: (open: boolean) => void; channel: Channel | null; onConfirm: (channel: Channel) => void }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmName, setConfirmName] = useState("");

  const handleDelete = async () => {
    if (channel && confirmName.toLowerCase() === channel.name.toLowerCase()) {
      setIsDeleting(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsDeleting(false);
      onOpenChange(false);
      setConfirmName("");
      onConfirm(channel);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[450px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Delete Channel
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently disconnect and remove {channel?.type === "facebook" ? " Facebook Page" : " Instagram Account"} from your workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 overflow-y-auto flex-1 px-1">
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              <div>
                <p className="font-medium">Channel: {channel?.name}</p>
                <p className="text-sm text-muted-foreground">{channel?.type === "facebook" ? "Facebook Page" : "Instagram Account"}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-name">Type <strong>{channel?.name}</strong> to confirm deletion</Label>
            <Input id="confirm-name" placeholder={channel?.name} value={confirmName} onChange={(e) => setConfirmName(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 shrink-0 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={confirmName.toLowerCase() !== channel?.name.toLowerCase() || isDeleting} className="w-full sm:w-auto">
            {isDeleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deleting...</> : "Delete Channel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ConnectDialog({ open, onOpenChange, channelType, onConnect }: { open: boolean; onOpenChange: (open: boolean) => void; channelType: "facebook" | "instagram" | null; onConnect: (name: string, pageId: string) => void }) {
  const [pageId, setPageId] = useState("");
  const [pageName, setPageName] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (pageId && pageName) {
      setIsConnecting(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsConnecting(false);
      onOpenChange(false);
      setPageId("");
      setPageName("");
      onConnect(pageName, pageId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Connect {channelType === "facebook" ? "Facebook Page" : "Instagram Account"}</DialogTitle>
          <DialogDescription>Enter the details to connect your {channelType === "facebook" ? "page" : "account"}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 overflow-y-auto flex-1 px-1">
          <div className="space-y-2">
            <Label htmlFor="channel-name">{channelType === "facebook" ? "Page" : "Account"} Name</Label>
            <Input id="channel-name" placeholder="Enter name" value={pageName} onChange={(e) => setPageName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="channel-id">{channelType === "facebook" ? "Page" : "Account"} ID</Label>
            <Input id="channel-id" placeholder="Enter ID" value={pageId} onChange={(e) => setPageId(e.target.value)} />
          </div>
          <div className="p-3 sm:p-4 rounded-lg bg-muted/50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Permission Required</p>
                <p className="mt-1">We will request the following permissions:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Manage pages and publish as pages</li>
                  <li>Read page conversations</li>
                  <li>Read user content</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 shrink-0 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Cancel</Button>
          <Button variant="secondary" onClick={handleConnect} disabled={!pageId || !pageName || isConnecting} className="w-full sm:w-auto">
            {isConnecting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Connecting...</> : <><ExternalLink className="w-4 h-4 mr-2" />Connect with {channelType === "facebook" ? "Facebook" : "Instagram"}</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [configureDialogOpen, setConfigureDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedChannelType, setSelectedChannelType] = useState<"facebook" | "instagram" | null>(null);
  const [channelToConfigure, setChannelToConfigure] = useState<Channel | null>(null);
  const [channelToDelete, setChannelToDelete] = useState<Channel | null>(null);

  const filteredChannels = channels.filter((channel) => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || channel.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const facebookCount = channels.filter((c) => c.type === "facebook").length;
  const instagramCount = channels.filter((c) => c.type === "instagram").length;
  const totalMessages = channels.reduce((sum, c) => sum + c.messageCount, 0);
  const totalFollowers = channels.reduce((sum, c) => sum + c.followers, 0);

  const handleConfigure = (channel: Channel) => {
    setChannelToConfigure(channel);
    setConfigureDialogOpen(true);
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
          ? { ...c, status: "connected", lastSync: new Date().toISOString(), messageCount: 1247, followers: 15420, growth: 12.4 }
          : c
      )
    );
  };

  const handleRefresh = (channel: Channel) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channel.id ? { ...c, lastSync: new Date().toISOString() } : c
      )
    );
  };

  const handleToggleAutoReply = (channelId: string, value: boolean) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === channelId ? { ...c, autoReply: value } : c))
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
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Channels</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your connected social media channels</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Channel
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openConnectDialog("facebook")}>
              <Facebook className="w-4 h-4 mr-2 text-[#1877F2]" />
              Facebook Page
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openConnectDialog("instagram")}>
              <Instagram className="w-4 h-4 mr-2 text-[#E1306C]" />
              Instagram Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={Facebook} title="Facebook Pages" value={facebookCount} description="Connected pages" iconColor="text-[#1877F2]" />
        <StatCard icon={Instagram} title="Instagram Accounts" value={instagramCount} description="Connected accounts" iconColor="text-[#E1306C]" />
        <StatCard icon={MessageSquare} title="Total Messages" value={totalMessages.toLocaleString()} description="All time messages" iconColor="text-primary" />
        <StatCard icon={Users} title="Total Reach" value={`${(totalFollowers / 1000).toFixed(1)}K`} description="Total followers" iconColor="text-primary" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="w-full sm:w-auto grid grid-cols-3">
            <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
            <TabsTrigger value="facebook" className="text-xs sm:text-sm">Facebook</TabsTrigger>
            <TabsTrigger value="instagram" className="text-xs sm:text-sm">Instagram</TabsTrigger>
          </TabsList>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
        </div>
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredChannels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onConfigure={handleConfigure}
                onDelete={handleDelete}
                onReconnect={handleReconnect}
                onRefresh={handleRefresh}
                onToggleAutoReply={handleToggleAutoReply}
              />
            ))}
          </div>
          {filteredChannels.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No channels found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ConfigureDialog open={configureDialogOpen} onOpenChange={setConfigureDialogOpen} channel={channelToConfigure} />
      <DeleteDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} channel={channelToDelete} onConfirm={confirmDelete} />
      <ConnectDialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen} channelType={selectedChannelType} onConnect={handleConnect} />
    </div>
  );
}
