"use client";

import { Separator } from "@/components/ui/separator";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CustomerGrowthChart } from "@/components/dashboard/CustomerGrowthChart";
import { PlatformBreakdownChart } from "@/components/dashboard/PlatformBreakdownChart";
import { RecentAppsTable } from "@/components/dashboard/RecentAppsTable";
import { ChannelStatusTable } from "@/components/dashboard/ChannelStatusTable";
import { useGetDashboardStatsQuery } from "@/store/api/analyticsApi";
import { AppWindow, Users, Radio, Activity } from "lucide-react";

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery({});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Overview of your apps, channels, and customer growth
        </p>
      </div>

      <Separator />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Apps"
          value={stats?.totalApps ?? 0}
          description="Apps created"
          icon={AppWindow}
          loading={isLoading}
        />
        <StatsCard
          title="Channels"
          value={stats?.totalChannels ?? 0}
          description={`${stats?.activeChannels ?? 0} active`}
          icon={Radio}
          loading={isLoading}
        />
        <StatsCard
          title="Customers"
          value={stats?.totalCustomers ?? 0}
          description={`${stats?.newCustomersThisMonth ?? 0} this month`}
          icon={Users}
          loading={isLoading}
          trend={
            stats?.newCustomersThisMonth
              ? {
                  value: Math.round(
                    (stats.newCustomersThisMonth / stats.totalCustomers) * 100,
                  ),
                  isPositive: true,
                }
              : undefined
          }
        />
        <StatsCard
          title="Active Sessions"
          value={stats?.activeSessions ?? 0}
          description="Current sessions"
          icon={Activity}
          loading={isLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerGrowthChart
          data={stats?.customerGrowth ?? []}
          loading={isLoading}
        />
        <PlatformBreakdownChart
          data={stats?.platformBreakdown ?? []}
          loading={isLoading}
        />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAppsTable apps={stats?.recentApps ?? []} loading={isLoading} />
        <ChannelStatusTable
          channels={stats?.channels ?? []}
          loading={isLoading}
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-4">
          <p className="text-sm text-red-600 dark:text-red-400">
            Failed to load dashboard data. Please try refreshing the page.
          </p>
        </div>
      )}
    </div>
  );
}
