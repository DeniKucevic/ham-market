import { MessagesClient } from "@/components/messages-client";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function MessagesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ listing?: string; recipient?: string }>;
}) {
  const { locale } = await params;
  const { listing, recipient } = await searchParams;
  const t = await getTranslations({ locale, namespace: "messages" });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h1>
        <MessagesClient
          userId={user.id}
          locale={locale}
          initialListingId={listing}
          initialRecipientId={recipient}
        />
      </main>
    </div>
  );
}
