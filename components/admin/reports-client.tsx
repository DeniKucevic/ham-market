"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pagination } from "../pagination";

interface Report {
  id: string;
  listing_id: string;
  reporter_id: string | null;
  reason: string;
  description: string | null;
  status: string | null;
  created_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  admin_notes: string | null;
  listing: {
    id: string;
    title: string;
    user_id: string;
  } | null;
  reporter: {
    callsign: string;
    display_name: string | null;
  } | null;
  reviewer: {
    callsign: string;
    display_name: string | null;
  } | null;
}

interface Props {
  reports: Report[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function ReportsClient({
  reports,
  currentPage,
  totalPages,
  totalCount,
}: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "pending" | "reviewed">("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredReports = reports.filter((report: Report) => {
    if (filter === "all") return true;
    if (filter === "pending") return report.status === "pending";
    if (filter === "reviewed") return report.status === "reviewed";
    return true;
  });

  const handleMarkReviewed = async (reportId: string) => {
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("reports")
      .update({
        status: "reviewed",
        reviewed_at: new Date().toISOString(),
        reviewed_by: (await supabase.auth.getUser()).data.user?.id,
        admin_notes: adminNotes || null,
      })
      .eq("id", reportId);

    if (error) {
      alert("Failed to update report");
    } else {
      router.refresh();
      setSelectedReport(null);
      setAdminNotes("");
    }
    setLoading(false);
  };

  const handleDeleteListing = async (listingId: string, reportId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    setLoading(true);
    const supabase = createClient();

    // Get listing to delete images
    const { data: listing } = await supabase
      .from("listings")
      .select("images, user_id")
      .eq("id", listingId)
      .single();

    if (listing) {
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
      await supabase.from("listings").delete().eq("id", listingId);

      // Mark report as reviewed
      await supabase
        .from("reports")
        .update({
          status: "reviewed",
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          admin_notes: "Listing deleted by admin",
        })
        .eq("id", reportId);

      router.refresh();
    }
    setLoading(false);
  };

  const pendingCount = reports.filter(
    (r: Report) => r.status === "pending"
  ).length;
  const reviewedCount = reports.filter(
    (r: Report) => r.status === "reviewed"
  ).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reports Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Showing {reports.length} of {totalCount} total reports (Page{" "}
          {currentPage} of {totalPages})
        </p>
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reports Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Review and handle user-reported listings
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
            All ({reports.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`border-b-2 px-1 py-3 text-sm font-medium ${
              filter === "pending"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("reviewed")}
            className={`border-b-2 px-1 py-3 text-sm font-medium ${
              filter === "reviewed"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            Reviewed ({reviewedCount})
          </button>
        </nav>
      </div>

      {/* Reports list */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">No reports found</p>
          </div>
        ) : (
          filteredReports.map((report: Report) => (
            <div
              key={report.id}
              className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        report.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {report.status}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {report.created_at &&
                        new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">
                    Reason: {report.reason}
                  </h3>

                  {report.listing && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Listing:{" "}
                      <a
                        href={`/en/listings/${report.listing.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {report.listing.title}
                      </a>
                    </p>
                  )}

                  {report.description && (
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      {report.description}
                    </p>
                  )}

                  {report.reporter && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Reported by:{" "}
                      {report.reporter.display_name ||
                        report.reporter.callsign ||
                        "Anonymous"}
                    </p>
                  )}

                  {report.admin_notes && (
                    <div className="mt-3 rounded bg-gray-50 p-3 dark:bg-gray-700">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Admin Notes:
                      </p>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {report.admin_notes}
                      </p>
                    </div>
                  )}

                  {report.reviewed_at && report.reviewer && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Reviewed by:{" "}
                      {report.reviewer.display_name || report.reviewer.callsign}{" "}
                      on {new Date(report.reviewed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {report.status === "pending" && (
                  <div className="ml-4 flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      disabled={loading}
                      className="whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                    >
                      Mark Reviewed
                    </button>
                    {report.listing && (
                      <button
                        onClick={() =>
                          handleDeleteListing(report.listing!.id, report.id)
                        }
                        disabled={loading}
                        className="whitespace-nowrap rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                      >
                        Delete Listing
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        )}
      </div>

      {/* Admin notes modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Mark as Reviewed
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Add optional admin notes before marking this report as reviewed.
            </p>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              placeholder="Admin notes (optional)..."
              className="mt-4 w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setSelectedReport(null);
                  setAdminNotes("");
                }}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleMarkReviewed(selectedReport.id)}
                disabled={loading}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Mark Reviewed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
