"use client";

import { AlertTriangle, ShieldAlert } from "lucide-react";
import { formatPKR } from "@/lib/format";
import type { DashboardStats } from "@/types";

type AlertsBannerProps = {
  stats: DashboardStats;
};

export function AlertsBanner({ stats }: AlertsBannerProps) {
  const hasOverspend = stats.overspentCategories.length > 0;
  const hasSavingsAlert = stats.savingsAlert;

  if (!hasOverspend && !hasSavingsAlert) return null;

  return (
    <div className="space-y-3">
      {hasSavingsAlert && (
        <div className="flex items-start gap-3 rounded-2xl border border-danger/30 bg-danger/10 px-5 py-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
          <div>
            <p className="text-sm font-semibold text-danger">Savings at risk</p>
            <p className="mt-1 text-sm text-muted">
              Remaining balance ({formatPKR(stats.remaining)}) is below your{" "}
              {stats.salary > 0
                ? Math.round((stats.savingsTarget / stats.salary) * 100)
                : 10}
              % savings target ({formatPKR(stats.savingsTarget)}). You need{" "}
              {formatPKR(stats.savingsShortfall)} more to stay on track.
            </p>
          </div>
        </div>
      )}

      {hasOverspend && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-amber-600">
              Category overspending detected
            </p>
            <p className="mt-1 text-sm text-muted">
              {stats.overspentCategories
                .map(
                  (c) =>
                    `${c.label} (${formatPKR(c.spent)} / ${formatPKR(c.budget)})`
                )
                .join(" · ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
