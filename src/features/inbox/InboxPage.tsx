// Simple inbox page with mock data

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import ConversationArea from "./components/ConversationPanel";
import TicketsPanel from "./components/TicketPanel";
import { DetailsPanel } from "./components/WidgetPanel";

function InboxPage() {
  const isMobile = useIsMobile();
  const [selectedTicket, setSelectedTicket] = useState<string | null>("1");
  const [showDetails, setShowDetails] = useState(false);

  const handleSendMessage = async (message: string, attachments?: File[]) => {
    console.log("Sending message:", message, "Attachments:", attachments);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-full w-full overflow-hidden bg-background">
        {!selectedTicket ? (
          <TicketsPanel
            selectedTicket={selectedTicket || undefined}
            setSelectedTicket={setSelectedTicket}
            className="w-full border-r-0"
          />
        ) : (
          <ConversationArea
            selectedTicket={selectedTicket}
            handleSendMessage={handleSendMessage}
            onBack={() => setSelectedTicket(null)}
            onShowDetails={() => setShowDetails(true)}
          />
        )}

        <Sheet open={showDetails} onOpenChange={setShowDetails}>
          <SheetContent side="right" className="w-[90%] sm:w-[400px] p-0 pt-10">
            <DetailsPanel className="w-full border-0" />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[400px_1fr_400px] h-full overflow-hidden bg-background">
      <TicketsPanel
        selectedTicket={selectedTicket || undefined}
        setSelectedTicket={setSelectedTicket}
        className="border-r"
      />

      <ConversationArea
        selectedTicket={selectedTicket || undefined}
        handleSendMessage={handleSendMessage}
      />

      <DetailsPanel className="border-l" />
    </div>
  );
}

export default InboxPage;
