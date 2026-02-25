export type ChannelPlatform = "facebook" | "instagram";

export type ChannelConnectPayload = {
  user_id?: string;
  platform?: ChannelPlatform;
  access_token: string;
  data_access_expiration_time?: number;
};

export type ChannelsListParams = {
  app_id?: string;
  platform?: ChannelPlatform;
};

export type ChannelsListResponse = {
  total?: number;
  user_id?: string;
  has_connection?: boolean;
  connection_expires_at?: string;
  accounts?: Array<Channel>;
};

export type Channel = {
  platform_page_id?: string;
  platform?: ChannelPlatform;
  account_name?: string;
  profile_pic_url?: string;
  instagram_username?: string | null;
  is_subscribed?: boolean;
  channel_id?: string;
  app_id?: string | null;
  linked_instagram: {
    platform_page_id?: string;
    platform?: ChannelPlatform;
    account_name?: string;
    profile_pic_url?: string | null;
    instagram_username?: string | null;
    is_subscribed?: boolean;
    channel_id?: string | null;
    app_id?: string | null;
    linked_instagram?: null;
  };
};

export type ChannelSubscribePayload = {
  app_id?: string;
  channel_id?: string;
  platform_page_id?: string;
};

export type AppChannelDisconnectParams = {
  app_id?: string;
  platform?: ChannelPlatform;
};

export type ChannelSubscribeResponse = {
  app_id?: string;
  subscribed?: boolean;
  affected_channel_ids: string[];
};
