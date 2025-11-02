"use client";

import { useEffect } from "react";

interface ViewCountTrackerProps {
  snippetId: string;
}

export function ViewCountTracker({ snippetId }: ViewCountTrackerProps) {
  useEffect(() => {
    // Track view after component mounts
    const trackView = async () => {
      try {
        await fetch(`/api/snippets/${snippetId}/view`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Failed to track view:", error);
      }
    };

    // Delay tracking to avoid counting quick navigations
    const timeout = setTimeout(trackView, 2000);

    return () => clearTimeout(timeout);
  }, [snippetId]);

  return null; // This component doesn't render anything
}
