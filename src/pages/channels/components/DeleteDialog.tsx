import { useDeleteChannel, type Channel } from "@/api/services/channels";
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

interface DeleteUrlChannelBtnProps {
  channel: Channel;
}

export function DeleteUrlChannelBtn({ channel }: DeleteUrlChannelBtnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const channelDeleteMutation = useDeleteChannel();

  const handleDelete = async () => {
    const isNameNotConfirmed =
      confirmName.trim().toLowerCase() !== channel.account_name?.toLowerCase();
    if (isNameNotConfirmed) return;
    else if (channel.channel_id) {
      channelDeleteMutation.mutate(channel.channel_id);
      setIsOpen(false);
      setConfirmName("");
    }
  };

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="size-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        title="Disconnect channel"
      >
        <Trash2 className="size-3.5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-115">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="size-4 text-destructive" />
              Delete Channel
            </DialogTitle>
            <DialogDescription>
              This will permanently disconnect this channel from your app.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-md border bg-muted/40 p-3 text-sm">
              <p>
                <span className="font-medium">Channel:</span>{" "}
                {channel.account_name || "N/A"}
              </p>
              <p className="mt-1 capitalize">
                <span className="font-medium">Platform:</span>{" "}
                {channel.platform || "N/A"}
              </p>
            </div>

            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <p>
                This action cannot be undone. To reconnect, you will need to
                authorize again from{" "}
                {channel.platform === "facebook" ? "Facebook" : "Instagram"}.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-name">
                Type <span className="font-medium">{channel.account_name}</span>{" "}
                to confirm
              </Label>
              <Input
                id="confirm-name"
                placeholder="Enter channel name"
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={
                confirmName.trim().toLowerCase() !==
                  channel.account_name?.toLowerCase() ||
                channelDeleteMutation.isPending
              }
            >
              {channelDeleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
