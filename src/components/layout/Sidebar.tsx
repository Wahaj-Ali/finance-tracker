"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Settings,
  Wallet,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SidebarProps = {
  onAddExpense?: () => void;
};

export function Sidebar({ onAddExpense }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleAddExpense = () => {
    if (onAddExpense) {
      onAddExpense();
      return;
    }
    router.push("/dashboard?add=1");
  };

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="sticky top-0 flex h-screen w-[72px] shrink-0 flex-col items-center border-r border-card-border bg-sidebar py-6">
      <Link
        href="/dashboard"
        className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10"
      >
        <Wallet className="h-5 w-5 text-accent" />
      </Link>

      <nav className="flex flex-1 flex-col items-center gap-3">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                active
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:bg-hover hover:text-accent"
              }`}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
        <button
          onClick={handleAddExpense}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-muted transition hover:bg-hover hover:text-accent"
          title="Add Expense"
        >
          <PlusCircle className="h-5 w-5" />
        </button>
      </nav>

      <button
        onClick={handleSignOut}
        className="flex h-11 w-11 items-center justify-center rounded-xl text-muted transition hover:bg-hover hover:text-danger"
        title="Sign out"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </aside>
  );
}
