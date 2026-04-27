"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { searchAddresses, type AddressSuggestion } from "@/lib/api/geo/addresses";

interface AddressFieldsProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

interface AddressParts {
  street: string;
  number: string;
  city: string;
  province: string;
  postalCode: string;
}

const parseAddress = (address: string): AddressParts => {
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  
  let street = "";
  let number = "";
  let city = "";
  let province = "";
  let postalCode = "";

  // Primer elemento: intentar separar calle y numero (formatos: "Calle 15", "Calle 15-b", "Calle 10-17", "Calle s/n")
  if (parts.length >= 1) {
    const firstPart = parts[0];
    // Regex más flexible: acepta números, letras, guiones, "s/n", rangos
    const numberMatch = firstPart.match(/^(.+?)\s+([\d]+[\s\-]?[\d]*[a-zA-Z]?|[sSnN/]+|[kK][mM]?\.?\s*\d+|[bB][iI][sS]?)\s*$/i);
    if (numberMatch) {
      street = numberMatch[1].trim();
      number = numberMatch[2].trim();
    } else {
      street = firstPart;
    }
  }
  
  // Segundo elemento: puede ser número (con letras, guiones) o ciudad
  if (parts.length >= 2) {
    const secondPart = parts[1];
    // Acepta: 15, 15B, 15-b, 10-17, s/n, bis, km 5
    const flexibleNumberMatch = secondPart.match(/^([\d]+[\s\-]?[\d]*[a-zA-Z]?|[sSnN/]+|[kK][mM]?\.?\s*\d+|[bB][iI][sS]?)$/i);
    if (flexibleNumberMatch) {
      number = flexibleNumberMatch[1];
    } else {
      city = secondPart;
    }
  }
  
  //Tercer elemento -> ciudad o provincia
  if (parts.length >= 3) {
    const thirdPart = parts[2];
    const isPostalCode = thirdPart.match(/^\d{5}$/);
    if (isPostalCode) {
      postalCode = thirdPart;
    } else if (!city) {
      city = thirdPart;
    } else {
      province = thirdPart;
    }
  }
  
  // Cuarto elemento
  if (parts.length >= 4) {
    const fourthPart = parts[3];
    const isPostal = fourthPart.match(/^\d{5}$/);
    if (isPostal) {
      postalCode = fourthPart;
    } else {
      province = fourthPart;
    }
  }
  
  // Quinto elemento
  if (parts.length >= 5) {
    postalCode = parts[4];
  }

  return { street, number, city, province, postalCode };
};

const stringifyAddress = (parts: AddressParts): string => {
  const { street, number, city, province, postalCode } = parts;
  const partsArr: string[] = [];

  if (street) partsArr.push(street);
  if (number) partsArr.push(number);
  if (city) partsArr.push(city);
  if (province) partsArr.push(province);
  if (postalCode) partsArr.push(postalCode);

  return partsArr.join(", ");
};

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: AddressSuggestion) => void;
  placeholder: string;
  suggestions: AddressSuggestion[];
  loading: boolean;
  onSearch: (query: string) => void;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  inputClass: string;
}

