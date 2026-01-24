// Channels service

import type { APIResponse, RequestOptions } from "../types/api.types";
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
  async getChannels(
    options?: RequestOptions,
  ): Promise<APIResponse<ChannelConnection[]>> {
    return this.get<ChannelConnection[]>(
      API_ENDPOINTS.CHANNELS.LIST,
      undefined,
      options,
    );
  }

  /**
   * Get single channel connection
   */
  async getChannel(
    channelId: string,
    options?: RequestOptions,
  ): Promise<APIResponse<ChannelConnection>> {
    return this.get<ChannelConnection>(
      API_ENDPOINTS.CHANNELS.DETAIL(channelId),
      undefined,
      options,
    );
  }

  /**
   * Connect new channel
   */
  async connectChannel(
    data: ConnectChannelRequest,
    options?: RequestOptions,
  ): Promise<APIResponse<ChannelConnection>> {
    return this.post<ConnectChannelRequest, ChannelConnection>(
      API_ENDPOINTS.CHANNELS.CONNECT,
      data,
      options,
    );
  }

  /**
   * Disconnect channel
   */
  async disconnectChannel(
    channelId: string,
    options?: RequestOptions,
  ): Promise<APIResponse<void>> {
    return this.post<void, void>(
      API_ENDPOINTS.CHANNELS.DISCONNECT(channelId),
      undefined as any,
      options,
    );
  }
}

// Export singleton instance
export const channelsService = new ChannelsService();
