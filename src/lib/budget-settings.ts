import {
  CUSTOM_CATEGORY_COLORS,
  DEFAULT_CATEGORY_TEMPLATES,
  createTempCategoryId,
  isTempCategoryId,
  type CategoryConfig,
} from "@/lib/constants";
import type { UserCategory } from "@/types";

export function rowToCategoryConfig(row: UserCategory): CategoryConfig {
  return {
    id: row.id,
    slug: row.slug,
    label: row.label,
    color: row.color,
    percentage: row.percentage,
    isCustom: row.is_custom,
    sortOrder: row.sort_order,
  };
}

export function buildCategoryConfig(rows: UserCategory[] | null): CategoryConfig[] {
  if (!rows || rows.length === 0) {
    return DEFAULT_CATEGORY_TEMPLATES.map((template, index) => ({
      ...template,
      id: createTempCategoryId(),
      isCustom: false,
      sortOrder: index,
    }));
  }

  return rows
    .map(rowToCategoryConfig)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getDefaultCategories(
  existing?: CategoryConfig[]
): CategoryConfig[] {
  return DEFAULT_CATEGORY_TEMPLATES.map((template, index) => {
    const match = existing?.find((c) => c.slug === template.slug);
    return {
      ...template,
      id: match?.id ?? createTempCategoryId(),
      isCustom: false,
      sortOrder: index,
    };
  });
}

export function getTotalPercentage(categories: CategoryConfig[]): number {
  return categories.reduce((sum, cat) => sum + cat.percentage, 0);
}

export function validateCategories(categories: CategoryConfig[]): string | null {
  if (categories.length === 0) {
    return "Add at least one category";
  }

  for (const cat of categories) {
    if (!cat.label.trim()) {
      return "Every category needs a name";
    }
    if (cat.percentage < 0 || cat.percentage > 100) {
      return `${cat.label} must be between 0 and 100%`;
    }
  }

  const labels = categories.map((c) => c.label.trim().toLowerCase());
  if (new Set(labels).size !== labels.length) {
    return "Category names must be unique";
  }

  if (getTotalPercentage(categories) !== 100) {
    return "Percentages must add up to exactly 100%";
  }

  return null;
}

export function getSavingsPercentage(categories: CategoryConfig[]): number {
  return (
    categories.find((c) => c.slug === "savings")?.percentage ??
    categories.find((c) => c.label.toLowerCase().includes("saving"))?.percentage ??
    10
  );
}

export function pickCustomCategoryColor(index: number): string {
  return CUSTOM_CATEGORY_COLORS[index % CUSTOM_CATEGORY_COLORS.length];
}

export function createNewCategory(existingCount: number): CategoryConfig {
  return {
    id: createTempCategoryId(),
    slug: null,
    label: "",
    color: pickCustomCategoryColor(existingCount),
    percentage: 0,
    isCustom: true,
    sortOrder: existingCount,
  };
}

export { isTempCategoryId };
