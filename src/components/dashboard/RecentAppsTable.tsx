"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface App {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  creator_id: string;
}

interface RecentAppsTableProps {
  apps: App[];
  loading?: boolean;
}

export function RecentAppsTable({
  apps,
  loading = false,
}: RecentAppsTableProps) {
  if (loading) {
    return (
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle>Recent Apps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentApps = apps.slice(0, 5);

  return (
    <Card className="border-neutral-200 dark:border-neutral-800">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-neutral-50">
          Recent Apps
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentApps.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400 text-sm">
            No apps created yet
          </div>
        ) : (
          <div className="space-y-3">
            {recentApps.map((app) => (
              <div
                key={app.id}
                className="flex items-start justify-between p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-50 truncate">
                    {app.name}
                  </h4>
                  {app.description && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
                      {app.description}
                    </p>
                  )}
                </div>
                <div className="text-xs text-neutral-400 dark:text-neutral-500 ml-4 whitespace-nowrap">
                  {formatDistanceToNow(new Date(app.created_at), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
