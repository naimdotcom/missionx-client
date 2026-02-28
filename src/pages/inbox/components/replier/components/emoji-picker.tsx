// Lazy-loaded emoji picker component using emoji-mart

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { Suspense, lazy, useState } from "react";
import { Button } from "~/components/ui/button";

// Lazy load emoji picker for better bundle size
const EmojiPickerImpl = lazy(() => import("./emoji-picker-impl"));

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  disabled?: boolean;
}

export const EmojiPicker = ({ onSelect, disabled }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          title="Add emoji"
        >
          <Smile className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="w-auto p-0 border-none shadow-xl"
        sideOffset={8}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center w-[352px] h-[435px] bg-background rounded-lg">
              <p className="text-sm text-muted-foreground">Loading emojis...</p>
            </div>
          }
        >
          <EmojiPickerImpl
            onSelect={(emoji) => {
              onSelect(emoji);
              setIsOpen(false);
            }}
            onClose={() => setIsOpen(false)}
          />
        </Suspense>
      </PopoverContent>
    </Popover>
  );
};
