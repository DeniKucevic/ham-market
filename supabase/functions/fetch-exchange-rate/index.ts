import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

serve(async (req) => {
  try {
    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch exchange rate from free API
    // Using exchangerate-api.com (free, no API key needed for basic use)
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/EUR"
    );

    if (!response.ok) {
      throw new Error(`Exchange rate API returned ${response.status}`);
    }

    const data = await response.json();
    const eurToRsd = data.rates.RSD;

    // Update the rate in database
    const { error } = await supabaseClient.from("app_settings").upsert(
      {
        key: "eur_to_rsd_rate",
        value: eurToRsd,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "key",
      }
    );

    if (error) {
      console.error("Database update error:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        rate: eurToRsd,
        updated_at: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
