// Simple inbox page with mock data

import { ConversationTicket } from "@/api/services/inbox/inbox.type";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Route } from "@/routes";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import ConversationArea from "./components/ConversationPanel";
import TicketsPanel from "./components/TicketPanel";
import { DetailsPanel } from "./components/WidgetPanel";

function InboxPage() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate({ from: Route.fullPath });
  const [selectedTicket, setSelectedTicket] = useState<
    ConversationTicket | undefined
  >(undefined);
  const { case: selectedCase } = useSearch({ from: "/_private/inbox" });

  const handleSendMessage = async (message: string, attachments?: File[]) => {
    console.log("Sending message:", message, "Attachments:", attachments);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <div
      className={cn(
        "h-full overflow-hidden",
        "md:grid grid-cols-[400px_1fr_auto]",
      )}
    >
      <TicketsPanel
        className={cn(
          "border-r-0 md:border-r",
          selectedCase ? "hidden md:grid" : "w-full",
        )}
        selectedTicket={selectedTicket?.id}
        setSelectedTicket={(ticket) => setSelectedTicket(ticket)}
      />

      <ConversationArea
        handleSendMessage={handleSendMessage}
        onBack={() =>
          navigate({ search: (prev) => ({ ...prev, case: undefined }) })
        }
        selectedTicket={selectedTicket}
        onShowDetails={() => setShowDetails(true)}
        onShowSidebar={() => setShowSidebar((prev) => !prev)}
        className={cn(
          "min-w-0",
          !selectedCase ? "hidden md:flex" : "flex h-full",
        )}
      />

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
