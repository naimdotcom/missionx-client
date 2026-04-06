import { mutationKeys, queryKeys } from "@/api";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  conversationList,
  conversationHistory,
  updateConversationStatus,
  sendMessage,
  markAsRead,
} from "./inbox.service";
import {
  ConversationTicketsParams,
  ConversationTicketStatus,
  SendMessagePayload,
} from "./inbox.type";

export function useConversationTickets(params: ConversationTicketsParams) {
  return useInfiniteQuery({
    enabled: !!params?.app_id,
    queryKey: [...queryKeys.inboxKeys.conversationList, params],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await conversationList({
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

/** Cursor used by bi-directional (older) pagination. */
interface HistoryCursor {
  before_id: string;
  before_time: string;
}

export function useConversationHistory(conversationId: string) {
  return useInfiniteQuery({
    refetchOnWindowFocus: false,
    enabled: !!conversationId,
    queryKey: [...queryKeys.inboxKeys.conversationHistory(conversationId)],
    initialPageParam: undefined as HistoryCursor | undefined,
    queryFn: async ({ pageParam }) => {
      const response = await conversationHistory(conversationId, {
        limit: 20,
        ...(pageParam && {
          before_id: pageParam.before_id,
          before_time: pageParam.before_time,
        }),
      });
      return response;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.has_older) return undefined;

      // Use the oldest message in this page as the cursor for the next page
      const items = lastPage.items ?? [];
      const oldest = items[items.length - 1];
      if (!oldest?.id || !oldest?.created_at) return undefined;

      return { before_id: oldest.id, before_time: oldest.created_at };
    },
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
      status: ConversationTicketStatus;
    }) => {
      const response = await updateConversationStatus(conversationId, status);
      return response;
    },
    mutationKey: mutationKeys.inboxKeys.updateConversationStatus,
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.inboxKeys.conversationHistory(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.inboxKeys.conversationList,
      });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessagePayload) => sendMessage(payload),
    mutationKey: mutationKeys.inboxKeys.sendMessage,
    onSuccess: (data) => {
      if (data?.conversation_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.inboxKeys.conversationHistory(
            data.conversation_id,
          ),
        });
      }
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => markAsRead(conversationId),
    mutationKey: mutationKeys.inboxKeys.markAsRead,
    onSuccess: () => {
      // Refresh conversation list so unread counts update
      queryClient.invalidateQueries({
        queryKey: queryKeys.inboxKeys.conversationList,
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
