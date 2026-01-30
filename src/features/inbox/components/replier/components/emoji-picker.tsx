// Lazy-loaded emoji picker component

import { Smile } from "lucide-react";
import { Suspense, lazy, useState } from "react";
import { Button } from "~/components/ui/button";

// Lazy load emoji picker for better bundle size
const EmojiPickerImpl = lazy(() => import("./emoji-picker-impl"));

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        title="Add emoji"
      >
        <Smile className="w-5 h-5" />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 z-50">
          <Suspense
            fallback={
              <div className="bg-background border rounded-lg p-4 shadow-lg">
                <p className="text-sm text-muted-foreground">Loading...</p>
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
        </div>
      )}
    </div>
  );
};
