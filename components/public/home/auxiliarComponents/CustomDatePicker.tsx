"use client";

import { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CalendarDays } from "lucide-react";

interface CustomDatePickerProps {
  onSelect: (date: Date) => void;
}

const CustomDatePicker = ({ onSelect }: CustomDatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelect = (date?: Date) => {
    if (date) {
      setSelectedDate(date);
      onSelect(date);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between border border-fourth-gray bg-first-white px-4 py-3 rounded-lg shadow-sm text-third-gray hover: focus:ring-1 focus:ring-first-golden transition"
      >
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-second-gray" />
          {selectedDate
            ? format(selectedDate, "dd/MM/yyyy")
            : "Fecha"}
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-first-white border border-fourth-gray rounded-lg shadow-lg z-10 p-4">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            className="text-first-gray"
          />
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
