// Query key factory for TanStack Query

export const queryKeys = {
  authKeys: {
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

  channelsKeys: { channelsList: ["channels", "list"] as const },
} as const;

export const mutationKeys = {
  authKeys: {
    login: ["auth", "login"] as const,
    register: ["auth", "register"] as const,
    logout: ["auth", "logout"] as const,
    google: ["auth", "google"] as const,
    facebook: ["auth", "facebook"] as const,
    meta: ["auth", "meta"] as const,
    refreshToken: ["auth", "refreshToken"] as const,
    verify: ["auth", "verify"] as const,
    userInfo: ["auth", "userInfo"] as const,
  },

  inboxKeys: {
    markAsRead: ["inbox", "mark-as-read"] as const,
    updateConversationStatus: ["inbox", "update-conversation-status"] as const,
    sendMessage: ["inbox", "send-message"] as const,
    sendCSATTemplate: ["inbox", "send-csat-template"] as const,
  },

  channelsKeys: {
    channelConnect: ["channels", "connect"] as const,
    channelDisconnect: ["channels", "disconnect"] as const,
    channelSubscribeApp: ["channels", "subscribe-app"] as const,
    channelUnsubscribeApp: ["channels", "unsubscribe-app"] as const,
    channelDelete: ["channels", "delete"] as const,
  },
} as const;
