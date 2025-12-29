"use client";

import { getCountries } from "@/lib/countries";
import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  locale: string; // Add locale prop
  label?: string;
  placeholder?: string;
}

export function CountrySelect({
  value,
  onChange,
  locale,
  label,
  placeholder = "Select country",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const countries = getCountries(locale);
  const selectedCountry = countries.find((c) => c.code === value);

  const filteredCountries = countries.filter(
    (country) =>
      country.nameTranslated.toLowerCase().includes(search.toLowerCase()) ||
      country.name.toLowerCase().includes(search.toLowerCase()) // Also search English name
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      {/* Selected value / trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      >
        {selectedCountry ? (
          <span>
            {selectedCountry.flag} {selectedCountry.nameTranslated}
          </span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-600">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries..."
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              autoFocus
            />
          </div>

          {/* Country list */}
          <div className="max-h-60 overflow-y-auto">
            {/* All countries option */}
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
                setSearch("");
              }}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              All Countries
            </button>

            {filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onChange(country.code);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                  value === country.code ? "bg-blue-50 dark:bg-blue-900" : ""
                }`}
              >
                {country.flag} {country.nameTranslated}
              </button>
            ))}

            {filteredCountries.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
