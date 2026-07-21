"use client";

import { useMemo, useState } from "react";
import type { CategoryConfig } from "@/lib/constants";
import {
  buildCategoryConfig,
  createNewCategory,
  getDefaultCategories,
  validateCategories,
} from "@/lib/budget-settings";
import { saveUserCategories } from "@/lib/categories-api";
import { createClient } from "@/lib/supabase/client";
import type { UserCategory } from "@/types";
import { Plus, RotateCcw, Save, Trash2 } from "lucide-react";

type BudgetSettingsFormProps = {
  userId: string;
  initialCategories: UserCategory[];
  onSaved?: (categories: UserCategory[]) => void;
};

export function BudgetSettingsForm({
  userId,
  initialCategories,
  onSaved,
}: BudgetSettingsFormProps) {
  const supabase = createClient();
  const initialConfig = useMemo(
    () => buildCategoryConfig(initialCategories),
    [initialCategories]
  );

  const [categories, setCategories] = useState<CategoryConfig[]>(initialConfig);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = categories.reduce((sum, cat) => sum + cat.percentage, 0);
  const isValid = total === 100 && validateCategories(categories) === null;

  const updateCategory = (
    id: string,
    updates: Partial<Pick<CategoryConfig, "label" | "percentage" | "color">>
  ) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
    setError(null);
  };

  const handleAddCategory = () => {
    setCategories((prev) => [...prev, createNewCategory(prev.length)]);
    setError(null);
  };

  const handleRemoveCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    setError(null);
  };

  const handleReset = () => {
    setCategories(getDefaultCategories(initialConfig));
    setError(null);
  };

  const handleSave = async () => {
    const validationError = validateCategories(categories);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const savedCategories = await saveUserCategories(
        supabase,
        userId,
        categories,
        initialCategories.map((c) => c.id)
      );

      setCategories(buildCategoryConfig(savedCategories));
      setSaved(true);
      onSaved?.(savedCategories);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save settings. Run migration 003_user_categories.sql in Supabase."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Budget Allocation
            </h2>
            <p className="mt-1 text-sm text-muted">
              Adjust default categories or add your own. Percentages apply only
              to your account and must total 100%.
            </p>
          </div>
          <div
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              isValid
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            }`}
          >
            Total: {total}%
          </div>
        </div>

        <div className="space-y-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-xl border border-card-border bg-surface p-4"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <input
                    type="color"
                    value={cat.color}
                    onChange={(e) =>
                      updateCategory(cat.id, { color: e.target.value })
                    }
                    className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-card-border bg-transparent"
                    title="Category color"
                  />
                  {cat.isCustom ? (
                    <input
                      type="text"
                      value={cat.label}
                      onChange={(e) =>
                        updateCategory(cat.id, { label: e.target.value })
                      }
                      placeholder="Category name"
                      className="input-field min-w-0 flex-1 rounded-lg px-3 py-2 text-sm"
                    />
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {cat.label}
                      </p>
                      <p className="text-xs text-muted">Default category</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={cat.percentage}
                    onChange={(e) =>
                      updateCategory(cat.id, {
                        percentage: parseInt(e.target.value) || 0,
                      })
                    }
                    className="input-field w-20 rounded-lg px-3 py-2 text-right text-sm font-semibold"
                  />
                  <span className="text-sm text-muted">%</span>
                  {cat.isCustom && (
                    <button
                      onClick={() => handleRemoveCategory(cat.id)}
                      className="rounded-lg p-2 text-muted transition hover:bg-hover hover:text-danger"
                      title="Remove category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={cat.percentage}
                onChange={(e) =>
                  updateCategory(cat.id, {
                    percentage: parseInt(e.target.value),
                  })
                }
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--progress-track)] accent-accent"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleAddCategory}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-card-border py-3 text-sm font-medium text-muted transition hover:border-accent hover:text-accent"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        {!isValid && !error && (
          <p className="mt-4 text-sm text-danger">
            Fix category names and ensure percentages total exactly 100%.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            disabled={loading || !isValid}
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent-dim disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-card-border px-5 py-3 text-sm font-medium text-muted transition hover:bg-hover hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </button>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Preview</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-xl border border-card-border bg-surface px-3 py-3 text-center"
            >
              <p
                className="text-2xl font-bold"
                style={{ color: cat.color }}
              >
                {cat.percentage}%
              </p>
              <p className="mt-1 truncate text-xs text-muted">
                {cat.label || "New category"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
