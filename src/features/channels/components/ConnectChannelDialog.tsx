import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Instagram,
  Facebook,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface ConnectChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelType: "facebook" | "instagram" | null;
}

export function ConnectChannelDialog({ open, onOpenChange, channelType }: ConnectChannelDialogProps) {
  const [step, setStep] = useState<"select" | "connect" | "success">("select");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsConnecting(false);
    setStep("success");
    toast.success(`${channelType === "facebook" ? "Facebook Page" : "Instagram Account"} connected successfully!`);
  };

  const handleClose = () => {
    setStep("select");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {step === "select" && (
          <>
            <DialogHeader>
              <DialogTitle>Connect {channelType === "facebook" ? "Facebook Page" : "Instagram Account"}</DialogTitle>
              <DialogDescription>
                Choose how you want to connect your {channelType === "facebook" ? "Facebook Page" : "Instagram Business Account"}.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 py-6">
              <button
                onClick={() => setStep("connect")}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 transition-all duration-200 group cursor-pointer"
              >
                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  {channelType === "facebook" ? (
                    <Facebook className="w-8 h-8 text-[#1877F2]" />
                  ) : (
                    <Instagram className="w-8 h-8 text-[#E1306C]" />
                  )}
                </div>
                <div className="text-center">
                  <p className="font-medium">Select Existing</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose from your connected {channelType === "facebook" ? "pages" : "accounts"}
                  </p>
                </div>
              </button>

              <button
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 transition-all duration-200 group cursor-pointer"
              >
                <div className="p-4 rounded-full bg-muted group-hover:bg-muted/80 transition-colors">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Add New</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Connect a new {channelType === "facebook" ? "page" : "account"}
                  </p>
                </div>
              </button>
            </div>
          </>
        )}

        {step === "connect" && (
          <>
            <DialogHeader>
              <DialogTitle>Connect Your {channelType === "facebook" ? "Facebook Page" : "Instagram Account"}</DialogTitle>
              <DialogDescription>
                Enter the details to connect your {channelType === "facebook" ? "page" : "account"}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="page-id">Page / Account ID</Label>
                <Input id="page-id" placeholder="Enter ID" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="page-name">Page / Account Name</Label>
                <Input id="page-name" placeholder="Enter name" />
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
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

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("select")}>
                Back
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect with {channelType === "facebook" ? "Facebook" : "Instagram"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "success" && (
          <>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connected Successfully!</h3>
              <p className="text-muted-foreground text-center">
                Your {channelType === "facebook" ? "Facebook Page" : "Instagram Account"} has been connected and is ready to use.
              </p>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={handleClose}>
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
