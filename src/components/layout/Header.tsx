"use client";

import { Bell, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { formatMonthYear } from "@/lib/format";

type HeaderProps = {
  userName: string | null;
  avatarUrl: string | null;
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  canGoNext: boolean;
};

export function Header({
  userName,
  avatarUrl,
  year,
  month,
  onPrevMonth,
  onNextMonth,
  canGoNext,
}: HeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-card-border px-8 py-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="mt-1 flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="rounded-lg p-1 text-muted transition hover:bg-zinc-900 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-sm text-muted">{formatMonthYear(year, month)}</p>
          <button
            onClick={onNextMonth}
            disabled={!canGoNext}
            className="rounded-lg p-1 text-muted transition hover:bg-zinc-900 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="glass hidden items-center gap-2 rounded-xl px-4 py-2.5 md:flex">
          <Search className="h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-48 bg-transparent text-sm text-white outline-none placeholder:text-muted"
          />
        </div>

        <button className="relative rounded-xl p-2.5 text-muted transition hover:bg-zinc-900 hover:text-white">
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-card-border bg-zinc-900 px-3 py-2">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
              {(userName ?? "U")[0].toUpperCase()}
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">{userName ?? "User"}</p>
            <p className="text-xs text-muted">Finance Tracker</p>
          </div>
        </div>
      </div>
    </header>
  );
}
