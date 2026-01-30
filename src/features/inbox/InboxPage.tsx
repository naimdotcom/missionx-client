// Simple inbox page with mock data

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ConversationArea from "./components/ConversationPanel";
import TicketsPanel from "./components/TicketPanel";
import { DetailsPanel } from "./components/WidgetPanel";

function InboxPage() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>("1");
  const [showDetails, setShowDetails] = useState(false);

  const handleSendMessage = async (message: string, attachments?: File[]) => {
    console.log("Sending message:", message, "Attachments:", attachments);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-[350px_1fr] xl:grid-cols-[350px_1fr_350px] 2xl:grid-cols-[400px_1fr_400px] h-full overflow-hidden bg-background">
      <TicketsPanel
        className={cn(
          "border-r-0 md:border-r",
          selectedTicket ? "hidden md:block" : "w-full md:w-auto",
        )}
        setSelectedTicket={setSelectedTicket}
        selectedTicket={selectedTicket || undefined}
      />

      <ConversationArea
        className={cn(!selectedTicket ? "hidden md:flex" : "flex")}
        selectedTicket={selectedTicket || undefined}
        handleSendMessage={handleSendMessage}
        onBack={() => setSelectedTicket(null)}
        onShowDetails={() => setShowDetails(true)}
      />

      <DetailsPanel className="border-l hidden xl:block" />

      <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent side="right" className="w-[90%] sm:w-[400px] p-0 pt-10">
          <DetailsPanel className="w-full border-0" />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default InboxPage;
