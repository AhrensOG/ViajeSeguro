"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type DayCount = {
  date: string; // YYYY-MM-DD
  count: number;
};

export default function CalendarMonth({
  year,
  month, // 0-11
  selectedDate,
  counts,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
}: {
  year: number;
  month: number;
  selectedDate?: string; // YYYY-MM-DD
  counts: Record<string, number>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (yyyyMmDd: string) => void;
}) {
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay(); // 0-6 (Sun-Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthLabel = firstDay.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  const grid: (number | null)[] = [];
  for (let i = 0; i < (startWeekday === 0 ? 6 : startWeekday - 1); i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);

  const toKey = (d: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-custom-gray-300 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrevMonth} className="p-2 rounded-md hover:bg-gray-100">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-lg font-semibold text-custom-black-700">{monthLabel}</div>
        <button onClick={onNextMonth} className="p-2 rounded-md hover:bg-gray-100">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-3 text-xs text-custom-gray-700 mb-2">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
          <div key={d} className="text-center font-semibold">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-3">
        {grid.map((day, idx) => {
          if (day === null) return <div key={idx} />;
          const key = toKey(day);
          const isSelected = selectedDate === key;
          const c = counts[key] || 0;
          return (
            <button
              key={idx}
              onClick={() => onSelectDay(key)}
              className={
                "h-20 md:h-24 rounded-lg border flex flex-col items-center justify-center transition " +
                (isSelected
                  ? "border-custom-golden-600 bg-custom-golden-50"
                  : c > 0
                  ? "border-blue-200 hover:bg-blue-50"
                  : "border-custom-gray-200 hover:bg-gray-50")
              }
              title={c > 0 ? `${c} viajes` : "Sin viajes"}
            >
              <div className="text-sm font-semibold text-custom-black-700">{day}</div>
              <div className={"mt-1 text-xs leading-tight font-medium text-center px-1 " + (c > 0 ? "text-blue-700" : "text-custom-gray-600")}>
                Viajes del día <span className="font-bold">{c}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
