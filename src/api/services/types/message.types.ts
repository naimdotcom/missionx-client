// Message service types

import type { ChannelType } from "./ticket.types";

export type MessageDirection = "inbound" | "outbound";
export type ContentType = "text" | "image" | "video" | "file" | "audio";

export interface UnifiedMessage {
  id: string;
  ticketId: string;
  channelType: ChannelType;
  direction: MessageDirection;
  sender: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  contentType: ContentType;
  text?: string;
  attachments: Attachment[];
  timestamp: string; // ISO 8601
  isRead: boolean;
  isOptimistic?: boolean; // For optimistic updates
  platformMessageId?: string;
}

export interface Attachment {
  id: string;
  type: ContentType;
  url: string;
  filename?: string;
  fileName?: string; // Legacy alias for compatibility
  size?: number; // bytes
  fileSize?: number; // Legacy alias
  thumbnailUrl?: string;
  previewUrl?: string; // For local previews during upload
  mimeType?: string;

  // Upload state (client-side only, not sent to API)
  status?: "uploading" | "uploaded" | "failed";
  uploadProgress?: number;
}

export interface SendMessageRequest {
  ticketId: string;
  text?: string;
  attachments?: File[];
}

export interface SendMessagePayload {
  text?: string;
  attachmentIds?: string[]; // IDs from upload endpoint
}

export interface MarkReadRequest {
  messageIds: string[];
}
