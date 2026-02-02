import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ExternalLink,
  Facebook,
  Instagram,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

interface ConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelType: "facebook" | "instagram" | null;
  onConnect: (name: string, pageId: string) => void;
}

export function ConnectDialog({
  open,
  onOpenChange,
  channelType,
  onConnect,
}: ConnectDialogProps) {
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

  const isFacebook = channelType === "facebook";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              <Facebook className="text-white fill-white w-8 h-8" />
            ) : (
              <Instagram className="text-white w-8 h-8" />
            )}
          </div>
        </div>

        <div className="p-8 pt-6 space-y-6">
          <DialogHeader className="space-y-2 text-center sm:text-left">
            <DialogTitle className="text-2xl font-black tracking-tight">
              Connect {isFacebook ? "Facebook Page" : "Instagram Account"}
            </DialogTitle>
            <DialogDescription className="font-medium">
              Enter details below to authorize and connect your{" "}
              {isFacebook ? "page" : "account"} with MissionX.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black ml-1 uppercase tracking-widest text-muted-foreground/60">
                Display Name
              </Label>
              <Input
                placeholder={
                  isFacebook ? "e.g. Acme Corp Facebook" : "e.g. @acme_official"
                }
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                className="h-12 bg-muted/40 border-muted-foreground/10 rounded-2xl px-5 font-bold focus-visible:ring-primary focus-visible:border-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black ml-1 uppercase tracking-widest text-muted-foreground/60">
                {isFacebook ? "Page ID" : "Account ID / Username"}
              </Label>
              <Input
                placeholder="Enter unique identifier"
                value={pageId}
                onChange={(e) => setPageId(e.target.value)}
                className="h-12 bg-muted/40 border-muted-foreground/10 rounded-2xl px-5 font-bold focus-visible:ring-primary focus-visible:border-primary transition-all"
              />
            </div>

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
              onClick={() => onOpenChange(false)}
              className="h-12 rounded-2xl font-bold order-2 sm:order-1 flex-1 sm:flex-none border border-transparent hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              disabled={!pageId || !pageName || isConnecting}
              className={`h-12 rounded-2xl font-bold px-8 shadow-xl shadow-primary/10 transition-all active:scale-95 order-1 sm:order-2 flex-1 ${isFacebook ? "bg-[#1877F2] hover:bg-[#1877F2]/90 text-white" : "bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] hover:opacity-90 text-white"}`}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2 stroke-[3]" />
                  Authorize
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
