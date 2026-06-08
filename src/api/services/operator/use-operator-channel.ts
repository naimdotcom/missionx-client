// Operator chat controller: seeds the timeline from the persisted feed,
// streams live `activity` events over the operator Soketi channel, and exposes
// the send / choice actions. Live events drive the UI for smoothness; on every
// terminal event (`done`/`error`) the persisted feed is refetched so the view
// converges to canonical state — this is what makes leave-and-return mid-run,
// replay, and resume all render correctly.

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  appendUserMessage,
  applyLiveEvent,
  feedToTimeline,
  markChoiceAnswered,
  TimelineItem,
} from "@/pages/operator/lib/timeline";
import { queryKeys } from "@/api";
import { operatorSoketi } from "./operator-soketi";
import { useSessionMessages, usePostMessage } from "./operator.hook";
import { OperatorEvent, OperatorSession } from "./operator.type";

export type ChatPhase = "idle" | "thinking" | "awaiting";

function initialPhase(status?: string): ChatPhase {
  if (status === "queued" || status === "running") return "thinking";
  if (status === "awaiting_input") return "awaiting";
  return "idle";
}

export function useOperatorChat(session: OperatorSession | null) {
  const sessionId = session?.id ?? null;
  const queryClient = useQueryClient();
  const messages = useSessionMessages(sessionId);
  const post = usePostMessage(sessionId ?? "");

  const [items, setItems] = useState<TimelineItem[]>([]);
  const [phase, setPhase] = useState<ChatPhase>(() =>
    initialPhase(session?.status),
  );

  // Reseed whenever the feed (re)loads — initial load and reconcile refetches.
  useEffect(() => {
    if (!messages.data) return;
    setItems(feedToTimeline(messages.data));
    setPhase(initialPhase(session?.status));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.data, sessionId]);

  // Keep a stable reconcile callback for the socket handler.
  const reconcile = useRef<() => void>(() => {});
  reconcile.current = () => {
    if (!sessionId) return;
    queryClient.invalidateQueries({
      queryKey: queryKeys.operatorKeys.sessionMessages(sessionId),
    });
    // Refresh session list so the sidebar picks up the auto-generated title.
    queryClient.invalidateQueries({
      queryKey: queryKeys.operatorKeys.sessions,
    });
  };

  // Subscribe to the session's live channel.
  useEffect(() => {
    if (!session?.channel) return;

    const onActivity = (event: OperatorEvent) => {
      setItems((prev) => applyLiveEvent(prev, event));
      switch (event.type) {
        case "queued":
        case "status":
        case "text":
        case "tool_result":
          setPhase("thinking");
          break;
        case "choice":
        case "awaiting_input":
          setPhase("awaiting");
          break;
        case "done":
        case "error":
          setPhase("idle");
          reconcile.current();
          break;
        default:
          break;
      }
    };

    const unsubscribe = operatorSoketi.subscribe(session.channel, onActivity);
    return unsubscribe;
  }, [session?.channel]);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !sessionId) return;
      setItems((prev) => appendUserMessage(prev, trimmed));
      setPhase("thinking");
      post.mutate(
        { message: trimmed },
        {
          onError: () => {
            setItems((prev) =>
              applyLiveEvent(prev, {
                type: "error",
                error: "Couldn't send your message. Please try again.",
              }),
            );
            setPhase("idle");
          },
        },
      );
    },
    [post, sessionId],
  );

  const submitChoice = useCallback(
    (choiceId: string, selection: string[]) => {
      if (!sessionId) return;
      setItems((prev) => markChoiceAnswered(prev, selection, choiceId));
      setPhase("thinking");
      post.mutate(
        { choice_id: choiceId, selection },
        {
          onError: () => {
            setItems((prev) =>
              applyLiveEvent(prev, {
                type: "error",
                error: "Couldn't submit your selection. Please try again.",
              }),
            );
            setPhase("awaiting");
          },
        },
      );
    },
    [post, sessionId],
  );

  return {
    items,
    phase,
    isLoading: messages.isLoading,
    isSending: post.isPending,
    send,
    submitChoice,
  };
}
