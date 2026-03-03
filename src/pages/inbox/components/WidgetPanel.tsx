import { useConversationHistory } from "@/api/services/inbox/inbox.hook";
import { ConversationTicket } from "@/api/services/inbox/inbox.type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { mockNotes, mockOrders } from "../const";
import { CustomerInfoWidget, NotesWidget, OrderHistoryWidget } from "./widgets";

interface DetailsPanelProps {
  className?: string;
  selectedTicket?: ConversationTicket;
  conversationId?: string;
}

export function WidgetPanel({
  className,
  selectedTicket,
  conversationId,
}: DetailsPanelProps) {
  const conversationHistoryQuery = useConversationHistory(conversationId || "");

  const customerData = useMemo(() => {
    const firstPage = conversationHistoryQuery.data?.pages?.[0];
    const customer = firstPage?.customer;
    const channel = firstPage?.channel;

    if (customer || selectedTicket) {
      return {
        name:
          customer?.display_name || selectedTicket?.customer_name || "Unknown",
        avatar:
          customer?.profile_pic_url || selectedTicket?.customer_profile_pic,
        platform: channel?.platform || selectedTicket?.platform,
        platformId:
          customer?.platform_id || selectedTicket?.customer_platform_id,
        status: selectedTicket?.status,
      };
    }
    return null;
  }, [conversationHistoryQuery.data?.pages, selectedTicket]);

  const handleAddNote = (content: string) => {
    console.log("Adding note:", content);
  };

  return (
    <div
      className={cn("flex flex-col h-full min-h-0 overflow-hidden", className)}
    >
      <ScrollArea className="h-full w-full">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4">
            <CustomerInfoWidget
              customer={{
                name: customerData?.name || "No customer selected",
                avatar: customerData?.avatar,
                platform: customerData?.platform,
                platformId: customerData?.platformId,
                status: customerData?.status,
              }}
            />
            <OrderHistoryWidget orders={mockOrders} />
            <NotesWidget notes={mockNotes} onAddNote={handleAddNote} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
