"use client";

import type { Profile } from "@/types";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

type AppShellProps = {
  profile: Profile | null;
  children: React.ReactNode;
  onAddExpense?: () => void;
  header: Omit<
    React.ComponentProps<typeof Header>,
    "userName" | "avatarUrl"
  >;
};

export function AppShell({
  profile,
  children,
  onAddExpense,
  header,
}: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar onAddExpense={onAddExpense} />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Header
          userName={profile?.full_name ?? null}
          avatarUrl={profile?.avatar_url ?? null}
          {...header}
        />

        <main className="min-h-0 flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
