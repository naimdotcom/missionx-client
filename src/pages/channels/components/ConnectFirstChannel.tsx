import { useChannelConnectUrl } from "@/api/services/channels";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Facebook, Instagram, Zap } from "lucide-react";

interface ConnectFirstChannelProps {
  appId: string;
}

export function ConnectFirstChannel({ appId }: ConnectFirstChannelProps) {
  const facebookUrl = useChannelConnectUrl(appId, "meta");
  const instagramUrl = useChannelConnectUrl(appId, "instagram");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500/5 via-background to-purple-500/10 p-4">
      <div className="w-full max-w-3xl space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-flex">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
            <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 rounded-full">
              <Activity className="w-16 h-16 text-blue-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Almost There! 🎯
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Let's connect your first social media channel to start managing
              conversations
            </p>
          </div>
        </div>

        {/* Channel Options */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Facebook Card */}
          <Card className="border-2 hover:border-blue-500/50 transition-all">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <Facebook className="w-8 h-8 text-blue-600" />
                </div>
                <Button
                  onClick={() => {
                    if (facebookUrl.isSuccess) {
                      window.location.href = facebookUrl.data.authorization_url;
                    }
                  }}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Connect
                </Button>
              </div>
              <div>
                <CardTitle className="text-xl">Facebook Pages</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Connect your Facebook business page
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>Respond to messages and comments</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>Manage page interactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>Track engagement metrics</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Instagram Card */}
          <Card className="border-2 hover:border-purple-500/50 transition-all">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-3 rounded-lg">
                  <Instagram className="w-8 h-8 text-purple-600" />
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    if (instagramUrl.isSuccess) {
                      window.location.href =
                        instagramUrl.data.authorization_url;
                    }
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Connect
                </Button>
              </div>
              <div>
                <CardTitle className="text-xl">Instagram Business</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Connect your Instagram business account
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                  <span>Reply to direct messages</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                  <span>Manage comment threads</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                  <span>Monitor story mentions</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Why connect a channel?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Channels are your gateway to customer conversations. By
                  connecting Facebook or Instagram, you'll be able to receive,
                  manage, and respond to all messages in one unified inbox. You
                  can always add more channels later from the Channels page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
