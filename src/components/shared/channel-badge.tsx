// Channel badge component to indicate message source

import { Facebook, Instagram } from "lucide-react";
import { cn } from "~/lib/utils";
import { ChannelType } from "~/types/message";

interface ChannelBadgeProps {
  channelType: ChannelType;
  platformName?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const ChannelBadge = ({
  channelType,
  platformName,
  size = "md",
  showLabel = false,
}: ChannelBadgeProps) => {
  const config = getChannelConfig(channelType);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          "rounded-full flex items-center justify-center p-1",
          config.bgColor,
        )}
        title={platformName || config.label}
      >
        <config.icon className={cn(sizeClasses[size], config.iconColor)} />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground">
          {platformName || config.label}
        </span>
      )}
    </div>
  );
};

function getChannelConfig(channelType: ChannelType) {
  const configs = {
    facebook_page: {
      icon: Facebook,
      label: "Facebook",
      bgColor: "bg-[#1877F2]/10",
      iconColor: "text-[#1877F2]",
    },
    instagram_business: {
      icon: Instagram,
      label: "Instagram",
      bgColor: "bg-[#E1306C]/10",
      iconColor: "text-[#E1306C]",
    },
  };

  return configs[channelType];
}
