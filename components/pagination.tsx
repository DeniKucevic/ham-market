"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Props {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: Props) {
  const t = useTranslations("pagination");
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Link
        href={createPageUrl(currentPage - 1)}
        className={`rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 ${
          currentPage === 1 ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {t("previous")}
      </Link>

      <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
        {t("page")} {currentPage} {t("of")} {totalPages}
      </span>

      <Link
        href={createPageUrl(currentPage + 1)}
        className={`rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 ${
          currentPage === totalPages ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {t("next")}
      </Link>
    </div>
  );
}
