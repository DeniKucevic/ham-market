import { locales } from "@/i18n";
import { createClient } from "@/lib/supabase/server";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://hamtrade.net";
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from("listings")
    .select("id, updated_at")
    .eq("status", "active");

  const staticPages: MetadataRoute.Sitemap = [];
  const listingPages: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    staticPages.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });

    listings?.forEach((listing) => {
      listingPages.push({
        url: `${baseUrl}/${locale}/listings/${listing.id}`,
        lastModified: new Date(listing.updated_at ?? ""),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    });
  });

  return [...staticPages, ...listingPages];
}
