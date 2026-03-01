import { useAuthStore } from "@/stores/auth-store";
import { useEffect, useState } from "react";
import { soketiService } from "./soketi.service";

/**
 * App-level connection hook.
 *
 * Mount this ONCE in PrivateLayout (or a SoketiProvider).
 * It opens the WebSocket for the selected app and keeps it alive across
 * all route changes. Individual modules subscribe to events via their
 * own domain hooks (e.g. useInboxSoketi) without touching the connection.
 *
 * Architecture:
 *   PrivateLayout → useSoketi()           ← manages connect / disconnect
 *   InboxPage     → useInboxSoketi()      ← registers new_message / message_read handlers
 *   CommentsPage  → useCommentsSoketi()   ← registers new_comment handlers
 *   (any module)  → soketiService.on(…)  ← raw low-level access
 */
export function useSoketi() {
  const selectedApp = useAuthStore((s) => s.selectedApp);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  // Lazy initializer — reads current connection state without triggering a render
  const [connected, setConnected] = useState(() => soketiService.isConnected);

  useEffect(() => {
    if (!isAuthenticated || !selectedApp?.id) return;

    soketiService.connect(selectedApp.id);

    const handleOnline = () => setConnected(soketiService.isConnected);
    const handleOffline = () => setConnected(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      // Do NOT disconnect here — the connection must survive route changes.
      // Call soketiService.destroy() only on logout.
    };
  }, [selectedApp?.id, isAuthenticated]);

  return { connected };
}
