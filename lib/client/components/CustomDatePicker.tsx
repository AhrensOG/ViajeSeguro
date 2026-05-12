"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CalendarDays } from "lucide-react";
import { formatDateToDDMMYYYY } from "@/lib/functions";

interface CustomDatePickerProps {
    onSelect: (date: Date) => void;
    value?: Date;
    placeholder?: string;
    fromDate?: Date;
}

const CustomDatePicker = ({ onSelect, value, placeholder, fromDate }: CustomDatePickerProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(value || undefined);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = fromDate || today;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleSelect = (date?: Date) => {
        if (date) {
            setSelectedDate(date);
            onSelect(date);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full border border-gray-200 bg-white px-4 py-3 rounded-xl text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">{selectedDate ? formatDateToDDMMYYYY(selectedDate) : placeholder || "Fecha"}</span>
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-custom-white-100 border border-custom-gray-300 rounded-lg shadow-lg z-10 p-4">
                    <DayPicker 
                        mode="single" 
                        selected={selectedDate} 
                        onSelect={handleSelect} 
                        className="text-custom-gray-800 [&_.rdp-day_button:not([disabled])]:text-custom-gray-800"
                        fromDate={minDate}
                        style={{
                            "--rdp-day-height": "36px",
                            "--rdp-day-width": "36px",
                        } as React.CSSProperties}
                    />
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;
