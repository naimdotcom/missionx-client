// Channel normalizer - handles platform-specific validation and formatting
// TODO: Implement channel-specific rules for Facebook and Instagram

import type { ChannelType } from "~/types/message";

export class ChannelNormalizer {
  static getMaxTextLength(channelType: ChannelType): number {
    switch (channelType) {
      case "facebook_page":
        return 8000; // Facebook Messenger limit
      case "instagram_business":
        return 1000; // Instagram DM limit
      default:
        return 2000;
    }
  }

  static getSupportedAttachmentTypes(channelType: ChannelType): string[] {
    switch (channelType) {
      case "facebook_page":
        return ["image", "video", "file", "audio"];
      case "instagram_business":
        return ["image", "video"]; // Instagram more restrictive
      default:
        return ["image", "file"];
    }
  }

  static getMaxAttachmentSize(channelType: ChannelType): number {
    // Returns size in bytes
    switch (channelType) {
      case "facebook_page":
        return 25 * 1024 * 1024; // 25MB
      case "instagram_business":
        return 8 * 1024 * 1024; // 8MB
      default:
        return 10 * 1024 * 1024; // 10MB
    }
  }

  static supportsRichText(_channelType: ChannelType): boolean {
    // Currently, neither platform supports rich text in DMs
    return false;
  }

  static supportsEmojis(_channelType: ChannelType): boolean {
    return true; // Both platforms support emojis
  }

  static validateMessage(
    channelType: ChannelType,
    text: string,
    attachments?: any[],
  ): { valid: boolean; error?: string } {
    const maxLength = this.getMaxTextLength(channelType);

    if (text.length > maxLength) {
      return {
        valid: false,
        error: `Message exceeds maximum length of ${maxLength} characters`,
      };
    }

    if (!text && (!attachments || attachments.length === 0)) {
      return {
        valid: false,
        error: "Message must contain text or at least one attachment",
      };
    }

    return { valid: true };
  }

  static getChannelConstraints(channelType: ChannelType) {
    const maxTextLength = this.getMaxTextLength(channelType);
    return {
      maxTextLength,
      supportedAttachmentTypes: this.getSupportedAttachmentTypes(channelType),
      maxAttachmentSize: this.getMaxAttachmentSize(channelType),
      maxFileSize: this.getMaxAttachmentSize(channelType), // Alias
      supportsRichText: this.supportsRichText(channelType),
      supportsEmojis: this.supportsEmojis(channelType),
      allowedMimeTypes: ["image/*", "video/*", "application/pdf"], // TODO: Make channel-specific
      characterCountWarning: Math.floor(maxTextLength * 0.9), // Warn at 90%
    };
  }
}
