import { ScrollArea } from "@/components/ui/scroll-area";
import { mockCustomerData, mockNotes, mockOrders } from "../const";
import { CustomerInfoWidget, NotesWidget, OrderHistoryWidget } from "./widgets";

export function DetailsPanel() {
  const handleAddNote = (content: string) => {
    console.log("Adding note:", content);
  };
  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <ScrollArea className="h-full w-full">
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4">
            <CustomerInfoWidget customer={mockCustomerData} />
            <OrderHistoryWidget orders={mockOrders} />
            <NotesWidget notes={mockNotes} onAddNote={handleAddNote} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
