import { ListingsAdminClient } from "@/components/admin/listings-admin-client";
import { Database } from "@/types/database";
import { createClient } from "@supabase/supabase-js";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

const ITEMS_PER_PAGE = 5;

export default async function AdminListingsPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");

  // Use service role to bypass RLS and see ALL listings
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // Get total count
  const { count } = await supabaseAdmin
    .from("listings")
    .select("*", { count: "exact", head: true });

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  // Get paginated listings
  const { data: listings } = await supabaseAdmin
    .from("listings")
    .select(
      `
      *,
      profiles!listings_user_id_fkey(callsign, display_name)
    `
    )
    .order("created_at", { ascending: false })
    .range(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE - 1
    );

  return (
    <div>
      <ListingsAdminClient
        listings={listings || []}
        locale={locale}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={count || 0}
      />
    </div>
  );
}
