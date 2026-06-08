import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChoiceOption } from "@/api/services/operator/operator.type";
import { AlertTriangle, Check } from "lucide-react";

interface ChoiceCardProps {
  prompt: string;
  options: ChoiceOption[];
  multi: boolean;
  confirm: boolean;
  answered: boolean;
  selection?: string[];
  disabled?: boolean;
  onSubmit: (selection: string[]) => void;
}

export function ChoiceCard({
  prompt,
  options,
  multi,
  confirm,
  answered,
  selection,
  disabled,
  onSubmit,
}: ChoiceCardProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const isLocked = answered || disabled;
  const chosen = answered ? (selection ?? []) : selected;

  const toggle = (id: string) => {
    if (isLocked) return;
    if (multi) {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
    } else if (confirm) {
      // Single + destructive: select first, confirm second.
      setSelected([id]);
    } else {
      // Single, non-destructive: act immediately.
      onSubmit([id]);
    }
  };

  const needsConfirmButton = !isLocked && (multi || confirm);
  const canSubmit = selected.length > 0;

  return (
    <div
      className={cn(
        "ml-10 max-w-[80%] rounded-xl border bg-card p-3 shadow-sm",
        confirm && !answered && "border-destructive/40",
      )}
    >
      <div className="mb-2 flex items-start gap-2">
        {confirm && (
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
        )}
        <p className="text-sm font-medium text-foreground">{prompt}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        {options.map((opt) => {
          const active = chosen.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              disabled={isLocked}
              onClick={() => toggle(opt.id)}
              className={cn(
                "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                active
                  ? "border-primary bg-primary/10"
                  : "border-input hover:bg-accent",
                isLocked && "cursor-default opacity-90",
              )}
            >
              <span className="flex flex-col">
                <span className="font-medium text-foreground">{opt.label}</span>
                {opt.subtitle && (
                  <span className="text-xs text-muted-foreground">
                    {opt.subtitle}
                  </span>
                )}
              </span>
              {active && <Check className="size-4 shrink-0 text-primary" />}
            </button>
          );
        })}
      </div>

      {needsConfirmButton && (
        <div className="mt-2 flex justify-end">
          <Button
            size="sm"
            variant={confirm ? "destructive" : "default"}
            disabled={!canSubmit}
            onClick={() => onSubmit(selected)}
          >
            {confirm ? "Confirm" : "Submit"}
          </Button>
        </div>
      )}

      {answered && (
        <p className="mt-2 text-xs text-muted-foreground">
          ✓ Submitted
          {chosen.length > 0 &&
            `: ${options
              .filter((o) => chosen.includes(o.id))
              .map((o) => o.label)
              .join(", ")}`}
        </p>
      )}
    </div>
  );
}
