"use client";

import { CATEGORIES, type CategoryId } from "@/lib/constants";
import { X } from "lucide-react";
import { useState } from "react";

type AddExpenseModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category: CategoryId;
    amount: number;
    description: string;
    expense_date: string;
  }) => Promise<void>;
};

export function AddExpenseModal({
  open,
  onClose,
  onSubmit,
}: AddExpenseModalProps) {
  const [category, setCategory] = useState<CategoryId>("household");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    if (!description.trim()) {
      setError("Enter an expense name");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        category,
        amount: parsedAmount,
        description: description.trim(),
        expense_date: date,
      });
      setAmount("");
      setDescription("");
      onClose();
    } catch {
      setError("Failed to save expense. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "var(--overlay)" }}
    >
      <div className="card w-full max-w-md p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Add Expense</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted transition hover:bg-hover hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs text-muted">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryId)}
              className="input-field w-full rounded-xl px-4 py-3 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} ({c.percentage}%)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-muted">
              Amount (PKR)
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="input-field w-full rounded-xl px-4 py-3 text-sm"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-muted">
              Expense name
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Grocery shopping, Fuel, Netflix"
              className="input-field w-full rounded-xl px-4 py-3 text-sm"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-muted">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field w-full rounded-xl px-4 py-3 text-sm"
              required
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent-dim disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}
