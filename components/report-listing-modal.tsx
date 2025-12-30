"use client";

import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
}

export function ReportListingModal({
  isOpen,
  onClose,
  listingId,
  listingTitle,
}: Props) {
  const t = useTranslations("reportListing");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const REPORT_REASONS = [
    { value: "spam", label: t("spam") },
    { value: "inappropriate", label: t("inappropriate") },
    { value: "duplicate", label: t("duplicate") },
    { value: "wrong_category", label: t("wrongCategory") },
    { value: "already_sold", label: t("alreadySold") },
    { value: "other", label: t("other") },
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert(t("mustBeSignedIn"));
        return;
      }

      const { error } = await supabase.from("reports").insert({
        listing_id: listingId,
        reporter_id: user.id,
        reason,
        description: description || null,
      });

      if (error) throw error;

      alert(t("successMessage"));
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Report error:", error);
      alert(t("errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all dark:bg-gray-800">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("title")}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {listingTitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("reasonRequired")}
              </label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{t("selectReason")}</option>
                {REPORT_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("detailsLabel")}
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={500}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder={t("detailsPlaceholder")}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={loading || !reason}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >
                {loading ? t("submitting") : t("submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
