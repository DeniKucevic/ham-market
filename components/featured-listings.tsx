import { BrowseListing } from "@/types/listing";
import { formatPrice } from "@/utils/currency";
import Image from "next/image";
import Link from "next/link";

interface Props {
  listings: BrowseListing[];
  locale: string;
}

export function FeaturedListings({ listings, locale }: Props) {
  if (!listings || listings.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          ⭐ Featured Listings
        </h2>
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
          Handpicked by Admins
        </span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <Link
            key={listing.id}
            href={`/${locale}/listings/${listing.id}`}
            className="group relative overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-lg dark:bg-gray-800"
          >
            {/* Star Badge */}
            <div className="absolute right-2 top-2 z-10 rounded-full bg-yellow-400 p-2 shadow-lg">
              <span className="text-xl">⭐</span>
            </div>

            {/* Image */}
            <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
              {listing.images && listing.images.length > 0 ? (
                <Image
                  src={listing.images[0]}
                  alt={listing.title}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="line-clamp-2 font-semibold text-gray-900 dark:text-white">
                {listing.title}
              </h3>
              <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(listing.price, listing.currency || "EUR")}
              </p>
              {listing.profiles && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {listing.profiles.display_name || listing.profiles.callsign}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
