// Simple inbox page with mock data

import { ConversationTicket } from "@/api/services/inbox/inbox.type";
import { useInboxSoketi } from "@/api/services/soketi/use-inbox-soketi";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useSearch } from "@tanstack/react-router";
import { Inbox } from "lucide-react";
import { useState } from "react";
import ConversationArea from "./components/ConversationPanel";
import TicketsPanel from "./components/TicketPanel";
import { WidgetPanel } from "./components/WidgetPanel";

function InboxPage() {
  useInboxSoketi();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<
    ConversationTicket | undefined
  >(undefined);

  const { case: selectedParamsConversation } = useSearch({
    from: "/_private/inbox",
  });

  return (
    <div
      className={cn(
        "h-full overflow-hidden",
        "md:grid grid-cols-[350px_1fr_auto] lg:grid-cols-[400px_1fr_auto]",
      )}
    >
      <TicketsPanel
        selectedTicket={selectedParamsConversation}
        setSelectedTicket={(ticket) => setSelectedConversation(ticket)}
      />

      {selectedParamsConversation && (
        <ConversationArea
          selectedTicket={selectedConversation}
          onShowDetails={() => setShowDetails(true)}
          unreadCount={selectedConversation?.unread_count}
          onShowSidebar={() => setShowSidebar((prev) => !prev)}
        />
      )}

      {!selectedParamsConversation && (
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
          "hidden xl:block shrink-0 transition-[width] duration-300 overflow-hidden bg-background",
          showSidebar && selectedParamsConversation
            ? "w-87.5 2xl:w-100 border-l"
            : "w-0 border-none",
        )}
      >
        <WidgetPanel selectedTicket={selectedConversation} />
      </div>

      <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent side="right" className="w-[90%] sm:w-100 p-0 pt-10">
          <WidgetPanel
            className="w-full border-0"
            selectedTicket={selectedConversation}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default InboxPage;
