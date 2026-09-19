"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useMotionReady } from "@/lib/motion";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

type CalendarCell = {
  date: Date;
  inMonth: boolean;
};

export type GlassCalendarProps = {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  className?: string;
  disabled?: boolean;
};

export function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseISODate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return startOfDay(date);
}

export function formatBookingDate(date: Date): string {
  return date
    .toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(/\s*г\.?$/u, "");
}

function mondayFirstIndex(date: Date): number {
  const weekday = date.getDay();
  return weekday === 0 ? 6 : weekday - 1;
}

function lastBookableDate(today: Date): Date {
  return startOfDay(new Date(today.getFullYear(), today.getMonth() + 2, 0));
}

function isDateDisabled(date: Date, today: Date): boolean {
  return (
    date.getTime() < today.getTime() ||
    date.getTime() > lastBookableDate(today).getTime() ||
    date.getDay() === 0
  );
}

function monthHasAvailableDay(year: number, month: number, today: Date): boolean {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day += 1) {
    if (!isDateDisabled(new Date(year, month, day), today)) {
      return true;
    }
  }

  return false;
}

function buildMonthCells(year: number, month: number): CalendarCell[] {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const leadingDays = mondayFirstIndex(firstOfMonth);
  const cells: CalendarCell[] = [];

  for (let index = leadingDays; index > 0; index -= 1) {
    cells.push({
      date: new Date(year, month - 1, daysInPrevMonth - index + 1),
      inMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      date: new Date(year, month, day),
      inMonth: true,
    });
  }

  const trailingDays = (7 - (cells.length % 7)) % 7;
  for (let day = 1; day <= trailingDays; day += 1) {
    cells.push({
      date: new Date(year, month + 1, day),
      inMonth: false,
    });
  }

  return cells;
}

function formatMonthTitle(date: Date): string {
  const month = date.toLocaleDateString("ru-RU", { month: "long" });
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${date.getFullYear()}`;
}

export function GlassCalendar({
  selectedDate,
  onSelectDate,
  className,
  disabled = false,
}: GlassCalendarProps) {
  const ready = useMotionReady();
  const today = useMemo(() => startOfDay(new Date()), [ready]);
  const [viewDate, setViewDate] = useState(() => {
    const source = selectedDate ?? today;
    return new Date(source.getFullYear(), source.getMonth(), 1);
  });

  const selectedKey = selectedDate ? toISODate(selectedDate) : "";

  useEffect(() => {
    if (!selectedKey) {
      setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
      return;
    }

    const parsed = parseISODate(selectedKey);
    if (!parsed) return;

    setViewDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
  }, [selectedKey, today]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cells = useMemo(() => buildMonthCells(year, month), [year, month]);

  const canGoPrev = monthHasAvailableDay(
    month === 0 ? year - 1 : year,
    month === 0 ? 11 : month - 1,
    today,
  );
  const canGoNext = monthHasAvailableDay(
    month === 11 ? year + 1 : year,
    month === 11 ? 0 : month + 1,
    today,
  );

  function goToMonth(offset: number) {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  function handleSelect(date: Date) {
    if (disabled || isDateDisabled(date, today)) {
      return;
    }

    setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
    onSelectDate(startOfDay(date));
  }

  return (
    <div
      className={cn(
        "w-full max-w-full rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-xl sm:p-4",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Предыдущий месяц"
          disabled={!canGoPrev}
          onClick={() => goToMonth(-1)}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors",
            canGoPrev
              ? "hover:bg-white/10"
              : "pointer-events-none cursor-not-allowed opacity-30",
          )}
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>

        <p
          className="min-w-0 text-center font-heading text-sm font-semibold text-white sm:text-base"
          aria-live="polite"
        >
          {ready ? formatMonthTitle(viewDate) : "\u00a0"}
        </p>

        <button
          type="button"
          aria-label="Следующий месяц"
          disabled={!canGoNext}
          onClick={() => goToMonth(1)}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors",
            canGoNext
              ? "hover:bg-white/10"
              : "pointer-events-none cursor-not-allowed opacity-30",
          )}
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      <div
        role="grid"
        aria-label="Календарь записи на сервис"
        className="grid grid-cols-7 gap-1"
      >
        {WEEKDAYS.map((weekday, index) => (
          <div
            key={weekday}
            role="columnheader"
            className={cn(
              "py-1 text-center text-[11px] font-medium tracking-wide uppercase sm:text-xs",
              index === 6 ? "text-red-400/55" : "text-white/45",
            )}
          >
            {weekday}
          </div>
        ))}

        {ready
          ? cells.map(({ date, inMonth }) => {
              const isDisabled = isDateDisabled(date, today);
              const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
              const isToday = isSameDay(date, today);
              const label = date.toLocaleDateString("ru-RU", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              });

              return (
                <button
                  key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                  type="button"
                  role="gridcell"
                  aria-label={label}
                  aria-selected={isSelected}
                  aria-current={isToday ? "date" : undefined}
                  disabled={isDisabled}
                  onClick={() => handleSelect(date)}
                  className={cn(
                    "relative flex aspect-square w-full min-w-0 items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:outline-none",
                    inMonth ? "text-white" : "text-white/35",
                    !isDisabled && !isSelected && "hover:bg-white/10",
                    isDisabled &&
                      "pointer-events-none cursor-not-allowed opacity-30 hover:bg-transparent",
                    isToday &&
                      !isSelected &&
                      "border border-[#0066FF] text-white shadow-[0_0_0_1px_rgba(0,102,255,0.25)]",
                    isSelected &&
                      "bg-blue-600 text-white shadow-lg shadow-blue-500/50 hover:bg-blue-600",
                  )}
                >
                  {date.getDate()}
                  {isToday && !isSelected ? (
                    <span
                      aria-hidden
                      className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[#0066FF]"
                    />
                  ) : null}
                </button>
              );
            })
          : Array.from({ length: 35 }, (_, index) => (
              <div
                key={index}
                className="aspect-square rounded-xl bg-white/5"
                aria-hidden
              />
            ))}
      </div>
    </div>
  );
}
