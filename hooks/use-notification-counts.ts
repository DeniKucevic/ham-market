"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type RealtimeMessage = {
  id: string;
  listing_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean | null;
  created_at: string | null;
};

export function useNotificationCounts(userId: string | undefined) {
  const [counts, setCounts] = useState({
    unreadRatings: 0,
    unratedPurchases: 0,
    unratedSales: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    if (!userId) return;

    const fetchCounts = async () => {
      const supabase = createClient();

      const { count: unreadRatings } = await supabase
        .from("ratings")
        .select("*", { count: "exact", head: true })
        .eq("rated_user_id", userId)
        .is("response", null);

      const { count: unreadMessages } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("recipient_id", userId)
        .eq("read", false);

      const { data: purchases } = await supabase
        .from("listings")
        .select("id, user_id")
        .eq("sold_to", userId)
        .eq("status", "sold");

      let unratedPurchasesCount = 0;
      if (purchases) {
        for (const purchase of purchases) {
          const { count } = await supabase
            .from("ratings")
            .select("*", { count: "exact", head: true })
            .eq("listing_id", purchase.id)
            .eq("rater_user_id", userId)
            .eq("rated_user_id", purchase.user_id);

          if (count === 0) unratedPurchasesCount++;
        }
      }

      const { data: sales } = await supabase
        .from("listings")
        .select("id, sold_to")
        .eq("user_id", userId)
        .eq("status", "sold")
        .not("sold_to", "is", null);

      let unratedSalesCount = 0;
      if (sales) {
        for (const sale of sales) {
          const { count } = await supabase
            .from("ratings")
            .select("*", { count: "exact", head: true })
            .eq("listing_id", sale.id)
            .eq("rater_user_id", userId)
            .eq("rated_user_id", sale.sold_to ?? "");

          if (count === 0) unratedSalesCount++;
        }
      }

      setCounts({
        unreadRatings: unreadRatings || 0,
        unratedPurchases: unratedPurchasesCount,
        unratedSales: unratedSalesCount,
        unreadMessages: unreadMessages || 0,
      });
    };

    fetchCounts();

    // Listen for custom event when messages are read
    const handleMessagesRead = () => {
      fetchCounts();
    };

    window.addEventListener("messages-read", handleMessagesRead);

    // Subscribe to real-time with delay
    const subscribeToRealtime = async () => {
      // Wait 1 second to ensure auth is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const supabase = createClient();
      const channel = supabase
        .channel(`message-notifications-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            const msg = payload.new as RealtimeMessage;

            // Only refetch if it's for this user
            if (msg.recipient_id === userId) {
              fetchCounts();
            }
          }
        )
        .subscribe();

      return channel;
    };

    const channelPromise = subscribeToRealtime();

    return () => {
      window.removeEventListener("messages-read", handleMessagesRead);
      channelPromise.then((channel) => {
        const supabase = createClient();
        supabase.removeChannel(channel);
      });
    };
  }, [userId]);

  return counts;
}
