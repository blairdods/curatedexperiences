"use client";

import type { Journey } from "@/lib/data/journeys";
import { useItineraryRefiner } from "@/lib/itinerary-refiner/context";
import { dispatchOpenConcierge } from "@/lib/itinerary-refiner/events";
import { openContactModal } from "./contact-modal";

export function ItineraryRefinerSummary({ journey }: { journey: Journey }) {
  const refiner = useItineraryRefiner();
  if (!refiner) return null;

  const { state, locationGroups, totalDays, selectedActivityCount, captureCustomization } = refiner;
  const baseDayCount = journey.durationDays;
  const dayCountChanged = totalDays !== baseDayCount;

  const handleBeginJourney = () => {
    const customization = captureCustomization();
    dispatchOpenConcierge({
      customization,
      journeySlug: journey.slug,
    });
  };

  return (
    <div className="hidden lg:block sticky top-28">
      <div className="bg-white rounded-xl p-6 shadow-[0_2px_20px_-4px_rgba(31,56,100,0.08)] border border-warm-200">
        <h3 className="font-serif text-lg text-navy tracking-tight">
          {journey.title}
        </h3>
        <p className="mt-1 text-xs text-foreground-muted">
          <span className={dayCountChanged ? "text-gold font-medium" : ""}>
            {totalDays} days
          </span>
          {dayCountChanged && (
            <span className="text-foreground-muted ml-1">
              (originally {baseDayCount})
            </span>
          )}
        </p>

        {/* Location breakdown */}
        <div className="mt-4 pt-4 border-t border-warm-200/50">
          <p className="text-xs tracking-widest uppercase text-warm-500 mb-3">
            Your Itinerary
          </p>
          <ul className="space-y-1.5">
            {locationGroups.map((g) => {
              const nights = state.dayAdjustments[g.id] ?? (g.dayEnd - g.dayStart + 1);
              const adjusted = nights !== (g.dayEnd - g.dayStart + 1);
              return (
                <li
                  key={g.id}
                  className="flex items-baseline justify-between text-sm"
                >
                  <span className="text-foreground/70">{g.label}</span>
                  <span
                    className={`tabular-nums ml-2 ${
                      adjusted
                        ? "text-gold font-medium"
                        : "text-foreground-muted"
                    }`}
                  >
                    {nights} {nights === 1 ? "nt" : "nts"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Activity count */}
        {selectedActivityCount > 0 && (
          <p className="mt-4 text-xs text-foreground-muted">
            <span className="text-gold font-medium">{selectedActivityCount}</span>{" "}
            {selectedActivityCount === 1 ? "activity" : "activities"} selected
          </p>
        )}

        {/* CTAs */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleBeginJourney}
            className="w-full inline-flex items-center justify-center px-6 py-3 text-sm tracking-wide
              bg-navy text-background rounded-lg
              hover:bg-navy/90 transition-colors duration-200"
          >
            Begin Your Journey
          </button>
          <button
            onClick={() => openContactModal(journey.title)}
            className="w-full inline-flex items-center justify-center px-6 py-3 text-sm tracking-wide
              text-navy border border-navy/20 rounded-lg
              hover:bg-navy/5 transition-colors duration-200"
          >
            Enquire
          </button>
        </div>

        <p className="mt-4 text-[11px] text-center text-foreground-muted">
          Every experience is fully customisable
        </p>
      </div>
    </div>
  );
}
