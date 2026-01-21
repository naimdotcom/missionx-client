import { create } from 'zustand';
import type { ChannelConnection } from '@/db/schema';

interface ChannelState {
  channels: ChannelConnection[];
  isConnecting: boolean;
  selectedChannel: ChannelConnection | null;
  setChannels: (channels: ChannelConnection[]) => void;
  addChannel: (channel: ChannelConnection) => void;
  updateChannel: (id: string, updates: Partial<ChannelConnection>) => void;
  removeChannel: (id: string) => void;
  setConnecting: (connecting: boolean) => void;
  setSelectedChannel: (channel: ChannelConnection | null) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  channels: [],
  isConnecting: false,
  selectedChannel: null,
  
  setChannels: (channels) => set({ channels }),
  
  addChannel: (channel) =>
    set((state) => ({
      channels: [...state.channels, channel],
    })),
  
  updateChannel: (id, updates) =>
    set((state) => ({
      channels: state.channels.map((ch) =>
        ch.id === id ? { ...ch, ...updates } : ch
      ),
    })),
  
  removeChannel: (id) =>
    set((state) => ({
      channels: state.channels.filter((ch) => ch.id !== id),
    })),
  
  setConnecting: (connecting) => set({ isConnecting: connecting }),
  
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
}));
