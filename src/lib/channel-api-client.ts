/**
 * Channel API Helper Utilities
 * Common functions for testing and interacting with the Channel API
 */

export interface ChannelAPIConfig {
  baseUrl: string;
  accessToken: string;
  userId?: string;
  appId?: string;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export class ChannelAPIClient {
  private config: ChannelAPIConfig;

  constructor(config: ChannelAPIConfig) {
    this.config = {
      baseUrl: config.baseUrl.replace(/\/$/, ""), // Remove trailing slash
      accessToken: config.accessToken,
      userId: config.userId,
      appId: config.appId,
    };
  }

  private async request<T = unknown>(
    endpoint: string,
    method: "GET" | "POST" | "DELETE" = "GET",
    body?: unknown,
  ): Promise<APIResponse<T>> {
    try {
      const url = `${this.config.baseUrl}${endpoint}`;

      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.accessToken}`,
        },
        credentials: "include",
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        return { success: true, data: data as T, statusCode: response.status };
      } else {
        return {
          success: false,
          error: data.detail || data.message || "Request failed",
          statusCode: response.status,
        };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return { success: false, error: errorMsg };
    }
  }

  // OAuth Endpoints
  async initiateMeta(appId: string, collectOnly = false) {
    return this.request("/api/v1/channels/meta/oauth/initiate", "POST", {
      app_id: appId,
      collect_only: collectOnly,
    });
  }

  async initiateInstagram(appId: string, collectOnly = false) {
    return this.request("/api/v1/channels/instagram/oauth/initiate", "POST", {
      app_id: appId,
      collect_only: collectOnly,
    });
  }

  // Channel Management Endpoints
  async getMyChannels() {
    return this.request("/api/v1/channels/my", "GET");
  }

  async getAppChannels(appId: string) {
    return this.request(`/api/v1/channels/by-app/${appId}`, "GET");
  }

  async subscribeChannel(channelId: string, appId: string) {
    return this.request("/api/v1/channels/subscribe", "POST", {
      channel_id: channelId,
      app_id: appId,
    });
  }

  async unsubscribeChannel(channelId: string) {
    return this.request("/api/v1/channels/unsubscribe", "POST", {
      channel_id: channelId,
    });
  }

  // Webhook Management Endpoints
  async checkSubscriptionStatus(channelId: string) {
    return this.request(
      `/api/v1/channels/meta/accounts/${channelId}/subscription-status`,
      "GET",
    );
  }

  async subscribeWebhook(channelId: string) {
    return this.request(
      `/api/v1/channels/meta/accounts/${channelId}/webhook/subscribe`,
      "POST",
    );
  }

  async unsubscribeWebhook(channelId: string) {
    return this.request(
      `/api/v1/channels/meta/accounts/${channelId}/webhook/unsubscribe`,
      "POST",
    );
  }

  // Account Management Endpoints
  async disconnectAccount(channelId: string) {
    return this.request(
      `/api/v1/channels/meta/accounts/${channelId}`,
      "DELETE",
    );
  }

  async disconnectIntegration(appId: string) {
    return this.request(
      `/api/v1/channels/meta/disconnect?app_id=${appId}`,
      "DELETE",
    );
  }

  // Helper: Get all channels for an app with full details
  async getAllChannelsForApp(appId: string) {
    const response = await this.getAppChannels(appId);
    if (response.success && response.data) {
      const data = response.data as { channels?: unknown[] };
      return { ...response, data: data.channels || [] };
    }
    return response;
  }

  // Helper: Find parent channel for a given IG child
  async findParentChannel(childChannelId: string) {
    const response = await this.getMyChannels();
    if (response.success && response.data) {
      const data = response.data as {
        channels?: Array<{ id: string; parent_page_id?: string }>;
      };
      return data.channels?.find((ch) => ch.id === childChannelId)
        ?.parent_page_id;
    }
    return null;
  }
}

export default ChannelAPIClient;
