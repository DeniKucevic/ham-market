import { HeroSearch } from "@/components/hero-search";
import { getCountryFromIP } from "@/lib/geolocation";
import { createClient } from "@/lib/supabase/server";
import { BrowseListing } from "@/types/listing";
import {
  getExchangeRates,
  normalizeToEur
} from "@/utils/currency-server";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BrowseListingsClient } from "../../components/browse-listings-client";

export const revalidate = 60;

const ITEMS_PER_PAGE = 24;

const VALID_CATEGORIES = [
  "transceiver_hf",
  "transceiver_vhf_uhf",
  "transceiver_handheld",
  "antenna_hf",
  "antenna_vhf_uhf",
  "antenna_accessories",
  "power_supply",
  "amplifier",
  "tuner",
  "rotator",
  "swr_meter",
  "digital_modes",
  "microphone",
  "cables_connectors",
  "tools",
  "books_manuals",
  "other",
] as const;

const VALID_CONDITIONS = [
  "new",
  "excellent",
  "good",
  "fair",
  "parts_repair",
] as const;

type ValidCategory = (typeof VALID_CATEGORIES)[number];
type ValidCondition = (typeof VALID_CONDITIONS)[number];
interface SearchParams {
  page?: string;
  search?: string;
  category?: string;
  condition?: string;
  min_price?: string;
  max_price?: string;
  price_currency?: string;
  country?: string;
  sort?: string;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const searchParamsResolved = await searchParams;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const searchQuery = searchParamsResolved.search || "";
  const category = searchParamsResolved.category || "";

  // Build dynamic title based on filters
  let title = t("title");
  let description = t("description");

  if (searchQuery) {
    title = `${searchQuery} - ${t("title")}`;
    description = `Search results for "${searchQuery}" on HAM Radio Marketplace. ${t(
      "description"
    )}`;
  } else if (category) {
    const categoryLabel = category.replace(/_/g, " ");
    title = `${categoryLabel} - ${t("title")}`;
    description = `Browse ${categoryLabel} equipment on HAM Radio Marketplace. ${t(
      "description"
    )}`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://hamtrade.net/${locale}`,
      siteName: t("title"),
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://hamtrade.net/${locale}`,
      languages: {
        en: "https://hamtrade.net/en",
        sr: "https://hamtrade.net/sr",
        "sr-Cyrl": "https://hamtrade.net/sr-Cyrl",
        is: "https://hamtrade.net/is",
        bg: "https://hamtrade.net/bg",
        ro: "https://hamtrade.net/ro",
        de: "https://hamtrade.net/de",
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "browse" });
  const searchParamsResolved = await searchParams;

  const page = parseInt(searchParamsResolved.page || "1");
  const searchQuery = searchParamsResolved.search || "";
  const category = searchParamsResolved.category || "";
  const conditions = searchParamsResolved.condition
    ? searchParamsResolved.condition.split(",")
    : [];
  const minPrice = searchParamsResolved.min_price || "";
  const maxPrice = searchParamsResolved.max_price || "";
  const priceCurrency = searchParamsResolved.price_currency || "EUR";
  const sortBy = searchParamsResolved.sort || "newest";

  const offset = (page - 1) * ITEMS_PER_PAGE;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("*").eq("id", user.id).single()
    : { data: null };

  let defaultCountry = "";

  if (searchParamsResolved.country) {
    // User manually selected a country via URL
    defaultCountry = searchParamsResolved.country;
  } else if (profile?.location_country) {
    // User has set their country in profile
    defaultCountry = profile.location_country;
  } else {
    // Detect from IP
    defaultCountry = await getCountryFromIP();
  }

  const country = defaultCountry;

  const showFeatured = page === 1 && !searchQuery && !category && !country;
  const { data: featuredListings } = showFeatured
    ? await supabase
        .from("listings")
        .select(
          `
          *,
          profiles!listings_user_id_fkey (
            callsign,
            display_name,
            location_city,
            location_country,
            rating
          )
        `
        )
        .eq("status", "active")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(6)
    : { data: null };

  // Build query with all filters
  let query = supabase
    .from("listings")
    .select(
      `
      *,
      profiles!listings_user_id_fkey (
        callsign,
        display_name,
        location_city,
        location_country
      )
    `,
      { count: "exact" }
    )
    .eq("status", "active");

