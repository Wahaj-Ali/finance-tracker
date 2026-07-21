"use client";

import {
  getCategoryChartColor,
  getChartTheme,
  useTheme,
} from "@/components/theme/ThemeProvider";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatPKR } from "@/lib/format";
import type { CategoryStats } from "@/types";
import { useMemo } from "react";

type SpendingPieChartProps = {
  categories: CategoryStats[];
};

export function SpendingPieChart({ categories }: SpendingPieChartProps) {
  const { theme } = useTheme();
  const chart = getChartTheme();

  const data = useMemo(
    () =>
      categories
        .filter((c) => c.spent > 0)
        .map((c) => ({
          name: c.label,
          value: c.spent,
          color: getCategoryChartColor(c.id, theme),
        })),
    [categories, theme]
  );

  if (data.length === 0) {
    return (
      <div className="card flex h-full min-h-[280px] flex-col p-6">
        <h3 className="mb-1 text-sm font-semibold text-foreground">
          Spending Distribution
        </h3>
        <p className="flex flex-1 items-center justify-center text-sm text-muted">
          No expenses recorded yet
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="mb-1 text-sm font-semibold text-foreground">
        Spending Distribution
      </h3>
      <p className="mb-2 text-xs text-muted">Where your money is going</p>
      <ResponsiveContainer width="100%" height={220} key={theme}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: chart.tooltipBg,
              border: `1px solid ${chart.tooltipBorder}`,
              borderRadius: "12px",
              fontSize: "12px",
              color: "var(--foreground)",
            }}
            formatter={(value) => formatPKR(Number(value))}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap gap-3">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-muted">{d.name.split(" ")[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PredictiveAnalytics({ categories }: SpendingPieChartProps) {
  const { theme } = useTheme();

  const items = categories.map((c) => ({
    label: c.label,
    utilization: Math.min(c.utilization, 100),
    color: getCategoryChartColor(c.id, theme),
    overspent: c.overspent,
  }));

  return (
    <div className="card p-6">
      <h3 className="mb-1 text-sm font-semibold text-foreground">
        Budget Analytics
      </h3>
      <p className="mb-5 text-xs text-muted">
        Category utilization at a glance
      </p>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-muted">{item.label}</span>
              <span
                className={item.overspent ? "text-danger" : "text-accent"}
              >
                {item.utilization.toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[var(--progress-track)]">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${item.utilization}%`,
                  backgroundColor: item.overspent ? "var(--danger)" : item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
