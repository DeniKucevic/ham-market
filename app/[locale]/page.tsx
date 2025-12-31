import { HeroSearch } from "@/components/hero-search";
import { createClient } from "@/lib/supabase/server";
import { BrowseListing } from "@/types/listing";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BrowseListingsClient } from "../../components/browse-listings-client";

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
      url: `https://ham-market.vercel.app/${locale}`,
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
      canonical: `https://ham-market.vercel.app/${locale}`,
      languages: {
        en: `https://ham-market.vercel.app/en`,
        sr: `https://ham-market.vercel.app/sr`,
        "sr-Cyrl": `https://ham-market.vercel.app/sr-Cyrl`,
        is: `https://ham-market.vercel.app/is`,
        bg: `https://ham-market.vercel.app/bg`,
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
  const t = await getTranslations("browse");
  const searchParamsResolved = await searchParams;

  const page = parseInt(searchParamsResolved.page || "1");
  const searchQuery = searchParamsResolved.search || "";
  const category = searchParamsResolved.category || "";
  const conditions = searchParamsResolved.condition
    ? searchParamsResolved.condition.split(",")
    : [];
  const minPrice = searchParamsResolved.min_price || "";
  const maxPrice = searchParamsResolved.max_price || "";
  const country = searchParamsResolved.country || "";
  const sortBy = searchParamsResolved.sort || "newest";

  const offset = (page - 1) * ITEMS_PER_PAGE;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("*").eq("id", user.id).single()
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

  // Price filters
  if (minPrice) {
    query = query.gte("price", parseFloat(minPrice));
  }
  if (maxPrice) {
    query = query.lte("price", parseFloat(maxPrice));
  }

  // Sorting
  switch (sortBy) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "price_low":
      query = query.order("price", { ascending: true });
      break;
    case "price_high":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
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

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
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
          initialCountry={country}
          initialSort={sortBy}
          locale={locale}
        />
      </main>
    </div>
  );
}
