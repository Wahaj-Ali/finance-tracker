"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPKR } from "@/lib/format";
import type { CategoryStats } from "@/types";

type CategoryProgressProps = {
  categories: CategoryStats[];
};

export function CategoryProgress({ categories }: CategoryProgressProps) {
  return (
    <div className="card p-6">
      <h3 className="mb-1 text-sm font-semibold text-white">
        Category Budget vs Spent
      </h3>
      <p className="mb-6 text-xs text-muted">
        Compare allocated budget against actual spending
      </p>

      <div className="space-y-5">
        {categories.map((cat) => (
          <div key={cat.id}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-white">{cat.label}</span>
                <span className="text-xs text-muted">({cat.percentage}%)</span>
              </div>
              <div className="text-right">
                <span
                  className={`font-medium ${cat.overspent ? "text-danger" : "text-white"}`}
                >
                  {formatPKR(cat.spent)}
                </span>
                <span className="text-muted"> / {formatPKR(cat.budget)}</span>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className={`h-full rounded-full transition-all ${cat.overspent ? "bg-danger" : "bg-accent"}`}
                style={{
                  width: `${Math.min(cat.utilization, 100)}%`,
                }}
              />
            </div>
            {cat.overspent && (
              <p className="mt-1 text-xs text-danger">
                Over by {formatPKR(cat.spent - cat.budget)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryBarChart({ categories }: CategoryProgressProps) {
  const data = categories.map((c) => ({
    name: c.label.split(" ")[0],
    budget: c.budget,
    spent: c.spent,
    color: c.color,
  }));

  return (
    <div className="card p-6">
      <h3 className="mb-1 text-sm font-semibold text-white">
        Budget Comparison
      </h3>
      <p className="mb-4 text-xs text-muted">Budget vs actual by category</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="name"
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
            formatter={(value) => formatPKR(Number(value))}
          />
          <Bar dataKey="budget" fill="#3f3f46" radius={[6, 6, 0, 0]} />
          <Bar dataKey="spent" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