  // Search filter
  if (searchQuery) {
    query = query.or(
      `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,manufacturer.ilike.%${searchQuery}%,model.ilike.%${searchQuery}%`
    );
  }

  const isValidCategory = (value: string): value is ValidCategory => {
    return VALID_CATEGORIES.includes(value as ValidCategory);
  };

  const isValidCondition = (value: string): value is ValidCondition => {
    return VALID_CONDITIONS.includes(value as ValidCondition);
  };
  const validCategory = isValidCategory(category) ? category : "";
  const validConditions = conditions.filter(isValidCondition);

  if (validCategory) {
    query = query.eq("category", validCategory);
  }

  if (validConditions.length > 0) {
    query = query.in("condition", validConditions);
  }

  if (minPrice || maxPrice) {
    const rates = await getExchangeRates();

    if (minPrice) {
      const minPriceNum = parseFloat(minPrice);

      // Convert to all currencies for filtering
      if (priceCurrency === "EUR") {
        const minPriceRSD = minPriceNum * rates.eurToRsd;
        const minPriceUSD = minPriceNum / rates.usdToEur;
        const minPriceGBP = minPriceNum / rates.gbpToEur;

        query = query.or(
          `and(currency.eq.EUR,price.gte.${minPriceNum}),` +
            `and(currency.eq.RSD,price.gte.${minPriceRSD}),` +
            `and(currency.eq.USD,price.gte.${minPriceUSD}),` +
            `and(currency.eq.GBP,price.gte.${minPriceGBP})`
        );
      } else if (priceCurrency === "RSD") {
        const minPriceEUR = minPriceNum / rates.eurToRsd;
        const minPriceUSD = minPriceNum / rates.eurToRsd / rates.usdToEur;
        const minPriceGBP = minPriceNum / rates.eurToRsd / rates.gbpToEur;

        query = query.or(
          `and(currency.eq.RSD,price.gte.${minPriceNum}),` +
            `and(currency.eq.EUR,price.gte.${minPriceEUR}),` +
            `and(currency.eq.USD,price.gte.${minPriceUSD}),` +
            `and(currency.eq.GBP,price.gte.${minPriceGBP})`
        );
      } else if (priceCurrency === "USD") {
        const minPriceEUR = minPriceNum * rates.usdToEur;
        const minPriceRSD = minPriceNum * rates.usdToEur * rates.eurToRsd;
        const minPriceGBP = (minPriceNum * rates.usdToEur) / rates.gbpToEur;

        query = query.or(
          `and(currency.eq.USD,price.gte.${minPriceNum}),` +
            `and(currency.eq.EUR,price.gte.${minPriceEUR}),` +
            `and(currency.eq.RSD,price.gte.${minPriceRSD}),` +
            `and(currency.eq.GBP,price.gte.${minPriceGBP})`
        );
      } else if (priceCurrency === "GBP") {
        const minPriceEUR = minPriceNum * rates.gbpToEur;
        const minPriceRSD = minPriceNum * rates.gbpToEur * rates.eurToRsd;
        const minPriceUSD = (minPriceNum * rates.gbpToEur) / rates.usdToEur;

        query = query.or(
          `and(currency.eq.GBP,price.gte.${minPriceNum}),` +
            `and(currency.eq.EUR,price.gte.${minPriceEUR}),` +
            `and(currency.eq.RSD,price.gte.${minPriceRSD}),` +
            `and(currency.eq.USD,price.gte.${minPriceUSD})`
        );
      }
    }

    if (maxPrice) {
      const maxPriceNum = parseFloat(maxPrice);

      if (priceCurrency === "EUR") {
        const maxPriceRSD = maxPriceNum * rates.eurToRsd;
        const maxPriceUSD = maxPriceNum / rates.usdToEur;
        const maxPriceGBP = maxPriceNum / rates.gbpToEur;

        query = query.or(
          `and(currency.eq.EUR,price.lte.${maxPriceNum}),` +
            `and(currency.eq.RSD,price.lte.${maxPriceRSD}),` +
            `and(currency.eq.USD,price.lte.${maxPriceUSD}),` +
            `and(currency.eq.GBP,price.lte.${maxPriceGBP})`
        );
      } else if (priceCurrency === "RSD") {
        const maxPriceEUR = maxPriceNum / rates.eurToRsd;
        const maxPriceUSD = maxPriceNum / rates.eurToRsd / rates.usdToEur;
        const maxPriceGBP = maxPriceNum / rates.eurToRsd / rates.gbpToEur;

        query = query.or(
          `and(currency.eq.RSD,price.lte.${maxPriceNum}),` +
            `and(currency.eq.EUR,price.lte.${maxPriceEUR}),` +
            `and(currency.eq.USD,price.lte.${maxPriceUSD}),` +
            `and(currency.eq.GBP,price.lte.${maxPriceGBP})`
        );
      } else if (priceCurrency === "USD") {
        const maxPriceEUR = maxPriceNum * rates.usdToEur;
        const maxPriceRSD = maxPriceNum * rates.usdToEur * rates.eurToRsd;
        const maxPriceGBP = (maxPriceNum * rates.usdToEur) / rates.gbpToEur;

        query = query.or(
          `and(currency.eq.USD,price.lte.${maxPriceNum}),` +
            `and(currency.eq.EUR,price.lte.${maxPriceEUR}),` +
            `and(currency.eq.RSD,price.lte.${maxPriceRSD}),` +
            `and(currency.eq.GBP,price.lte.${maxPriceGBP})`
        );
      } else if (priceCurrency === "GBP") {
        const maxPriceEUR = maxPriceNum * rates.gbpToEur;
        const maxPriceRSD = maxPriceNum * rates.gbpToEur * rates.eurToRsd;
        const maxPriceUSD = (maxPriceNum * rates.gbpToEur) / rates.usdToEur;

        query = query.or(
          `and(currency.eq.GBP,price.lte.${maxPriceNum}),` +
            `and(currency.eq.EUR,price.lte.${maxPriceEUR}),` +
            `and(currency.eq.RSD,price.lte.${maxPriceRSD}),` +
            `and(currency.eq.USD,price.lte.${maxPriceUSD})`
        );
      }
    }
  }

