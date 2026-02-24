import { API_ENDPOINTS, RequestOptions } from "@/api";
import { BaseAPIService } from "@/api/core/base.service";
import { env } from "@/lib/env";
import type {
  AppChannelResponse,
  AppChannelsParams,
  ChannelSubscribeAppRequest,
  MetaAccountChannels,
  MetaSubscriptionStatusResponse,
  SDKLoginRequest,
  UrlChannelType,
} from "./channels.types";

export class ChannelsService extends BaseAPIService {
  constructor(baseURL: string) {
    super(baseURL);
  }

  channelSdkLogin = (payload: SDKLoginRequest, options?: RequestOptions) =>
    this.post<MetaAccountChannels>(
      API_ENDPOINTS.CHANNELS.CHANNEL_SDK_LOGIN,
      payload,
      options,
    );

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

  getAppChannels = (params: AppChannelsParams, options?: RequestOptions) => {
    const queryParams = new URLSearchParams();
    if (params.platform) queryParams.append("platform", params.platform);
    return this.get<AppChannelResponse>(
      `${API_ENDPOINTS.CHANNELS.APP_CHANNELS(params.appId)}?${queryParams.toString()}`,
      undefined,
      options,
    );
  };

  // metaCallback = (type: UrlChannelType, options?: RequestOptions) =>
  //   this.get<MetaCallbackResponse>(
  //     API_ENDPOINTS.CHANNELS.CHANNEL_CALLBACK(type),
  //     undefined,
  //     options,
  //   );

  // metaDisconnect = (type: UrlChannelType, options?: RequestOptions) =>
  //   this.post(
  //     `${API_ENDPOINTS.CHANNELS.CHANNEL_DISCONNECT(type)}`,
  //     undefined,
  //     options,
  //   );

  metaDisconnect = (
    id: string,
    type: UrlChannelType,
    options?: RequestOptions,
  ) =>
    this.delete(API_ENDPOINTS.CHANNELS.CHANNEL_DISCONNECT(id, type), options);

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
