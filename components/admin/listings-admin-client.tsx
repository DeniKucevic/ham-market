"use client";

import { ViewToggle } from "@/components/view-toggle";
import { useLocalStorage } from "@/hooks/use-local-storage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pagination } from "../pagination";

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
  admin_notes: string | null | undefined;
  profiles: {
    callsign: string;
    display_name: string | null;
  } | null;
}

interface Props {
  listings: Listing[];
  locale: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function ListingsAdminClient({
  listings,
  locale,
  currentPage,
  totalPages,
  totalCount,
}: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<
    "all" | "active" | "sold" | "hidden" | "featured"
  >("all");
  const [loading, setLoading] = useState(false);
  const [hideModal, setHideModal] = useState<Listing | null>(null);
  const [hideReason, setHideReason] = useState("");
  const [viewMode, setViewMode, viewMounted] = useLocalStorage<"grid" | "list">(
    "admin-listings-view-mode",
    "grid"
  );

  const filteredListings = listings.filter((listing: Listing) => {
    if (filter === "all") return true;
    if (filter === "active") return listing.status === "active";
    if (filter === "sold") return listing.status === "sold";
    if (filter === "hidden") return listing.status === "hidden";
    if (filter === "featured") return listing.featured === true;
    return true;
  });

  const handleToggleFeatured = async (
    listingId: string,
    currentStatus: boolean | null
  ) => {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/toggle-featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          featured: !currentStatus,
        }),
      });

      if (!response.ok) throw new Error("Failed to update");
      router.refresh();
    } catch (error) {
      alert("Failed to update listing");
    } finally {
      setLoading(false);
    }
  };

  const handleHideListing = async () => {
    if (!hideModal || !hideReason.trim()) {
      alert("Please provide a reason for hiding this listing");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/hide-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: hideModal.id,
          adminNotes: hideReason,
        }),
      });

      if (!response.ok) throw new Error("Failed to hide listing");

      setHideModal(null);
      setHideReason("");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to hide listing");
    } finally {
      setLoading(false);
    }
  };

  const handleUnhideListing = async (listingId: string) => {
    if (!confirm("Unhide this listing and make it active again?")) return;

    setLoading(true);

    try {
      const response = await fetch("/api/admin/unhide-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });

      if (!response.ok) throw new Error("Failed to unhide");
      router.refresh();
    } catch (error) {
      alert("Failed to unhide listing");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listing: Listing) => {
    if (
      !confirm(
        `Are you sure you want to PERMANENTLY DELETE "${listing.title}"? This cannot be undone. Consider hiding it instead.`
      )
    )
      return;

    setLoading(true);

    try {
      const response = await fetch("/api/admin/delete-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          images: listing.images,
        }),
      });

      if (!response.ok) throw new Error("Failed to delete");
      router.refresh();
    } catch (error) {
      alert("Failed to delete listing");
    } finally {
      setLoading(false);
    }
  };

  const activeCount = listings.filter(
    (l: Listing) => l.status === "active"
  ).length;
  const soldCount = listings.filter((l: Listing) => l.status === "sold").length;
  const hiddenCount = listings.filter(
    (l: Listing) => l.status === "hidden"
  ).length;
  const featuredCount = listings.filter(
    (l: Listing) => l.featured === true
  ).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Listings Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Showing {listings.length} of {totalCount} total listings (Page{" "}
            {currentPage} of {totalPages})
          </p>
        </div>
        {viewMounted && <ViewToggle value={viewMode} onChange={setViewMode} />}
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
            onClick={() => setFilter("hidden")}
            className={`border-b-2 px-1 py-3 text-sm font-medium ${
              filter === "hidden"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            Hidden ({hiddenCount})
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

      {/* Grid View */}
      {viewMounted && viewMode === "grid" && (
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
                  {listing.status === "hidden" && (
                    <div className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-1 text-xs font-semibold text-white">
                      👁️ Hidden
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
                          : listing.status === "hidden"
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
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

                  {/* Admin Notes */}
                  {listing.admin_notes && (
                    <div className="mt-3 rounded bg-orange-50 p-2 dark:bg-orange-900/20">
                      <p className="text-xs font-semibold text-orange-800 dark:text-orange-400">
                        Hide Reason:
                      </p>
                      <p className="mt-1 text-xs text-orange-700 dark:text-orange-300">
                        {listing.admin_notes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex flex-col gap-2">
                    <a
                      href={`/${locale}/listings/${listing.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-500"
                    >
                      View Listing
                    </a>
                    <a
                      href={`/${locale}/listings/${listing.id}/edit`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-gray-500"
                    >
                      Edit Listing
                    </a>
                    {listing.status !== "hidden" && (
                      <>
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
                          onClick={() => setHideModal(listing)}
                          disabled={loading}
                          className="rounded-md bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-200 disabled:opacity-50 dark:bg-orange-900/20 dark:text-orange-400"
                        >
                          Hide Listing
                        </button>
                      </>
                    )}
                    {listing.status === "hidden" && (
                      <button
                        onClick={() => handleUnhideListing(listing.id)}
                        disabled={loading}
                        className="rounded-md bg-green-100 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-200 disabled:opacity-50 dark:bg-green-900/20 dark:text-green-400"
                      >
                        Unhide Listing
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteListing(listing)}
                      disabled={loading}
                      className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400"
                    >
                      Delete Permanently
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* List View - Add similar structure as grid but in list format */}
      {viewMounted && viewMode === "list" && (
        <div className="space-y-4">
          {filteredListings.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800">
              <p className="text-gray-500 dark:text-gray-400">
                No listings found
              </p>
            </div>
          ) : (
            filteredListings.map((listing: Listing) => (
              <div
                key={listing.id}
                className="flex gap-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800"
              >
                {/* Thumbnail */}
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                  {listing.images && listing.images.length > 0 ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {listing.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            listing.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : listing.status === "hidden"
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                          }`}
                        >
                          {listing.status}
                        </span>
                        {listing.featured && (
                          <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            ⭐ Featured
                          </span>
                        )}
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
                      {listing.admin_notes && (
                        <div className="mt-2 rounded bg-orange-50 p-2 dark:bg-orange-900/20">
                          <p className="text-xs font-semibold text-orange-800 dark:text-orange-400">
                            Hide Reason: {listing.admin_notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="ml-4 flex flex-col gap-2">
                      <a
                        href={`/${locale}/listings/${listing.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whitespace-nowrap rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-500"
                      >
                        View
                      </a>
                      <a
                        href={`/${locale}/listings/${listing.id}/edit`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whitespace-nowrap rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-500"
                      >
                        Edit
                      </a>
                      {listing.status !== "hidden" ? (
                        <>
                          <button
                            onClick={() =>
                              handleToggleFeatured(listing.id, listing.featured)
                            }
                            disabled={loading}
                            className="whitespace-nowrap rounded-md bg-yellow-100 px-3 py-1.5 text-sm font-semibold text-yellow-800 hover:bg-yellow-200 disabled:opacity-50 dark:bg-yellow-900/30 dark:text-yellow-400"
                          >
                            {listing.featured ? "Unfeature" : "Feature"}
                          </button>
                          <button
                            onClick={() => setHideModal(listing)}
                            disabled={loading}
                            className="whitespace-nowrap rounded-md bg-orange-100 px-3 py-1.5 text-sm font-semibold text-orange-700 hover:bg-orange-200 disabled:opacity-50 dark:bg-orange-900/20 dark:text-orange-400"
                          >
                            Hide
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleUnhideListing(listing.id)}
                          disabled={loading}
                          className="whitespace-nowrap rounded-md bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-700 hover:bg-green-200 disabled:opacity-50 dark:bg-green-900/20 dark:text-green-400"
                        >
                          Unhide
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteListing(listing)}
                        disabled={loading}
                        className="whitespace-nowrap rounded-md bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
      {/* Hide Modal */}
      {hideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Hide Listing
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Provide a reason why this listing is being hidden. The user will
              see this message.
            </p>
            <textarea
              value={hideReason}
              onChange={(e) => setHideReason(e.target.value)}
              rows={4}
              placeholder="e.g., 'This listing violates our policy against selling prohibited items' or 'Please provide more detailed photos and description'"
              className="mt-4 w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setHideModal(null);
                  setHideReason("");
                }}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleHideListing}
                disabled={loading || !hideReason.trim()}
                className="flex-1 rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-50"
              >
                {loading ? "Hiding..." : "Hide Listing"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
