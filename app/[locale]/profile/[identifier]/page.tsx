import { createClient } from "@/lib/supabase/server";
import { BrowseListing } from "@/types/listing";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicProfileClient } from "./public-profile-client";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { identifier, locale } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("callsign, display_name, rating, total_sales, location_country")
    .eq("id", identifier)
    .single();

  if (!profile) {
    return { title: "Profile Not Found" };
  }

  const name = profile.display_name || profile.callsign || "User";
  const title = `${name} - HAM Radio Marketplace`;
  const description = `${name}'s profile on HAM Radio Marketplace. Rating: ${
    profile.rating || 0
  }/5, Total sales: ${profile.total_sales || 0}. ${
    profile.location_country || ""
  }`;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
  };
}

interface Props {
  params: Promise<{ identifier: string; locale: string }>;
}

export default async function PublicProfilePage({ params }: Props) {
  const { locale, identifier } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: currentUserProfile } = user
    ? await supabase.from("profiles").select("*").eq("id", user.id).single()
    : { data: null };

  let profile = null;

  const isUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      identifier
    );

  if (!isUUID) {
    const { data: profileByCallsign } = await supabase
      .from("profiles")
      .select("*")
      .eq("callsign", identifier)
      .single();

    if (profileByCallsign) {
      profile = profileByCallsign;
    }
  }

  if (!profile) {
    const { data: profileById } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", identifier)
      .single();

    profile = profileById;
  }

  if (!profile) {
    notFound();
  }

  const { data: listings } = await supabase
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
    `
    )
    .eq("user_id", profile.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicProfileClient
        profile={profile}
        listings={listings as BrowseListing[]}
        isLoggedIn={!!user}
        isOwnProfile={user?.id === profile.id}
        locale={locale}
      />
    </div>
  );
}
