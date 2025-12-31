import { createClient } from "@/lib/supabase/server";

// Cache for exchange rate
let cachedRate: number | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

/**
 * Fetch the current EUR to RSD exchange rate from database (server-side only)
 * Cached for 24 hours to minimize DB calls
 */
export async function getExchangeRate(): Promise<number> {
  const now = Date.now();

  // Return cached rate if still valid
  if (cachedRate && now - lastFetch < CACHE_DURATION) {
    return cachedRate;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "eur_to_rsd_rate")
      .single();

    if (error) throw error;

    cachedRate = Number(data.value);
    lastFetch = now;
    return cachedRate;
  } catch (error) {
    console.error("Failed to fetch exchange rate:", error);
    // Fallback to approximate rate
    return 117.0;
  }
}

/**
 * Normalize any price to EUR for consistent sorting
 */
export function normalizeToEur(
  price: number,
  currency: "EUR" | "RSD",
  rate: number
): number {
  return currency === "EUR" ? price : price / rate;
}