  // Determine if we're doing price sorting
  const isPriceSorting = sortBy === "price_low" || sortBy === "price_high";

  // Apply sorting to query (for non-price sorts)
  if (!isPriceSorting) {
    switch (sortBy) {
      case "oldest":
        query = query
          .order("featured", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: true });
        break;
      case "newest":
      default:
        query = query
          .order("featured", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false });
        break;
    }
  } else {
    // For price sorting, order by created_at for consistent pagination
    query = query
      .order("featured", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
  }

  // Get count first
  const { count } = await query;

  // Fetch paginated listings
  const { data: listings } = await query.range(
    offset,
    offset + ITEMS_PER_PAGE - 1
  );

  // Client-side filter for location (since it's on joined table)
  let filteredListings = listings || [];
  if (country) {
    filteredListings = filteredListings.filter(
      (listing) =>
        listing.profiles?.location_country?.toLowerCase() ===
        country.toLowerCase()
    );
  }

  if (isPriceSorting && filteredListings.length > 0) {
    const rates = await getExchangeRates();

    filteredListings.sort((a, b) => {
      const priceA = normalizeToEur(
        a.price,
        a.currency as "EUR" | "RSD" | "USD" | "GBP",
        rates
      );
      const priceB = normalizeToEur(
        b.price,
        b.currency as "EUR" | "RSD" | "USD" | "GBP",
        rates
      );

      return sortBy === "price_low" ? priceA - priceB : priceB - priceA;
    });
  }
  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroSearch initialQuery={searchQuery} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("browseListings")}
          </h1>
        </div>

        <BrowseListingsClient
          listings={filteredListings as BrowseListing[]}
          currentPage={page}
          totalPages={totalPages}
          totalCount={count || 0}
          initialSearchQuery={searchQuery}
          initialCategory={category}
          initialConditions={conditions}
          initialMinPrice={minPrice}
          initialMaxPrice={maxPrice}
          initialPriceCurrency={priceCurrency}
          initialCountry={country}
          initialSort={sortBy}
          locale={locale}
          defaultCountry={defaultCountry}
        />
      </main>
    </div>
  );
}
