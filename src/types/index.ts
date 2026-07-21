import type { CategoryId } from "@/lib/constants";

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

export type MonthlyBudget = {
  id: string;
  user_id: string;
  year: number;
  month: number;
  salary_pkr: number;
  created_at: string;
  updated_at: string;
};

export type Expense = {
  id: string;
  user_id: string;
  monthly_budget_id: string;
  category: CategoryId;
  amount: number;
  description: string | null;
  expense_date: string;
  created_at: string;
};

export type CategoryStats = {
  id: CategoryId;
  label: string;
  percentage: number;
  color: string;
  budget: number;
  spent: number;
  remaining: number;
  utilization: number;
  overspent: boolean;
};

export type DashboardStats = {
  salary: number;
  totalSpent: number;
  remaining: number;
  savingsTarget: number;
  savingsShortfall: number;
  savingsAlert: boolean;
  overspentCategories: CategoryStats[];
  categories: CategoryStats[];
  expenseCount: number;
  avgDailySpend: number;
  daysInMonth: number;
  daysElapsed: number;
};
