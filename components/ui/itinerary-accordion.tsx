"use client";

import { useState } from "react";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  overnight?: string;
  highlights?: string[];
}

export function ItineraryAccordion({ days }: { days: ItineraryDay[] }) {
  const [openDay, setOpenDay] = useState<number | null>(0);

  return (
    <div className="divide-y divide-warm-200">
      {days.map((day, i) => {
        const isOpen = openDay === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpenDay(isOpen ? null : i)}
              className="w-full flex items-center gap-4 py-5 text-left group"
            >
              <span className="flex-shrink-0 w-12 h-12 rounded-full bg-warm-100 flex items-center justify-center
                text-sm font-medium text-navy group-hover:bg-warm-200 transition-colors">
                {day.day}
              </span>
              <span className="flex-1">
                <span className="text-xs tracking-widest uppercase text-warm-500">
                  Day {day.day}
                </span>
                <span className="block font-serif text-lg text-navy tracking-tight mt-0.5">
                  {day.title}
                </span>
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={`w-5 h-5 text-warm-400 flex-shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isOpen && (
              <div className="pb-6 pl-16 pr-4 animate-[concierge-fade-in_0.2s_ease-out]">
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {day.description}
                </p>
                {day.highlights && day.highlights.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {day.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className="text-gold mt-0.5 flex-shrink-0">&#9672;</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                {day.overnight && (
                  <p className="mt-4 text-xs text-warm-500 tracking-wide">
                    Overnight: {day.overnight}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
