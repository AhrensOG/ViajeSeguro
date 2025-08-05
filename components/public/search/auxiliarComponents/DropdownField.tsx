"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface DropdownOption {
    label: string;
    value: string;
}

interface DropdownFieldProps {
    id: string;
    label: string;
    placeholder?: string;
    options: DropdownOption[];
    value?: string;
    onChange?: (value: string) => void;
}

export default function DropdownField({ id, label, placeholder, options, value, onChange }: DropdownFieldProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (optionValue: string) => {
        onChange?.(optionValue);
        setIsOpen(false);
    };

    return (
        <div className=" flex flex-col gap-2 w-1/2 relative">
            <label htmlFor={id} className="font-medium text-custom-black-900 text-lg pl-1">
                {label}
            </label>

            <button
                id={id}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-custom-black-900 
                   focus:outline-none focus:ring-1 focus:ring-custom-golden-500 focus:border-custom-golden-500
                   hover:shadow-md transition duration-300"
            >
                <span className={value ? "text-black" : "text-gray-400"}>
                    {value ? options.find((opt) => opt.value === value)?.label : placeholder || "Seleccionar"}
                </span>
                <ChevronDown className="h-4 w-4 ml-2 text-custom-gray-600" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full z-20 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden"
                    >
                        <ul className="flex flex-col">
                            {options.map((option) => (
                                <li
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className="px-4 py-2 text-left text-sm hover:bg-custom-golden-100 hover:text-black cursor-pointer transition-colors"
                                >
                                    {option.label}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
