import type { CategoryConfig } from "@/lib/constants";
import type { CategoryStats, DashboardStats, Expense } from "@/types";
import {
  differenceInCalendarDays,
  getDaysInMonth,
  startOfMonth,
} from "date-fns";
import { getSavingsPercentage } from "@/lib/budget-settings";

export function getBudgetAmount(salary: number, percentage: number): number {
  return Math.round((salary * percentage) / 100);
}

export function getSpentByCategory(
  expenses: Expense[],
  categories: CategoryConfig[]
): Record<string, number> {
  const totals = Object.fromEntries(
    categories.map((c) => [c.id, 0])
  ) as Record<string, number>;

  for (const expense of expenses) {
    if (expense.category_id in totals) {
      totals[expense.category_id] += Number(expense.amount);
    }
  }

  return totals;
}

export function buildCategoryStats(
  salary: number,
  expenses: Expense[],
  categories: CategoryConfig[]
): CategoryStats[] {
  const spentByCategory = getSpentByCategory(expenses, categories);

  return categories.map((category) => {
    const budget = getBudgetAmount(salary, category.percentage);
    const spent = spentByCategory[category.id] ?? 0;
    const remaining = budget - spent;
    const utilization = budget > 0 ? (spent / budget) * 100 : 0;

    return {
      id: category.id,
      slug: category.slug,
      label: category.label,
      percentage: category.percentage,
      color: category.color,
      budget,
      spent,
      remaining,
      utilization: Math.min(utilization, 999),
      overspent: spent > budget,
    };
  });
}

export function buildDashboardStats(
  salary: number,
  expenses: Expense[],
  year: number,
  month: number,
  categories: CategoryConfig[]
): DashboardStats {
  const categoryStats = buildCategoryStats(salary, expenses, categories);
  const totalSpent = categoryStats.reduce((sum, c) => sum + c.spent, 0);
  const remaining = salary - totalSpent;
  const savingsPct = getSavingsPercentage(categories);
  const savingsTarget = getBudgetAmount(salary, savingsPct);
  const savingsShortfall = Math.max(0, savingsTarget - remaining);
  const savingsAlert = remaining < savingsTarget;
  const overspentCategories = categoryStats.filter((c) => c.overspent);

  const monthStart = startOfMonth(new Date(year, month - 1));
  const daysInMonth = getDaysInMonth(monthStart);
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month - 1;
  const daysElapsed = isCurrentMonth
    ? differenceInCalendarDays(today, monthStart) + 1
    : daysInMonth;

  const avgDailySpend =
    daysElapsed > 0 ? Math.round(totalSpent / daysElapsed) : 0;

  return {
    salary,
    totalSpent,
    remaining,
    savingsTarget,
    savingsShortfall,
    savingsAlert,
    overspentCategories,
    categories: categoryStats,
    expenseCount: expenses.length,
    avgDailySpend,
    daysInMonth,
    daysElapsed,
  };
}

export function getDailySpendingData(
  expenses: Expense[],
  year: number,
  month: number
) {
  const daysInMonth = getDaysInMonth(new Date(year, month - 1));
  const dailyMap = new Map<number, number>();

  for (let day = 1; day <= daysInMonth; day++) {
    dailyMap.set(day, 0);
  }

  for (const expense of expenses) {
    const date = new Date(expense.expense_date);
    if (date.getFullYear() === year && date.getMonth() === month - 1) {
      const day = date.getDate();
      dailyMap.set(day, (dailyMap.get(day) ?? 0) + Number(expense.amount));
    }
  }

  let cumulative = 0;
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const amount = dailyMap.get(day) ?? 0;
    cumulative += amount;
    return { day, amount, cumulative };
  });
}
