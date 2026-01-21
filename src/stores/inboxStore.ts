import { create } from 'zustand';
import type { Conversation, Message } from '@/db/schema';

interface InboxState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Record<string, Message[]>; // conversationId -> messages[]
  unreadCount: number;
  isLoading: boolean;
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  setSelectedConversation: (conversation: Conversation | null) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  setUnreadCount: (count: number) => void;
  setLoading: (loading: boolean) => void;
  clearInbox: () => void;
}

export const useInboxStore = create<InboxState>((set) => ({
  conversations: [],
  selectedConversation: null,
  messages: {},
  unreadCount: 0,
  isLoading: false,
  
  setConversations: (conversations) => set({ conversations }),
  
  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),
  
  setSelectedConversation: (conversation) =>
    set({ selectedConversation: conversation }),
  
  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
    })),
  
  addMessage: (conversationId, message) =>
    set((state) => {
      const existingMessages = state.messages[conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...existingMessages, message],
        },
      };
    }),
  
  updateMessage: (conversationId, messageId, updates) =>
    set((state) => {
      const messages = state.messages[conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [conversationId]: messages.map((msg) =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          ),
        },
      };
    }),
  
  setUnreadCount: (count) => set({ unreadCount: count }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  clearInbox: () =>
    set({
      conversations: [],
      selectedConversation: null,
      messages: {},
      unreadCount: 0,
      isLoading: false,
    }),
}));
