import { API_ENDPOINTS, RequestOptions } from "@/api";
import { BaseAPIService } from "@/api/core/base.service";
import { env } from "@/lib/env";
import {
  ConversationHistory,
  ConversationHistoryParams,
  ConversationTickets,
  ConversationTicketsParams,
  ConversationTicketStatus,
  MessageSendResponse,
  SendMessagePayload,
} from "./inbox.type";

export class InboxService extends BaseAPIService {
  constructor(baseURL: string) {
    super(baseURL);
  }

  conversationList = (
    params: ConversationTicketsParams,
    options?: RequestOptions,
  ) =>
    this.get<ConversationTickets>(
      API_ENDPOINTS.INBOX.CONVERSATION_LIST,
      params,
      options,
    );

  conversationHistory = (
    conversationID: string,
    params?: ConversationHistoryParams,
    options?: RequestOptions,
  ) =>
    this.get<ConversationHistory>(
      API_ENDPOINTS.INBOX.CONVERSATION_HISTORY(conversationID),
      params,
      options,
    );

  updateConversationStatus = (
    conversationId: string,
    status: ConversationTicketStatus,
    options?: RequestOptions,
  ) =>
    this.patch(
      API_ENDPOINTS.INBOX.UPDATE_CONVERSATION_STATUS(conversationId),
      { status },
      options,
    );

  sendMessage = (payload: SendMessagePayload, options?: RequestOptions) =>
    this.post<MessageSendResponse>(
      API_ENDPOINTS.INBOX.SEND_MESSAGE,
      payload,
      options,
    );

  markAsRead = (conversationId: string, options?: RequestOptions) =>
    this.post(
      API_ENDPOINTS.INBOX.MARK_AS_READ(conversationId),
      undefined,
      options,
    );

  // sendCSATTemplate = (
  //   payload: {
  //     conversationId: string;
  //   },
  //   options?: RequestOptions,
  // ) => this.post(API_ENDPOINTS.INBOX.SEND_CSAT_TEMPLATE, payload, options);
}

export const inboxService = new InboxService(env.channelUrl || "");
