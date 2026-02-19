import { BarChart3, CheckCircle2, MessageSquare, Users } from "lucide-react";
import ChannelListDialog from "./ChannelListDialog";

// interface ConnectFirstChannelProps {
//   appId: string;
// }

export function ConnectFirstChannel() {
  // const facebookUrl = useChannelConnectUrl(appId, "meta");
  // const instagramUrl = useChannelConnectUrl(appId, "instagram");

  return (
    <div>
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        {/* Left Panel - Value Proposition - Show second on mobile via order-last */}
        <div className="relative flex w-full flex-col justify-between overflow-hidden bg-primary/5 p-6 md:p-8 lg:order-first lg:w-1/2 lg:p-12 xl:p-16">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          <div className="relative z-10 space-y-6 lg:space-y-8">
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl lg:text-5xl">
                Connect to your audience
              </h1>
              <p className="max-w-md text-sm text-muted-foreground md:text-base lg:text-lg">
                Bring all your customer conversations into one unified inbox.
                Connect your first channel to get started.
              </p>
            </div>

            <div className="grid gap-4 md:gap-6 lg:space-y-6 lg:block">
              <div className="flex items-start gap-3 lg:gap-4">
                <div className="rounded-lg bg-background p-1.5 shadow-sm ring-1 ring-border lg:p-2">
                  <MessageSquare className="h-4 w-4 text-primary lg:h-6 lg:w-6" />
                </div>
                <div className="space-y-0.5 lg:space-y-1">
                  <h3 className="font-semibold text-sm lg:text-base">
                    Unified Inbox
                  </h3>
                  <p className="text-xs text-muted-foreground lg:text-sm">
                    Reply to Facebook and Instagram messages from a single
                    dashboard.
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex lg:flex items-start gap-3 lg:gap-4">
                <div className="rounded-lg bg-background p-1.5 shadow-sm ring-1 ring-border lg:p-2">
                  <Users className="h-4 w-4 text-primary lg:h-6 lg:w-6" />
                </div>
                <div className="space-y-0.5 lg:space-y-1">
                  <h3 className="font-semibold text-sm lg:text-base">
                    Team Collaboration
                  </h3>
                  <p className="text-xs text-muted-foreground lg:text-sm">
                    Assign conversations, add internal notes, and work together.
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex lg:flex items-start gap-3 lg:gap-4">
                <div className="rounded-lg bg-background p-1.5 shadow-sm ring-1 ring-border lg:p-2">
                  <BarChart3 className="h-4 w-4 text-primary lg:h-6 lg:w-6" />
                </div>
                <div className="space-y-0.5 lg:space-y-1">
                  <h3 className="font-semibold text-sm lg:text-base">
                    Analytics & Insights
                  </h3>
                  <p className="text-xs text-muted-foreground lg:text-sm">
                    Track response times, volume, and customer satisfaction.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 hidden lg:block">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Secure connection via official Meta APIs</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Actions - Show first on mobile */}
        <div className="flex w-full flex-col justify-center bg-background p-6 md:p-8 lg:h-auto lg:w-1/2 lg:p-12 xl:p-16">
          <div className="mx-auto w-full max-w-md space-y-6 md:space-y-8">
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-xl font-bold tracking-tight md:text-2xl">
                Select a channel
              </h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Choose a platform to connect. You can add more later.
              </p>
            </div>

            <div className="grid gap-3 md:gap-4">
              <ChannelListDialog type="meta" />
              <ChannelListDialog type="instagram" />
            </div>

            <div className="text-center text-xs text-muted-foreground lg:hidden">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>Secure connection via official Meta APIs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
