import { mutationKeys, queryKeys } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { channelsService } from "./channels.service";
import type {
  AppChannelDisconnectParams,
  ChannelConnectPayload,
  ChannelsListParams,
  ChannelSubscribePayload,
} from "./channels.types";

/**
 * Hook to list all channels for the authenticated user
 * @param params - Optional parameters for filtering channels (app_id, platform)
 * @returns Query result with channels list
 */
export const useChannelsList = (params?: ChannelsListParams) => {
  return useQuery({
    staleTime: 100, // 1 minute
    queryFn: () => channelsService.channelsList(params),
    queryKey: [...queryKeys.channelsKeys.channelsList, params],
  });
};

/**
 * Hook to connect a new channel
 * Automatically invalidates the channels list on success
 * @returns Mutation function to connect a channel with payload: ChannelConnectPayload
 */
export const useChannelConnect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChannelConnectPayload) =>
      channelsService.channelConnect(payload),
    mutationKey: mutationKeys.channelsKeys.channelConnect,
    onSuccess: () => {
      // Invalidate channels list to refresh with new channel
      queryClient.invalidateQueries({
        queryKey: queryKeys.channelsKeys.channelsList,
      });
    },
  });
};

/**
 * Hook to subscribe to a channel
 * Links an app (channel) subscription for the user
 * @returns Mutation function to subscribe with payload: ChannelSubscribePayload
 */
export const useChannelSubscribe = () => {
  return useMutation({
    mutationFn: (payload: ChannelSubscribePayload) =>
      channelsService.channelSubscribe(payload),
    mutationKey: mutationKeys.channelsKeys.channelSubscribeApp,

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.detail || "Failed to subscribe to channel",
        );
      }
    },
  });
};

/**
 * Hook to unsubscribe from a channel
 * Removes the subscription relationship between app and channel
 * @returns Mutation function to unsubscribe with payload: { channel_id: string }
 */
export const useChannelUnsubscribe = () => {
  return useMutation({
    mutationFn: (payload: { channel_id: string }) =>
      channelsService.channelUnsubscribe(payload),
    mutationKey: mutationKeys.channelsKeys.channelUnsubscribeApp,

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.detail || "Failed to subscribe to channel",
        );
      }
    },
  });
};

/**
 * Hook to disconnect an app channel
 * Removes the connection between an app and a platform (Facebook/Instagram)
 * @returns Mutation function to disconnect with params: AppChannelDisconnectParams
 */
export const useAllAppChannelDisconnect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: AppChannelDisconnectParams) =>
      channelsService.appAllChannelDisconnect(params),
    mutationKey: mutationKeys.channelsKeys.channelDisconnect,
    onSuccess: () => {
      // Invalidate channels list after disconnection
      queryClient.invalidateQueries({
        queryKey: queryKeys.channelsKeys.channelsList,
      });
    },
  });
};

/**
 * Hook to delete a channel
 * Permanently removes a channel connection
 * @returns Mutation function to delete with channel_id: string
 */
export const useDeleteChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (channel_id: string) =>
      channelsService.deleteChannel(channel_id),
    mutationKey: mutationKeys.channelsKeys.channelDelete,
    onSuccess: () => {
      // Invalidate channels list after deletion
      queryClient.invalidateQueries({
        queryKey: queryKeys.channelsKeys.channelsList,
      });
    },
  });
};
