import { baseApi } from "./baseApi";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardStats: build.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          // Fetch apps
          const appsResult = await fetchWithBQ({
            url: "/api/v1/apps",
            service: "apps",
          });

          // Fetch channels
          const channelsResult = await fetchWithBQ({
            url: "/api/v1/channels",
            service: "webhook",
          });

          // Fetch customers
          const customersResult = await fetchWithBQ({
            url: "/api/v1/customers/",
            service: "auth",
          });

          // Fetch sessions
          const sessionsResult = await fetchWithBQ({
            url: "/api/auth/sessions",
            service: "auth",
          });

          if (appsResult.error) return { error: appsResult.error };
          if (channelsResult.error) return { error: channelsResult.error };
          if (customersResult.error) return { error: customersResult.error };

          const apps = (appsResult.data as any)?.apps || [];
          const channels = (channelsResult.data as any)?.channels || [];
          const customers = (customersResult.data as any) || [];
          const sessions = (sessionsResult.data as any)?.sessions || [];

          // Calculate stats
          const now = new Date();
          const thirtyDaysAgo = new Date(
            now.getTime() - 30 * 24 * 60 * 60 * 1000,
          );

          // Customer growth data
          const customerGrowth = processCustomerGrowth(customers);

          // Platform breakdown
          const platformBreakdown = processPlatformBreakdown(channels);

          // Recent apps (sorted by created_at)
          const recentApps = [...apps]
            .sort(
              (a: any, b: any) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )
            .slice(0, 5);

          return {
            data: {
              totalApps: apps.length,
              totalChannels: channels.length,
              totalCustomers: customers.length,
              activeSessions: sessions.length,
              activeChannels: channels.filter((c: any) => c.is_active).length,
              newCustomersThisMonth: customers.filter(
                (c: any) => new Date(c.created_at) > thirtyDaysAgo,
              ).length,
              customerGrowth,
              platformBreakdown,
              recentApps,
              channels: channels.slice(0, 5),
            },
          };
        } catch (error: any) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
      },
      providesTags: ["Apps", "Profile"],
    }),
  }),
  overrideExisting: false,
});

// Helper function to process customer growth data
function processCustomerGrowth(customers: any[]) {
  const now = new Date();
  const last30Days = [];

  // Generate last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];

    const count = customers.filter((c) => {
      const createdDate = new Date(c.created_at).toISOString().split("T")[0];
      return createdDate <= dateStr;
    }).length;

    last30Days.push({
      date: new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count,
    });
  }

  return last30Days;
}

// Helper function to process platform breakdown
function processPlatformBreakdown(channels: any[]) {
  const platforms: Record<string, { active: number; inactive: number }> = {};

  channels.forEach((channel) => {
    const platform =
      channel.platform.charAt(0).toUpperCase() + channel.platform.slice(1);

    if (!platforms[platform]) {
      platforms[platform] = { active: 0, inactive: 0 };
    }

    if (channel.is_active) {
      platforms[platform].active++;
    } else {
      platforms[platform].inactive++;
    }
  });

  return Object.entries(platforms).map(([platform, stats]) => ({
    platform,
    ...stats,
  }));
}

export const { useGetDashboardStatsQuery } = analyticsApi;
