"use client";

import { useEffect, useRef, useState } from "react";
import { mergedCitySearch, type CitySuggestion } from "@/lib/api/geo/cities";
import { MapPin, Loader2 } from "lucide-react";

export interface CityAutocompleteValue {
  label: string;
  source: CitySuggestion["source"] | "free-text";
  payload?: CitySuggestion;
}

interface Props {
  value: string;
  onChange: (val: string, meta?: CityAutocompleteValue) => void;
  placeholder?: string;
  countryCodes?: string[]; // optional allowlist; if omitted, no filter
  countryCode?: string; // force a single country (e.g., 'ES') for external providers
  limit?: number;
  allowFreeText?: boolean; // default true
  disabled?: boolean;
  className?: string;
}

const inputCls = "w-full border border-custom-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-golden-400 transition";

export default function CityAutocomplete({
  value,
  onChange,
  placeholder = "Ciudad",
  countryCodes,
  countryCode = 'ES',
  limit = 10,
  allowFreeText = true,
  disabled = false,
  className,
}: Props) {
  const [query, setQuery] = useState<string>(value ?? "");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<CitySuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setQuery(value ?? "");
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!query || disabled) {
        setItems([]);
        return;
      }
      setLoading(true);
      try {
        const res = await mergedCitySearch(query, { countryCode, limit });
        const filtered = countryCodes && countryCodes.length
          ? res.filter((c) => c.countryCode && countryCodes.includes((c.countryCode || "").toUpperCase()))
          : res;
        setItems(filtered);
      } finally {
        setLoading(false);
      }
    }, 150);
    return () => clearTimeout(handler);
  }, [query, countryCodes, limit, disabled, countryCode]);

  const highlight = (text: string, q: string) => {
    const t = text || "";
    const queryLower = (q || "").toLowerCase();
    const idx = t.toLowerCase().indexOf(queryLower);
    if (!q || idx === -1) return t;
    const before = t.slice(0, idx);
    const match = t.slice(idx, idx + q.length);
    const after = t.slice(idx + q.length);
    return (
      <>
        {before}
        <span className="font-semibold text-custom-gray-900">{match}</span>
        {after}
      </>
    );
  };

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const onSelectItem = (it: CitySuggestion) => {
    const label = [it.name, it.countryCode || it.country].filter(Boolean).join(", ");
    onChange(label, { label, source: it.source, payload: it });
    setQuery(label);
    setOpen(false);
    setItems([]);
    // Evita que el dropdown se reabra y elimina el "No resultados"
    inputRef.current?.blur();
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      if (query.trim().length > 0) setOpen(true);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (open && activeIdx >= 0 && activeIdx < items.length) {
        onSelectItem(items[activeIdx]);
      } else if (allowFreeText) {
        onChange(query, { label: query, source: "free-text" });
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className={`relative w-full ${className || ''}`} ref={boxRef}>
      <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-gray-600" />
      <input
        ref={inputRef}
        className={`${inputCls} pl-10 w-full`}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setOpen(true);
          setActiveIdx(-1);
        }}
        onFocus={() => {
          if (query.trim().length > 0) setOpen(true);
        }}
        onKeyDown={onKeyDown}
        disabled={disabled}
      />
      {open && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-72 overflow-auto backdrop-blur-sm">
          {!query && (
            <div className="px-4 py-3 text-sm text-gray-600">Escribe al menos 1 carácter para ver sugerencias</div>
          )}
          {loading && query && (
            <div className="px-4 py-3 text-sm text-gray-600 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Buscando ciudades...
            </div>
          )}
          {!loading && query && items.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-600">Sin resultados</div>
          )}
          {!loading && items.length > 0 && items.map((it, idx) => {
            const label = [it.name, it.countryCode || it.country].filter(Boolean).join(", ");
            const active = idx === activeIdx;
            return (
              <button
                type="button"
                key={`${it.slug}-${idx}`}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${active ? 'bg-custom-gray-100/60' : ''} hover:bg-custom-gray-100/60`}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => onSelectItem(it)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-custom-gray-900">{highlight(label, query)}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
