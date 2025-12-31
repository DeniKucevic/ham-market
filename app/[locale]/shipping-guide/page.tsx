import { getTranslations } from "next-intl/server";

export default async function ShippingGuidePage() {
  const t = await getTranslations("shippingGuidePage");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        {t("subtitle")}
      </p>

      <div className="mt-8 space-y-8">
        {/* For Sellers */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("sellers.title")}
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("sellers.packaging.title")}
              </h3>
              <ul className="mt-2 space-y-2 text-gray-600 dark:text-gray-400">
                <li>• {t("sellers.packaging.tip1")}</li>
                <li>• {t("sellers.packaging.tip2")}</li>
                <li>• {t("sellers.packaging.tip3")}</li>
                <li>• {t("sellers.packaging.tip4")}</li>
                <li>• {t("sellers.packaging.tip5")}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("sellers.documentation.title")}
              </h3>
              <ul className="mt-2 space-y-2 text-gray-600 dark:text-gray-400">
                <li>• {t("sellers.documentation.tip1")}</li>
                <li>• {t("sellers.documentation.tip2")}</li>
                <li>• {t("sellers.documentation.tip3")}</li>
                <li>• {t("sellers.documentation.tip4")}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("sellers.insurance.title")}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t("sellers.insurance.content")}
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
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("buyers.receiving.title")}
              </h3>
              <ul className="mt-2 space-y-2 text-gray-600 dark:text-gray-400">
                <li>• {t("buyers.receiving.tip1")}</li>
                <li>• {t("buyers.receiving.tip2")}</li>
                <li>• {t("buyers.receiving.tip3")}</li>
                <li>• {t("buyers.receiving.tip4")}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("buyers.inspection.title")}
              </h3>
              <ul className="mt-2 space-y-2 text-gray-600 dark:text-gray-400">
                <li>• {t("buyers.inspection.tip1")}</li>
                <li>• {t("buyers.inspection.tip2")}</li>
                <li>• {t("buyers.inspection.tip3")}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* International Shipping */}
        <section className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("international.title")}
          </h2>
          <div className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
            <p>
              <strong>{t("international.customs.title")}:</strong>{" "}
              {t("international.customs.content")}
            </p>
            <p>
              <strong>{t("international.vat.title")}:</strong>{" "}
              {t("international.vat.content")}
            </p>
            <p>
              <strong>{t("international.regulations.title")}:</strong>{" "}
              {t("international.regulations.content")}
            </p>
          </div>
        </section>

        {/* Recommended Carriers */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("carriers.title")}
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t("carriers.intro")}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t("carriers.national")}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {t("carriers.nationalDesc")}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t("carriers.international")}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {t("carriers.internationalDesc")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
