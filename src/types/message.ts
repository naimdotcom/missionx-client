// Core message and communication types for the CX platform

export type ChannelType = "facebook_page" | "instagram_business";
export type MessageDirection = "inbound" | "outbound";
export type ContentType =
  | "text"
  | "image"
  | "video"
  | "file"
  | "audio"
  | "sticker";
export type AttachmentStatus = "pending" | "uploading" | "uploaded" | "failed";

export interface Sender {
  id: string;
  name: string;
  avatarUrl?: string;
  type: "customer" | "agent" | "system";
}

export interface Attachment {
  id: string;
  type: ContentType;
  url: string;
  previewUrl?: string; // Local blob URL before upload
  fileName?: string;
  fileSize?: number;
  mimeType: string;
  status: AttachmentStatus;
  uploadProgress?: number; // 0-100
}

export interface UnifiedMessage {
  id: string;
  ticketId: string;
  channelType: ChannelType;
  direction: MessageDirection;
  sender: Sender;
  contentType: ContentType;
  text?: string;
  attachments: Attachment[];
  timestamp: string; // ISO 8601
  isRead: boolean;
  isOptimistic?: boolean; // True during optimistic update
  platformMessageId?: string; // Original Facebook/Instagram ID
  metadata?: {
    replyToId?: string; // Threading support
    reactions?: string[];
  };
}

export interface MessagePayload {
  ticketId: string;
  text?: string;
  attachments?: Attachment[];
  replyToId?: string;
}
