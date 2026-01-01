"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

interface Props {
  locale: string;
}

export function CreateListingBanner({ locale }: Props) {
  const t = useTranslations("banner");
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 text-center text-white">
      <p className="pr-8 text-sm md:text-base">
        📻 {t("gotGear")}{" "}
        <Link
          href={`/${locale}/sign-in`}
          className="inline-block font-semibold underline hover:text-green-100"
        >
          <span className="whitespace-nowrap">{t("signInToSell")} →</span>
        </Link>
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-green-800/50"
        aria-label="Dismiss"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
