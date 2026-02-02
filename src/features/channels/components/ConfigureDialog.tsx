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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Facebook,
  Instagram,
  Loader2,
  Save,
  Settings2,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Channel } from "../types";

interface ConfigureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel: Channel | null;
}

export function ConfigureDialog({
  open,
  onOpenChange,
  channel,
}: ConfigureDialogProps) {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (channel) {
      setAutoReplyEnabled(channel.autoReply);
    }
  }, [channel]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    onOpenChange(false);
    toast.success(`${channel?.name} settings updated successfully`);
  };

  if (!channel) return null;

  const isFacebook = channel.type === "facebook";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[540px] rounded-[2rem] p-0 border-0 overflow-hidden shadow-2xl bg-background">
        <div className="p-8 space-y-8">
          <DialogHeader className="flex flex-row items-center gap-5 space-y-0 text-left">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${isFacebook ? "bg-[#1877F2]/10" : "bg-gradient-to-tr from-[#f09433]/10 via-[#e6683c]/10 to-[#bc1888]/10"}`}
            >
              {isFacebook ? (
                <Facebook className="text-[#1877F2] w-7 h-7" />
              ) : (
                <Instagram className="text-[#e6683c] w-7 h-7" />
              )}
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black tracking-tight">
                {channel.name}
              </DialogTitle>
              <DialogDescription className="font-bold flex items-center gap-2">
                <Settings2 className="w-3.5 h-3.5" />
                Channel Configuration
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent">
            {/* Automation Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-black text-[10px] uppercase tracking-widest text-primary/80">
                  Automation
                </h3>
              </div>

              <div className="flex items-center justify-between rounded-[1.5rem] border border-muted-foreground/10 p-5 bg-muted/20 transition-all hover:bg-muted/30">
                <div className="space-y-1">
                  <Label className="text-base font-bold tracking-tight">
                    Auto-reply Bot
                  </Label>
                  <p className="text-[11px] font-medium text-muted-foreground leading-tight">
                    Instantly respond to incoming messages.
                  </p>
                </div>
                <Switch
                  checked={autoReplyEnabled}
                  onCheckedChange={setAutoReplyEnabled}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              {autoReplyEnabled && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label
                    htmlFor="greeting"
                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1"
                  >
                    Greeting Message
                  </Label>
                  <Input
                    id="greeting"
                    placeholder="Hi! Thanks for reaching out..."
                    value={greetingMessage}
                    onChange={(e) => setGreetingMessage(e.target.value)}
                    className="h-12 bg-muted/40 border-muted-foreground/10 rounded-2xl px-5 font-bold focus-visible:ring-primary focus-visible:border-primary transition-all"
                  />
                </div>
              )}
            </div>

            <Separator className="opacity-50" />

            {/* Sync Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Settings2 className="w-4 h-4 text-orange-500" />
                </div>
                <h3 className="font-black text-[10px] uppercase tracking-widest text-orange-500/80">
                  Sync Settings
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="sync-interval"
                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1"
                  >
                    Sync Interval (min)
                  </Label>
                  <Input
                    id="sync-interval"
                    type="number"
                    defaultValue="15"
                    className="h-12 bg-muted/40 border-muted-foreground/10 rounded-2xl px-5 font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="batch-size"
                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1"
                  >
                    Batch Size
                  </Label>
                  <Input
                    id="batch-size"
                    type="number"
                    defaultValue="50"
                    className="h-12 bg-muted/40 border-muted-foreground/10 rounded-2xl px-5 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-muted/20">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-12 rounded-2xl font-bold order-2 sm:order-1 flex-1 sm:flex-none hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="h-12 rounded-2xl font-bold px-10 shadow-xl shadow-primary/20 transition-all active:scale-95 order-1 sm:order-2 flex-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2 stroke-[3]" />
                  Save Settings
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
