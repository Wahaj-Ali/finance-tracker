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
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          <div>
            <p className="text-sm font-semibold text-red-300">
              Savings at risk
            </p>
            <p className="mt-1 text-sm text-red-200/80">
              Remaining balance ({formatPKR(stats.remaining)}) is below your 10%
              savings target ({formatPKR(stats.savingsTarget)}). You need{" "}
              {formatPKR(stats.savingsShortfall)} more to stay on track.
            </p>
          </div>
        </div>
      )}

      {hasOverspend && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-amber-300">
              Category overspending detected
            </p>
            <p className="mt-1 text-sm text-amber-200/80">
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
