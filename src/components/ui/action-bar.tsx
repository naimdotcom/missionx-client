"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface ActionBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function ActionBar({ open, children, className }: ActionBarProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      role="toolbar"
      aria-label="Table row actions"
      data-state={open ? "open" : "closed"}
      className={cn(
        "fixed inset-x-0 bottom-6 z-50 mx-auto flex w-fit items-center gap-2 rounded-full border bg-background px-4 py-2 shadow-lg",
        // Animate in/out
        "transition-all duration-200 ease-in-out",
        open
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-4 opacity-0 pointer-events-none",
        className
      )}
    >
      {children}
    </div>,
    document.body
  );
}
