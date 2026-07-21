"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPKR } from "@/lib/format";

type DailySpendingChartProps = {
  data: { day: number; amount: number; cumulative: number }[];
};

export function DailySpendingChart({ data }: DailySpendingChartProps) {
  return (
    <div className="card p-6">
      <h3 className="mb-1 text-sm font-semibold text-white">
        Daily Spending Trend
      </h3>
      <p className="mb-4 text-xs text-muted">
        Cumulative spending throughout the month
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DFFF00" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#DFFF00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "#71717a", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#71717a", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₨${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              background: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "12px",
              fontSize: "12px",
            }}
            formatter={(value, name) => [
              formatPKR(Number(value)),
              name === "cumulative" ? "Cumulative" : "Daily",
            ]}
            labelFormatter={(day) => `Day ${day}`}
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#DFFF00"
            strokeWidth={2}
            fill="url(#spendGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
