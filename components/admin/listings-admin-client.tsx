"use client";

import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Listing {
  id: string;
  title: string;
  user_id: string;
  price: number;
  currency: string | null;
  status: string | null;
  category: string;
  condition: string;
  images: string[];
  featured: boolean | null;
  created_at: string | null;
  views: number | null;
  profiles: {
    callsign: string;
    display_name: string | null;
  } | null;
}

interface Props {
  listings: Listing[];
}

export function ListingsAdminClient({ listings }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "active" | "sold" | "featured">(
    "all"
  );
  const [loading, setLoading] = useState(false);

  const filteredListings = listings.filter((listing: Listing) => {
    if (filter === "all") return true;
    if (filter === "active") return listing.status === "active";
    if (filter === "sold") return listing.status === "sold";
    if (filter === "featured") return listing.featured === true;
    return true;
  });

  const handleToggleFeatured = async (listingId: string, currentStatus: boolean | null) => {
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("listings")
      .update({ featured: !currentStatus })
      .eq("id", listingId);

    if (error) {
      alert("Failed to update listing");
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  const handleDeleteListing = async (listing: Listing) => {
    if (
      !confirm(
        `Are you sure you want to delete "${listing.title}"? This cannot be undone.`
      )
    )
      return;

    setLoading(true);
    const supabase = createClient();

    // Delete images from storage
    if (listing.images && listing.images.length > 0) {
      for (const imageUrl of listing.images) {
        const urlParts = imageUrl.split("/listing-images/");
        if (urlParts.length === 2) {
          await supabase.storage.from("listing-images").remove([urlParts[1]]);
        }
      }
    }

    // Delete listing
    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", listing.id);

    if (error) {
      alert("Failed to delete listing");
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  const activeCount = listings.filter((l: Listing) => l.status === "active").length;
  const soldCount = listings.filter((l: Listing) => l.status === "sold").length;
  const featuredCount = listings.filter((l: Listing) => l.featured === true).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Listings Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Moderate listings and manage featured content
        </p>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setFilter("all")}
            className={`border-b-2 px-1 py-3 text-sm font-medium ${
              filter === "all"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            All ({listings.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`border-b-2 px-1 py-3 text-sm font-medium ${
              filter === "active"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter("sold")}
            className={`border-b-2 px-1 py-3 text-sm font-medium ${
              filter === "sold"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            Sold ({soldCount})
          </button>
          <button
            onClick={() => setFilter("featured")}
            className={`border-b-2 px-1 py-3 text-sm font-medium ${
              filter === "featured"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            Featured ({featuredCount})
          </button>
        </nav>
      </div>

      {/* Listings grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredListings.length === 0 ? (
          <div className="col-span-full rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">
              No listings found
            </p>
          </div>
        ) : (
          filteredListings.map((listing: Listing) => (
            <div
              key={listing.id}
              className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                {listing.images && listing.images.length > 0 ? (
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                {listing.featured && (
                  <div className="absolute right-2 top-2 rounded-full bg-yellow-400 px-2 py-1 text-xs font-semibold text-yellow-900">
                    ⭐ Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="line-clamp-2 font-semibold text-gray-900 dark:text-white">
                  {listing.title}
                </h3>

                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      listing.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {listing.status}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {listing.views || 0} views
                  </span>
                </div>

                <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                  {listing.price} {listing.currency || "EUR"}
                </p>

                {listing.profiles && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    By:{" "}
                    {listing.profiles.display_name ||
                      listing.profiles.callsign ||
                      "Unknown"}
                  </p>
                )}

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {listing.created_at &&
                    new Date(listing.created_at).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="mt-4 flex flex-col gap-2">
                  <a
                    href={`/en/listings/${listing.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    View Listing
                  </a>
                  <button
                    onClick={() =>
                      handleToggleFeatured(listing.id, listing.featured)
                    }
                    disabled={loading}
                    className="rounded-md bg-yellow-100 px-3 py-2 text-sm font-semibold text-yellow-800 hover:bg-yellow-200 disabled:opacity-50 dark:bg-yellow-900/30 dark:text-yellow-400"
                  >
                    {listing.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    onClick={() => handleDeleteListing(listing)}
                    disabled={loading}
                    className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}