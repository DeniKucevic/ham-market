// lib/geolocation.ts
import { headers } from "next/headers";

export type GeoData = {
  country: string;
  currency: "EUR" | "USD" | "GBP" | "RSD";
};

// Map countries to their primary currencies
const COUNTRY_CURRENCY_MAP: Record<string, "EUR" | "USD" | "GBP" | "RSD"> = {
  // Europe (EUR) - Including ALL European countries
  AT: "EUR",
  BE: "EUR",
  BG: "EUR",
  HR: "EUR",
  CY: "EUR",
  CZ: "EUR",
  DK: "EUR",
  EE: "EUR",
  FI: "EUR",
  FR: "EUR",
  DE: "EUR",
  GR: "EUR",
  HU: "EUR",
  IE: "EUR",
  IT: "EUR",
  LV: "EUR",
  LT: "EUR",
  LU: "EUR",
  MT: "EUR",
  NL: "EUR",
  PL: "EUR",
  PT: "EUR",
  RO: "EUR",
  SK: "EUR",
  SI: "EUR",
  ES: "EUR",
  SE: "EUR",
  IS: "EUR",
  NO: "EUR",
  CH: "EUR",

  // Serbia and Balkans (EUR as default, but RSD available in dropdown)
  RS: "EUR",
  BA: "EUR",
  ME: "EUR",
  MK: "EUR",
  AL: "EUR",
  XK: "EUR",

  // UK (GBP)
  GB: "GBP",

  // US and territories (USD)
  US: "USD",
  CA: "USD",
  MX: "USD",
  AU: "USD",
  NZ: "USD",
};

export async function getGeoData(): Promise<GeoData> {
  try {
    const headersList = await headers();

    // Check Vercel headers
    let country = headersList.get("x-vercel-ip-country");

    if (!country || country === "T1") {
      // Check Cloudflare headers
      country = headersList.get("cf-ipcountry");
    }

    // Local development fallback
    if (
      (!country || country === "XX") &&
      process.env.NODE_ENV === "development"
    ) {
      country = "RS"; // Default for testing
    }

    const validCountry =
      country && country !== "T1" && country !== "XX" ? country : "";
    const currency = validCountry
      ? COUNTRY_CURRENCY_MAP[validCountry] || "EUR"
      : "EUR";

    return {
      country: validCountry,
      currency,
    };
  } catch (error) {
    console.error("Error detecting geo data:", error);
    return { country: "", currency: "EUR" };
  }
}

// Legacy function for backward compatibility
export async function getCountryFromIP(): Promise<string> {
  const { country } = await getGeoData();
  return country;
}
