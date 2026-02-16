// Query key factory for TanStack Query

import { UrlType } from ".";

export const queryKeys = {
  authKeys: {
    meta: ["auth", "meta"] as const,
    verifyToken: ["verify", "auth"] as const,
  },
  usersQueryKeys: {
    userProfileFull: ["user-profile", "full"] as const,
  },

  appsQueryKeys: {
    listApps: ["apps", "list"] as const,
    listMyApps: ["apps", "list-my-apps"] as const,
    appDetails: (id: string) => ["apps", "details", id] as const,
    appUsers: (id: string) => ["apps", "users", id] as const,
    listRoles: ["apps", "roles"] as const,
  },

  inboxKeys: {
    conversationList: ["inbox", "conversation-list"] as const,
    conversationHistory: (conversationId: string) =>
      ["inbox", "conversation-history", conversationId] as const,
  },

  channelsKeys: {
    all: ["channels"] as const,
    allChannels: (appId: string) => ["channels", "all", appId] as const,
    channelConnect: (type: UrlType) => ["channels", type, "connect"] as const,
    metaCallback: ["channels", "meta", "callback"] as const,
    metaSubscriptionStatus: (accountId: string) =>
      ["channels", "meta", "subscription-status", accountId] as const,
  },
} as const;

export const mutationKeys = {
  authKeys: {
    login: ["auth", "login"] as const,
    register: ["auth", "register"] as const,
    logout: ["auth", "logout"] as const,
    google: ["auth", "google"] as const,
    meta: ["auth", "meta"] as const,
    refreshToken: ["auth", "refreshToken"] as const,
    verify: ["auth", "verify"] as const,
    userInfo: ["auth", "userInfo"] as const,
  },

  inboxKeys: {
    updateConversationStatus: ["inbox", "update-conversation-status"] as const,
    sendMessage: ["inbox", "send-message"] as const,
    sendCSATTemplate: ["inbox", "send-csat-template"] as const,
  },

  channelsKeys: {
    metaConnect: ["channels", "meta", "connect"] as const,
    metaDisconnect: ["channels", "meta", "disconnect"] as const,
    metaDelete: ["channels", "meta", "delete"] as const,
    instagramConnect: ["channels", "instagram", "connect"] as const,
    instagramDisconnect: ["channels", "instagram", "disconnect"] as const,
    instagramDelete: ["channels", "instagram", "delete"] as const,
  },
} as const;
