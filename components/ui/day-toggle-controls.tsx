"use client";

import type { LocationGroup } from "@/lib/data/itinerary-types";
import { useItineraryRefiner } from "@/lib/itinerary-refiner/context";

export function DayToggleControls({ group }: { group: LocationGroup }) {
  const refiner = useItineraryRefiner();
  if (!refiner) return null;

  const { state, adjustDays } = refiner;
  const currentNights = state.dayAdjustments[group.id] ?? (group.dayEnd - group.dayStart + 1);
  const atMin = currentNights <= group.minDays;
  const atMax = currentNights >= group.maxDays;
  const adjusted = currentNights !== (group.dayEnd - group.dayStart + 1);

  return (
    <div className="flex items-center justify-between py-4 px-5 bg-white rounded-lg border border-warm-200">
      <div>
        <p className="font-serif text-sm text-navy tracking-tight">
          {group.label}
        </p>
        {group.accommodation && (
          <p className="text-xs text-foreground-muted mt-0.5">
            {group.accommodation}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => adjustDays(group.id, -1)}
          disabled={atMin}
          className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center
            text-navy hover:bg-navy hover:text-white transition-all duration-200
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-navy"
          aria-label={`Remove one night from ${group.label}`}
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
            <rect x="2" y="7" width="12" height="2" rx="1" />
          </svg>
        </button>
        <span
          className={`font-serif text-lg tracking-tight tabular-nums min-w-[5ch] text-center ${
            adjusted ? "text-gold" : "text-navy"
          }`}
        >
          {currentNights} {currentNights === 1 ? "night" : "nights"}
        </span>
        <button
          onClick={() => adjustDays(group.id, 1)}
          disabled={atMax}
          className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center
            text-navy hover:bg-navy hover:text-white transition-all duration-200
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-navy"
          aria-label={`Add one night to ${group.label}`}
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
            <path d="M7 7V2a1 1 0 012 0v5h5a1 1 0 010 2H9v5a1 1 0 01-2 0V9H2a1 1 0 010-2h5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
