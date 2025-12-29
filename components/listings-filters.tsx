"use client";

import { getCountries } from "@/lib/countries";
import { CountrySelect } from "./country-select";

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedCondition: string[];
  onConditionChange: (conditions: string[]) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (price: string) => void;
  onMaxPriceChange: (price: string) => void;
  country: string;
  onCountryChange: (country: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  locale: string;
}

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "transceiver_hf", label: "HF Transceiver" },
  { value: "transceiver_vhf_uhf", label: "VHF/UHF Transceiver" },
  { value: "transceiver_handheld", label: "Handheld Transceiver" },
  { value: "antenna_hf", label: "HF Antenna" },
  { value: "antenna_vhf_uhf", label: "VHF/UHF Antenna" },
  { value: "antenna_accessories", label: "Antenna Accessories" },
  { value: "power_supply", label: "Power Supply" },
  { value: "amplifier", label: "Amplifier" },
  { value: "tuner", label: "Antenna Tuner" },
  { value: "rotator", label: "Rotator" },
  { value: "swr_meter", label: "SWR Meter" },
  { value: "digital_modes", label: "Digital Modes Equipment" },
  { value: "microphone", label: "Microphone" },
  { value: "cables_connectors", label: "Cables & Connectors" },
  { value: "tools", label: "Tools" },
  { value: "books_manuals", label: "Books & Manuals" },
  { value: "other", label: "Other" },
];

const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "parts_repair", label: "For Parts/Repair" },
];

export function ListingsFilters({
  selectedCategory,
  onCategoryChange,
  selectedCondition,
  onConditionChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  country,
  onCountryChange,
  sortBy,
  onSortChange,
  onClearFilters,
  locale,
}: Props) {
  const toggleCondition = (condition: string) => {
    if (selectedCondition.includes(condition)) {
      onConditionChange(selectedCondition.filter((c) => c !== condition));
    } else {
      onConditionChange([...selectedCondition, condition]);
    }
  };

  const hasActiveFilters =
    selectedCategory !== "" ||
    selectedCondition.length > 0 ||
    minPrice !== "" ||
    maxPrice !== "" ||
    country !== "";

  // Get readable labels
  const getCategoryLabel = (value: string) =>
    CATEGORIES.find((c) => c.value === value)?.label || value;

  const getConditionLabel = (value: string) =>
    CONDITIONS.find((c) => c.value === value)?.label || value;

  const getCountryLabel = (code: string) => {
    const countries = getCountries(locale);
    return countries.find((c) => c.code === code)?.nameTranslated || code;
  };

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Active Filters
            </h3>
            <button
              onClick={onClearFilters}
              className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {getCategoryLabel(selectedCategory)}
                <button
                  onClick={() => onCategoryChange("")}
                  className="hover:text-blue-600 dark:hover:text-blue-100"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}

            {selectedCondition.map((condition) => (
              <span
                key={condition}
                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {getConditionLabel(condition)}
                <button
                  onClick={() => toggleCondition(condition)}
                  className="hover:text-blue-600 dark:hover:text-blue-100"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}

            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Price: {minPrice || "0"} - {maxPrice || "∞"}
                <button
                  onClick={() => {
                    onMinPriceChange("");
                    onMaxPriceChange("");
                  }}
                  className="hover:text-blue-600 dark:hover:text-blue-100"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}

            {country && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {getCountryLabel(country)}
                <button
                  onClick={() => onCountryChange("")}
                  className="hover:text-blue-600 dark:hover:text-blue-100"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Sort By */}
      <div>
        <label
          htmlFor="sort"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Sort By
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>

      {/* Location Filters */}
      <CountrySelect
        value={country}
        onChange={onCountryChange}
        locale={locale}
        label="Country"
        placeholder="All Countries"
      />

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Category
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Condition
        </label>
        <div className="mt-2 space-y-2">
          {CONDITIONS.map((condition) => (
            <label key={condition.value} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCondition.includes(condition.value)}
                onChange={() => toggleCondition(condition.value)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {condition.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Price Range
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}
