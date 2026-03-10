import { ConversationTicket } from "@/api/services/inbox/inbox.type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { mockNotes, mockOrders } from "../const";
import { CustomerInfoWidget } from "./widgets";
import { NotesWidget } from "./widgets/NotesWidget";
import { OrderHistoryWidget } from "./widgets/OrderHistoryWidget";

interface DetailsPanelProps {
  className?: string;
  selectedTicket?: ConversationTicket;
}

export function WidgetPanel({ className, selectedTicket }: DetailsPanelProps) {
  return (
    <div
      className={cn("flex flex-col h-full min-h-0 overflow-hidden", className)}
    >
      <ScrollArea className="h-full w-full">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4">
            <CustomerInfoWidget selectedTicket={selectedTicket} />
            <OrderHistoryWidget orders={mockOrders} />
            <NotesWidget notes={mockNotes} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