function AutocompleteInput({
  value,
  onChange,
  onSelect,
  placeholder,
  suggestions,
  loading,
  onSearch,
  showDropdown,
  setShowDropdown,
  inputClass,
}: AutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowDropdown]);

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          onSearch(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => value && setShowDropdown(true)}
        className={inputClass}
      />
      {showDropdown && (loading || suggestions.length > 0) && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-auto">
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Buscando...
            </div>
          )}
          {!loading && suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
              onClick={() => {
                onSelect(suggestion);
                setShowDropdown(false);
              }}
            >
              <div className="flex items-start gap-2">
                <MapPin className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-gray-900 font-medium">
                    {suggestion.street} {suggestion.number}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {suggestion.city}{suggestion.postalCode ? `, ${suggestion.postalCode}` : ""} {suggestion.province ? `(${suggestion.province})` : ""}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressFieldsInner({ label, value, onChange }: AddressFieldsProps) {
  const [initialized, setInitialized] = useState(false);
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [streetSuggestions, setStreetSuggestions] = useState<AddressSuggestion[]>([]);
  const [citySuggestions, setCitySuggestions] = useState<AddressSuggestion[]>([]);
  const [loadingStreet, setLoadingStreet] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);
  const [showStreetDropdown, setShowStreetDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!initialized) {
      const parts = parseAddress(value);
      setStreet(parts.street);
      setNumber(parts.number);
      setCity(parts.city);
      setProvince(parts.province);
      setPostalCode(parts.postalCode);
      setInitialized(true);
    }
  }, [value, initialized]);

  const searchStreet = useCallback(async (query: string) => {
    if (query.length < 3) {
      setStreetSuggestions([]);
      return;
    }
    setLoadingStreet(true);
    const results = await searchAddresses(query, { limit: 6 });
    setStreetSuggestions(results);
    setLoadingStreet(false);
  }, []);

  const searchCity = useCallback(async (query: string) => {
    if (query.length < 3) {
      setCitySuggestions([]);
      return;
    }
    setLoadingCity(true);
    const results = await searchAddresses(query, { limit: 6 });
    setCitySuggestions(results);
    setLoadingCity(false);
  }, []);

  const handleChange = useCallback((newStreet: string, newNumber: string, newCity: string, newProvince: string, newPostalCode: string) => {
    const newAddress = stringifyAddress({ 
      street: newStreet, 
      number: newNumber, 
      city: newCity, 
      province: newProvince, 
      postalCode: newPostalCode 
    });
    onChangeRef.current(newAddress);
  }, []);

  const handleStreetSelect = useCallback((suggestion: AddressSuggestion) => {
    setStreet(suggestion.street);
    setNumber(suggestion.number);
    if (suggestion.city) setCity(suggestion.city);
    if (suggestion.province) setProvince(suggestion.province);
    if (suggestion.postalCode) setPostalCode(suggestion.postalCode);
    handleChange(
      suggestion.street,
      suggestion.number,
      suggestion.city || city,
      suggestion.province || province,
      suggestion.postalCode || postalCode
    );
  }, [city, province, postalCode, handleChange]);

  const handleCitySelect = useCallback((suggestion: AddressSuggestion) => {
    setCity(suggestion.city);
    setProvince(suggestion.province || province);
    setPostalCode(suggestion.postalCode || postalCode);
    handleChange(
      street,
      number,
      suggestion.city,
      suggestion.province || province,
      suggestion.postalCode || postalCode
    );
  }, [street, number, province, postalCode, handleChange]);

  const inputClass =
    "w-full border border-custom-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-custom-golden-400 transition";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 text-xs font-semibold text-custom-gray-500 uppercase tracking-wide">
        <MapPin className="size-3" />
        <span>{label}</span>
      </div>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-6">
          <AutocompleteInput
            value={street}
            onChange={(val) => {
              setStreet(val);
              handleChange(val, number, city, province, postalCode);
            }}
            onSelect={handleStreetSelect}
            placeholder="Calle"
            suggestions={streetSuggestions}
            loading={loadingStreet}
            onSearch={searchStreet}
            showDropdown={showStreetDropdown}
            setShowDropdown={setShowStreetDropdown}
            inputClass={inputClass}
          />
        </div>
        <div className="col-span-2">
          <input
            type="text"
            placeholder="Nº"
            value={number}
            onChange={(e) => {
              const val = e.target.value;
              setNumber(val);
              handleChange(street, val, city, province, postalCode);
            }}
            className={inputClass}
          />
        </div>
        <div className="col-span-4">
          <AutocompleteInput
            value={city}
            onChange={(val) => {
              setCity(val);
              handleChange(street, number, val, province, postalCode);
            }}
            onSelect={handleCitySelect}
            placeholder="Ciudad"
            suggestions={citySuggestions}
            loading={loadingCity}
            onSearch={searchCity}
            showDropdown={showCityDropdown}
            setShowDropdown={setShowCityDropdown}
            inputClass={inputClass}
          />
        </div>
        <div className="col-span-4">
          <input
            type="text"
            placeholder="Provincia"
            value={province}
            onChange={(e) => {
              const val = e.target.value;
              setProvince(val);
              handleChange(street, number, city, val, postalCode);
            }}
            className={inputClass}
          />
        </div>
        <div className="col-span-2">
          <input
            type="text"
            placeholder="CP"
            value={postalCode}
            onChange={(e) => {
              const val = e.target.value;
              setPostalCode(val);
              handleChange(street, number, city, province, val);
            }}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(AddressFieldsInner);
