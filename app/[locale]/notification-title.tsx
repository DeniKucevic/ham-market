"use client";

import { useNotificationCounts } from "@/hooks/use-notification-counts";
import { useEffect } from "react";

interface Props {
  userId?: string;
  baseTitle: string;
}

export function NotificationTitle({ userId, baseTitle }: Props) {
  const counts = useNotificationCounts(userId);
  const totalCount =
    counts.unreadMessages + counts.unratedSales + counts.unratedPurchases;

  useEffect(() => {
    if (totalCount > 0) {
      document.title = `(${totalCount}) ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
  }, [totalCount, baseTitle]);

  return null;
}
