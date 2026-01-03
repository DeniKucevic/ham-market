"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  listingId: string;
  listingTitle: string;
  isHidden: boolean;
}

export function HideListingButton({
  listingId,
  listingTitle,
  isHidden,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggleHide = async () => {
    const action = isHidden ? "unhide" : "hide";

    if (!confirm(`Are you sure you want to ${action} "${listingTitle}"?`)) {
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("listings")
      .update({
        status: isHidden ? "active" : "hidden",
        admin_notes: null, // Clear admin notes when user unhides
      })
      .eq("id", listingId);

    if (error) {
      alert(`Failed to ${action} listing`);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggleHide}
      disabled={loading}
      className="whitespace-nowrap rounded-md bg-orange-100 px-3 py-1.5 text-sm font-medium text-orange-700 hover:bg-orange-200 disabled:opacity-50 dark:bg-orange-900/20 dark:text-orange-400"
    >
      {loading ? "..." : isHidden ? "Unhide" : "Hide"}
    </button>
  );
}
