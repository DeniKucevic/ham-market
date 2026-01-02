import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Get stats
  const [
    { count: totalUsers },
    { count: totalListings },
    { count: activeListings },
    { count: pendingReports },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("listings").select("*", { count: "exact", head: true }),
    supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const stats = [
    { name: "Total Users", value: totalUsers || 0, color: "blue" },
    { name: "Total Listings", value: totalListings || 0, color: "green" },
    { name: "Active Listings", value: activeListings || 0, color: "purple" },
    { name: "Pending Reports", value: pendingReports || 0, color: "red" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Overview of your marketplace
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <a
            href="./admin/reports"
            className="block rounded-lg bg-white p-6 shadow hover:shadow-md dark:bg-gray-800"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Review Reports
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Handle user-reported listings
            </p>
          </a>
          <a
            href="./admin/listings"
            className="block rounded-lg bg-white p-6 shadow hover:shadow-md dark:bg-gray-800"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Moderate Listings
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Delete spam or featured listings
            </p>
          </a>
          <a
            href="./admin/users"
            className="block rounded-lg bg-white p-6 shadow hover:shadow-md dark:bg-gray-800"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Manage Users
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              View and moderate user accounts
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
