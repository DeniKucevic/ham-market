import { getTranslations } from "next-intl/server";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "termsPage" });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        {t("title")}
      </h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {t("lastUpdated")}: {new Date().toLocaleDateString()}
      </p>

      <div className="mt-8 space-y-6 text-gray-600 dark:text-gray-400">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            1. {t("acceptance.title")}
          </h2>
          <p className="mt-2">{t("acceptance.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            2. {t("eligibility.title")}
          </h2>
          <p className="mt-2">{t("eligibility.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            3. {t("userAccounts.title")}
          </h2>
          <p className="mt-2">{t("userAccounts.content")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>{t("userAccounts.responsibility1")}</li>
            <li>{t("userAccounts.responsibility2")}</li>
            <li>{t("userAccounts.responsibility3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            4. {t("listings.title")}
          </h2>
          <p className="mt-2">{t("listings.content")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>{t("listings.rule1")}</li>
            <li>{t("listings.rule2")}</li>
            <li>{t("listings.rule3")}</li>
            <li>{t("listings.rule4")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            5. {t("transactions.title")}
          </h2>
          <p className="mt-2">{t("transactions.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            6. {t("prohibitedConduct.title")}
          </h2>
          <p className="mt-2">{t("prohibitedConduct.intro")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>{t("prohibitedConduct.item1")}</li>
            <li>{t("prohibitedConduct.item2")}</li>
            <li>{t("prohibitedConduct.item3")}</li>
            <li>{t("prohibitedConduct.item4")}</li>
            <li>{t("prohibitedConduct.item5")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            7. {t("intellectualProperty.title")}
          </h2>
          <p className="mt-2">{t("intellectualProperty.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            8. {t("disclaimer.title")}
          </h2>
          <p className="mt-2">{t("disclaimer.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            9. {t("limitation.title")}
          </h2>
          <p className="mt-2">{t("limitation.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            10. {t("termination.title")}
          </h2>
          <p className="mt-2">{t("termination.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            11. {t("changes.title")}
          </h2>
          <p className="mt-2">{t("changes.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            12. {t("contact.title")}
          </h2>
          <p className="mt-2">{t("contact.content")}</p>
        </section>
      </div>
    </div>
  );
}
