import type { ChannelPlatform } from "@/api";
import { cn } from "@/lib/utils";
import { Facebook, Instagram } from "lucide-react";

// ─── Platform config ───────────────────────────────────────────────────────────

const PLATFORM_CONFIG = {
  facebook: {
    icon: Facebook,
    label: "Facebook Page",
    bg: "bg-[#1877F2]",
    hoverBg: "hover:bg-[#1564d4]",
  },
  instagram: {
    icon: Instagram,
    label: "Instagram Account",
    bg: "bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]",
    hoverBg: "hover:opacity-90",
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
        "flex shrink-0 items-center justify-center transition-all duration-200",
        config.bg,
        config.hoverBg,
        shape === "circle" ? "rounded-full" : "rounded-xl",
        className,
      )}
    >
      <Icon
        style={{ width: iconSize, height: iconSize }}
        className="text-white"
        strokeWidth={2}
      />
    </div>
  );
}
