import { mutationKeys, queryKeys } from "@/api";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { inboxService } from "./inbox.service";
import { ConversationTicketsParams, SendMessagePayload } from "./inbox.type";

export function useConversationTickets(params: ConversationTicketsParams) {
  return useInfiniteQuery({
    staleTime: 100, // 1 minute
    enabled: !!params?.app_id,
    queryKey: [...queryKeys.inboxKeys.conversationList, params],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await inboxService.conversationList({
        ...params,
        page: pageParam,
      });
      return response;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
}

export function useConversationHistory(conversationId: string) {
  return useQuery({
    staleTime: 100, // 1 minute
    enabled: !!conversationId,
    queryFn: () => inboxService.conversationHistory(conversationId),
    queryKey: [queryKeys.inboxKeys.conversationHistory, conversationId],
  });
}

export function useUpdateConversationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      status,
    }: {
      conversationId: string;
      status: "open" | "closed";
    }) => {
      const response = await inboxService.updateConversationStatus(
        conversationId,
        status,
      );
      return response;
    },
    mutationKey: mutationKeys.inboxKeys.updateConversationStatus,
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.inboxKeys.conversationHistory, conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.inboxKeys.conversationList],
      });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessagePayload) =>
      inboxService.sendMessage(payload),
    mutationKey: mutationKeys.inboxKeys.sendMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [
          queryKeys.inboxKeys.conversationHistory,
          data?.conversation_id,
        ],
      });
    },
  });
}

// export function useSendCSATTemplate() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (payload: { conversationId: string }) => {
//       const response = await inboxService.sendCSATTemplate(payload);
//       return response;
//     },
//     mutationKey: mutationKeys.inboxKeys.sendCSATTemplate,
//     onSuccess: (_, { conversationId }) => {
//       queryClient.invalidateQueries({
//         queryKey: [queryKeys.inboxKeys.conversationHistory, conversationId],
//       });
//     },
//   });
// }
