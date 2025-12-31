import { getTranslations } from "next-intl/server";

export default async function CommunityGuidelinesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guidelinesPage" });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        {t("subtitle")}
      </p>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("respect.title")}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("respect.content")}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600 dark:text-gray-400">
            <li>{t("respect.rule1")}</li>
            <li>{t("respect.rule2")}</li>
            <li>{t("respect.rule3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("honesty.title")}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("honesty.content")}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600 dark:text-gray-400">
            <li>{t("honesty.rule1")}</li>
            <li>{t("honesty.rule2")}</li>
            <li>{t("honesty.rule3")}</li>
            <li>{t("honesty.rule4")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("safety.title")}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("safety.content")}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600 dark:text-gray-400">
            <li>{t("safety.rule1")}</li>
            <li>{t("safety.rule2")}</li>
            <li>{t("safety.rule3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("communication.title")}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("communication.content")}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600 dark:text-gray-400">
            <li>{t("communication.rule1")}</li>
            <li>{t("communication.rule2")}</li>
            <li>{t("communication.rule3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("prohibited.title")}
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600 dark:text-gray-400">
            <li>{t("prohibited.item1")}</li>
            <li>{t("prohibited.item2")}</li>
            <li>{t("prohibited.item3")}</li>
            <li>{t("prohibited.item4")}</li>
            <li>{t("prohibited.item5")}</li>
            <li>{t("prohibited.item6")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("reporting.title")}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("reporting.content")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("consequences.title")}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("consequences.content")}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600 dark:text-gray-400">
            <li>{t("consequences.action1")}</li>
            <li>{t("consequences.action2")}</li>
            <li>{t("consequences.action3")}</li>
          </ul>
        </section>

        <section className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("spirit.title")}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("spirit.content")}
          </p>
        </section>
      </div>
    </div>
  );
}
