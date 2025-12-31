import { MyPurchasesClient } from "@/components/my-purchases-client";
import { createClient } from "@/lib/supabase/server";
import type { MyListing } from "@/types/listing";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

const ITEMS_PER_PAGE = 12;

interface SearchParams {
  page?: string;
}

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function MyPurchasesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const searchParamsResolved = await searchParams;
  const t = await getTranslations({ locale, namespace: "myPurchases" });

  const page = parseInt(searchParamsResolved.page || "1");
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch items user BOUGHT with pagination
  const query = supabase
    .from("listings")
    .select(
      `
      *,
      profiles!listings_user_id_fkey (
        callsign,
        display_name,
        location_city,
        location_country
      )
    `,
      { count: "exact" }
    )
    .eq("sold_to", user.id)
    .order("created_at", { ascending: false });

  const { count } = await query;
  const { data: purchases } = await query.range(
    offset,
    offset + ITEMS_PER_PAGE - 1
  );

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("itemsYouBought")}
          </p>
        </div>
        <MyPurchasesClient
          purchases={purchases as MyListing[]}
          userId={user.id}
          locale={locale}
          currentPage={page}
          totalPages={totalPages}
          totalCount={count || 0}
        />
      </main>
    </div>
  );
}
