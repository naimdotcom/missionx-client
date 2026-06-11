import { API_ENDPOINTS, RequestOptions } from "@/api";
import { appClient } from "@/api/core/init";
import {
  ChangesetPreview,
  CreateSessionPayload,
  FeedMessage,
  MessageAccepted,
  OperatorSession,
  PostMessageBody,
} from "./operator.type";

export const operatorService = {
  listSessions: (options?: RequestOptions) =>
    appClient.get<OperatorSession[]>(
      API_ENDPOINTS.OPERATOR.SESSIONS,
      undefined,
      options,
    ),

  createSession: (payload: CreateSessionPayload, options?: RequestOptions) =>
    appClient.post<OperatorSession, CreateSessionPayload>(
      API_ENDPOINTS.OPERATOR.SESSIONS,
      payload,
      options,
    ),

  getMessages: (sessionId: string, options?: RequestOptions) =>
    appClient.get<FeedMessage[]>(
      API_ENDPOINTS.OPERATOR.SESSION_MESSAGES(sessionId),
      undefined,
      options,
    ),

  postMessage: (
    sessionId: string,
    body: PostMessageBody,
    options?: RequestOptions,
  ) =>
    appClient.post<MessageAccepted, PostMessageBody>(
      API_ENDPOINTS.OPERATOR.SESSION_MESSAGES(sessionId),
      body,
      options,
    ),

  getChangesetPreview: (
    changesetId: string,
    params?: { offset?: number; limit?: number },
    options?: RequestOptions,
  ) =>
    appClient.get<ChangesetPreview>(
      API_ENDPOINTS.OPERATOR.CHANGESET_PREVIEW(changesetId),
      params,
      options,
    ),
};
