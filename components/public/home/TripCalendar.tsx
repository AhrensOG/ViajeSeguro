"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { searchTrips } from "@/lib/api/trip";

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];

interface TripCalendarProps {
  origin: string;
  destination: string;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

const TripCalendar = ({ origin, destination, selectedDate, onDateSelect }: TripCalendarProps) => {
  const router = useRouter();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  useEffect(() => {
    if (!origin || !destination) return;

    const fetchCounts = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const middayToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);
        const query = {
          origin,
          destination,
          departure: middayToday.toISOString(),
          serviceType: "SIMPLE_TRIP" as const,
        };
        const result = await searchTrips(query);
        const all = [
          ...(result.exact || []),
          ...(result.previous || []),
          ...(result.next || []),
          ...(result.futureAll || []),
        ];
        const map: Record<string, number> = {};
        for (const t of all) {
          const d = new Date(t.departure);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          map[key] = (map[key] || 0) + 1;
        }
        setCounts(map);
      } catch {
        setCounts({});
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [origin, destination]);

  const firstDay = new Date(calYear, calMonth, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const monthLabel = firstDay.toLocaleDateString("es", { year: "numeric", month: "long" });

  const toKey = (d: number) =>
    `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const isPastDay = (d: number) => {
    const dayDate = new Date(calYear, calMonth, d);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate < today;
  };

  const isToday = (d: number) => {
    const dayDate = new Date(calYear, calMonth, d);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate.getTime() === today.getTime();
  };

  const isSelected = (d: number) => {
    if (!selectedDate) return false;
    const sel = new Date(selectedDate);
    sel.setHours(0, 0, 0, 0);
    const dayDate = new Date(calYear, calMonth, d);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate.getTime() === sel.getTime();
  };

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalYear(calYear - 1);
      setCalMonth(11);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalYear(calYear + 1);
      setCalMonth(0);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const canGoPrev = () => {
    const prevMonthLastDay = new Date(calYear, calMonth, 0);
    prevMonthLastDay.setHours(0, 0, 0, 0);
    return prevMonthLastDay >= today;
  };

  const handleDayClick = (day: number) => {
    const date = new Date(calYear, calMonth, day, 12, 0, 0, 0);
    if (onDateSelect) {
      onDateSelect(date);
    } else {
      const params = new URLSearchParams({
        origin,
        destination,
        departure: date.toISOString(),
        serviceType: "SIMPLE_TRIP",
        mode: "car",
      });
      router.push(`/search?${params.toString()}`);
    }
  };

  const grid: (number | null)[] = [];
  const adjustedStart = startWeekday === 0 ? 6 : startWeekday - 1;
  for (let i = 0; i < adjustedStart; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev()}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-900 capitalize">{monthLabel}</span>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-amber-500" />}
        </div>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 transition">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-3">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((day, idx) => {
          if (day === null) return <div key={idx} />;
          const key = toKey(day);
          const count = counts[key] || 0;
          const past = isPastDay(day);
          const selected = isSelected(day);
          const todayDay = isToday(day);

          let cellStyle = "";
          let numStyle = "";
          let showDot = false;

          if (past) {
            cellStyle = "opacity-25 cursor-default";
            numStyle = "text-gray-400";
          } else if (selected) {
            cellStyle = "bg-amber-500 shadow-sm shadow-amber-200";
            numStyle = "text-white font-bold";
            showDot = count > 0;
          } else if (count > 0) {
            cellStyle = "hover:bg-amber-50 cursor-pointer";
            numStyle = "text-gray-900 font-medium";
            showDot = true;
          } else {
            cellStyle = "hover:bg-gray-50 cursor-pointer";
            numStyle = "text-gray-600";
          }

          if (todayDay && !selected && !past) {
            cellStyle += " ring-1 ring-amber-300";
          }

          return (
            <button
              key={idx}
              onClick={() => !past && handleDayClick(day)}
              disabled={past}
              className={`relative h-11 rounded-lg flex flex-col items-center justify-center transition text-sm ${cellStyle}`}
            >
              <span className={`text-sm leading-none ${numStyle}`}>{day}</span>
              {showDot && (
                <span
                  className={`mt-0.5 w-1 h-1 rounded-full ${
                    selected ? "bg-white" : "bg-amber-400"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TripCalendar;
