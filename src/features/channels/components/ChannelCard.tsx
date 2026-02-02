import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
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
  Instagram,
  Facebook,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Channel {
  id: string;
  type: "facebook" | "instagram";
  name: string;
  pageId: string;
  status: "connected" | "disconnected" | "pending";
  lastSync?: string;
  messageCount: number;
  followers: number;
  autoReply: boolean;
  businessAccountId?: string;
}

interface ChannelCardProps {
  channel: Channel;
  onConfigure: (channel: Channel) => void;
  onDelete: (channel: Channel) => void;
  onRefresh: (channel: Channel) => void;
}

export function ChannelCard({ channel, onConfigure, onDelete, onRefresh }: ChannelCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
    toast.success(`${channel.name} synced successfully`);
    onRefresh(channel);
  };

  const Icon = channel.type === "facebook" ? Facebook : Instagram;
  const iconColor = channel.type === "facebook" ? "text-[#1877F2]" : "text-[#E1306C]";
  const bgColor = channel.type === "facebook" ? "bg-[#1877F2]/10" : "bg-[#E1306C]/10";
  const accentColor = channel.type === "facebook" ? "bg-[#1877F2]" : "bg-[#E1306C]";

  return (
    <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
      <div className={`absolute top-0 left-0 w-1 h-full ${accentColor}`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${bgColor}`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{channel.name}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                ID: {channel.pageId}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={channel.status === "connected" ? "default" : channel.status === "pending" ? "secondary" : "destructive"}
              className={
                channel.status === "connected" 
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                  : channel.status === "disconnected"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : ""
              }
            >
              {channel.status === "connected" && <CheckCircle2 className="w-3 h-3 mr-1" />}
              {channel.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
              {channel.status === "disconnected" && <AlertCircle className="w-3 h-3 mr-1" />}
              {channel.status.charAt(0).toUpperCase() + channel.status.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {channel.status === "connected" && (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <MessageSquare className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-lg font-semibold">{channel.messageCount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Messages</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Users className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-lg font-semibold">{(channel.followers / 1000).toFixed(1)}K</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <TrendingUp className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-lg font-semibold">+12%</p>
                <p className="text-xs text-muted-foreground">Growth</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last sync: {channel.lastSync ? new Date(channel.lastSync).toLocaleTimeString() : "Never"}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch checked={channel.autoReply} id={`auto-reply-${channel.id}`} />
                <Label htmlFor={`auto-reply-${channel.id}`} className="text-sm cursor-pointer">
                  Auto-reply enabled
                </Label>
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onConfigure(channel)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(channel)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {channel.status === "disconnected" && (
          <div className="text-center py-4">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mb-4">
              This channel needs to be reconnected
            </p>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Reconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
