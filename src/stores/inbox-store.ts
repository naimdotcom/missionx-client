import { create } from "zustand";

interface Message {
  id: string;
  conversationId: string;
  platformMessageId: string;
  direction: "inbound" | "outbound";
  contentType: string;
  text?: string;
  payload?: any;
  senderId?: string;
  senderPlatformId?: string;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  id: string;
  channelConnectionId: string;
  contactId: string;
  assignedUserId?: string;
  status: string;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  unreadCount: number;
  contact?: {
    id: string;
    name?: string;
    username?: string;
    avatarUrl?: string;
    platform: string;
  };
  channel?: {
    id: string;
    type: string;
    platformName: string;
    platformAvatarUrl?: string;
  };
}

interface InboxState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  markAsRead: (conversationId: string) => void;
}

export const useInboxStore = create<InboxState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},

  setConversations: (conversations) => set({ conversations }),

  setActiveConversation: (id) => set({ activeConversationId: id }),

  addMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
    })),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
    })),

  updateConversation: (id, updates) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, ...updates } : conv,
      ),
    })),

  markAsRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
      ),
    })),
}));
