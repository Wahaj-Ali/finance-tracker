"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buildDashboardStats, getDailySpendingData } from "@/lib/finance";
import type { Expense, MonthlyBudget, Profile } from "@/types";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { HeroCard } from "@/components/dashboard/HeroCard";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { AlertsBanner } from "@/components/dashboard/AlertsBanner";
import { CategoryProgress, CategoryBarChart } from "@/components/dashboard/CategoryProgress";
import { BudgetRadarChart } from "@/components/dashboard/BudgetRadarChart";
import { DailySpendingChart } from "@/components/dashboard/DailySpendingChart";
import {
  SpendingPieChart,
  PredictiveAnalytics,
} from "@/components/dashboard/SpendingCharts";
import { ExpenseTable } from "@/components/dashboard/ExpenseTable";
import { AddExpenseModal } from "@/components/dashboard/AddExpenseModal";
import { SalarySetup } from "@/components/dashboard/SalarySetup";
import type { CategoryId } from "@/lib/constants";

type DashboardClientProps = {
  profile: Profile | null;
  initialBudget: MonthlyBudget | null;
  initialExpenses: Expense[];
  year: number;
  month: number;
  userId: string;
};

export function DashboardClient({
  profile,
  initialBudget,
  initialExpenses,
  year: initialYear,
  month: initialMonth,
  userId,
}: DashboardClientProps) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [budget, setBudget] = useState<MonthlyBudget | null>(initialBudget);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const now = new Date();
  const canGoNext =
    year < now.getFullYear() ||
    (year === now.getFullYear() && month < now.getMonth() + 1);

  const fetchMonthData = useCallback(
    async (y: number, m: number) => {
      setLoading(true);
      try {
        const { data: budgetData } = await supabase
          .from("monthly_budgets")
          .select("*")
          .eq("user_id", userId)
          .eq("year", y)
          .eq("month", m)
          .maybeSingle();

        setBudget(budgetData);

        if (budgetData) {
          const { data: expenseData } = await supabase
            .from("expenses")
            .select("*")
            .eq("monthly_budget_id", budgetData.id)
            .order("expense_date", { ascending: false });

          setExpenses(expenseData ?? []);
        } else {
          setExpenses([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [supabase, userId]
  );

  useEffect(() => {
    fetchMonthData(year, month);
  }, [year, month, fetchMonthData]);

  const salary = budget ? Number(budget.salary_pkr) : 0;
  const stats = useMemo(
    () =>
      salary > 0
        ? buildDashboardStats(salary, expenses, year, month)
        : buildDashboardStats(0, expenses, year, month),
    [salary, expenses, year, month]
  );

  const dailyData = useMemo(
    () => getDailySpendingData(expenses, year, month),
    [expenses, year, month]
  );

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (!canGoNext) return;
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const handleSaveSalary = async (salaryPkr: number) => {
    if (budget) {
      const { data, error } = await supabase
        .from("monthly_budgets")
        .update({ salary_pkr: salaryPkr, updated_at: new Date().toISOString() })
        .eq("id", budget.id)
        .select()
        .single();

      if (error) throw error;
      setBudget(data);
    } else {
      const { data, error } = await supabase
        .from("monthly_budgets")
        .insert({
          user_id: userId,
          year,
          month,
          salary_pkr: salaryPkr,
        })
        .select()
        .single();

      if (error) throw error;
      setBudget(data);
    }
  };

  const handleAddExpense = async (data: {
    category: CategoryId;
    amount: number;
    description: string;
    expense_date: string;
  }) => {
    if (!budget) throw new Error("Set salary first");

    const { data: expense, error } = await supabase
      .from("expenses")
      .insert({
        user_id: userId,
        monthly_budget_id: budget.id,
        category: data.category,
        amount: data.amount,
        description: data.description || null,
        expense_date: data.expense_date,
      })
      .select()
      .single();

    if (error) throw error;
    setExpenses((prev) => [expense, ...prev]);
  };

  const handleDeleteExpense = async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) return;
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar onAddExpense={() => setModalOpen(true)} />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Header
          userName={profile?.full_name ?? null}
          avatarUrl={profile?.avatar_url ?? null}
          year={year}
          month={month}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          canGoNext={canGoNext}
        />

        <main className="min-h-0 flex-1 overflow-y-auto p-6 md:p-8">
          {loading && (
            <div className="mb-4 text-xs text-muted">Loading...</div>
          )}

          <div className="mx-auto max-w-[1400px] space-y-6">
            <AlertsBanner stats={stats} />

            <SalarySetup
              currentSalary={budget ? Number(budget.salary_pkr) : null}
              onSave={handleSaveSalary}
            />

            <HeroCard stats={stats} salarySet={salary > 0} />

            {salary > 0 && (
              <>
                <MetricCards stats={stats} />

                <ExpenseTable
                  expenses={expenses}
                  onDelete={handleDeleteExpense}
                />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <CategoryProgress categories={stats.categories} />
                  </div>
                  <BudgetRadarChart categories={stats.categories} />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <CategoryBarChart categories={stats.categories} />
                  <SpendingPieChart categories={stats.categories} />
                  <PredictiveAnalytics categories={stats.categories} />
                </div>

                <DailySpendingChart data={dailyData} />
              </>
            )}
          </div>
        </main>
      </div>

      <AddExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={async (data) => {
          if (!budget) {
            throw new Error("Set your monthly salary before adding expenses.");
          }
          await handleAddExpense(data);
        }}
      />
    </div>
  );
}
