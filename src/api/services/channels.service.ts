// Channels service

import type { RequestOptions } from "../types/api.types";
import { API_ENDPOINTS } from "../types/endpoints";
import { BaseAPIService } from "./base.service";
import type {
  ChannelConnection,
  ConnectChannelRequest,
} from "./types/channel.types";

export class ChannelsService extends BaseAPIService {
  /**
   * Get all channel connections
   */
  getChannels = (options?: RequestOptions) =>
    this.get<ChannelConnection[]>(
      API_ENDPOINTS.CHANNELS.LIST,
      undefined,
      options,
    );

  /**
   * Get single channel connection
   */
  getChannel = (channelId: string, options?: RequestOptions) =>
    this.get<ChannelConnection>(
      API_ENDPOINTS.CHANNELS.DETAIL(channelId),
      undefined,
      options,
    );

  /**
   * Connect new channel
   */
  connectChannel = (data: ConnectChannelRequest, options?: RequestOptions) =>
    this.post<ChannelConnection>(API_ENDPOINTS.CHANNELS.CONNECT, data, options);

  /**
   * Disconnect channel
   */
  disconnectChannel = (channelId: string, options?: RequestOptions) =>
    this.post<void>(
      API_ENDPOINTS.CHANNELS.DISCONNECT(channelId),
      undefined,
      options,
    );
}

// Export singleton instance
export const channelsService = new ChannelsService();
