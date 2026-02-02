import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Clock,
  ExternalLink,
  Facebook,
  Instagram,
  Loader2,
  MessageSquare,
  RefreshCw,
  Settings,
  Trash2,
  TrendingUp,
  Unplug,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Channel } from "../types";
import { Badge } from "./Badge";

interface ChannelCardProps {
  channel: Channel;
  onConfigure: (channel: Channel) => void;
  onDisconnect: (channel: Channel) => void;
  onDelete: (channel: Channel) => void;
  onReconnect: (channel: Channel) => void;
  onRefresh: (channel: Channel) => void;
  onToggleAutoReply: (channelId: string, value: boolean) => void;
}

export function ChannelCard({
  channel,
  onConfigure,
  onDisconnect,
  onDelete,
  onReconnect,
  onRefresh,
  onToggleAutoReply,
}: ChannelCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const isFB = channel.type === "facebook";
  const Icon = isFB ? Facebook : Instagram;

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
    const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg duration-300">
      <div className={cn("absolute top-0 left-0 w-full h-1")} />
      <CardHeader className="pb-3 pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300",
                  isFB ? "bg-[#1877F2]/10" : "bg-[#E1306C]/10",
                )}
              >
                <Icon
                  className={cn(
                    "w-6 h-6",
                    isFB ? "text-[#1877F2]" : "text-[#E1306C]",
                  )}
                />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold tracking-tight">
                  {channel.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase">
                    {channel.type}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    ID: {channel.pageId}
                  </span>
                </div>
              </div>
            </div>
            <Badge
              variant={
                channel.status === "connected" ? "default" : "destructive"
              }
              className={cn(
                "animate-in fade-in zoom-in duration-500",
                channel.status === "connected"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800"
                  : "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800",
              )}
            >
              {channel.status === "connected" ? (
                <div className="flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Live
                </div>
              ) : (
                "Disconnected"
              )}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {channel.status === "connected" ? (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "Messages",
                  val: channel.messageCount.toLocaleString(),
                  Icon: MessageSquare,
                },
                {
                  label: "Followers",
                  val:
                    channel.followers >= 1000
                      ? `${(channel.followers / 1000).toFixed(1)}K`
                      : channel.followers,
                  Icon: Users,
                },
                {
                  label: "Growth",
                  val: `${channel.growth}%`,
                  Icon: TrendingUp,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="relative group/stat p-3 rounded-2xl bg-muted/30 border border-transparent transition-all hover:bg-muted/50 hover:border-muted-foreground/10"
                >
                  <stat.Icon className="w-4 h-4 mb-2 text-muted-foreground transition-colors group-hover/stat:text-primary" />
                  <p className="text-lg font-bold tabular-nums tracking-tight leading-none mb-1">
                    {stat.val}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 group/sync">
                <div
                  className={cn(
                    "p-1.5 rounded-full bg-muted/50",
                    isRefreshing && "animate-pulse",
                  )}
                >
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                    Last Synced
                  </span>
                  <span className="text-xs font-medium">
                    {formatLastSync(channel.lastSync)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-1 px-3 rounded-full bg-muted/50 border border-transparent hover:border-primary/10 transition-colors">
                <Switch
                  checked={channel.autoReply}
                  id={`auto-reply-${channel.id}`}
                  onCheckedChange={(checked) =>
                    onToggleAutoReply(channel.id, checked)
                  }
                  className="scale-75"
                />
                <Label
                  htmlFor={`auto-reply-${channel.id}`}
                  className="text-[10px] font-bold uppercase cursor-pointer select-none"
                >
                  Auto Reply
                </Label>
              </div>
            </div>

            <Separator className="bg-muted-foreground/5" />

            <div className="flex items-center justify-between pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-9 rounded-xl border-dashed hover:border-primary hover:text-primary transition-all px-4"
              >
                {isRefreshing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                )}
                Sync Now
              </Button>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => onConfigure(channel)}
                  className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                  title="Settings"
                >
                  <Settings className="w-4.5 h-4.5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => onDisconnect(channel)}
                  className="h-9 w-9 rounded-xl hover:bg-orange-500/10 hover:text-orange-500 transition-colors"
                  title="Disconnect Channel"
                >
                  <Unplug className="w-4.5 h-4.5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => onDelete(channel)}
                  className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
                  title="Permanently Delete"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="p-4 rounded-full bg-rose-500/10 animate-pulse">
              <AlertCircle className="w-10 h-10 text-rose-500" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-rose-600 dark:text-rose-400">
                Connection Interrupted
              </p>
              <p className="text-xs text-muted-foreground px-4">
                Your connection with this channel has expired or was revoked.
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={handleReconnect}
              disabled={isReconnecting}
              className="w-full h-10 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20"
            >
              {isReconnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Reconnecting...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Reconnect Now
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
