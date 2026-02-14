import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Loader2,
  MessageSquare,
  Plug,
  RefreshCw,
  Settings,
  Trash2,
  Unplug,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Channel } from "../types";
import { Badge } from "./Badge";
import { ChannelIcon } from "./ChannelIcons";

interface ChannelCardProps {
  channel: Channel;
  onConfigure: (channel: Channel) => void;
  onDisconnect: (channel: Channel) => void;
  onDelete: (channel: Channel) => void;
  onReconnect: (channel: Channel) => void;
  onRefresh: (channel: Channel) => void;
}

export function ChannelCard({
  channel,
  onConfigure,
  onDisconnect,
  onDelete,
  onReconnect,
  onRefresh,
}: ChannelCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

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

  return (
    <Card className="overflow-hidden h-72 flex flex-col justify-between group">
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <ChannelIcon
            type={channel.type}
            variant="boxed"
            className="p-3 rounded-2xl group-hover:scale-110 duration-300"
            iconClassName="w-6 h-6"
          />

          <div>
            <div className="text-lg font-bold tracking-tight">
              {channel.name}
            </div>
            {channel.status === "connected" && (
              <Badge
                variant="secondary"
                className="capitalize bg-green-500/10 text-green-500"
              >
                {channel.status}
              </Badge>
            )}
            {channel.status === "disconnected" && (
              <Badge variant="destructive">{channel.status}</Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {channel.status === "connected" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
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
          <div className="flex flex-col items-center justify-center text-center gap-2">
            <div className="p-4 rounded-full bg-destructive/10">
              <AlertCircle className="size-9 text-rose-500" />
            </div>

            <div className="space-y-1">
              <p className="font-bold text-destructive">
                Connection Interrupted
              </p>
              <p className="text-xs text-muted-foreground px-4">
                Your connection with this channel has expired.
              </p>
            </div>

            <Button
              size="sm"
              className="w-full"
              variant="destructive"
              onClick={handleReconnect}
              disabled={isReconnecting}
            >
              {isReconnecting && (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Reconnecting...
                </>
              )}

              {!isReconnecting && (
                <>
                  <Plug className="size-4" />
                  Reconnect
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
