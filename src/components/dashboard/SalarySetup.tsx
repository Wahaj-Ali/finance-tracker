"use client";

import { formatPKR } from "@/lib/format";
import type { CategoryConfig } from "@/lib/constants";
import { Save } from "lucide-react";
import { useState } from "react";

type SalarySetupProps = {
  categories: CategoryConfig[];
  currentSalary: number | null;
  onSave: (salary: number) => Promise<void>;
};

export function SalarySetup({
  categories,
  currentSalary,
  onSave,
}: SalarySetupProps) {
  const [salary, setSalary] = useState(
    currentSalary ? String(currentSalary) : ""
  );
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const parsed = parseFloat(salary) || 0;

  const handleSave = async () => {
    if (parsed <= 0) return;
    setLoading(true);
    try {
      await onSave(parsed);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <h3 className="mb-1 text-sm font-semibold text-foreground">
        Monthly Salary (PKR)
      </h3>
      <p className="mb-4 text-xs text-muted">
        Set your income to calculate category budgets
      </p>

      <div className="flex gap-3">
        <input
          type="number"
          min="1"
          step="1"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="e.g. 250000"
          className="input-field flex-1 rounded-xl px-4 py-3 text-sm"
        />
        <button
          onClick={handleSave}
          disabled={loading || parsed <= 0}
          className="flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent-dim disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save"}
        </button>
      </div>

      {parsed > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => {
            const budget = Math.round((parsed * cat.percentage) / 100);
            return (
              <div
                key={cat.id}
                className="rounded-xl border border-card-border bg-surface px-3 py-2.5"
              >
                <p className="text-[10px] text-muted">{cat.percentage}%</p>
                <p className="text-xs font-medium text-foreground">
                  {cat.label.split(" ")[0]}
                </p>
                <p className="text-xs text-accent">{formatPKR(budget)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
