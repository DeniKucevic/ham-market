import { getTranslations } from "next-intl/server";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPage" });

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
            1. {t("introduction.title")}
          </h2>
          <p className="mt-2">{t("introduction.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            2. {t("dataCollection.title")}
          </h2>
          <p className="mt-2">{t("dataCollection.intro")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              <strong>{t("dataCollection.account.title")}:</strong>{" "}
              {t("dataCollection.account.items")}
            </li>
            <li>
              <strong>{t("dataCollection.profile.title")}:</strong>{" "}
              {t("dataCollection.profile.items")}
            </li>
            <li>
              <strong>{t("dataCollection.listings.title")}:</strong>{" "}
              {t("dataCollection.listings.items")}
            </li>
            <li>
              <strong>{t("dataCollection.usage.title")}:</strong>{" "}
              {t("dataCollection.usage.items")}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            3. {t("dataUse.title")}
          </h2>
          <p className="mt-2">{t("dataUse.intro")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>{t("dataUse.purpose1")}</li>
            <li>{t("dataUse.purpose2")}</li>
            <li>{t("dataUse.purpose3")}</li>
            <li>{t("dataUse.purpose4")}</li>
            <li>{t("dataUse.purpose5")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            4. {t("dataSharing.title")}
          </h2>
          <p className="mt-2">{t("dataSharing.content")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>{t("dataSharing.case1")}</li>
            <li>{t("dataSharing.case2")}</li>
            <li>{t("dataSharing.case3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            5. {t("dataSecurity.title")}
          </h2>
          <p className="mt-2">{t("dataSecurity.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            6. {t("cookies.title")}
          </h2>
          <p className="mt-2">{t("cookies.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            7. {t("userRights.title")}
          </h2>
          <p className="mt-2">{t("userRights.intro")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>{t("userRights.right1")}</li>
            <li>{t("userRights.right2")}</li>
            <li>{t("userRights.right3")}</li>
            <li>{t("userRights.right4")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            8. {t("retention.title")}
          </h2>
          <p className="mt-2">{t("retention.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            9. {t("children.title")}
          </h2>
          <p className="mt-2">{t("children.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            10. {t("changes.title")}
          </h2>
          <p className="mt-2">{t("changes.content")}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            11. {t("contact.title")}
          </h2>
          <p className="mt-2">{t("contact.content")}</p>
        </section>
      </div>
    </div>
  );
}
