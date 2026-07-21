"use client";

import {
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Wallet,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type SidebarProps = {
  onAddExpense: () => void;
};

export function Sidebar({ onAddExpense }: SidebarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="sticky top-0 flex h-screen w-[72px] shrink-0 flex-col items-center border-r border-card-border bg-zinc-950 py-6">
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
        <Wallet className="h-5 w-5 text-accent" />
      </div>

      <nav className="flex flex-1 flex-col items-center gap-3">
        <button
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent"
          title="Dashboard"
        >
          <LayoutDashboard className="h-5 w-5" />
        </button>
        <button
          onClick={onAddExpense}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-muted transition hover:bg-zinc-900 hover:text-accent"
          title="Add Expense"
        >
          <PlusCircle className="h-5 w-5" />
        </button>
      </nav>

      <button
        onClick={handleSignOut}
        className="flex h-11 w-11 items-center justify-center rounded-xl text-muted transition hover:bg-zinc-900 hover:text-danger"
        title="Sign out"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </aside>
  );
}
