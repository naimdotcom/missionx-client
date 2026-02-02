import { cn } from "@/lib/utils";
import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "secondary";
}

export function Badge({
  className,
  children,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: "bg-primary/10 text-primary border-primary/20",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
    secondary: "bg-secondary text-secondary-foreground border-transparent",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border transition-all duration-300",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
