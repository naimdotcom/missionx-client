"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CustomerGrowthChartProps {
  data: Array<{ date: string; count: number }>;
  loading?: boolean;
}

type Period = "day" | "month" | "year";

export function CustomerGrowthChart({
  data,
  loading = false,
}: CustomerGrowthChartProps) {
  const [period, setPeriod] = useState<Period>("month");

  if (loading) {
    return (
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle>Customer Growth</CardTitle>
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-neutral-900 dark:text-neutral-50">
            Customer Growth
          </CardTitle>
          <div className="flex gap-1 border border-neutral-200 dark:border-neutral-800 rounded-md p-1">
            {(["day", "month", "year"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  period === p
                    ? "bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#000000" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e5e5"
              className="dark:stroke-neutral-800"
            />
            <XAxis
              dataKey="date"
              stroke="#737373"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#737373"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e5e5",
                borderRadius: "6px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#171717", fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#000000"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
