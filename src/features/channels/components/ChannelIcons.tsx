import { cn } from "@/lib/utils";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const FacebookIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-facebook", className)}
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const InstagramIcon = ({
  size = 16,
  className,
  ...props
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-instagram", className)}
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const CHANNEL_CONFIG = {
  facebook: {
    icon: FacebookIcon,
    textColor: "text-[#1877F2]",
    bgColor: "bg-[#1877F2]/10",
    hoverBg: "group-hover:bg-[#1877F2]/20",
    label: "Facebook Page",
  },
  instagram: {
    icon: InstagramIcon,
    textColor: "text-[#E1306C]",
    bgColor: "bg-[#E1306C]/10",
    hoverBg: "group-hover:bg-[#E1306C]/20",
    label: "Instagram Account",
  },
} as const;

export type ChannelType = keyof typeof CHANNEL_CONFIG;

interface ChannelIconProps {
  type: ChannelType | string;
  className?: string;
  iconClassName?: string;
  variant?: "plain" | "boxed";
}

export function ChannelIcon({
  type,
  className,
  iconClassName,
  variant = "plain",
}: ChannelIconProps) {
  const normalizedType = type.toLowerCase() as ChannelType;
  const config = CHANNEL_CONFIG[normalizedType];

  if (!config) return null;

  const Icon = config.icon;

  if (variant === "boxed") {
    return (
      <div
        className={cn(
          "p-2 rounded-lg transition-colors",
          config.bgColor,
          config.hoverBg,
          className,
        )}
      >
        <Icon className={cn("size-4", config.textColor, iconClassName)} />
      </div>
    );
  }

  return <Icon className={cn("size-4", config.textColor, className)} />;
}

export const getChannelIcon = (type: string) => {
  const normalizedType = type.toLowerCase() as ChannelType;
  return CHANNEL_CONFIG[normalizedType]?.icon || null;
};

export const getChannelColor = (type: string) => {
  const normalizedType = type.toLowerCase() as ChannelType;
  return CHANNEL_CONFIG[normalizedType]?.textColor || "text-primary";
};
