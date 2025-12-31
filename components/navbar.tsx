"use client";

import { useNotificationCounts } from "@/hooks/use-notification-counts";
import { getDisplayName } from "@/lib/display-name";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

interface Props {
  user?: {
    id: string;
    email?: string;
  } | null;
  profile?: {
    callsign: string;
    display_name: string | null;
  } | null;
  locale: string;
}

export function Navbar({ user, profile, locale }: Props) {
  const counts = useNotificationCounts(user?.id);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("nav");

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
    router.push(`/${locale}`);
    router.refresh();
  };

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            HAM Marketplace
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden nav:flex nav:items-center nav:gap-8">
            {user && (
              <div className="flex gap-6">
                <Link
                  href={`/${locale}/my-listings`}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  {counts.unratedSales > 0 && (
                    <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {counts.unratedSales}
                    </span>
                  )}
                  {t("myListings")}
                </Link>
                <Link
                  href={`/${locale}/my-purchases`}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  {counts.unratedPurchases > 0 && (
                    <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {counts.unratedPurchases}
                    </span>
                  )}
                  {t("myPurchases")}
                </Link>
                <Link
                  href={`/${locale}/messages`}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  {counts.unreadMessages > 0 && (
                    <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {counts.unreadMessages}
                    </span>
                  )}
                  {t("messages")}
                </Link>
              </div>
            )}
            <div className="flex items-center gap-4">
              {user && (
                <>
                  <Link
                    href={`/${locale}/listings/new`}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    {t("createListing")}
                  </Link>
                  <ThemeToggle />
                  <LanguageSwitcher currentLocale={locale} />

                  {/* User Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <span>
                        {getDisplayName(
                          profile ?? null,
                          user.email?.split("@")[0]
                        )}
                      </span>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {dropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setDropdownOpen(false)}
                        />
                        <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
                          <Link
                            href={`/${locale}/profile/${
                              profile?.callsign || user.id
                            }`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            onClick={() => setDropdownOpen(false)}
                          >
                            {t("viewProfile")}
                          </Link>
                          <Link
                            href={`/${locale}/settings`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            onClick={() => setDropdownOpen(false)}
                          >
                            {t("settings")}
                          </Link>
                          <hr className="my-1 border-gray-200 dark:border-gray-700" />
                          <button
                            onClick={handleSignOut}
                            type="button"
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            {t("signOut")}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {!user && (
                <>
                  <ThemeToggle />
                  <LanguageSwitcher currentLocale={locale} />
                  <Link
                    href={`/${locale}/sign-in`}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    {t("signIn")}
                  </Link>
                </>
              )}
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center gap-2 nav:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? (
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="nav:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {user ? (
              <>
                <div className="border-b border-gray-200 pb-2 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {getDisplayName(profile ?? null, user.email?.split("@")[0])}
                  </p>
                </div>
                <Link
                  href={`/${locale}/my-listings`}
                  className="relative block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    {t("myListings")}
                    {counts.unratedSales > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {counts.unratedSales}
                      </span>
                    )}
                  </span>
                </Link>
                <Link
                  href={`/${locale}/my-purchases`}
                  className="relative block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    {t("myPurchases")}
                    {counts.unratedPurchases > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {counts.unratedPurchases}
                      </span>
                    )}
                  </span>
                </Link>
                <Link
                  href={`/${locale}/messages`}
                  className="relative block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    {t("messages")}
                    {counts.unreadMessages > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {counts.unreadMessages}
                      </span>
                    )}
                  </span>
                </Link>
                <Link
                  href={`/${locale}/listings/new`}
                  className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("createListing")}
                </Link>
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                <Link
                  href={`/${locale}/profile/${profile?.callsign || user.id}`}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("viewProfile")}
                </Link>
                <Link
                  href={`/${locale}/settings`}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("settings")}
                </Link>
                <div className="px-3 py-2">
                  <LanguageSwitcher currentLocale={locale} />
                </div>
                <button
                  onClick={handleSignOut}
                  className="block w-full px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {t("signOut")}
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/${locale}/sign-in`}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("signIn")}
                </Link>
                <div className="px-3 py-2">
                  <LanguageSwitcher currentLocale={locale} />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
