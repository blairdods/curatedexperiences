"use client";

import { useItineraryRefiner } from "@/lib/itinerary-refiner/context";

interface ActivitySelectorProps {
  day: number;
  options: string[];
  selected: string[];
  onToggle: (day: number, activity: string) => void;
}

export function ActivitySelector({
  day,
  options,
  selected,
  onToggle,
}: ActivitySelectorProps) {
  return (
    <div className="mt-4 rounded-lg border border-warm-200/50 bg-white">
      <p className="px-4 pt-4 pb-2 text-xs tracking-widest uppercase text-warm-500">
        Freedom of Choice
      </p>
      <div className="pb-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              onClick={() => onToggle(day, option)}
              className="w-full flex items-start gap-3 px-4 py-2.5 text-left
                hover:bg-warm-100/50 transition-colors duration-150 group"
            >
              <span className="flex-shrink-0 mt-0.5">
                {isSelected ? (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                ) : (
                  <span className="block h-4 w-4 rounded-full border border-warm-300 group-hover:border-warm-400 transition-colors" />
                )}
              </span>
              <span
                className={`text-sm leading-snug transition-colors ${
                  isSelected
                    ? "text-foreground font-medium"
                    : "text-foreground/70"
                }`}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Connected version that reads/writes from the refiner context.
 */
export function ActivitySelectorConnected({
  day,
  options,
}: {
  day: number;
  options: string[];
}) {
  const refiner = useItineraryRefiner();
  if (!refiner) {
    // Fallback: static list (no context available)
    return (
      <div className="mt-4 p-4 rounded-lg bg-warm-100/60 border border-warm-200/50">
        <p className="text-xs tracking-widest uppercase text-warm-500 mb-2">
          Freedom of Choice
        </p>
        <ul className="space-y-1.5">
          {options.map((option, k) => (
            <li key={k} className="flex items-start gap-2 text-sm text-foreground/70">
              <span className="text-navy/40 mt-0.5 flex-shrink-0">&#9673;</span>
              {option}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const selected = refiner.state.daySelections[day]?.selectedActivities ?? [];

  return (
    <ActivitySelector
      day={day}
      options={options}
      selected={selected}
      onToggle={refiner.toggleActivity}
    />
  );
}
