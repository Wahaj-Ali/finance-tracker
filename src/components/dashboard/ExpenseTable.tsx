"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, CATEGORY_MAP, type CategoryId } from "@/lib/constants";
import { formatDate, formatPKR } from "@/lib/format";
import type { Expense } from "@/types";
import { Receipt, Trash2 } from "lucide-react";

type ExpenseTableProps = {
  expenses: Expense[];
  onDelete: (id: string) => void;
};

export function ExpenseTable({ expenses, onDelete }: ExpenseTableProps) {
  const [filter, setFilter] = useState<CategoryId | "all">("all");

  const sorted = useMemo(
    () =>
      [...expenses].sort(
        (a, b) =>
          new Date(b.expense_date).getTime() -
          new Date(a.expense_date).getTime()
      ),
    [expenses]
  );

  const filtered =
    filter === "all"
      ? sorted
      : sorted.filter((expense) => expense.category === filter);

  const categoryCounts = useMemo(() => {
    const counts = Object.fromEntries(
      CATEGORIES.map((c) => [c.id, 0])
    ) as Record<CategoryId, number>;
    for (const expense of expenses) {
      counts[expense.category]++;
    }
    return counts;
  }, [expenses]);

  if (expenses.length === 0) {
    return (
      <div className="card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Receipt className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold text-white">
            Individual Expenses
          </h3>
        </div>
        <p className="py-8 text-center text-sm text-muted">
          No expenses yet. Add your first one with the + button in the sidebar.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-card-border px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold text-white">
                Individual Expenses
              </h3>
            </div>
            <p className="mt-1 text-xs text-muted">
              {expenses.length} expense{expenses.length !== 1 ? "s" : ""} this
              month
              {filter !== "all" &&
                ` · ${filtered.length} in ${CATEGORY_MAP[filter].label}`}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              filter === "all"
                ? "bg-accent text-zinc-950"
                : "bg-zinc-800 text-muted hover:text-white"
            }`}
          >
            All ({expenses.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              disabled={categoryCounts[cat.id] === 0}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition disabled:opacity-40 ${
                filter === cat.id
                  ? "text-zinc-950"
                  : "bg-zinc-800 text-muted hover:text-white"
              }`}
              style={
                filter === cat.id
                  ? { backgroundColor: cat.color }
                  : undefined
              }
            >
              {cat.label.split(" ")[0]} ({categoryCounts[cat.id]})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-muted">
          No expenses in this category yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border text-left text-xs text-muted">
                <th className="px-6 py-3 font-medium">Expense</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
                <th className="px-6 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((expense) => {
                const cat = CATEGORY_MAP[expense.category];
                const label =
                  expense.description?.trim() ||
                  `${cat.label} expense`;

                return (
                  <tr
                    key={expense.id}
                    className="border-b border-card-border/50 transition hover:bg-zinc-900/50"
                  >
                    <td className="px-6 py-3.5">
                      <p className="font-medium text-white">{label}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        Added{" "}
                        {formatDate(expense.created_at.split("T")[0])}
                      </p>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
                        style={{
                          backgroundColor: `${cat.color}20`,
                          color: cat.color,
                        }}
                      >
                        {cat.label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-muted">
                      {formatDate(expense.expense_date)}
                    </td>
                    <td className="px-6 py-3.5 text-right font-semibold text-white">
                      {formatPKR(Number(expense.amount))}
                    </td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="rounded-lg p-1.5 text-muted transition hover:bg-zinc-800 hover:text-danger"
                        title="Delete expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
