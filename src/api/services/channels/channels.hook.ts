import { mutationKeys, queryKeys } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { channelsService } from "./channels.service";
import type { UrlType } from "./channels.types";

/**
 * Hook to get all channels for a specific app
 */
export function useChannels(appId: string) {
  return useQuery({
    enabled: !!appId,
    queryKey: queryKeys.channelsKeys.allChannels(appId),
    queryFn: async () => {
      const response = await channelsService.getAllChannels(appId);
      return response;
    },
  });
}

export function useChannelConnectUrl(appId: string, type: UrlType) {
  return useQuery({
    enabled: !!type && !!appId,
    queryKey: queryKeys.channelsKeys.channelConnect(type),
    queryFn: async () => {
      const response = await channelsService.channelConnectUrl(appId, type);
      return response;
    },
  });
}

export function useMetaCallback(type: UrlType) {
  return useQuery({
    enabled: !!type,
    queryKey: queryKeys.channelsKeys.metaCallback,
    queryFn: async () => {
      const response = await channelsService.metaCallback(type);
      return response;
    },
  });
}

export function useMetaDisconnect(type: UrlType) {
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

export function useMetaDelete(type: UrlType) {
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
