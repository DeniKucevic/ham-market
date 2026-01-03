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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { FilterDrawer } from "./filter-drawer";
import { ListingGridSkeleton, ListingListSkeleton } from "./listing-skeleton";

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
  initialPriceCurrency?: string;
  initialCountry?: string;
  initialSort?: string;
  locale: string;
  defaultCountry: string;
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
  initialPriceCurrency = "EUR",
  initialCountry = "",
  initialSort = "newest",
  locale,
  defaultCountry,
}: Props) {
  const t = useTranslations("browse");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [viewMode, setViewMode, viewMounted] = useLocalStorage<"grid" | "list">(
    "listings-view-mode",
    "grid"
  );

  // Filter states
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCondition, setSelectedCondition] =
    useState<string[]>(initialConditions);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [priceCurrency, setPriceCurrency] = useState(initialPriceCurrency);
  const [sortBy, setSortBy] = useState(initialSort);
  const [country, setCountry] = useState(initialCountry);

  const debounceTimer = useRef<NodeJS.Timeout>(null);

  const updateFilters = useCallback(
    (
      newParams?: {
        search?: string;
        category?: string;
        condition?: string[];
        minPrice?: string;
        maxPrice?: string;
        priceCurrency?: string;
        country?: string;
        sort?: string;
      },
      immediate = false
    ) => {
      const doUpdate = () => {
        const params = new URLSearchParams(searchParams);

        const search =
          newParams?.search !== undefined ? newParams.search : searchQuery;
        const cat =
          newParams?.category !== undefined
            ? newParams.category
            : selectedCategory;
        const cond =
          newParams?.condition !== undefined
            ? newParams.condition
            : selectedCondition;
        const minP =
          newParams?.minPrice !== undefined ? newParams.minPrice : minPrice;
        const maxP =
          newParams?.maxPrice !== undefined ? newParams.maxPrice : maxPrice;
        const priceCurr =
          newParams?.priceCurrency !== undefined
            ? newParams.priceCurrency
            : priceCurrency;
        const ctry =
          newParams?.country !== undefined ? newParams.country : country;
        const sort = newParams?.sort !== undefined ? newParams.sort : sortBy;

        params.forEach((_, key) => params.delete(key));

        if (search) params.set("search", search);
        if (cat) params.set("category", cat);
        if (cond.length > 0) params.set("condition", cond.join(","));
        if (minP) params.set("min_price", minP);
        if (maxP) params.set("max_price", maxP);
        if (priceCurr !== "EUR") params.set("price_currency", priceCurr);
        if (ctry) params.set("country", ctry);
        if (sort !== "newest") params.set("sort", sort);

        const newUrl = `${pathname}?${params.toString()}`;
        window.history.replaceState(null, "", newUrl);

        startTransition(() => {
          router.push(`${pathname}?${params.toString()}`, { scroll: false });
        });
      };

      if (immediate) {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
        doUpdate();
      } else {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(doUpdate, 300); // Also changed to 300ms
      }
    },
    [
      searchParams,
      pathname,
      searchQuery,
      selectedCategory,
      selectedCondition,
      minPrice,
      maxPrice,
      priceCurrency,
      country,
      sortBy,
      router,
    ]
  );

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedCondition([]);
    setMinPrice("");
    setMaxPrice("");
    setPriceCurrency("EUR");
    setSortBy("newest");
    setCountry(defaultCountry);

    const params = new URLSearchParams();
    if (defaultCountry) {
      params.set("country", defaultCountry);
    }

    startTransition(() => {
      router.push(
        `/${locale}${params.toString() ? `?${params.toString()}` : ""}`,
        { scroll: false }
      );
    });
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const activeFilterCount = [
    selectedCategory,
    ...selectedCondition,
    minPrice || maxPrice ? "price" : "",
    country,
  ].filter(Boolean).length;

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:block lg:col-span-1">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {t("filters")}
          </h2>
          <ListingsFilters
            searchQuery={searchQuery}
            onSearchChange={(value) => {
              setSearchQuery(value);
              updateFilters({ search: value }, false);
            }}
            selectedCategory={selectedCategory}
            onCategoryChange={(value) => {
              setSelectedCategory(value);
              updateFilters({ category: value }, true);
            }}
            selectedCondition={selectedCondition}
            onConditionChange={(value) => {
              setSelectedCondition(value);
              updateFilters({ condition: value }, true);
            }}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={(value) => {
              setMinPrice(value);
              updateFilters({ minPrice: value }, false);
            }}
            onMaxPriceChange={(value) => {
              setMaxPrice(value);
              updateFilters({ maxPrice: value }, false);
            }}
            priceCurrency={priceCurrency}
            onPriceCurrencyChange={(value) => {
              setPriceCurrency(value);
              updateFilters({ priceCurrency: value }, true);
            }}
            country={country}
            onCountryChange={(value) => {
              setCountry(value);
              updateFilters({ country: value }, true);
            }}
            sortBy={sortBy}
            onSortChange={(value) => {
              setSortBy(value);
              updateFilters({ sort: value }, true);
            }}
            onClearFilters={clearFilters}
            locale={locale}
          />
        </div>
      </aside>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      >
        <ListingsFilters
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            updateFilters({ search: value }, false);
          }}
          selectedCategory={selectedCategory}
          onCategoryChange={(value) => {
            setSelectedCategory(value);
            updateFilters({ category: value }, true);
          }}
          selectedCondition={selectedCondition}
          onConditionChange={(value) => {
            setSelectedCondition(value);
            updateFilters({ condition: value }, true);
          }}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={(value) => {
            setMinPrice(value);
            updateFilters({ minPrice: value }, false);
          }}
          onMaxPriceChange={(value) => {
            setMaxPrice(value);
            updateFilters({ maxPrice: value }, false);
          }}
          priceCurrency={priceCurrency}
          onPriceCurrencyChange={(value) => {
            setPriceCurrency(value);
            updateFilters({ priceCurrency: value }, true);
          }}
          country={country}
          onCountryChange={(value) => {
            setCountry(value);
            updateFilters({ country: value }, true);
          }}
          sortBy={sortBy}
          onSortChange={(value) => {
            setSortBy(value);
            updateFilters({ sort: value }, true);
          }}
          onClearFilters={clearFilters}
          locale={locale}
        />
      </FilterDrawer>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Mobile Filter Button & Sort */}
        <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            {t("filters")}
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {viewMounted && (
            <ViewToggle value={viewMode} onChange={setViewMode} />
          )}
        </div>

        {/* Desktop Header with view toggle */}
        <div className="mb-6 hidden items-center justify-between lg:flex">
          <p className="text-gray-600 dark:text-gray-400">
            {t("showing")} {listings.length} {t("of")} {totalCount}{" "}
            {t("listings")}
          </p>
          {viewMounted && (
            <ViewToggle value={viewMode} onChange={setViewMode} />
          )}
        </div>

        {/* Mobile results count */}
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 lg:hidden">
          {t("showing")} {listings.length} {t("of")} {totalCount}{" "}
          {t("listings")}
        </p>

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

        {isPending && (
          <>
            {viewMode === "grid" && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <ListingGridSkeleton key={i} />
                ))}
              </div>
            )}
            {viewMode === "list" && (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <ListingListSkeleton key={i} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Grid View */}
        {!isPending &&
          viewMounted &&
          listings.length > 0 &&
          viewMode === "grid" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <ListingGridCard
                  key={listing.id}
                  listing={listing}
                  locale={locale}
                />
              ))}
            </div>
          )}

        {/* List View */}
        {!isPending &&
          viewMounted &&
          listings.length > 0 &&
          viewMode === "list" && (
            <div className="space-y-4">
              {listings.map((listing) => (
                <ListingListCard
                  key={listing.id}
                  listing={listing}
                  locale={locale}
                />
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
