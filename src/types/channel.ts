// Channel and platform integration types

import { ChannelType } from "./message";

export interface ChannelConnection {
  id: string;
  type: ChannelType;
  platformName: string; // e.g., "Facebook", "Instagram"
  accountName: string; // Page/account name
  accountId: string; // Platform-specific ID
  avatarUrl?: string;
  isActive: boolean;
  capabilities: ChannelCapabilities;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ChannelCapabilities {
  supportsText: boolean;
  supportsImages: boolean;
  supportsVideos: boolean;
  supportsFiles: boolean;
  supportsAudio: boolean;
  supportsStickers: boolean;
  maxTextLength: number; // Character limit
  maxFileSize: number; // In bytes
  allowedMimeTypes: string[];
}

export interface FacebookPagePayload {
  id: string;
  message?: string;
  from: {
    id: string;
    name: string;
  };
  created_time: string;
  attachments?: Array<{
    type: string;
    payload: {
      url: string;
    };
  }>;
}

export interface InstagramMessagePayload {
  id: string;
  text?: string;
  from: {
    id: string;
    username: string;
  };
  timestamp: string;
  attachments?: Array<{
    type: string;
    payload: {
      url: string;
    };
  }>;
}

export type PlatformPayload = FacebookPagePayload | InstagramMessagePayload;

export interface NormalizedPayload {
  platformId: string;
  senderId: string;
  senderName: string;
  text?: string;
  timestamp: string;
  attachments: Array<{
    type: string;
    payload: {
      url: string;
    };
  }>;
}
