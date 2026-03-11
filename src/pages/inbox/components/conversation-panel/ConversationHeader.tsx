import { ConversationHistory } from "@/api/services/inbox/inbox.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, PanelRight } from "lucide-react";
import React from "react";

interface ConversationHeaderProps {
  customer?: ConversationHistory["customer"];
  channel?: ConversationHistory["channel"];
  onBack: () => void;
  onShowDetails?: () => void;
  onShowSidebar?: () => void;
}

export const ConversationHeader = React.memo(
  ({
    customer,
    channel,
    onBack,
    onShowDetails,
    onShowSidebar,
  }: ConversationHeaderProps) => {
    return (
      <div className="border-b px-4 py-2 flex items-center justify-between shrink-0 h-14 bg-background z-10">
        <div className="flex items-center gap-2 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0 md:hidden"
          >
            <ArrowLeft className="size-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={customer?.profile_pic_url}
                alt={customer?.display_name || "Avatar"}
              />
              <AvatarFallback>
                {customer?.display_name?.split(" ")[0]?.charAt(0).toUpperCase()}
                {customer?.display_name?.split(" ")[1]?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <h2 className="truncate font-bold text-sm leading-tight">
                {customer?.display_name}
              </h2>

              <span className="capitalize text-[10px] font-bold text-primary/70 tracking-tighter shrink-0">
                {channel?.platform}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="xl:hidden"
            onClick={onShowDetails}
          >
            <Info className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="hidden xl:flex"
            onClick={onShowSidebar}
          >
            <PanelRight className="size-4" />
          </Button>
        </div>
      </div>
    );
  },
);

ConversationHeader.displayName = "ConversationHeader";
