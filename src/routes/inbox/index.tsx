import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthStore } from "~/stores/auth-store";
import { useInboxStore } from "~/stores/inbox-store";

export const Route = createFileRoute("/inbox/")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: InboxPage,
});

// Mock data for demonstration
const mockConversations = [
  {
    id: "1",
    channelConnectionId: "ch1",
    contactId: "c1",
    status: "open",
    lastMessageAt: new Date().toISOString(),
    lastMessagePreview: "Hey! I have a question about...",
    unreadCount: 2,
    contact: {
      id: "c1",
      name: "Sarah Johnson",
      username: "sarah.j",
      avatarUrl: "",
      platform: "facebook",
    },
    channel: {
      id: "ch1",
      type: "facebook_page",
      platformName: "My Business Page",
      platformAvatarUrl: "",
    },
  },
  {
    id: "2",
    channelConnectionId: "ch2",
    contactId: "c2",
    status: "open",
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    lastMessagePreview: "Thanks for your help!",
    unreadCount: 0,
    contact: {
      id: "c2",
      name: "Mike Chen",
      username: "mikechen",
      avatarUrl: "",
      platform: "instagram",
    },
    channel: {
      id: "ch2",
      type: "instagram_business",
      platformName: "@mybusiness",
      platformAvatarUrl: "",
    },
  },
  {
    id: "3",
    channelConnectionId: "ch1",
    contactId: "c3",
    status: "open",
    lastMessageAt: new Date(Date.now() - 7200000).toISOString(),
    lastMessagePreview: "Can you send me more details?",
    unreadCount: 1,
    contact: {
      id: "c3",
      name: "Emma Wilson",
      username: "emma.w",
      avatarUrl: "",
      platform: "facebook",
    },
    channel: {
      id: "ch1",
      type: "facebook_page",
      platformName: "My Business Page",
      platformAvatarUrl: "",
    },
  },
];

function InboxPage() {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    setConversations,
  } = useInboxStore();
  const { user, logout } = useAuthStore();

  // Load mock data on mount
  useEffect(() => {
    if (conversations.length === 0) {
      setConversations(mockConversations);
    }
  }, [conversations.length, setConversations]);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Conversation List */}
      <aside className="w-80 border-r border-border bg-card">
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <h1 className="text-lg font-semibold">Inbox</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-foreground"
            title={`Logged in as ${user?.email}`}
          >
            Logout
          </button>
        </div>
        <div className="overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>No conversations yet</p>
              <p className="mt-2 text-sm">
                Connect your channels to start receiving messages
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className={`w-full border-b border-border p-4 text-left transition-colors hover:bg-accent ${
                  activeConversationId === conv.id ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {conv.contact?.name?.[0] || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">
                        {conv.contact?.name || "Unknown"}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground truncate">
                      {conv.lastMessagePreview || "No messages"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {conv.channel?.platformName} • {conv.channel?.type}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Message Thread */}
      <main className="flex-1 flex flex-col">
        {activeConversationId ? (
          <>
            <div className="flex h-16 items-center border-b border-border px-6">
              <h2 className="font-semibold">Conversation</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-center text-muted-foreground">
                <p>Message thread will appear here</p>
              </div>
            </div>
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
