import { useState } from "react";
import { OperatorSession } from "@/api/services/operator/operator.type";
import { ChatPanel } from "./components/ChatPanel";
import { SessionSidebar } from "./components/SessionSidebar";

export default function OperatorPage() {
  const [activeSession, setActiveSession] = useState<OperatorSession | null>(
    null,
  );

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <SessionSidebar
        activeId={activeSession?.id ?? null}
        onSelect={setActiveSession}
      />
      <ChatPanel session={activeSession} />
    </div>
  );
}
