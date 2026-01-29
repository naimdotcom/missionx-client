import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  loading = false,
}: StatsCardProps) {
  if (loading) {
    return (
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-10 w-24 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded" />
          {description && (
            <div className="h-4 w-32 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded mt-2" />
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {title}
          </CardTitle>
          {Icon && (
            <Icon className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            {value}
          </div>
          {trend && (
            <span
              className={`text-sm font-medium ${
                trend.isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
