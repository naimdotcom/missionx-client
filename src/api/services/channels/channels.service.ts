import { API_ENDPOINTS } from "@/api";
import type {
  AppChannelDisconnectParams,
  ChannelConnectPayload,
  ChannelsListParams,
  ChannelsListResponse,
  ChannelSubscribePayload,
  ChannelSubscribeResponse,
} from "./channels.types";
import { channelClient } from "@/api/core/init";

export const channelService = {
  channelConnect: (payload: ChannelConnectPayload) => {
    return channelClient.post(API_ENDPOINTS.CHANNELS.CHANNEL_CONNECT, payload);
  },

  channelsList: (params?: ChannelsListParams) => {
    return channelClient.get<ChannelsListResponse>(
      API_ENDPOINTS.CHANNELS.CHANNELS_LIST,
      params,
    );
  },

  channelSubscribe: (payload: ChannelSubscribePayload) => {
    return channelClient.post<ChannelSubscribeResponse>(
      API_ENDPOINTS.CHANNELS.SUBSCRIBE_CHANNEL,
      payload,
    );
  },

  channelUnsubscribe: (payload: { channel_id: string }) => {
    return channelClient.post(
      API_ENDPOINTS.CHANNELS.UNSUBSCRIBE_CHANNEL,
      payload,
    );
  },

  appAllChannelDisconnect: (params: AppChannelDisconnectParams) => {
    return channelClient.delete(
      API_ENDPOINTS.CHANNELS.APP_CHANNEL_DISCONNECT,
      params,
    );
  },

  deleteChannel: (channel_id: string) => {
    return channelClient.delete(
      API_ENDPOINTS.CHANNELS.DELETE_CHANNEL(channel_id),
    );
  },
};
