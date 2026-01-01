"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

interface Props {
  locale: string;
}

export function CreateListingFAB({ locale }: Props) {
  const t = useTranslations("nav");

  return (
    <Link
      href={`/${locale}/listings/new`}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-500 md:h-auto md:w-auto md:gap-2 md:px-6 md:py-3"
      title={t("createListing")}
    >
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span className="hidden md:inline font-semibold">
        {t("createListing")}
      </span>
    </Link>
  );
}
