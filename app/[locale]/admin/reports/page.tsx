import { ReportsClient } from "@/components/admin/reports-client";
import { Database } from "@/types/database";
import { createClient } from "@supabase/supabase-js";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

const ITEMS_PER_PAGE = 5;

export default async function AdminReportsPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");

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
    .from("reports")
    .select("*", { count: "exact", head: true });

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  // Get paginated reports
  const { data: reports } = await supabaseAdmin
    .from("reports")
    .select(
      `
      *,
      listing:listings(id, title, user_id),
      reporter:profiles!reports_reporter_id_fkey(callsign, display_name),
      reviewer:profiles!reports_reviewed_by_fkey(callsign, display_name)
    `
    )
    .order("created_at", { ascending: false })
    .range(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE - 1
    );

  return (
    <ReportsClient
      reports={reports || []}
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={count || 0}
    />
  );
}
