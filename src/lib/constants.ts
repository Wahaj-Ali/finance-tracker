export const CATEGORIES = [
  {
    id: "household",
    label: "Household Expenses",
    percentage: 35,
    color: "#DFFF00",
  },
  {
    id: "car",
    label: "Car Expenses",
    percentage: 15,
    color: "#B8E600",
  },
  {
    id: "investments",
    label: "Investments",
    percentage: 25,
    color: "#9ACC00",
  },
  {
    id: "lifestyle",
    label: "Dine Outs & Shopping",
    percentage: 15,
    color: "#E5FF4D",
  },
  {
    id: "savings",
    label: "Savings / Emergency",
    percentage: 10,
    color: "#C4FF00",
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, (typeof CATEGORIES)[number]>;

export const TOTAL_ALLOCATION = CATEGORIES.reduce(
  (sum, c) => sum + c.percentage,
  0
);
