import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        {t("title")}
      </h1>

      <div className="mt-8 space-y-6 text-gray-600 dark:text-gray-400">
        <p className="text-lg">{t("intro")}</p>

        <h2 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
          {t("mission.title")}
        </h2>
        <p>{t("mission.content")}</p>

        <h2 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
          {t("features.title")}
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>{t("features.free")}</li>
          <li>{t("features.openSource")}</li>
          <li>{t("features.multilingual")}</li>
          <li>{t("features.ratings")}</li>
          <li>{t("features.community")}</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
          {t("developer.title")}
        </h2>
        <p>{t("developer.content")}</p>
        <p>
          <strong>{t("developer.callsign")}</strong> YU4AIE
        </p>
        <p>
          <strong>{t("developer.github")}</strong>{" "}
          <a
            href="https://github.com/DeniKucevic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            github.com/DeniKucevic
          </a>
        </p>

        <div className="mt-8 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("getStarted.title")}
          </h3>
          <p className="mt-2">{t("getStarted.content")}</p>
          <Link
            href={`/${locale}/sign-up`}
            className="mt-4 inline-block rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
          >
            {t("getStarted.button")}
          </Link>
        </div>
      </div>
    </div>
  );
}
