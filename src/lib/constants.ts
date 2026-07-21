export type CategoryConfig = {
  id: string;
  slug: string | null;
  label: string;
  color: string;
  percentage: number;
  isCustom: boolean;
  sortOrder: number;
};

export const DEFAULT_CATEGORY_TEMPLATES: Omit<
  CategoryConfig,
  "id" | "isCustom"
>[] = [
  {
    slug: "household",
    label: "Household Expenses",
    color: "#DFFF00",
    percentage: 35,
    sortOrder: 0,
  },
  {
    slug: "car",
    label: "Car Expenses",
    color: "#B8E600",
    percentage: 15,
    sortOrder: 1,
  },
  {
    slug: "investments",
    label: "Investments",
    color: "#9ACC00",
    percentage: 25,
    sortOrder: 2,
  },
  {
    slug: "lifestyle",
    label: "Dine Outs & Shopping",
    color: "#E5FF4D",
    percentage: 15,
    sortOrder: 3,
  },
  {
    slug: "savings",
    label: "Savings / Emergency",
    color: "#C4FF00",
    percentage: 10,
    sortOrder: 4,
  },
];

export const CUSTOM_CATEGORY_COLORS = [
  "#84cc16",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
];

export function isTempCategoryId(id: string): boolean {
  return id.startsWith("temp-");
}

export function createTempCategoryId(): string {
  return `temp-${crypto.randomUUID()}`;
}
