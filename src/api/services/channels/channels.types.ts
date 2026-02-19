// Re-export types from pages/channels for consistency
export type { Channel } from "@/pages/channels/types";

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
export type ChannelsResponse = any;
