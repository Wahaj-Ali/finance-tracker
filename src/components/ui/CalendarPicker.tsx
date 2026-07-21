"use client";

import { formatDate } from "@/lib/format";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type CalendarPickerProps = {
  value: string;
  onChange: (value: string) => void;
  disableFuture?: boolean;
};

function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function CalendarPicker({
  value,
  onChange,
  disableFuture = true,
}: CalendarPickerProps) {
  const selectedDate = value ? parseDateString(value) : new Date();
  const [viewDate, setViewDate] = useState(startOfMonth(selectedDate));
  const today = startOfDay(new Date());

  useEffect(() => {
    if (value) {
      setViewDate(startOfMonth(parseDateString(value)));
    }
  }, [value]);

  const days = useMemo(() => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [viewDate]);

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const isDisabled = (day: Date) =>
    disableFuture && isAfter(startOfDay(day), today);

  return (
    <div className="rounded-xl border border-card-border bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewDate((current) => subMonths(current, 1))}
          className="rounded-lg p-2 text-muted transition hover:bg-hover hover:text-foreground"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <p className="text-sm font-semibold text-foreground">
          {format(viewDate, "MMMM yyyy")}
        </p>

        <button
          type="button"
          onClick={() => setViewDate((current) => addMonths(current, 1))}
          disabled={
            disableFuture &&
            isAfter(startOfMonth(addMonths(viewDate, 1)), today)
          }
          className="rounded-lg p-2 text-muted transition hover:bg-hover hover:text-foreground disabled:opacity-30"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-1 text-center text-[11px] font-medium text-muted"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const selected = value ? isSameDay(day, selectedDate) : false;
          const inMonth = isSameMonth(day, viewDate);
          const disabled = isDisabled(day);
          const todayMarker = isToday(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => onChange(toDateString(day))}
              className={`relative flex h-10 items-center justify-center rounded-lg text-sm transition ${
                selected
                  ? "bg-accent font-semibold text-accent-foreground"
                  : disabled
                    ? "cursor-not-allowed text-muted/40"
                    : inMonth
                      ? "text-foreground hover:bg-hover"
                      : "text-muted/50 hover:bg-hover hover:text-foreground"
              } ${todayMarker && !selected ? "ring-1 ring-accent/40" : ""}`}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      {value && (
        <p className="mt-4 text-center text-xs text-muted">
          Selected:{" "}
          <span className="font-medium text-foreground">
            {formatDate(value)}
          </span>
        </p>
      )}
    </div>
  );
}
