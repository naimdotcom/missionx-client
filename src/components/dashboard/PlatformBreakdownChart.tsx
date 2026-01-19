"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PlatformBreakdownChartProps {
  data: Array<{
    platform: string;
    active: number;
    inactive: number;
  }>;
  loading?: boolean;
}

export function PlatformBreakdownChart({
  data,
  loading = false,
}: PlatformBreakdownChartProps) {
  if (loading) {
    return (
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle>Channel Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-neutral-200 dark:border-neutral-800">
      <CardHeader>
        <CardTitle className="text-neutral-900 dark:text-neutral-50">
          Channel Platforms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e5e5"
              className="dark:stroke-neutral-800"
            />
            <XAxis type="number" stroke="#737373" fontSize={12} />
            <YAxis
              dataKey="platform"
              type="category"
              stroke="#737373"
              fontSize={12}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e5e5",
                borderRadius: "6px",
                fontSize: "12px",
              }}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              iconType="circle"
              iconSize={8}
            />
            <Bar
              dataKey="active"
              fill="#22c55e"
              name="Active"
              radius={[0, 4, 4, 0]}
            />
            <Bar
              dataKey="inactive"
              fill="#ef4444"
              name="Inactive"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
