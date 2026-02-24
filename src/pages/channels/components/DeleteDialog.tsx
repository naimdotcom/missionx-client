import type { Channel } from "@/api/services/channels";
import { useMetaDisconnect } from "@/api/services/channels";
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
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteUrlChannelBtnProps {
  channel: Channel;
}

export function DeleteUrlChannelBtn({ channel }: DeleteUrlChannelBtnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const metaDelete = useMetaDisconnect(
    channel.platform === "facebook" ? "meta" : "instagram",
  );

  const isDeleting = metaDelete.isPending;

  const handleDelete = async () => {
    if (
      confirmName.trim().toLowerCase() !== channel.account_name?.toLowerCase()
    ) {
      return;
    }

    try {
      if (channel.id) metaDelete.mutate(channel.id);
      toast.success(`${channel.account_name} has been deleted`);
      setIsOpen(false);
      setConfirmName("");
    } catch (error) {
      toast.error("Failed to delete channel");
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="flex-1 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
      >
        <Trash2 className="size-3.5" />
        Disconnect
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[450px] rounded-[2rem] p-0 border-0 overflow-hidden shadow-2xl bg-background">
          <div className="h-2 bg-destructive/10 w-full" />

          <div className="p-8 space-y-6">
            <DialogHeader className="space-y-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto sm:mx-0">
                <Trash2 className="w-7 h-7 text-destructive" />
              </div>
              <div className="space-y-2">
                <DialogTitle className="text-2xl font-black tracking-tight text-destructive text-center sm:text-left">
                  Remove Channel
                </DialogTitle>
                <DialogDescription className="font-medium text-sm leading-relaxed text-center sm:text-left">
                  This will permanently disconnect{" "}
                  <span className="text-foreground font-bold">
                    "{channel.account_name}"
                  </span>
                  . All synchronized data and automation for this channel will
                  be removed.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-destructive leading-relaxed uppercase tracking-tight">
                Critical: This action is irreversible. You will need to
                re-authorize through{" "}
                {channel.platform === "facebook" ? "Facebook" : "Instagram"} to
                reconnect.
              </p>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="confirm-name"
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1"
              >
                Confirm by typing "{channel.account_name}"
              </Label>
              <Input
                id="confirm-name"
                placeholder="Type channel name..."
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                autoFocus
                className="h-12 bg-muted/40 border-muted-foreground/10 rounded-2xl px-5 font-bold focus-visible:ring-destructive focus-visible:border-destructive transition-all"
              />
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="h-12 rounded-2xl font-bold order-2 sm:order-1 flex-1 sm:flex-none hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                // disabled={
                //   confirmName.trim().toLowerCase() !==
                //     channel.account_name.toLowerCase() || isDeleting
                // }
                className="h-12 rounded-2xl font-bold px-8 shadow-xl shadow-destructive/20 transition-all active:scale-95 order-1 sm:order-2 flex-1"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Removing...
                  </>
                ) : (
                  "Delete Channel"
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
