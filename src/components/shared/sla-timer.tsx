// SLA timer component with color-coded states

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { SLATimer } from "~/types/ticket";

interface SLATimerProps {
  sla: SLATimer;
  size?: "sm" | "md";
}

export const SLATimerComponent = ({ sla, size = "md" }: SLATimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(sla.remainingSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatted = formatTime(timeRemaining);
  const stateConfig = getStateConfig(sla.state);

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-medium",
        sizeClasses[size],
        stateConfig.bgColor,
        stateConfig.textColor,
      )}
      title={`SLA ${sla.state}`}
    >
      <Clock className={cn(size === "sm" ? "w-3 h-3" : "w-4 h-4")} />
      <span>{formatted}</span>
    </div>
  );
};

function formatTime(seconds: number): string {
  if (seconds <= 0) return "0m";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function getStateConfig(state: SLATimer["state"]) {
  const configs = {
    safe: {
      bgColor: "bg-green-500/10",
      textColor: "text-green-700 dark:text-green-400",
    },
    warning: {
      bgColor: "bg-yellow-500/10",
      textColor: "text-yellow-700 dark:text-yellow-400",
    },
    critical: {
      bgColor: "bg-red-500/10",
      textColor: "text-red-700 dark:text-red-400",
    },
    breached: {
      bgColor: "bg-red-500/20",
      textColor: "text-red-800 dark:text-red-300",
    },
  };

  return configs[state];
}
