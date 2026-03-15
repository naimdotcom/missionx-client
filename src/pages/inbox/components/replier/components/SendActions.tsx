import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ChevronUp,
  Loader2,
  MessageCircle,
  Send,
} from "lucide-react";

interface SendActionsProps {
  canSend: boolean;
  isSending: boolean;
  disabled: boolean;
  disableSend: boolean;
  conversationId?: string;
  isTicketClosed: boolean;
  hasMessage: boolean;
  onSend: () => void;
  onSendAndClose: () => void;
  onSendAndKeepOpen: () => void;
}

export function SendActions({
  canSend,
  isSending,
  disabled,
  disableSend,
  conversationId,
  isTicketClosed,
  hasMessage,
  onSend,
  onSendAndClose,
  onSendAndKeepOpen,
}: SendActionsProps) {
  return (
    <div className="flex items-center">
      <Button
        onClick={onSend}
        disabled={!canSend}
        size="icon"
        className={cn("h-8 w-8", conversationId && "rounded-r-none")}
        title="Send message (Ctrl+Enter)"
      >
        {isSending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>

      {conversationId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="h-8 w-6 rounded-l-none border-l border-primary-foreground/20"
              disabled={disabled || isSending || disableSend}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={onSend} disabled={!canSend}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {!isTicketClosed && (
              <DropdownMenuItem onClick={onSendAndClose}>
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                {hasMessage ? "Send & Close Ticket" : "Close Ticket"}
              </DropdownMenuItem>
            )}
            {isTicketClosed && (
              <DropdownMenuItem onClick={onSendAndKeepOpen}>
                <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                {hasMessage ? "Send & Reopen Ticket" : "Reopen Ticket"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
