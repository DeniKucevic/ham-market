import { createClient } from "@/lib/supabase/server";

// Cache for exchange rates
let cachedRates: {
  eurToRsd: number;
  usdToEur: number;
  gbpToEur: number;
} | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

export type ExchangeRates = {
  eurToRsd: number;
  usdToEur: number;
  gbpToEur: number;
};

/**
 * Fetch exchange rates from database (server-side only)
 */
export async function getExchangeRates(): Promise<ExchangeRates> {
  const now = Date.now();

  // Return cached rates if still valid
  if (cachedRates && now - lastFetch < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    const supabase = await createClient();

    const { data: rates } = await supabase
      .from("app_settings")
      .select("key, value")
      .in("key", ["eur_to_rsd_rate", "usd_to_eur_rate", "gbp_to_eur_rate"]);

    const ratesMap =
      rates?.reduce((acc, { key, value }) => {
        acc[key] = Number(value);
        return acc;
      }, {} as Record<string, number>) || {};

    cachedRates = {
      eurToRsd: ratesMap["eur_to_rsd_rate"] || 117.0,
      usdToEur: ratesMap["usd_to_eur_rate"] || 0.92,
      gbpToEur: ratesMap["gbp_to_eur_rate"] || 1.2,
    };
    lastFetch = now;

    return cachedRates;
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    return { eurToRsd: 117.0, usdToEur: 0.92, gbpToEur: 1.2 };
  }
}

/**
 * Legacy function for backward compatibility
 */
export async function getExchangeRate(): Promise<number> {
  const { eurToRsd } = await getExchangeRates();
  return eurToRsd;
}

/**
 * Normalize any price to EUR for consistent sorting/comparison
 */
export function normalizeToEur(
  price: number,
  currency: "EUR" | "RSD" | "USD" | "GBP",
  rates: ExchangeRates
): number {
  if (currency === "EUR") return price;
  if (currency === "RSD") return price / rates.eurToRsd;
  if (currency === "USD") return price * rates.usdToEur;
  if (currency === "GBP") return price * rates.gbpToEur;
  return price;
}
