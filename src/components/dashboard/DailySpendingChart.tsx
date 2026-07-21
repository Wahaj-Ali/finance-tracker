"use client";

import {
  getChartTheme,
  useTheme,
} from "@/components/theme/ThemeProvider";
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
  const { theme } = useTheme();
  const chart = getChartTheme();
  const gradientId = `spendGrad-${theme}`;

  return (
    <div className="card p-6">
      <h3 className="mb-1 text-sm font-semibold text-foreground">
        Daily Spending Trend
      </h3>
      <p className="mb-4 text-xs text-muted">
        Cumulative spending throughout the month
      </p>
      <ResponsiveContainer width="100%" height={220} key={theme}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chart.accent} stopOpacity={0.3} />
              <stop offset="100%" stopColor={chart.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={chart.grid}
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fill: chart.muted, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: chart.muted, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₨${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              background: chart.tooltipBg,
              border: `1px solid ${chart.tooltipBorder}`,
              borderRadius: "12px",
              fontSize: "12px",
              color: "var(--foreground)",
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
            stroke={chart.accent}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
