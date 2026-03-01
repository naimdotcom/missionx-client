// Lazy-loaded emoji picker component using emoji-mart

import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";

// Lazy load emoji picker for better bundle size
const EmojiPickerImpl = lazy(() => import("./emoji-picker-impl"));

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  disabled?: boolean;
}

export const EmojiPicker = ({ onSelect, disabled }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside the entire wrapper (trigger + picker)
  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    // Use capture phase so we get it before anything else
    document.addEventListener("mousedown", handleOutside, true);
    return () => document.removeEventListener("mousedown", handleOutside, true);
  }, [isOpen]);

  return (
    <div ref={wrapperRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        title="Add emoji"
        onMouseDown={(e) => {
          e.preventDefault(); // prevent textarea blur
          setIsOpen((prev) => !prev);
        }}
      >
        <Smile className="w-5 h-5" />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 z-50 shadow-xl rounded-xl overflow-hidden">
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-[352px] h-[435px] bg-background rounded-xl border">
                <p className="text-sm text-muted-foreground">
                  Loading emojis...
                </p>
              </div>
            }
          >
            <EmojiPickerImpl
              onSelect={(emoji) => {
                onSelect(emoji);
              }}
              onClose={() => setIsOpen(false)}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
};
