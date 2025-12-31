"use client";

import { ImagePlaceholder } from "@/components/image-placeholder";
import { Pagination } from "@/components/pagination";
import { RateUserButton } from "@/components/rate-user-button";
import type { MyListing } from "@/types/listing";
import { formatPrice } from "@/utils/currency";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface Props {
  purchases: MyListing[];
  userId: string;
  locale: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function MyPurchasesClient({
  purchases,
  userId,
  locale,
  currentPage,
  totalPages,
  totalCount,
}: Props) {
  const t = useTranslations("myPurchases");

  if (!purchases || purchases.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("noPurchases")}
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("startBrowsing")}
        </p>
        <Link
          href={`/${locale}`}
          className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          {t("browseListing")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          {t("showing")} {purchases.length} {t("of")} {totalCount}{" "}
          {t("purchases")}
        </p>
      </div>

      {/* Purchases List */}
      <div className="space-y-4">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="flex gap-4 overflow-hidden rounded-lg bg-white p-4 shadow dark:bg-gray-800"
          >
            {/* Image */}
            <Link
              href={`/${locale}/listings/${purchase.id}`}
              className="flex-shrink-0"
            >
              <div className="h-24 w-24 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                {purchase.images && purchase.images.length > 0 ? (
                  <Image
                    src={purchase.images[0]}
                    alt={purchase.title}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <ImagePlaceholder size="sm" />
                )}
              </div>
            </Link>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <Link
                  href={`/${locale}/listings/${purchase.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                >
                  {purchase.title}
                </Link>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t("soldBy")}{" "}
                    <Link
                      href={`/${locale}/profile/${
                        purchase.profiles?.callsign || purchase.user_id
                      }`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {purchase.profiles?.display_name ||
                        purchase.profiles?.callsign}
                    </Link>
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(purchase.price, purchase.currency || "EUR")}
                </p>
                <div className="flex gap-2">
                  {/* Rate Seller Button */}
                  {purchase.status === "sold" && purchase.user_id && (
                    <RateUserButton
                      listingId={purchase.id}
                      ratedUserId={purchase.user_id} // Rating the seller
                      currentUserId={userId}
                      buttonText={t("rateSeller")}
                    />
                  )}
                  <Link
                    href={`/${locale}/listings/${purchase.id}`}
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500"
                  >
                    {t("viewDetails")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
