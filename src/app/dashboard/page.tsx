import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import type { Expense } from "@/types";

type Props = {
  searchParams: Promise<{ year?: string; month?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = await searchParams;
  const now = new Date();
  const year = params.year ? parseInt(params.year) : now.getFullYear();
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const { data: budget } = await supabase
    .from("monthly_budgets")
    .select("*")
    .eq("user_id", user.id)
    .eq("year", year)
    .eq("month", month)
    .maybeSingle();

  let expenses: Expense[] = [];

  if (budget) {
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .eq("monthly_budget_id", budget.id)
      .order("expense_date", { ascending: false });

    expenses = data ?? [];
  }

  return (
    <DashboardClient
      profile={profile}
      initialBudget={budget}
      initialExpenses={expenses ?? []}
      year={year}
      month={month}
      userId={user.id}
    />
  );
}
