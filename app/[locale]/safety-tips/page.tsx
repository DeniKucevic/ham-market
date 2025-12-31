import { getTranslations } from "next-intl/server";

export default async function SafetyTipsPage() {
  const t = await getTranslations("safetyTipsPage");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        {t("subtitle")}
      </p>

      <div className="mt-8 space-y-8">
        {/* For Buyers */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("buyers.title")}
          </h2>
          <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex gap-3">
              <span className="text-green-600">✓</span>
              <span>{t("buyers.tip1")}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600">✓</span>
              <span>{t("buyers.tip2")}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600">✓</span>
              <span>{t("buyers.tip3")}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600">✓</span>
              <span>{t("buyers.tip4")}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600">✓</span>
              <span>{t("buyers.tip5")}</span>
            </li>
          </ul>
        </section>

        {/* For Sellers */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("sellers.title")}
          </h2>
          <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex gap-3">
              <span className="text-green-600">✓</span>
              <span>{t("sellers.tip1")}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600">✓</span>
              <span>{t("sellers.tip2")}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600">✓</span>
              <span>{t("sellers.tip3")}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600">✓</span>
              <span>{t("sellers.tip4")}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600">✓</span>
              <span>{t("sellers.tip5")}</span>
            </li>
          </ul>
        </section>

        {/* Red Flags */}
        <section className="rounded-lg bg-red-50 p-6 dark:bg-red-900/20">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("redFlags.title")}
          </h2>
          <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex gap-3">
              <span className="text-red-600">⚠</span>
              <span>{t("redFlags.flag1")}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-600">⚠</span>
              <span>{t("redFlags.flag2")}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-600">⚠</span>
              <span>{t("redFlags.flag3")}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-600">⚠</span>
              <span>{t("redFlags.flag4")}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-600">⚠</span>
              <span>{t("redFlags.flag5")}</span>
            </li>
          </ul>
        </section>

        {/* General Tips */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("general.title")}
          </h2>
          <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex gap-3">
              <span className="text-blue-600">ℹ</span>
              <span>{t("general.tip1")}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600">ℹ</span>
              <span>{t("general.tip2")}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600">ℹ</span>
              <span>{t("general.tip3")}</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}