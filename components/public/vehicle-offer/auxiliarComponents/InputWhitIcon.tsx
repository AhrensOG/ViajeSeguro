"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DayPicker as Calendar, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/dist/style.css"; // Asegúrate de importar los estilos

interface InputWithIconProps {
    icon?: React.ReactNode;
    type: string;
    label: string;
    placeholder: string;
    id: string;
    value?: string | number | Date;
    onChange?: (value: any) => void;
}

export default function InputWithIcon({ icon, type, label, placeholder, id, value, onChange }: InputWithIconProps) {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [open, setOpen] = useState(false);

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        onChange?.(date);
        setOpen(false);
    };

    const classNames = getDefaultClassNames();

    return (
        <div className="flex flex-col gap-2 w-full">
            <label htmlFor={id} className="font-medium text-custom-black-900 text-lg pl-1">
                {label}
            </label>

            {type === "date" ? (
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className={`w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md text-left
                        focus:outline-none focus:ring-1 focus:ring-custom-golden-500 focus:border-custom-golden-500
                        ${!selectedDate ? "text-gray-400" : ""}`}
                    >
                        <span>{selectedDate ? format(selectedDate, "PPP") : placeholder}</span>
                        <CalendarIcon className="ml-2 h-5 w-5 text-custom-gray-600" />
                    </button>

                    {open && (
                        <div className="absolute z-10 bg-white border border-gray-300 rounded-md mt-2 shadow-md">
                            <Calendar
                                animate
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
                                autoFocus
                                className="p-4 text-sm"
                                classNames={{
                                    today: `bg-custom-golden-100 border-0 rounded-full p-1`,
                                    selected: "bg-custom-golden-500 text-custom-white-100 border-0 rounded-full p-1",
                                    chevron: "h-6 w-6 fill-custom-golden-500",
                                }}
                                showOutsideDays
                                lang="es"
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-custom-gray-600 font-semibold">{icon}</span>
                    <input
                        type={type}
                        id={id}
                        value={type === "date" && value instanceof Date ? format(value, "yyyy-MM-dd") : value?.toString()}
                        onChange={(e) => onChange?.(e.target.value)}
                        placeholder={placeholder}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-1 focus:ring-custom-golden-500 
                       focus:border-custom-golden-500"
                    />
                </div>
            )}
        </div>
    );
}
