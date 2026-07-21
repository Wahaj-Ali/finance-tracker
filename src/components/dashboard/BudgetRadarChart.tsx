"use client";

import {
  getChartTheme,
  useTheme,
} from "@/components/theme/ThemeProvider";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatPKR } from "@/lib/format";
import type { CategoryStats } from "@/types";

type BudgetRadarChartProps = {
  categories: CategoryStats[];
};

export function BudgetRadarChart({ categories }: BudgetRadarChartProps) {
  const { theme } = useTheme();
  const chart = getChartTheme();

  const data = categories.map((c) => ({
    category: c.label.split(" ")[0],
    utilization: Math.min(c.utilization, 100),
    fullLabel: c.label,
    spent: c.spent,
    budget: c.budget,
  }));

  return (
    <div className="card p-6">
      <h3 className="mb-1 text-sm font-semibold text-foreground">
        Category Utilization
      </h3>
      <p className="mb-2 text-xs text-muted">
        Percentage of budget used per category
      </p>
      <ResponsiveContainer width="100%" height={280} key={theme}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke={chart.grid} />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: chart.muted, fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: chart.muted, fontSize: 10 }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              background: chart.tooltipBg,
              border: `1px solid ${chart.tooltipBorder}`,
              borderRadius: "12px",
              fontSize: "12px",
              color: "var(--foreground)",
            }}
            formatter={(_, __, props) => {
              const p = props.payload as (typeof data)[0];
              return [
                `${p.utilization.toFixed(0)}% (${formatPKR(p.spent)} / ${formatPKR(p.budget)})`,
                p.fullLabel,
              ];
            }}
          />
          <Radar
            name="Utilization"
            dataKey="utilization"
            stroke={chart.accent}
            fill={chart.accent}
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
