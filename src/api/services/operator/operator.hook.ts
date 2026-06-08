import { mutationKeys, queryKeys } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { operatorService } from "./operator.service";
import { CreateSessionPayload, PostMessageBody } from "./operator.type";

export function useOperatorSessions() {
  return useQuery({
    queryKey: [...queryKeys.operatorKeys.sessions],
    queryFn: () => operatorService.listSessions(),
    refetchOnWindowFocus: false,
  });
}

/** The canonical persisted feed for a session (seeds + reconciles the timeline). */
export function useSessionMessages(sessionId: string | null) {
  return useQuery({
    enabled: !!sessionId,
    queryKey: queryKeys.operatorKeys.sessionMessages(sessionId ?? ""),
    queryFn: () => operatorService.getMessages(sessionId as string),
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.operatorKeys.createSession,
    mutationFn: (payload: CreateSessionPayload) =>
      operatorService.createSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.operatorKeys.sessions,
      });
    },
  });
}

export function usePostMessage(sessionId: string) {
  return useMutation({
    mutationKey: mutationKeys.operatorKeys.postMessage,
    mutationFn: (body: PostMessageBody) =>
      operatorService.postMessage(sessionId, body),
  });
}
