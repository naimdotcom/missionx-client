import { mutationKeys, queryKeys } from "@/api";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { channelService } from "./channels.service";
import type {
  AppChannelDisconnectParams,
  ChannelConnectPayload,
  ChannelsListParams,
  ChannelSubscribePayload,
} from "./channels.types";

const CHANNELS_PAGE_SIZE = 12;

/**
 * Infinite-query hook to list channels with pagination.
 * Each page fetches `limit` accounts; call `fetchNextPage` to load more.
 */
export const useChannelsList = (params?: Omit<ChannelsListParams, "page">) => {
  return useInfiniteQuery({
    staleTime: 30_000,
    queryKey: [...queryKeys.channelsKeys.channelsList, params],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      channelService.channelsList({
        ...params,
        page: pageParam,
        limit: CHANNELS_PAGE_SIZE,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.has_more) return (lastPage.page ?? 1) + 1;
      // Fallback: derive from total / limit when has_more isn't returned
      const total = lastPage.total ?? 0;
      const currentPage = lastPage.page ?? 1;
      const totalPages =
        lastPage.total_pages ?? Math.ceil(total / CHANNELS_PAGE_SIZE);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
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
      channelService.channelConnect(payload),
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
      channelService.channelSubscribe(payload),
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
      channelService.channelUnsubscribe(payload),
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
      channelService.appAllChannelDisconnect(params),
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
      channelService.deleteChannel(channel_id),
    mutationKey: mutationKeys.channelsKeys.channelDelete,
    onSuccess: () => {
      // Invalidate channels list after deletion
      queryClient.invalidateQueries({
        queryKey: queryKeys.channelsKeys.channelsList,
      });
    },
  });
};
