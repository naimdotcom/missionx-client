import { API_ENDPOINTS } from "@/api";
import { BaseAPIService } from "@/api/core/base.service";
import { env } from "@/lib/env";
import type {
  AppChannelDisconnectParams,
  ChannelConnectPayload,
  ChannelsListParams,
  ChannelsListResponse,
  ChannelSubscribePayload,
  ChannelSubscribeResponse,
} from "./channels.types";

export class ChannelsService extends BaseAPIService {
  constructor(baseURL: string) {
    super(baseURL);
  }

  channelConnect = (payload: ChannelConnectPayload) => {
    return this.post(API_ENDPOINTS.CHANNELS.CHANNEL_CONNECT, payload);
  };

  channelsList = (params?: ChannelsListParams) => {
    return this.get<ChannelsListResponse>(
      API_ENDPOINTS.CHANNELS.CHANNELS_LIST,
      params,
    );
  };

  channelSubscribe = (payload: ChannelSubscribePayload) => {
    return this.post<ChannelSubscribeResponse>(
      API_ENDPOINTS.CHANNELS.SUBSCRIBE_CHANNEL,
      payload,
    );
  };

  channelUnsubscribe = (payload: { channel_id: string }) => {
    return this.post(API_ENDPOINTS.CHANNELS.UNSUBSCRIBE_CHANNEL, payload);
  };

  appAllChannelDisconnect = (params: AppChannelDisconnectParams) => {
    return this.delete(API_ENDPOINTS.CHANNELS.APP_CHANNEL_DISCONNECT, params);
  };

  deleteChannel = (channel_id: string) => {
    return this.delete(API_ENDPOINTS.CHANNELS.DELETE_CHANNEL(channel_id));
  };
}

export const channelsService = new ChannelsService(env.channelUrl || "");
