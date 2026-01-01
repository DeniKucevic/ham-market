import { getCountries } from "@/lib/countries";
import { getDisplayName } from "@/lib/display-name";
import type { BrowseListing } from "@/types/listing";
import { formatPrice } from "@/utils/currency";
import Image from "next/image";
import { memo } from "react";
import { ImagePlaceholder } from "./image-placeholder";
import { LoadingLink } from "./loading-link";

interface Props {
  listing: BrowseListing;
  locale?: string;
}

export const ListingGridCard = memo(function ListingGridCard({
  listing,
  locale,
}: Props) {
  const countries = getCountries(locale ?? "en");
  const country = countries.find(
    (c) => c.code === listing.profiles?.location_country
  );

  return (
    <LoadingLink
      href={`/listings/${listing.id}`}
      className="group relative block overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-lg dark:bg-gray-800"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        {listing.images && listing.images.length > 0 ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            width={400}
            height={400}
            loading="lazy"
            quality={75}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder size="lg" />
        )}
      </div>
      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
          {listing.title}
        </h3>
        {listing.profiles?.location_country && (
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>
              {country?.flag}{" "}
              {listing.profiles?.location_city
                ? `${listing.profiles.location_city}, `
                : ""}
              {country?.nameTranslated}
            </span>
          </div>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            {listing.category.replace(/_/g, " ")}
          </span>
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {listing.condition.replace(/_/g, " ")}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p
            className={`text-xl font-bold ${
              listing.price === 0
                ? "text-green-600 dark:text-green-400"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {formatPrice(listing.price, listing.currency || "EUR")}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {getDisplayName(listing.profiles, "Seller")}
          </p>
        </div>
      </div>
    </LoadingLink>
  );
});
