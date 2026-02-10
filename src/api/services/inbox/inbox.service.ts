import { API_ENDPOINTS, RequestOptions } from "@/api";
import { BaseAPIService } from "@/api/core/base.service";
import { env } from "@/lib/env";

export class InboxService extends BaseAPIService {
  constructor(baseURL: string) {
    super(baseURL);
  }

  conversationList = (options?: RequestOptions) =>
    this.get(API_ENDPOINTS.INBOX.CONVERSATION_LIST, undefined, options);

  conversationHistory = (conversationId: string, options?: RequestOptions) =>
    this.get(
      API_ENDPOINTS.INBOX.CONVERSATION_HISTORY(conversationId),
      undefined,
      options,
    );

  updateConversationStatus = (
    conversationId: string,
    status: "open" | "closed",
    options?: RequestOptions,
  ) =>
    this.put(
      API_ENDPOINTS.INBOX.UPDATE_CONVERSATION_STATUS(conversationId),
      { status },
      options,
    );

  sendMessage = (
    payload: {
      conversationId: string;
      content: string;
      senderType: "user" | "agent";
    },
    options?: RequestOptions,
  ) => this.post(API_ENDPOINTS.INBOX.SEND_MESSAGE, payload, options);

  sendCSATTemplate = (
    payload: {
      conversationId: string;
    },
    options?: RequestOptions,
  ) => this.post(API_ENDPOINTS.INBOX.SEND_CSAT_TEMPLATE, payload, options);
}

export const inboxService = new InboxService(env.channelUrl || "");
