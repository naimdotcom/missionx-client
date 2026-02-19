import { API_ENDPOINTS, RequestOptions } from "@/api";
import { BaseAPIService } from "@/api/core/base.service";
import { env } from "@/lib/env";
import type {
  ChannelsResponse,
  ConnectChannelResponse,
  MetaCallbackResponse,
  MetaSubscriptionStatusResponse,
  UrlType,
} from "./channels.types";

export class ChannelsService extends BaseAPIService {
  constructor(baseURL: string) {
    super(baseURL);
  }

  getMetaAccounts = (type: UrlType, options?: RequestOptions) =>
    this.get<ChannelsResponse>(
      API_ENDPOINTS.CHANNELS.META_ACCOUNTS(type),
      undefined,
      options,
    );

  getMyChannels = (options?: RequestOptions) =>
    this.get<ChannelsResponse>(
      API_ENDPOINTS.CHANNELS.MY_CHANNELS,
      undefined,
      options,
    );

  getAllChannels = (appId: string, options?: RequestOptions) =>
    this.get<ChannelsResponse>(
      API_ENDPOINTS.CHANNELS.ALL(appId),
      undefined,
      options,
    );

  channelConnectUrl = (
    appId: string,
    type: UrlType,
    options?: RequestOptions,
  ) => {
    const queryParams = new URLSearchParams({ app_id: appId });
    return this.post<ConnectChannelResponse>(
      `${API_ENDPOINTS.CHANNELS.CHANNEL_CONNECT(type)}?${queryParams.toString()}`,
      undefined,
      options,
    );
  };

  metaCallback = (type: UrlType, options?: RequestOptions) =>
    this.get<MetaCallbackResponse>(
      API_ENDPOINTS.CHANNELS.CHANNEL_CALLBACK(type),
      undefined,
      options,
    );

  metaDisconnect = (type: UrlType, options?: RequestOptions) =>
    this.post(
      `${API_ENDPOINTS.CHANNELS.CHANNEL_DISCONNECT(type)}`,
      undefined,
      options,
    );

  metaDelete = (id: string, type: UrlType, options?: RequestOptions) =>
    this.delete(API_ENDPOINTS.CHANNELS.CHANNEL_DELETE(id, type), options);

  metaSubscriptionStatus = (id: string, options?: RequestOptions) =>
    this.get<MetaSubscriptionStatusResponse>(
      API_ENDPOINTS.CHANNELS.META_SUBSCRIPTION_STATUS(id),
      undefined,
      options,
    );
}

// Export singleton instance
export const channelsService = new ChannelsService(env.channelUrl || "");
