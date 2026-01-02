import { UsersAdminClient } from "@/components/admin/users-admin-client";
import { createClient } from "@/lib/supabase/server";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return <UsersAdminClient users={users || []} />;
}
