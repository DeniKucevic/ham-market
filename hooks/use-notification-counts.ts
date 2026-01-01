"use client";

import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database";
import { useEffect, useState } from "react";

type RealtimeMessage = {
  id: string;
  recipient_id: string;
  read: boolean;
};

export function useNotificationCounts(userId: string | undefined) {
  const [counts, setCounts] = useState({
    unreadMessages: 0,
  });

  const fetchCounts = async () => {
    if (!userId) return;

    const supabase = createClient();

    const { count: unreadMessages } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", userId)
      .eq("read", false);

    setCounts({
      unreadMessages: unreadMessages || 0,
    });

    if ("setAppBadge" in navigator) {
      if (unreadMessages && unreadMessages > 0) {
        navigator.setAppBadge(unreadMessages);
      } else {
        navigator.clearAppBadge();
      }
    }
  };

  // Request notification permission and subscribe to push
  const setupPushNotifications = async () => {
    if (!userId) return;

    // Check if notifications are supported
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return;
    }

    // Check if already granted
    if (Notification.permission === "granted") {
      await subscribeToPush();
      return;
    }

    // Don't ask if already denied
    if (Notification.permission === "denied") {
      return;
    }

    // Request permission (only if default/not asked yet)
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await subscribeToPush();
    }
  };

  const subscribeToPush = async () => {
    if (!userId) return;

    try {
      // Wait for service worker to be ready
      const registration = await navigator.serviceWorker.ready;

      // Check if already subscribed
      const existingSubscription =
        await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log("Already subscribed to push notifications");
        return;
      }

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
        ),
      });

      // Save subscription to database
      const supabase = createClient();
      const subscriptionData = subscription.toJSON();
      await supabase.from("push_subscriptions").upsert({
        user_id: userId,
        subscription:
          subscriptionData as unknown as Database["public"]["Tables"]["push_subscriptions"]["Insert"]["subscription"],
      });

      console.log("Subscribed to push notifications");
    } catch (error) {
      console.error("Failed to subscribe to push:", error);
    }
  };

  // Fetch immediately when userId is available
  useEffect(() => {
    if (!userId) return;

    const timer = setTimeout(() => {
      fetchCounts();
    }, 0);

    return () => clearTimeout(timer);
  }, [userId]);

  // Setup push notifications
  useEffect(() => {
    if (!userId) return;

    const timer = setTimeout(() => {
      setupPushNotifications();
    }, 2000); // Wait 2 seconds before asking for permission

    return () => clearTimeout(timer);
  }, [userId]);

  // Event listeners
  useEffect(() => {
    if (!userId) return;

    window.addEventListener("messages-read", fetchCounts);
    return () => {
      window.removeEventListener("messages-read", fetchCounts);
    };
  }, [userId]);

  // Real-time subscription
  useEffect(() => {
    if (!userId) return;

    const subscribeToRealtime = async () => {
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
            if (msg.recipient_id === userId) {
              fetchCounts();
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    subscribeToRealtime();
  }, [userId]);

  return counts;
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
