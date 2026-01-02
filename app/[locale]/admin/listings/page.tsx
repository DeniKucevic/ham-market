import { ListingsAdminClient } from "@/components/admin/listings-admin-client";
import { createClient } from "@/lib/supabase/server";

export default async function AdminListingsPage() {
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from("listings")
    .select(
      `
      *,
      profiles!listings_user_id_fkey(callsign, display_name)
    `
    )
    .order("created_at", { ascending: false });

  return <ListingsAdminClient listings={listings || []} />;
}
