"use client";

import { useEffect, useRef } from "react";

export function IncrementViews({ listingId }: { listingId: string }) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    // Prevent double execution
    if (hasIncremented.current) return;

    // Check if already viewed in this session
    const viewedKey = `viewed_listing_${listingId}`;
    const alreadyViewed = sessionStorage.getItem(viewedKey);

    if (alreadyViewed) return;

    // Increment view
    fetch(`/api/listings/${listingId}/increment-views`, { method: "POST" })
      .then(() => {
        // Mark as viewed in this session
        sessionStorage.setItem(viewedKey, "true");
        hasIncremented.current = true;
      })
      .catch((error) => {
        console.error("Failed to increment view:", error);
      });
  }, [listingId]);

  return null;
}
