"use client";

import { AppShell } from "@/components/layout/AppShell";
import { BudgetSettingsForm } from "@/components/settings/BudgetSettingsForm";
import type { Profile, UserCategory } from "@/types";

type SettingsClientProps = {
  profile: Profile | null;
  initialCategories: UserCategory[];
  userId: string;
};

export function SettingsClient({
  profile,
  initialCategories,
  userId,
}: SettingsClientProps) {
  return (
    <AppShell
      profile={profile}
      header={{
        title: "Settings",
        subtitle: "Customize categories and budget percentages",
        showMonthNav: false,
      }}
    >
      <div className="mx-auto max-w-3xl">
        <BudgetSettingsForm
          userId={userId}
          initialCategories={initialCategories}
        />
      </div>
    </AppShell>
  );
}
