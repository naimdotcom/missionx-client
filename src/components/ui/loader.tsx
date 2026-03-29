import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "~/lib/utils";

const loaderVariants = cva("flex items-center justify-center shrink-0", {
  variants: {
    size: {
      sm: "gap-[3px]",
      md: "gap-[5px]",
      lg: "gap-[7px]",
    },
  },
  defaultVariants: { size: "md" },
});

// Per-size bar dimensions
const BAR_SIZES = {
  sm: { width: "3px", height: "18px", borderRadius: "2px" },
  md: { width: "5px", height: "32px", borderRadius: "3px" },
  lg: { width: "7px", height: "48px", borderRadius: "4px" },
} as const;

// Stagger delay for each of the 4 bars
const DELAYS = ["0s", "0.15s", "0.30s", "0.45s"];

export interface LoaderProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {}

/**
 * MissionX branded loader — four morphing bars with staggered animation.
 */
export function Loader({ className, size = "md", ...props }: LoaderProps) {
  const { width, height, borderRadius } = BAR_SIZES[size ?? "md"];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(loaderVariants({ size }), className)}
      {...props}
    >
      {DELAYS.map((delay, i) => (
        <span
          key={i}
          className="inline-block bg-primary animate-mx-bar"
          style={{
            width,
            height,
            borderRadius,
            animationDelay: delay,
            transformOrigin: "center",
          }}
        />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/**
 * Full-page overlay — always centered on the viewport.
 */
export function PageLoader({ size = "lg", className, ...props }: LoaderProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-background/70 backdrop-blur-xs",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-card px-12 py-10">
        <Loader size={size} />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Loading
        </p>
      </div>
    </div>
  );
}
