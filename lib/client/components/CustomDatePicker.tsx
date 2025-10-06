"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CalendarDays } from "lucide-react";
import { formatDateToDDMMYYYY } from "@/lib/functions";

interface CustomDatePickerProps {
    onSelect: (date: Date) => void;
    value?: Date;
    placeholder?: string;
}

const CustomDatePicker = ({ onSelect, value, placeholder }: CustomDatePickerProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(value || undefined);
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
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full border border-custom-gray-300 bg-custom-white-100 px-4 py-2 rounded-md text-left text-custom-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-golden-400 transition flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-custom-gray-600" />
                    <span className="text-sm">{selectedDate ? formatDateToDDMMYYYY(selectedDate) : placeholder || "Fecha"}</span>
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-custom-white-100 border border-custom-gray-300 rounded-lg shadow-lg z-10 p-4">
                    <DayPicker mode="single" selected={selectedDate} onSelect={handleSelect} className="text-custom-gray-800" />
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;
