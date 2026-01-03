import { headers } from "next/headers";

export async function getCountryFromIP(): Promise<string> {
  try {
    const headersList = await headers();

    // Vercel provides country code in headers
    const country = headersList.get("x-vercel-ip-country");

    if (country && country !== "T1") {
      // T1 is Tor/VPN
      return country;
    }

    // Fallback: Use Cloudflare headers if deployed there
    const cfCountry = headersList.get("cf-ipcountry");
    if (cfCountry && cfCountry !== "XX") {
      return cfCountry;
    }

    return "";
  } catch (error) {
    console.error("Error detecting country:", error);
    return "";
  }
}
