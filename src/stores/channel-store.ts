import { create } from "zustand";

interface ChannelConnection {
  id: string;
  type: "facebook_page" | "instagram_business";
  platformId: string;
  platformName: string;
  platformUsername?: string;
  platformAvatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

interface ChannelState {
  channels: ChannelConnection[];
  selectedChannelId: string | null;
  setChannels: (channels: ChannelConnection[]) => void;
  addChannel: (channel: ChannelConnection) => void;
  removeChannel: (id: string) => void;
  updateChannel: (id: string, updates: Partial<ChannelConnection>) => void;
  setSelectedChannel: (id: string | null) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  channels: [],
  selectedChannelId: null,

  setChannels: (channels) => set({ channels }),

  addChannel: (channel) =>
    set((state) => ({
      channels: [...state.channels, channel],
    })),

  removeChannel: (id) =>
    set((state) => ({
      channels: state.channels.filter((ch) => ch.id !== id),
      selectedChannelId:
        state.selectedChannelId === id ? null : state.selectedChannelId,
    })),

  updateChannel: (id, updates) =>
    set((state) => ({
      channels: state.channels.map((ch) =>
        ch.id === id ? { ...ch, ...updates } : ch,
      ),
    })),

  setSelectedChannel: (id) => set({ selectedChannelId: id }),
}));
