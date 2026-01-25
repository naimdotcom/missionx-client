// Messages service

import type { RequestOptions } from "../types/api.types";
import { API_ENDPOINTS } from "../types/endpoints";
import { BaseAPIService } from "./base.service";
import type { SendMessagePayload, UnifiedMessage } from "./types/message.types";

export class MessagesService extends BaseAPIService {
  /**
   * Get all messages for a ticket
   */
  getByTicket = (ticketId: string, options?: RequestOptions) =>
    this.get<UnifiedMessage[]>(
      API_ENDPOINTS.MESSAGES.BY_TICKET(ticketId),
      undefined,
      options,
    );

  /**
   * Send a new message to a ticket
   */
  sendMessage = (
    ticketId: string,
    payload: SendMessagePayload,
    options?: RequestOptions,
  ) =>
    this.post<UnifiedMessage>(
      API_ENDPOINTS.MESSAGES.SEND(ticketId),
      payload,
      options,
    );

  /**
   * Get single message details
   */
  getMessage = (
    ticketId: string,
    messageId: string,
    options?: RequestOptions,
  ) =>
    this.get<UnifiedMessage>(
      API_ENDPOINTS.MESSAGES.DETAIL(ticketId, messageId),
      undefined,
      options,
    );

  /**
   * Mark messages as read
   */
  markAsRead = (
    ticketId: string,
    messageIds: string[],
    options?: RequestOptions,
  ) =>
    this.post<void>(
      API_ENDPOINTS.MESSAGES.MARK_READ(ticketId),
      { messageIds },
      options,
    );

  /**
   * Upload attachment and return attachment ID
   */
  async uploadAttachment(
    file: File,
    onProgress?: (progress: number) => void,
    options?: RequestOptions,
  ) {
    const formData = new FormData();
    formData.append("file", file);

    return this.upload<{ id: string; url: string }>(
      API_ENDPOINTS.UPLOAD.FILE,
      formData,
      {
        ...options,
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            onProgress(percentCompleted);
          }
        },
      },
    );
  }
}

// Export singleton instance
export const messagesService = new MessagesService();
