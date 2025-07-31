"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type CustomSelectProps = {
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

const CustomSelect = ({ options, value, onChange, placeholder = "Seleccionar..." }: CustomSelectProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((o) => o.value === value);

    return (
        <div ref={ref} className="relative w-full text-sm">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="w-full border border-custom-gray-300 rounded-md px-4 py-2 bg-white text-left shadow-sm flex justify-between items-center"
            >
                <span className="truncate break-words">{selectedOption?.label || placeholder}</span>
                <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
            </button>

            {open && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 border border-custom-gray-300">
                    <li
                        onClick={() => {
                            onChange("");
                            setOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-custom-golden-100 cursor-pointer break-words"
                    >
                        {placeholder}
                    </li>
                    {options.map(({ label, value: optionValue }) => (
                        <li
                            key={optionValue}
                            onClick={() => {
                                onChange(optionValue);
                                setOpen(false);
                            }}
                            className={`px-4 py-2 hover:bg-custom-golden-100 cursor-pointer break-words ${
                                value === optionValue ? "bg-custom-golden-50 font-semibold" : ""
                            }`}
                        >
                            {label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;
