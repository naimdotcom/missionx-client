import type { Channel } from "@/api/services/channels";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, MessageSquare, Trash2, Users } from "lucide-react";
import { Badge } from "./Badge";
import { ChannelIcon } from "./ChannelIcons";
import { DeleteUrlChannelBtn } from "./DeleteDialog";

interface ChannelCardProps {
  channel: Channel;
}

export function ChannelCard({ channel }: ChannelCardProps) {
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
                  val: (channel.messageCount || 0).toLocaleString(),
                  Icon: MessageSquare,
                },
                {
                  label: "Followers",
                  val:
                    (channel.followers || 0) >= 1000
                      ? `${((channel.followers || 0) / 1000).toFixed(1)}K`
                      : channel.followers || 0,
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

            <div className="flex items-center justify-end gap-1.5 pt-1">
              <DeleteUrlChannelBtn channel={channel} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="p-4 rounded-full bg-destructive/10">
              <AlertCircle className="size-9 text-rose-500" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-destructive">Connection Lost</p>
              <p className="text-xs text-muted-foreground px-4">
                This channel is disconnected. Please reconnect to continue.
              </p>
            </div>
            <Button size="sm" variant="destructive" className="gap-2">
              <Trash2 className="size-4" />
              Remove Channel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
