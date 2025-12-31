import { getTranslations } from "next-intl/server";

export default async function FAQPage() {
  const t = await getTranslations("faqPage");

  const faqs = [
    { q: "q1", a: "a1" },
    { q: "q2", a: "a2" },
    { q: "q3", a: "a3" },
    { q: "q4", a: "a4" },
    { q: "q5", a: "a5" },
    { q: "q6", a: "a6" },
    { q: "q7", a: "a7" },
    { q: "q8", a: "a8" },
    { q: "q9", a: "a9" },
    { q: "q10", a: "a10" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        {t("subtitle")}
      </p>

      <div className="mt-8 space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <summary className="flex cursor-pointer items-center justify-between p-6 text-left">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {t(faq.q)}
              </span>
              <svg
                className="h-5 w-5 text-gray-500 transition-transform group-open:rotate-180"
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
            </summary>
            <div className="border-t border-gray-200 p-6 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">{t(faq.a)}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
