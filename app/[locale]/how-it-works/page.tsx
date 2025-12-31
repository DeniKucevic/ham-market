import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("howItWorksPage");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        {t("title")}
      </h1>

      <div className="mt-8 space-y-8">
        {/* For Sellers */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("sellers.title")}
          </h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  1
                </span>
                {t("sellers.step1.title")}
              </h3>
              <p className="ml-10 mt-2 text-gray-600 dark:text-gray-400">
                {t("sellers.step1.content")}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  2
                </span>
                {t("sellers.step2.title")}
              </h3>
              <p className="ml-10 mt-2 text-gray-600 dark:text-gray-400">
                {t("sellers.step2.content")}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  3
                </span>
                {t("sellers.step3.title")}
              </h3>
              <p className="ml-10 mt-2 text-gray-600 dark:text-gray-400">
                {t("sellers.step3.content")}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  4
                </span>
                {t("sellers.step4.title")}
              </h3>
              <p className="ml-10 mt-2 text-gray-600 dark:text-gray-400">
                {t("sellers.step4.content")}
              </p>
            </div>
          </div>
        </section>

        {/* For Buyers */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("buyers.title")}
          </h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                  1
                </span>
                {t("buyers.step1.title")}
              </h3>
              <p className="ml-10 mt-2 text-gray-600 dark:text-gray-400">
                {t("buyers.step1.content")}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                  2
                </span>
                {t("buyers.step2.title")}
              </h3>
              <p className="ml-10 mt-2 text-gray-600 dark:text-gray-400">
                {t("buyers.step2.content")}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                  3
                </span>
                {t("buyers.step3.title")}
              </h3>
              <p className="ml-10 mt-2 text-gray-600 dark:text-gray-400">
                {t("buyers.step3.content")}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                  4
                </span>
                {t("buyers.step4.title")}
              </h3>
              <p className="ml-10 mt-2 text-gray-600 dark:text-gray-400">
                {t("buyers.step4.content")}
              </p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="rounded-lg bg-yellow-50 p-6 dark:bg-yellow-900/20">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("tips.title")}
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400">
            <li>{t("tips.tip1")}</li>
            <li>{t("tips.tip2")}</li>
            <li>{t("tips.tip3")}</li>
            <li>{t("tips.tip4")}</li>
            <li>{t("tips.tip5")}</li>
          </ul>
        </section>

        <div className="text-center">
          <Link
            href={`/${locale}`}
            className="inline-block rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
          >
            {t("startBrowsing")}
          </Link>
        </div>
      </div>
    </div>
  );
}
