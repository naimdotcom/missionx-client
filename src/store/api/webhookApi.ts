import { baseApi } from "./baseApi";

export const webhookApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getChannels: build.query({
      query: () => ({
        url: "/api/v1/channels",
        service: "webhook",
      }),
    }),
    getConversations: build.query({
      query: (params) => ({
        url: "/api/v1/conversations",
        params,
        service: "webhook",
      }),
    }),
    getMessages: build.query({
      query: (conversationId) => ({
        url: `/api/v1/conversations/${conversationId}/messages`,
        service: "webhook",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetChannelsQuery,
  useGetConversationsQuery,
  useGetMessagesQuery,
} = webhookApi;
