// Omnichannel data normalizer - transforms platform-specific payloads into UnifiedMessage format

import {
  FacebookPagePayload,
  InstagramMessagePayload,
  NormalizedPayload,
  PlatformPayload,
} from "~/types/channel";
import {
  Attachment,
  ChannelType,
  ContentType,
  UnifiedMessage,
} from "~/types/message";

export class ChannelNormalizer {
  /**
   * Normalizes a platform-specific payload into our unified message format
   */
  static normalize(
    payload: PlatformPayload,
    channelType: ChannelType,
    ticketId: string,
  ): UnifiedMessage {
    const normalized = this.extractCommonFields(payload, channelType);

    return {
      id: `${channelType}-${normalized.platformId}`,
      ticketId,
      channelType,
      direction: "inbound",
      sender: {
        id: normalized.senderId,
        name: normalized.senderName,
        type: "customer",
      },
      contentType: this.determineContentType(normalized),
      text: normalized.text,
      attachments: this.normalizeAttachments(normalized.attachments),
      timestamp: normalized.timestamp,
      isRead: false,
      platformMessageId: normalized.platformId,
    };
  }

  /**
   * Extracts common fields from platform-specific payloads
   */
  private static extractCommonFields(
    payload: PlatformPayload,
    channelType: ChannelType,
  ): NormalizedPayload {
    if (channelType === "facebook_page") {
      const fbPayload = payload as FacebookPagePayload;
      return {
        platformId: fbPayload.id,
        senderId: fbPayload.from.id,
        senderName: fbPayload.from.name,
        text: fbPayload.message,
        timestamp: fbPayload.created_time,
        attachments: fbPayload.attachments || [],
      };
    } else if (channelType === "instagram_business") {
      const igPayload = payload as InstagramMessagePayload;
      return {
        platformId: igPayload.id,
        senderId: igPayload.from.id,
        senderName: igPayload.from.username,
        text: igPayload.text,
        timestamp: igPayload.timestamp,
        attachments: igPayload.attachments || [],
      };
    }

    throw new Error(`Unsupported channel type: ${channelType}`);
  }

  /**
   * Determines the primary content type of a message
   */
  private static determineContentType(
    normalized: NormalizedPayload,
  ): ContentType {
    if (normalized.attachments.length === 0) {
      return "text";
    }

    const firstAttachment = normalized.attachments[0];
    const type = firstAttachment.type.toLowerCase();

    if (type.includes("image") || type === "photo") return "image";
    if (type.includes("video")) return "video";
    if (type.includes("audio")) return "audio";
    if (type.includes("sticker")) return "sticker";

    return "file";
  }

  /**
   * Normalizes attachment data across platforms
   */
  private static normalizeAttachments(
    platformAttachments: Array<{ type: string; payload: { url: string } }>,
  ): Attachment[] {
    return platformAttachments.map((att, index) => ({
      id: `att-${Date.now()}-${index}`,
      type: this.mapAttachmentType(att.type),
      url: att.payload.url,
      mimeType: this.inferMimeType(att.type),
      status: "uploaded" as const,
    }));
  }

  /**
   * Maps platform-specific attachment types to our ContentType
   */
  private static mapAttachmentType(platformType: string): ContentType {
    const type = platformType.toLowerCase();
    if (type.includes("image") || type === "photo") return "image";
    if (type.includes("video")) return "video";
    if (type.includes("audio")) return "audio";
    if (type.includes("sticker")) return "sticker";
    return "file";
  }

  /**
   * Infers MIME type from platform attachment type
   */
  private static inferMimeType(platformType: string): string {
    const type = platformType.toLowerCase();
    if (type.includes("image") || type === "photo") return "image/jpeg";
    if (type.includes("video")) return "video/mp4";
    if (type.includes("audio")) return "audio/mpeg";
    return "application/octet-stream";
  }

  /**
   * Gets channel-specific constraints for the replier
   */
  static getChannelConstraints(channelType: ChannelType) {
    const constraints = {
      facebook_page: {
        maxTextLength: 8000,
        maxFileSize: 25 * 1024 * 1024, // 25MB
        allowedMimeTypes: [
          "image/jpeg",
          "image/png",
          "image/gif",
          "video/mp4",
          "application/pdf",
        ],
        supportsRichText: false,
        characterCountWarning: 7000,
      },
      instagram_business: {
        maxTextLength: 1000,
        maxFileSize: 8 * 1024 * 1024, // 8MB
        allowedMimeTypes: ["image/jpeg", "image/png", "video/mp4"],
        supportsRichText: false,
        characterCountWarning: 900,
      },
    };

    return constraints[channelType];
  }
}
