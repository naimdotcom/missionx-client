import { UrlChannelType, useMetaAccounts } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Dialog } from "@radix-ui/react-dialog";
import { Facebook, Instagram, Zap } from "lucide-react";

type ChannelListDialogProps = {
  type: UrlChannelType;
};
function ChannelListDialog(props: ChannelListDialogProps) {
  const channelsQuery = useMetaAccounts(props.type);

  return (
    <Dialog>
      <DialogTrigger>
        <Card
          className={cn(
            props.type === "instagram" &&
              "hover:border-pink-500/50 hover:bg-pink-50/50",
            props.type === "meta" &&
              "hover:border-blue-500/50 hover:bg-blue-50/50",
            "group cursor-pointer border transition-all hover:shadow-md active:scale-95",
          )}
        >
          <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
            <div
              className={cn(
                props.type === "instagram" &&
                  "bg-pink-100 text-pink-600 transition-colors group-hover:bg-pink-600 group-hover:text-white",
                props.type === "meta" &&
                  "bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white",
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full ",
              )}
            >
              {props.type === "meta" && <Facebook className="h-5 w-5" />}
              {props.type === "instagram" && <Instagram className="h-5 w-5" />}
            </div>
            <div className="space-y-1 text-start">
              <CardTitle className="text-sm font-medium md:text-base">
                {props.type === "meta" ? "Facebook Page" : "Instagram Business"}
              </CardTitle>
              <CardDescription className="text-xs">
                {props.type === "meta"
                  ? "Connect for Messenger & Comments"
                  : "Connect for DMs & Comments"}
              </CardDescription>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="ml-auto shrink-0 h-8 w-8 md:h-9 md:w-9"
            >
              <Zap className="h-4 w-4" />
            </Button>
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent>{JSON.stringify(channelsQuery.data)}</DialogContent>
    </Dialog>
  );
}

export default ChannelListDialog;
