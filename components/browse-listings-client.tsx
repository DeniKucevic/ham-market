"use client";

import { ListingGridCard } from "@/components/listing-grid-card";
import { ListingListCard } from "@/components/listing-list-card";
import { ListingsFilters } from "@/components/listings-filters";
import { Pagination } from "@/components/pagination";
import { ViewToggle } from "@/components/view-toggle";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { BrowseListing } from "@/types/listing";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface Props {
  listings: BrowseListing[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  initialSearchQuery?: string;
  initialCategory?: string;
  initialConditions?: string[];
  initialMinPrice?: string;
  initialMaxPrice?: string;
  initialCountry?: string;
  initialSort?: string;
  locale: string;
}

export function BrowseListingsClient({
  listings,
  currentPage,
  totalPages,
  totalCount,
  initialSearchQuery = "",
  initialCategory = "",
  initialConditions = [],
  initialMinPrice = "",
  initialMaxPrice = "",
  initialCountry = "",
  initialSort = "newest",
  locale,
}: Props) {
  const t = useTranslations("browse");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [viewMode, setViewMode, viewMounted] = useLocalStorage<"grid" | "list">(
    "listings-view-mode",
    "grid"
  );

  // Filter states - controlled by URL params
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCondition, setSelectedCondition] =
    useState<string[]>(initialConditions);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [sortBy, setSortBy] = useState(initialSort);
  const [country, setCountry] = useState(initialCountry);

  // Update URL with filter params
  const updateFilters = (newParams?: {
    search?: string;
    category?: string;
    condition?: string[];
    minPrice?: string;
    maxPrice?: string;
    country?: string;
    sort?: string;
  }) => {
    const params = new URLSearchParams();

    const search =
      newParams?.search !== undefined ? newParams.search : searchQuery;
    const cat =
      newParams?.category !== undefined ? newParams.category : selectedCategory;
    const cond =
      newParams?.condition !== undefined
        ? newParams.condition
        : selectedCondition;
    const minP =
      newParams?.minPrice !== undefined ? newParams.minPrice : minPrice;
    const maxP =
      newParams?.maxPrice !== undefined ? newParams.maxPrice : maxPrice;
    const ctry = newParams?.country !== undefined ? newParams.country : country;
    const sort = newParams?.sort !== undefined ? newParams.sort : sortBy;

    if (search) params.set("search", search);
    if (cat) params.set("category", cat);
    if (cond.length > 0) params.set("condition", cond.join(","));
    if (minP) params.set("min_price", minP);
    if (maxP) params.set("max_price", maxP);
    if (ctry) params.set("country", ctry);
    if (sort !== "newest") params.set("sort", sort);

    startTransition(() => {
      router.push(`/${locale}?${params.toString()}`, { scroll: false });
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedCondition([]);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    setCountry("");

    startTransition(() => {
      router.push(`/${locale}`, { scroll: false });
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Sidebar Filters */}
      <aside className="lg:col-span-1">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {t("filters")}
          </h2>
          <ListingsFilters
            searchQuery={searchQuery}
            onSearchChange={(value) => {
              setSearchQuery(value);
              updateFilters({ search: value });
            }}
            selectedCategory={selectedCategory}
            onCategoryChange={(value) => {
              setSelectedCategory(value);
              updateFilters({ category: value });
            }}
            selectedCondition={selectedCondition}
            onConditionChange={(value) => {
              setSelectedCondition(value);
              updateFilters({ condition: value });
            }}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={(value) => {
              setMinPrice(value);
              updateFilters({ minPrice: value });
            }}
            onMaxPriceChange={(value) => {
              setMaxPrice(value);
              updateFilters({ maxPrice: value });
            }}
            country={country}
            onCountryChange={(value) => {
              setCountry(value);
              updateFilters({ country: value });
            }}
            sortBy={sortBy}
            onSortChange={(value) => {
              setSortBy(value);
              updateFilters({ sort: value });
            }}
            onClearFilters={clearFilters}
            locale={locale}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Header with view toggle */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            {t("showing")} {listings.length} {t("of")} {totalCount}{" "}
            {t("listings")}
          </p>
          {viewMounted && (
            <ViewToggle value={viewMode} onChange={setViewMode} />
          )}
        </div>

        {/* No results */}
        {(!listings || listings.length === 0) && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {totalCount === 0 ? t("noListingsYet") : t("noListingsFound")}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {totalCount === 0 ? t("beTheFirst") : t("tryAdjusting")}
            </p>
            {totalCount === 0 && (
              <Link
                href={`/${locale}/listings/new`}
                className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                {t("createListing")}
              </Link>
            )}
          </div>
        )}

        {/* Grid View */}
        {viewMounted && listings.length > 0 && viewMode === "grid" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <ListingGridCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* List View */}
        {viewMounted && listings.length > 0 && viewMode === "list" && (
          <div className="space-y-4">
            {listings.map((listing) => (
              <ListingListCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
