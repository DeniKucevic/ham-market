import { ReportsClient } from "@/components/admin/reports-client";
import { createClient } from "@/lib/supabase/server";

export default async function AdminReportsPage() {
  const supabase = await createClient();

  const { data: reports } = await supabase
    .from("reports")
    .select(
      `
      *,
      listing:listings(id, title, user_id),
      reporter:profiles!reports_reporter_id_fkey(callsign, display_name),
      reviewer:profiles!reports_reviewed_by_fkey(callsign, display_name)
    `
    )
    .order("created_at", { ascending: false });

  return <ReportsClient reports={reports || []} />;
}
