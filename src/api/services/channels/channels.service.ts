import { API_ENDPOINTS, RequestOptions } from "@/api";
import { BaseAPIService } from "@/api/core/base.service";
import { env } from "@/lib/env";
import type {
  ChannelSubscribeAppRequest,
  ConnectChannelResponse,
  MetaAccountChannels,
  MetaCallbackResponse,
  MetaSubscriptionStatusResponse,
  UrlChannelType,
} from "./channels.types";

export class ChannelsService extends BaseAPIService {
  constructor(baseURL: string) {
    super(baseURL);
  }

  getMetaAccountChannels = (type: UrlChannelType, options?: RequestOptions) =>
    this.get<MetaAccountChannels>(
      API_ENDPOINTS.CHANNELS.META_ACCOUNTS(type),
      undefined,
      options,
    );

  getMyChannels = (options?: RequestOptions) =>
    this.get<MetaAccountChannels>(
      API_ENDPOINTS.CHANNELS.MY_CHANNELS,
      undefined,
      options,
    );

  getAllChannels = (appId: string, options?: RequestOptions) =>
    this.get<MetaAccountChannels>(
      API_ENDPOINTS.CHANNELS.ALL(appId),
      undefined,
      options,
    );

  channelConnectUrl = (
    params: { appId?: string; type: UrlChannelType },
    options?: RequestOptions,
  ) => {
    const queryParams = new URLSearchParams();
    if (params.appId) queryParams.append("appId", params.appId);
    return this.post<ConnectChannelResponse>(
      `${API_ENDPOINTS.CHANNELS.CHANNEL_CONNECT(params.type)}?${queryParams.toString()}`,
      undefined,
      options,
    );
  };

  metaCallback = (type: UrlChannelType, options?: RequestOptions) =>
    this.get<MetaCallbackResponse>(
      API_ENDPOINTS.CHANNELS.CHANNEL_CALLBACK(type),
      undefined,
      options,
    );

  metaDisconnect = (type: UrlChannelType, options?: RequestOptions) =>
    this.post(
      `${API_ENDPOINTS.CHANNELS.CHANNEL_DISCONNECT(type)}`,
      undefined,
      options,
    );

  metaDelete = (id: string, type: UrlChannelType, options?: RequestOptions) =>
    this.delete(API_ENDPOINTS.CHANNELS.CHANNEL_DELETE(id, type), options);

  metaSubscriptionStatus = (id: string, options?: RequestOptions) =>
    this.get<MetaSubscriptionStatusResponse>(
      API_ENDPOINTS.CHANNELS.META_SUBSCRIPTION_STATUS(id),
      undefined,
      options,
    );

  channelSubscribeApp = (
    payload: ChannelSubscribeAppRequest,
    options?: RequestOptions,
  ) =>
    this.post(API_ENDPOINTS.CHANNELS.CHANNEL_SUBSCRIBE_APP, payload, options);

  channelUnsubscribeApp = (
    payload: ChannelSubscribeAppRequest,
    options?: RequestOptions,
  ) =>
    this.post(API_ENDPOINTS.CHANNELS.CHANNEL_UNSUBSCRIBE_APP, payload, options);
}

// Export singleton instance
export const channelsService = new ChannelsService(env.channelUrl || "");
