"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  placeholder?: string;
  onSelect: (value: string) => void;
  icon?: ReactNode;
}

const CustomSelect = ({
  options,
  placeholder = "Selecciona una opción",
  onSelect,
  icon,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div
      className="relative w-full"
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between border border-custom-gray-300 bg-custom-white-100 px-4 py-3 rounded-lg shadow-sm text-custom-gray-500 hover: focus:ring-1 focus:ring-custom-golden-600 transition"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-custom-gray-500">{icon}</span>}
          {selected
            ? options.find((opt) => opt.value === selected)?.label
            : placeholder}
        </div>
        <ChevronDown
          className={`h-5 w-5 text-custom-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full bg-custom-white-100 border border-custom-gray-300 mt-2 rounded-lg shadow-lg overflow-hidden z-10"
          >
            {options.map((option) => (
              <li
                key={option.value}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(option.value)}
                className="px-4 py-3 text-custom-gray-500 cursor-pointer hover:bg-amber-100 transition"
              >
                {option.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
