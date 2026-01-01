import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { recipientId, senderName, listingTitle, messagePreview } =
      await req.json();

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get recipient's push subscription
    const { data: subscriptions, error } = await supabaseClient
      .from("push_subscriptions")
      .select("subscription")
      .eq("user_id", recipientId)
      .limit(1);

    if (error || !subscriptions || subscriptions.length === 0) {
      console.log("No push subscription found for user:", recipientId);
      return new Response(
        JSON.stringify({ success: false, message: "No subscription found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subscription = subscriptions[0].subscription;

    // Prepare push notification payload
    const payload = JSON.stringify({
      title: `New message from ${senderName}`,
      body: `${listingTitle}: ${messagePreview}`,
      url: `${Deno.env.get("NEXT_PUBLIC_APP_URL")}/messages`,
    });

    // Send push notification using Web Push protocol
    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");
    const vapidSubject = Deno.env.get("VAPID_SUBJECT");

    // Import web-push for Deno
    const webpush = await import("npm:web-push@3.6.7");

    webpush.setVapidDetails(vapidSubject!, vapidPublicKey!, vapidPrivateKey!);

    await webpush.sendNotification(subscription, payload);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending push notification:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
