// Simple inbox page with mock data

import { ConversationTicket } from "@/api/services/inbox/inbox.type";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useSearch } from "@tanstack/react-router";
import { Inbox } from "lucide-react";
import { useState } from "react";
import ConversationArea from "./components/ConversationPanel";
import TicketsPanel from "./components/TicketPanel";
import { DetailsPanel } from "./components/WidgetPanel";

function InboxPage() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<
    ConversationTicket | undefined
  >(undefined);
  console.log(selectedTicket);

  const { case: selectedCase } = useSearch({ from: "/_private/inbox" });

  return (
    <div
      className={cn(
        "h-full overflow-hidden",
        "md:grid grid-cols-[400px_1fr_auto]",
      )}
    >
      <TicketsPanel
        selectedTicket={selectedCase}
        setSelectedTicket={(ticket) => setSelectedTicket(ticket)}
      />
      {selectedCase && (
        <ConversationArea
          selectedTicket={selectedCase}
          onShowDetails={() => setShowDetails(true)}
          onShowSidebar={() => setShowSidebar((prev) => !prev)}
        />
      )}
      {!selectedCase && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Inbox className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              No conversation selected
            </h3>
            <p className="text-sm text-muted-foreground">
              Select a ticket from the list to view the conversation
            </p>
          </div>
        </div>
      )}
      <div
        className={cn(
          "hidden xl:block shrink-0 transition-[width] duration-200 ease-linear overflow-hidden bg-background",
          showSidebar && selectedCase
            ? "w-[350px] 2xl:w-[400px] border-l"
            : "w-0 border-none",
        )}
      >
        <DetailsPanel className="w-[350px] 2xl:w-[400px] h-full border-none" />
      </div>
      <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent side="right" className="w-[90%] sm:w-[400px] p-0 pt-10">
          <DetailsPanel className="w-full border-0" />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default InboxPage;
