"use client";

import { useEffect, useState, useCallback } from "react";
import { useItineraryRefiner } from "@/lib/itinerary-refiner/context";
import { dispatchOpenConcierge } from "@/lib/itinerary-refiner/events";
import type { Journey } from "@/lib/data/journeys";

export function MobileRefinerBar({ journey }: { journey: Journey }) {
  const refiner = useItineraryRefiner();
  const [visible, setVisible] = useState(false);

  // Show when the user scrolls past the itinerary section header
  useEffect(() => {
    const el = document.getElementById("itinerary-section");
    if (!el) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show when the section header is not visible (scrolled past)
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!refiner) return null;

  const { totalDays, selectedActivityCount, captureCustomization } = refiner;

  const handleBeginJourney = useCallback(() => {
    const customization = captureCustomization();
    dispatchOpenConcierge({
      customization,
      journeySlug: journey.slug,
    });
  }, [captureCustomization, journey.slug]);

  if (!visible) return null;

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40
        bg-white/95 backdrop-blur border-t border-warm-200
        px-4 py-3 animate-[concierge-fade-in_0.3s_ease-out]"
    >
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        <div className="flex items-center gap-3 text-xs">
          {selectedActivityCount > 0 && (
            <span>
              <span className="text-gold font-medium">{selectedActivityCount}</span>{" "}
              selected
            </span>
          )}
          <span className="text-foreground-muted">
            <span className="text-navy font-medium">{totalDays}</span> days
          </span>
        </div>
        <button
          onClick={handleBeginJourney}
          className="inline-flex items-center px-5 py-2.5 text-xs tracking-wide
            bg-navy text-background rounded-lg
            hover:bg-navy/90 transition-colors duration-200"
        >
          Begin Your Journey
        </button>
      </div>
    </div>
  );
}
