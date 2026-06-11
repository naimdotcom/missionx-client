import { useEffect, useRef } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { OperatorSession } from "@/api/services/operator/operator.type";
import { useOperatorChat } from "@/api/services/operator/use-operator-channel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatComposer } from "./ChatComposer";
import { AssistantBubble } from "./timeline/AssistantBubble";
import { ChangesetApprovalCard } from "./timeline/ChangesetApprovalCard";
import { ChoiceCard } from "./timeline/ChoiceCard";
import { StatusIndicator } from "./timeline/StatusIndicator";
import { ToolResultItem } from "./timeline/ToolResultItem";
import { UserBubble } from "./timeline/UserBubble";
import { FlowPreview } from "./flow-preview";

export function ChatPanel({ session }: { session: OperatorSession | null }) {
  const { items, phase, isLoading, send, submitChoice } =
    useOperatorChat(session);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [items, phase]);

  if (!session) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="size-6" />
        </div>
        <div>
          <p className="font-medium text-foreground">Your assistant</p>
          <p className="text-sm">
            Start a new chat to manage your account by messaging.
          </p>
        </div>
      </div>
    );
  }

  const last = items[items.length - 1];
  const showThinking =
    phase === "thinking" &&
    (!last || (last.kind !== "status" && last.kind !== "queued"));

  return (
    <div className="flex h-full flex-1 flex-col">
      <ScrollArea className="flex-1">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-6">
          {isLoading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          )}

          {items.map((item) => {
            switch (item.kind) {
              case "user":
                return <UserBubble key={item.id} text={item.text} />;
              case "assistant":
                return <AssistantBubble key={item.id} text={item.text} />;
              case "status":
                return (
                  <StatusIndicator
                    key={item.id}
                    label={item.label}
                    denied={item.denied}
                    done={item.done}
                  />
                );
              case "tool_result":
                return (
                  <ToolResultItem
                    key={item.id}
                    tool={item.tool}
                    ok={item.ok}
                    data={item.data}
                    error={item.error}
                  />
                );
              case "flow_result":
                return (
                  <FlowPreview
                    key={item.id}
                    flow={item.flow}
                    node={item.node}
                  />
                );
              case "choice":
                // Changeset approval gets a rich preview card with a scrollable diff table.
                if (item.choiceKind === "changeset_approval" && item.changesetId) {
                  return (
                    <ChangesetApprovalCard
                      key={item.id}
                      changesetId={item.changesetId}
                      prompt={item.prompt}
                      options={item.options}
                      answered={item.answered}
                      selection={item.selection}
                      onSubmit={(selection) =>
                        submitChoice(item.choiceId, selection)
                      }
                    />
                  );
                }
                return (
                  <ChoiceCard
                    key={item.id}
                    prompt={item.prompt}
                    options={item.options}
                    multi={item.multi}
                    confirm={item.confirm}
                    answered={item.answered}
                    selection={item.selection}
                    onSubmit={(selection) =>
                      submitChoice(item.choiceId, selection)
                    }
                  />
                );
              case "queued":
                return (
                  <div
                    key={item.id}
                    className="pl-10 text-xs text-muted-foreground"
                  >
                    Queued
                    {item.position > 0 ? ` · position ${item.position}` : ""}…
                  </div>
                );
              case "error":
                return (
                  <div
                    key={item.id}
                    className="ml-10 max-w-[80%] rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  >
                    {item.error}
                  </div>
                );
              default:
                return null;
            }
          })}

          {showThinking && (
            <div className="flex items-center gap-2 pl-10 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              <span>Thinking…</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <ChatComposer
        onSend={send}
        disabled={phase !== "idle"}
        placeholder={
          phase === "awaiting"
            ? "Select an option above to continue…"
            : phase === "thinking"
              ? "Assistant is working…"
              : "Message the assistant…"
        }
      />
    </div>
  );
}
