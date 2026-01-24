// Messages service

import type { APIResponse, RequestOptions } from "../types/api.types";
import { API_ENDPOINTS } from "../types/endpoints";
import { BaseAPIService } from "./base.service";
import type {
  MarkReadRequest,
  SendMessagePayload,
  UnifiedMessage,
} from "./types/message.types";

export class MessagesService extends BaseAPIService {
  /**
   * Get all messages for a ticket
   */
  async getByTicket(
    ticketId: string,
    options?: RequestOptions,
  ): Promise<APIResponse<UnifiedMessage[]>> {
    return this.get<UnifiedMessage[]>(
      API_ENDPOINTS.MESSAGES.BY_TICKET(ticketId),
      undefined,
      options,
    );
  }

  /**
   * Send a new message to a ticket
   */
  async sendMessage(
    ticketId: string,
    payload: SendMessagePayload,
    options?: RequestOptions,
  ): Promise<APIResponse<UnifiedMessage>> {
    return this.post<SendMessagePayload, UnifiedMessage>(
      API_ENDPOINTS.MESSAGES.SEND(ticketId),
      payload,
      options,
    );
  }

  /**
   * Get single message details
   */
  async getMessage(
    ticketId: string,
    messageId: string,
    options?: RequestOptions,
  ): Promise<APIResponse<UnifiedMessage>> {
    return this.get<UnifiedMessage>(
      API_ENDPOINTS.MESSAGES.DETAIL(ticketId, messageId),
      undefined,
      options,
    );
  }

  /**
   * Mark messages as read
   */
  async markAsRead(
    ticketId: string,
    messageIds: string[],
    options?: RequestOptions,
  ): Promise<APIResponse<void>> {
    return this.post<MarkReadRequest, void>(
      API_ENDPOINTS.MESSAGES.MARK_READ(ticketId),
      { messageIds },
      options,
    );
  }

  /**
   * Upload attachment and return attachment ID
   */
  async uploadAttachment(
    file: File,
    onProgress?: (progress: number) => void,
    options?: RequestOptions,
  ): Promise<APIResponse<{ id: string; url: string }>> {
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
