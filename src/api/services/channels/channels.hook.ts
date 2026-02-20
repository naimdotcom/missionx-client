import { mutationKeys, queryKeys } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { channelsService } from "./channels.service";
import type {
  ChannelSubscribeAppRequest,
  UrlChannelType,
} from "./channels.types";

export function useMetaAccounts(type: UrlChannelType, enable: boolean) {
  return useQuery({
    enabled: !!type && !!enable,
    queryKey: queryKeys.channelsKeys.metaAccounts(type),
    queryFn: async () => {
      const response = await channelsService.getMetaAccountChannels(type);
      return response;
    },
  });
}

export function useMyChannels() {
  return useQuery({
    queryKey: queryKeys.channelsKeys.myChannels,
    queryFn: async () => {
      const response = await channelsService.getMyChannels();
      return response;
    },
  });
}

export function useAppChannels(appId: string) {
  return useQuery({
    enabled: !!appId,
    queryKey: queryKeys.channelsKeys.allChannels(appId),
    queryFn: async () => {
      const response = await channelsService.getAllChannels(appId);
      return response;
    },
  });
}

export function useChannelConnectUrl(params: {
  appId?: string;
  type: UrlChannelType;
}) {
  return useQuery({
    enabled: !!params.type && !!params.appId,
    queryKey: queryKeys.channelsKeys.channelConnect(params.type),
    queryFn: async () => {
      const response = await channelsService.channelConnectUrl(params);
      return response;
    },
  });
}

export function useMetaCallback(type: UrlChannelType) {
  return useQuery({
    enabled: !!type,
    queryKey: queryKeys.channelsKeys.metaCallback,
    queryFn: async () => {
      const response = await channelsService.metaCallback(type);
      return response;
    },
  });
}

export function useMetaDisconnect(type: UrlChannelType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.channelsKeys.metaDisconnect,
    mutationFn: () => channelsService.metaDisconnect(type),
    onSuccess: () => {
      // Invalidate all channels queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.channelsKeys.all,
      });
    },
  });
}

export function useMetaDelete(type: UrlChannelType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountId: string) => {
      const response = await channelsService.metaDelete(accountId, type);
      return response;
    },
    mutationKey: mutationKeys.channelsKeys.metaDelete,
    onSuccess: () => {
      // Invalidate all channels queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.channelsKeys.all,
      });
    },
  });
}

export function useMetaSubscriptionStatus(accountId: string) {
  return useQuery({
    enabled: !!accountId,
    queryKey: queryKeys.channelsKeys.metaSubscriptionStatus(accountId),
    queryFn: async () => {
      const response = await channelsService.metaSubscriptionStatus(accountId);
      return response;
    },
  });
}

export function useChannelSubscribeApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.channelsKeys.channelSubscribeApp,
    mutationFn: (payload: ChannelSubscribeAppRequest) =>
      channelsService.channelSubscribeApp(payload),
    onSuccess: () => {
      // Invalidate all channels queries
      queryClient.invalidateQueries({ queryKey: queryKeys.channelsKeys.all });
    },
  });
}

export function useChannelUnsubscribeApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.channelsKeys.channelUnsubscribeApp,
    mutationFn: async (payload: ChannelSubscribeAppRequest) => {
      const response = await channelsService.channelUnsubscribeApp(payload);
      return response;
    },
    onSuccess: () => {
      // Invalidate all channels queries
      queryClient.invalidateQueries({ queryKey: queryKeys.channelsKeys.all });
    },
  });
}
