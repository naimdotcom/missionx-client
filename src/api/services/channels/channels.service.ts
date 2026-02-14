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

  /**
   * Get all channels for a specific app
   */
  getAllChannels = (appId: string, options?: RequestOptions) =>
    this.get<ChannelsResponse>(
      API_ENDPOINTS.CHANNELS.ALL(appId),
      undefined,
      options,
    );

  /**
   * Meta (Facebook) Channel Methods
   */

  /**
   * Initiate Meta OAuth connection
   */
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

  /**
   * Handle Meta OAuth callback
   */
  metaCallback = (type: UrlType, options?: RequestOptions) =>
    this.get<MetaCallbackResponse>(
      API_ENDPOINTS.CHANNELS.CHANNEL_CALLBACK(type),
      undefined,
      options,
    );

  /**
   * Disconnect Meta channel
   */
  metaDisconnect = (type: UrlType, options?: RequestOptions) =>
    this.post(
      `${API_ENDPOINTS.CHANNELS.CHANNEL_DISCONNECT(type)}`,
      undefined,
      options,
    );

  /**
   * Delete Meta account
   */
  metaDelete = (id: string, type: UrlType, options?: RequestOptions) =>
    this.delete(API_ENDPOINTS.CHANNELS.CHANNEL_DELETE(id, type), options);

  /**
   * Get Meta subscription status
   */
  metaSubscriptionStatus = (id: string, options?: RequestOptions) =>
    this.get<MetaSubscriptionStatusResponse>(
      API_ENDPOINTS.CHANNELS.META_SUBSCRIPTION_STATUS(id),
      undefined,
      options,
    );
}

// Export singleton instance
export const channelsService = new ChannelsService(env.channelUrl || "");
