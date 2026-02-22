import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Pre-defined statuses ─────────────────────────────────────────

export type StatusType =
  | "active"
  | "inactive"
  | "pending"
  | "expired"
  | "connected"
  | "disconnected"
  | "verified"
  | "unverified"
  | "online"
  | "offline"
  | "open"
  | "closed"
  | "resolved"
  | "error"
  | "warning"
  | "info";

const STATUS_STYLES: Record<
  StatusType,
  { bg: string; text: string; dot: string; label: string }
> = {
  active: {
    bg: "bg-green-500/10 border-green-500/20",
    text: "text-green-600 dark:text-green-400",
    dot: "bg-green-500",
    label: "Active",
  },
  inactive: {
    bg: "bg-zinc-500/10 border-zinc-500/20",
    text: "text-zinc-500 dark:text-zinc-400",
    dot: "bg-zinc-400",
    label: "Inactive",
  },
  pending: {
    bg: "bg-yellow-500/10 border-yellow-500/20",
    text: "text-yellow-600 dark:text-yellow-400",
    dot: "bg-yellow-500",
    label: "Pending",
  },
  expired: {
    bg: "bg-red-500/10 border-red-500/20",
    text: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
    label: "Expired",
  },
  connected: {
    bg: "bg-green-500/10 border-green-500/20",
    text: "text-green-600 dark:text-green-400",
    dot: "bg-green-500",
    label: "Connected",
  },
  disconnected: {
    bg: "bg-red-500/10 border-red-500/20",
    text: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
    label: "Disconnected",
  },
  verified: {
    bg: "bg-blue-500/10 border-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
    label: "Verified",
  },
  unverified: {
    bg: "bg-zinc-500/10 border-zinc-500/20",
    text: "text-zinc-500 dark:text-zinc-400",
    dot: "bg-zinc-400",
    label: "Unverified",
  },
  online: {
    bg: "bg-emerald-500/10 border-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "Online",
  },
  offline: {
    bg: "bg-zinc-500/10 border-zinc-500/20",
    text: "text-zinc-500 dark:text-zinc-400",
    dot: "bg-zinc-400",
    label: "Offline",
  },
  open: {
    bg: "bg-blue-500/10 border-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
    label: "Open",
  },
  closed: {
    bg: "bg-zinc-500/10 border-zinc-500/20",
    text: "text-zinc-500 dark:text-zinc-400",
    dot: "bg-zinc-400",
    label: "Closed",
  },
  resolved: {
    bg: "bg-purple-500/10 border-purple-500/20",
    text: "text-purple-600 dark:text-purple-400",
    dot: "bg-purple-500",
    label: "Resolved",
  },
  error: {
    bg: "bg-red-500/10 border-red-500/20",
    text: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
    label: "Error",
  },
  warning: {
    bg: "bg-orange-500/10 border-orange-500/20",
    text: "text-orange-600 dark:text-orange-400",
    dot: "bg-orange-500",
    label: "Warning",
  },
  info: {
    bg: "bg-sky-500/10 border-sky-500/20",
    text: "text-sky-600 dark:text-sky-400",
    dot: "bg-sky-500",
    label: "Info",
  },
};

// ─── Props ────────────────────────────────────────────────────────

interface StatusBadgeProps {
  /** Pre-defined status — sets colors and default label automatically */
  status?: StatusType;
  /** Override or provide custom label text */
  children?: React.ReactNode;
  /** Show the colored dot indicator. Defaults to true */
  showDot?: boolean;
  /** Extra classes forwarded to the Badge */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────

export function StatusBadge({
  status,
  children,
  showDot = true,
  className,
}: StatusBadgeProps) {
  const style = status ? STATUS_STYLES[status] : null;

  return (
    <Badge
      className={cn(
        className,
        style?.bg,
        style?.text,
        "inline-flex items-center gap-1 shadow-none text-[11px] hover:bg-current/5",
      )}
    >
      {showDot && style && (
        <span className={cn("size-1.5 shrink-0 rounded-full", style.dot)} />
      )}
      {children ?? style?.label}
    </Badge>
  );
}
