// Channels service types

import type { ChannelType } from "./ticket.types";

export interface ChannelConnection {
  id: string;
  workspaceId: string;
  channelType: ChannelType;
  name: string;
  platformId: string; // Facebook Page ID or Instagram Business Account ID
  isActive: boolean;
  avatarUrl?: string;
  metadata?: {
    pageAccessToken?: string;
    instagramBusinessAccountId?: string;
    followers?: number;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ConnectChannelRequest {
  workspaceId: string;
  channelType: ChannelType;
  platformId: string;
  name: string;
  accessToken?: string;
  metadata?: Record<string, any>;
}
