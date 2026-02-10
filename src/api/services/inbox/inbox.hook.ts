import { mutationKeys, queryKeys } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inboxService } from "./inbox.service";

export function useConversationList() {
  return useQuery({
    queryKey: queryKeys.inboxKeys.conversationList,
    queryFn: async () => {
      const response = await inboxService.conversationList();
      return response;
    },
  });
}

export function useConversationHistory(conversationId: string) {
  return useQuery({
    enabled: !!conversationId,
    queryKey: [queryKeys.inboxKeys.conversationHistory, conversationId],
    queryFn: async () => {
      const response = await inboxService.conversationHistory(conversationId);
      return response;
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
    mutationFn: async (payload: {
      conversationId: string;
      content: string;
      senderType: "user" | "agent";
    }) => {
      const response = await inboxService.sendMessage(payload);
      return response;
    },
    mutationKey: mutationKeys.inboxKeys.sendMessage,
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.inboxKeys.conversationHistory, conversationId],
      });
    },
  });
}

export function useSendCSATTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { conversationId: string }) => {
      const response = await inboxService.sendCSATTemplate(payload);
      return response;
    },
    mutationKey: mutationKeys.inboxKeys.sendCSATTemplate,
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.inboxKeys.conversationHistory, conversationId],
      });
    },
  });
}
