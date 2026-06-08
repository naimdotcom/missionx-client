import { cn } from "@/lib/utils";
import { Check, Loader2, ShieldX } from "lucide-react";

interface StatusIndicatorProps {
  label: string;
  denied?: boolean;
  done?: boolean;
}

export function StatusIndicator({ label, denied, done }: StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-2 pl-10 text-xs text-muted-foreground">
      {denied ? (
        <ShieldX className="size-3.5 text-destructive" />
      ) : done ? (
        <Check className="size-3.5 text-[hsl(var(--sla-safe))]" />
      ) : (
        <Loader2 className="size-3.5 animate-spin" />
      )}
      <span className={cn(denied && "text-destructive")}>{label}</span>
    </div>
  );
}
