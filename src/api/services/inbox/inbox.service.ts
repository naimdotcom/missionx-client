import { API_ENDPOINTS, RequestOptions } from "@/api";
import { channelClient } from "@/api/core/init";
import {
  ConversationHistory,
  ConversationHistoryParams,
  ConversationTickets,
  ConversationTicketsParams,
  ConversationTicketStatus,
  MessageSendResponse,
  SendMessagePayload,
} from "./inbox.type";

export const conversationList = (
  params: ConversationTicketsParams,
  options?: RequestOptions,
) =>
  channelClient.get<ConversationTickets>(
    API_ENDPOINTS.INBOX.CONVERSATION_LIST,
    params,
    options,
  );

export const conversationHistory = (
  conversationID: string,
  params?: ConversationHistoryParams,
  options?: RequestOptions,
) =>
  channelClient.get<ConversationHistory>(
    API_ENDPOINTS.INBOX.CONVERSATION_HISTORY(conversationID),
    params,
    options,
  );

export const updateConversationStatus = (
  conversationId: string,
  status: ConversationTicketStatus,
  options?: RequestOptions,
) =>
  channelClient.patch(
    API_ENDPOINTS.INBOX.UPDATE_CONVERSATION_STATUS(conversationId),
    { status },
    options,
  );

export const sendMessage = (
  payload: SendMessagePayload,
  options?: RequestOptions,
) =>
  channelClient.post<MessageSendResponse>(
    API_ENDPOINTS.INBOX.SEND_MESSAGE,
    payload,
    options,
  );

export const markAsRead = (conversationId: string, options?: RequestOptions) =>
  channelClient.post(
    API_ENDPOINTS.INBOX.MARK_AS_READ(conversationId),
    undefined,
    options,
  );

// export const sendCSATTemplate = (
//   payload: {
//     conversationId: string;
//   },
//   options?: RequestOptions,
// ) => channelClient.post(API_ENDPOINTS.INBOX.SEND_CSAT_TEMPLATE, payload, options);
