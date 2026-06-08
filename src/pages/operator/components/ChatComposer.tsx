import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";

interface ChatComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatComposer({
  onSend,
  disabled,
  placeholder = "Message the assistant…",
}: ChatComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize up to a max height.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t bg-background p-3">
      <div
        className={cn(
          "relative flex items-end rounded-xl border bg-background transition-colors",
          "focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
          disabled && "opacity-60",
        )}
      >
        <Textarea
          ref={textareaRef}
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="max-h-50 min-h-11 resize-none border-0 bg-transparent pr-12 shadow-none focus-visible:ring-0"
          rows={1}
        />
        <Button
          size="icon"
          className="absolute bottom-1.5 right-1.5 size-8 rounded-lg"
          disabled={disabled || !value.trim()}
          onClick={submit}
        >
          <ArrowUp className="size-4" />
        </Button>
      </div>
      <p className="mt-1 px-1 text-[11px] text-muted-foreground">
        <kbd className="rounded border bg-muted px-1 py-0.5">Ctrl</kbd> +{" "}
        <kbd className="rounded border bg-muted px-1 py-0.5">Enter</kbd> to send
      </p>
    </div>
  );
}
