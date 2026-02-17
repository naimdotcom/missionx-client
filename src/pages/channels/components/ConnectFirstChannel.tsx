import { useChannelConnectUrl } from "@/api/services/channels";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  CheckCircle2,
  Facebook,
  Instagram,
  MessageSquare,
  Users,
  Zap,
} from "lucide-react";

interface ConnectFirstChannelProps {
  appId: string;
}

export function ConnectFirstChannel({ appId }: ConnectFirstChannelProps) {
  const facebookUrl = useChannelConnectUrl(appId, "meta");
  const instagramUrl = useChannelConnectUrl(appId, "instagram");

  return (
    <div className="flex min-h-screen w-full flex-col bg-background lg:flex-row">
      {/* Left Panel - Value Proposition */}
      <div className="relative flex w-full flex-col justify-between overflow-hidden bg-primary/5 p-8 lg:w-1/2 lg:p-12 xl:p-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Connect to your audience
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Bring all your customer conversations into one unified inbox.
              Connect your first channel to get started.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-background p-2 shadow-sm ring-1 ring-border">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Unified Inbox</h3>
                <p className="text-sm text-muted-foreground">
                  Reply to Facebook and Instagram messages from a single
                  dashboard.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-background p-2 shadow-sm ring-1 ring-border">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Team Collaboration</h3>
                <p className="text-sm text-muted-foreground">
                  Assign conversations, add internal notes, and work together.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-background p-2 shadow-sm ring-1 ring-border">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Analytics & Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Track response times, volume, and customer satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 hidden lg:block">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Secure connection via official Meta APIs</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Actions */}
      <div className="flex w-full flex-col justify-center p-8 lg:w-1/2 lg:p-12 xl:p-16">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight">
              Select a channel
            </h2>
            <p className="text-muted-foreground">
              Choose a platform to connect. You can add more later.
            </p>
          </div>

          <div className="grid gap-4">
            <Card
              className="group cursor-pointer border-2 transition-all hover:border-blue-500/50 hover:bg-blue-50/50 hover:shadow-md"
              onClick={() => {
                if (facebookUrl.isSuccess) {
                  window.location.href = facebookUrl.data.authorization_url;
                }
              }}
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Facebook className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-base">Facebook Page</CardTitle>
                  <CardDescription>
                    Connect for Messenger & Comments
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  className="ml-auto shrink-0"
                  size="icon"
                >
                  <Zap className="h-4 w-4" />
                </Button>
              </CardHeader>
            </Card>

            <Card
              className="group cursor-pointer border-2 transition-all hover:border-pink-500/50 hover:bg-pink-50/50 hover:shadow-md"
              onClick={() => {
                if (instagramUrl.isSuccess) {
                  window.location.href = instagramUrl.data.authorization_url;
                }
              }}
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600 transition-colors group-hover:bg-pink-600 group-hover:text-white">
                  <Instagram className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-base">
                    Instagram Business
                  </CardTitle>
                  <CardDescription>Connect for DMs & Comments</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  className="ml-auto shrink-0"
                  size="icon"
                >
                  <Zap className="h-4 w-4" />
                </Button>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center text-sm text-muted-foreground lg:hidden">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Secure connection via official Meta APIs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
