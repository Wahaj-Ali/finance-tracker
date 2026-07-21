"use client";

import { formatPKR } from "@/lib/format";
import type { DashboardStats } from "@/types";

type HeroCardProps = {
  stats: DashboardStats;
  salarySet: boolean;
};

export function HeroCard({ stats, salarySet }: HeroCardProps) {
  const utilization = salarySet
    ? Math.min((stats.totalSpent / stats.salary) * 100, 100)
    : 0;

  return (
    <div className="card accent-glow relative overflow-hidden p-6 md:p-8">
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-accent/5 blur-2xl" />

      <div className="relative">
        <p className="text-sm text-muted">Monthly Budget Journey</p>
        <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
          Track Your Spending Journey
        </h2>
        <p className="mt-2 max-w-lg text-sm text-muted">
          {salarySet
            ? `You've used ${utilization.toFixed(0)}% of your ${formatPKR(stats.salary)} monthly income across all categories.`
            : "Set your monthly salary to start tracking your budget allocations."}
        </p>

        {salarySet && (
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs">
              <span className="text-muted">Overall utilization</span>
              <span className="font-medium text-accent">
                {utilization.toFixed(1)}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${utilization}%` }}
              />
            </div>
            <div className="mt-3 flex gap-6 text-sm">
              <div>
                <span className="text-muted">Spent </span>
                <span className="font-semibold text-white">
                  {formatPKR(stats.totalSpent)}
                </span>
              </div>
              <div>
                <span className="text-muted">Remaining </span>
                <span
                  className={`font-semibold ${stats.savingsAlert ? "text-danger" : "text-success"}`}
                >
                  {formatPKR(stats.remaining)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
