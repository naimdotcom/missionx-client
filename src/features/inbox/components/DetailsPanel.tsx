import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DetailsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export function DetailsPanel({
  isOpen,
  onToggle,
  children,
}: DetailsPanelProps) {
  return (
    <div
      className={cn(
        "relative border-l transition-all duration-300 ease-in-out h-full overflow-hidden",
        isOpen ? "w-[320px]" : "w-0",
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className={cn(
          "absolute top-4 -left-9 z-10 rounded-md border bg-background shadow-sm hover:bg-accent",
          "transition-all duration-200",
        )}
        title={isOpen ? "Hide details" : "Show details"}
      >
        {isOpen ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* Panel Content */}
      <div
        className={cn(
          "h-full transition-opacity duration-300 overflow-hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <ScrollArea className="h-full w-full">
          <div className="p-4 grid gap-4">{children}</div>
        </ScrollArea>
      </div>
    </div>
  );
}
