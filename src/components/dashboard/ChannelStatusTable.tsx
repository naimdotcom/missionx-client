"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook, Instagram } from "lucide-react";

interface Channel {
  id: string;
  platform: string;
  is_active: boolean;
  is_verified: boolean;
  platform_page_id: string;
}

interface ChannelStatusTableProps {
  channels: Channel[];
  loading?: boolean;
}

export function ChannelStatusTable({
  channels,
  loading = false,
}: ChannelStatusTableProps) {
  if (loading) {
    return (
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle>Channel Status</CardTitle>
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

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-neutral-50">
          Channel Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {channels.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400 text-sm">
            No channels connected yet
          </div>
        ) : (
          <div className="space-y-3">
            {channels.slice(0, 5).map((channel) => (
              <div
                key={channel.id}
                className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-neutral-600 dark:text-neutral-400">
                    {getPlatformIcon(channel.platform)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-50 capitalize">
                      {channel.platform}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      ID: {channel.platform_page_id.slice(0, 12)}...
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      channel.is_verified
                        ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                        : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                    }`}
                  >
                    {channel.is_verified ? "Verified" : "Pending"}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      channel.is_active
                        ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {channel.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
