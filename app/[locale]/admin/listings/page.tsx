import { ListingsAdminClient } from "@/components/admin/listings-admin-client";
import { Database } from "@/types/database";
import { createClient } from "@supabase/supabase-js";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; status?: string }>;
}

const ITEMS_PER_PAGE = 30;

export default async function AdminListingsPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const { page, status } = await searchParams;
  const currentPage = parseInt(page || "1");
  const statusFilter = status || "all";

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

  // Get counts for each status (parallel queries)
  const [
    { count: totalCount },
    { count: activeCount },
    { count: soldCount },
    { count: hiddenCount },
    { count: featuredCount },
  ] = await Promise.all([
    supabaseAdmin.from("listings").select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabaseAdmin
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "sold"),
    supabaseAdmin
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "hidden"),
    supabaseAdmin
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("featured", true),
  ]);

  // Build query with status filter
  let query = supabaseAdmin.from("listings").select(
    `
      *,
      profiles!listings_user_id_fkey(callsign, display_name)
    `,
    { count: "exact" }
  );

  // Apply status filter server-side
  if (statusFilter === "active") {
    query = query.eq("status", "active");
  } else if (statusFilter === "sold") {
    query = query.eq("status", "sold");
  } else if (statusFilter === "hidden") {
    query = query.eq("status", "hidden");
  } else if (statusFilter === "featured") {
    query = query.eq("featured", true);
  }

  query = query.order("created_at", { ascending: false });

  const { count: filteredCount } = await query;
  const totalPages = Math.ceil((filteredCount || 0) / ITEMS_PER_PAGE);

  // Get paginated listings
  const { data: listings } = await query.range(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE - 1
  );

  return (
    <ListingsAdminClient
      listings={listings || []}
      locale={locale}
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={totalCount || 0}
      activeCount={activeCount || 0}
      soldCount={soldCount || 0}
      hiddenCount={hiddenCount || 0}
      featuredCount={featuredCount || 0}
      statusFilter={statusFilter}
    />
  );
}
