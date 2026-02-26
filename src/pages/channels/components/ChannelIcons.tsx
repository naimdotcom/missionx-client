import type { ChannelPlatform } from "@/api";
import { cn } from "@/lib/utils";
import { Facebook, Instagram } from "lucide-react";

// ─── Platform config ───────────────────────────────────────────────────────────

const PLATFORM_CONFIG = {
  facebook: {
    icon: Facebook,
    label: "Facebook Page",
    bg: "bg-[#1877F2]/10",
    text: "text-[#1564d4]",
  },
  instagram: {
    icon: Instagram,
    label: "Instagram Account",
    bg: " bg-[#e6683c]/10",
    text: "text-[#bc1888]",
  },
} as const;

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ChannelIconShape = "circle" | "square";

interface ChannelIconProps {
  platform: ChannelPlatform;
  /** "circle" → rounded-full | "square" → rounded-xl  (default: "square") */
  shape?: ChannelIconShape;
  /** Outer container size in px — default: 40 */
  size?: number;
  /** Inner icon size in px — default: 20 */
  iconSize?: number;
  className?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ChannelIcon({
  platform,
  shape = "square",
  size = 40,
  iconSize = 20,
  className,
}: ChannelIconProps) {
  const normalizedPlatform = platform?.toLowerCase() as ChannelPlatform;
  const config = PLATFORM_CONFIG[normalizedPlatform];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        config.bg,
        config.text,
        className,
        "flex shrink-0 items-center justify-center",
        shape === "circle" ? "rounded-full" : "rounded-xl",
      )}
    >
      <Icon strokeWidth={2} style={{ width: iconSize, height: iconSize }} />
    </div>
  );
}
