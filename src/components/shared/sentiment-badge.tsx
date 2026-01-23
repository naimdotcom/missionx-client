// Customer sentiment badge component

import { Frown, Meh, Smile } from "lucide-react";
import { cn } from "~/lib/utils";
import { SentimentType } from "~/types/ticket";

interface SentimentBadgeProps {
  sentiment: SentimentType;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export const SentimentBadge = ({
  sentiment,
  size = "md",
  showLabel = false,
}: SentimentBadgeProps) => {
  const config = getSentimentConfig(sentiment);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
  };

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          "rounded-full flex items-center justify-center p-1",
          config.bgColor,
        )}
        title={config.label}
      >
        <config.icon className={cn(sizeClasses[size], config.iconColor)} />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground">
          {config.label}
        </span>
      )}
    </div>
  );
};

function getSentimentConfig(sentiment: SentimentType) {
  const configs = {
    positive: {
      icon: Smile,
      label: "Positive",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-600",
    },
    neutral: {
      icon: Meh,
      label: "Neutral",
      bgColor: "bg-slate-500/10",
      iconColor: "text-slate-600",
    },
    negative: {
      icon: Frown,
      label: "Negative",
      bgColor: "bg-red-500/10",
      iconColor: "text-red-600",
    },
  };

  return configs[sentiment];
}
