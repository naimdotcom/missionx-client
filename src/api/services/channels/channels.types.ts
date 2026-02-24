// API Request/Response types (to be defined by backend contract)
export interface ConnectChannelResponse {
  state: string;
  collect_only: boolean;
  authorization_url: string;
}

export type UrlChannelType = "meta" | "instagram";

export type MetaConnectResponse = ConnectChannelResponse;
export type InstagramConnectResponse = ConnectChannelResponse;

export type MetaCallbackParams = any;
export type MetaCallbackResponse = any;
export type MetaDisconnectRequest = any;
export type MetaDisconnectResponse = any;
export type MetaSubscriptionStatusResponse = any;

export type InstagramCallbackParams = any;
export type InstagramCallbackResponse = any;
export type InstagramDisconnectRequest = any;
export type InstagramDisconnectResponse = any;

export type PlatformType = "facebook" | "instagram";

export type MetaAccountChannels = {
  total?: number;
  user_id?: string;
  accounts?: Channel[];
  has_connection?: boolean;
  connection_expires_at?: string;
};

export type Channel = {
  id?: string;
  is_subscribed: false;
  linked_instagram?: null;
  profile_pic_url?: string;
  channel_id: string;
  platform?: PlatformType;
  account_name?: string;
  instagram_username?: string;
  platform_page_id?: string;
  app_id?: string | null; // Not connected to any app yet
  is_active?: boolean;
  is_verified?: boolean;
  created_at?: string;
  granted_permissions?: boolean;
  parent_page_id?: string | number;
};

export type ChannelSubscribeAppRequest = {
  channel_id: string;
  app_id: string;
};

export type AppChannelResponse = {
  app_id?: string;
  channels?: Channel[];
  filters: { platform?: PlatformType | null; search?: string | null };
  pagination?: {
    page?: number;
    pages?: number;
    total?: number;
    limit?: number;
  };
  user_id?: string;
};

export type AppChannelsParams = { appId?: string; platform?: PlatformType };

export type SDKLoginRequest = {
  user_id?: string;
  platform?: string;
  access_token?: string;
  data_access_expiration_time?: number;
};
