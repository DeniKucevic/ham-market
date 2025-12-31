import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: string }>;
}
export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        {t("subtitle")}
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Contact Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("developer.title")}
            </h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Brixi
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("developer.callsign")}: YU4AIE
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:denikucevic@gmail.com"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  denikucevic@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <a
                  href="https://github.com/DeniKucevic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  github.com/DeniKucevic
                </a>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("project.title")}
            </h2>
            <div className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
              <p>{t("project.description")}</p>
              <p>
                <a
                  href="https://github.com/DeniKucevic/ham-marketplace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {t("project.viewSource")}
                </a>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("support.title")}
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t("support.content")}
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t("quickLinks.title")}
          </h2>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href="#"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {t("quickLinks.reportIssue")}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {t("quickLinks.suggestFeature")}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {t("quickLinks.contribute")}
              </a>
            </li>
          </ul>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {t("beforeContacting.title")}
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• {t("beforeContacting.checkFaq")}</li>
              <li>• {t("beforeContacting.searchIssues")}</li>
              <li>• {t("beforeContacting.readDocs")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
