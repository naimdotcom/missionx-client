import { UrlType, useChannelConnectUrl } from "@/api/services/channels";
import { Button } from "@/components/ui/button";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ChannelIcon, FacebookIcon, InstagramIcon } from "./ChannelIcons";

interface ConnectDialogProps {
  appId: string;
}

export function ConnectDialog(props: ConnectDialogProps) {
  const [selectedChannelType, setSelectedChannelType] =
    useState<UrlType | null>(null);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant={"secondary"}
                disabled={!props.appId}
                className="w-full"
              >
                <Plus className="size-4" />
                Add New Channel
              </Button>
            </TooltipTrigger>

            {props.appId && (
              <TooltipContent>
                <p>Please select a app to connect channels</p>
              </TooltipContent>
            )}
          </Tooltip>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setSelectedChannelType("meta")}
            className="flex items-center gap-2"
          >
            <ChannelIcon type="facebook" variant="boxed" />
            <span className="font-bold">Facebook Page</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setSelectedChannelType("instagram")}
            className="flex items-center gap-2"
          >
            <ChannelIcon type="instagram" variant="boxed" />
            <span className="font-bold">Instagram Account</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {selectedChannelType && (
        <ConnectChannelDialog
          appId={props.appId}
          channelType={selectedChannelType}
          open={selectedChannelType !== null}
          onOpenChange={() => setSelectedChannelType(null)}
        />
      )}
    </div>
  );
}

type ConnectChannelDialogProps = {
  open: boolean;
  appId: string;
  channelType: UrlType;
  onOpenChange: (open: boolean) => void;
};
function ConnectChannelDialog(props: ConnectChannelDialogProps) {
  console.log("App ID", props.appId);
  console.log("Channel Type", props.channelType);

  const channelConnectQuery = useChannelConnectUrl(
    props.appId,
    props.channelType,
  );

  const handleConnect = async () => {
    if (!props.appId) {
      toast.error("Please select an app first");
      return;
    }

    if (channelConnectQuery.data?.authorization_url) {
      window.location.href = channelConnectQuery.data.authorization_url;
      return;
    }
  };

  const isFacebook = props.channelType === "meta";
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[480px] rounded-[2rem] p-0 border-0 overflow-hidden shadow-2xl bg-background">
        <div
          className={`h-32 transition-colors duration-500 flex items-center justify-center relative overflow-hidden ${isFacebook ? "bg-[#1877F2]" : "bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]"}`}
        >
          {/* Decorative patterns */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-10 -left-10 w-40 h-40 border-[20px] border-white rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 border-[20px] border-white rounded-full" />
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30 z-10 animate-in zoom-in-50 duration-500">
            {isFacebook ? (
              <FacebookIcon className="text-white fill-current w-8 h-8" />
            ) : (
              <InstagramIcon className="text-white w-8 h-8" />
            )}
          </div>
        </div>

        <div className="p-8 pt-6 space-y-6">
          <DialogHeader className="space-y-2 text-center sm:text-left">
            <DialogTitle className="text-2xl font-black tracking-tight">
              Connect {isFacebook ? "Facebook Page" : "Instagram Account"}
            </DialogTitle>
            <DialogDescription className="font-medium">
              You'll be redirected to {isFacebook ? "Facebook" : "Instagram"} to
              authorize and connect your {isFacebook ? "page" : "account"}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4 mt-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-bold text-primary mb-0.5 tracking-tight">
                  Secure Connection
                </p>
                <p className="text-muted-foreground font-medium leading-relaxed text-xs">
                  Official API protocols are used. Your data is encrypted and
                  protected.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => props.onOpenChange(false)}
              className="h-12 rounded-2xl font-bold order-2 sm:order-1 flex-1 sm:flex-none border border-transparent hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              disabled={channelConnectQuery.isPending || !props.appId}
              className={`h-12 rounded-2xl font-bold px-8 shadow-xl shadow-primary/10 transition-all active:scale-95 order-1 sm:order-2 flex-1 ${isFacebook ? "bg-[#1877F2] hover:bg-[#1877F2]/90 text-white" : "bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] hover:opacity-90 text-white"}`}
            >
              Continue with {isFacebook ? "Facebook" : "Instagram"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
