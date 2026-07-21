"use client";

import { formatCompactPKR } from "@/lib/format";
import type { DashboardStats } from "@/types";
import { BarChart3, PiggyBank, Receipt, TrendingUp } from "lucide-react";

type MetricCardsProps = {
  stats: DashboardStats;
};

export function MetricCards({ stats }: MetricCardsProps) {
  const successRate =
    stats.categories.filter((c) => !c.overspent).length /
    stats.categories.length;

  const cards = [
    {
      label: "Total Spent",
      value: formatCompactPKR(stats.totalSpent),
      sub: `${stats.expenseCount} transactions`,
      icon: Receipt,
      sparkline: stats.categories.map((c) => c.spent),
    },
    {
      label: "Remaining",
      value: formatCompactPKR(stats.remaining),
      sub: stats.savingsAlert ? "Below savings target" : "On track",
      icon: PiggyBank,
      alert: stats.savingsAlert,
    },
    {
      label: "Avg Daily Spend",
      value: formatCompactPKR(stats.avgDailySpend),
      sub: `Day ${stats.daysElapsed} of ${stats.daysInMonth}`,
      icon: TrendingUp,
    },
    {
      label: "Budget Health",
      value: `${(successRate * 100).toFixed(0)}%`,
      sub: `${stats.categories.length - stats.overspentCategories.length}/${stats.categories.length} categories OK`,
      icon: BarChart3,
      gauge: successRate,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs text-muted">{card.label}</span>
            <div className="rounded-lg bg-accent/10 p-2">
              <card.icon className="h-4 w-4 text-accent" />
            </div>
          </div>
          <p
            className={`text-2xl font-bold ${card.alert ? "text-danger" : "text-foreground"}`}
          >
            {card.value}
          </p>
          <p className="mt-1 text-xs text-muted">{card.sub}</p>

          {card.sparkline && (
            <div className="mt-4 flex h-8 items-end gap-1">
              {card.sparkline.map((val, i) => {
                const max = Math.max(...card.sparkline!, 1);
                const h = (val / max) * 100;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-accent/80"
                    style={{ height: `${Math.max(h, 8)}%` }}
                  />
                );
              })}
            </div>
          )}

          {card.gauge !== undefined && (
            <div className="relative mx-auto mt-4 h-12 w-24 overflow-hidden">
              <div className="absolute inset-0 rounded-t-full border-[6px] border-[var(--progress-track)] border-b-transparent" />
              <div
                className="absolute inset-0 origin-bottom rounded-t-full border-[6px] border-accent border-b-transparent transition-all"
                style={{
                  clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 0)",
                  transform: `rotate(${(card.gauge - 0.5) * 180}deg)`,
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
