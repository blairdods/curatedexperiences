"use client";

import { useState } from "react";
import type { ItineraryDay } from "@/lib/data/itinerary-types";
import { DayToggleControls } from "@/components/ui/day-toggle-controls";
import { ActivitySelectorConnected } from "@/components/ui/activity-selector";

export type { ItineraryDay };

interface ItineraryAccordionProps {
  days: ItineraryDay[];
  variant?: "static" | "refinable";
  locationGroups?: Array<{
    id: string;
    label: string;
    dayStart: number;
    dayEnd: number;
    minDays: number;
    maxDays: number;
    accommodation?: string;
  }>;
}

export function ItineraryAccordion({
  days,
  variant = "static",
  locationGroups,
}: ItineraryAccordionProps) {
  const [openDay, setOpenDay] = useState<number | null>(0);
  const isRefinable = variant === "refinable" && locationGroups && locationGroups.length > 0;

  // Group days by locationGroupId for refinable mode
  const groups = isRefinable ? buildDayGroups(days, locationGroups!) : null;

  return (
    <div className="divide-y divide-warm-200">
      {isRefinable && groups
        ? groups.map((group) => (
            <div key={group.key}>
              {/* Location header + toggle controls */}
              {group.groupDef && group.isFirst && (
                <div className="pt-2 pb-3">
                  <DayToggleControls group={group.groupDef} />
                </div>
              )}

              {group.days.map((day, i) => {
                const dayIdx = days.indexOf(day);
                const isOpen = openDay === dayIdx;
                return (
                  <div key={day.day}>
                    <button
                      onClick={() => setOpenDay(isOpen ? null : dayIdx)}
                      className="w-full flex items-center gap-4 py-5 text-left group"
                    >
                      <span
                        className="flex-shrink-0 w-12 h-12 rounded-full bg-warm-100 flex items-center justify-center
                          text-sm font-medium text-navy group-hover:bg-warm-200 transition-colors"
                      >
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
                              <li
                                key={j}
                                className="flex items-start gap-2 text-sm text-foreground/80"
                              >
                                <span className="text-gold mt-0.5 flex-shrink-0">
                                  &#9672;
                                </span>
                                {h}
                              </li>
                            ))}
                          </ul>
                        )}
                        {day.freedomOfChoice && day.freedomOfChoice.length > 0 && (
                          <ActivitySelectorConnected
                            day={day.day}
                            options={day.freedomOfChoice}
                          />
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
          ))
        : days.map((day, i) => {
            const isOpen = openDay === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpenDay(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 py-5 text-left group"
                >
                  <span
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-warm-100 flex items-center justify-center
                      text-sm font-medium text-navy group-hover:bg-warm-200 transition-colors"
                  >
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
                          <li
                            key={j}
                            className="flex items-start gap-2 text-sm text-foreground/80"
                          >
                            <span className="text-gold mt-0.5 flex-shrink-0">
                              &#9672;
                            </span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                    {day.freedomOfChoice && day.freedomOfChoice.length > 0 && (
                      <div className="mt-4 p-4 rounded-lg bg-warm-100/60 border border-warm-200/50">
                        <p className="text-xs tracking-widest uppercase text-warm-500 mb-2">
                          Freedom of Choice
                        </p>
                        <ul className="space-y-1.5">
                          {day.freedomOfChoice.map((option, k) => (
                            <li
                              key={k}
                              className="flex items-start gap-2 text-sm text-foreground/70"
                            >
                              <span className="text-navy/40 mt-0.5 flex-shrink-0">
                                &#9673;
                              </span>
                              {option}
                            </li>
                          ))}
                        </ul>
                      </div>
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

interface DayGroup {
  key: string;
  groupDef: ItineraryAccordionProps["locationGroups"] extends Array<infer T> ? T : never;
  isFirst: boolean;
  days: ItineraryDay[];
}

function buildDayGroups(
  days: ItineraryDay[],
  locationGroups: NonNullable<ItineraryAccordionProps["locationGroups"]>
): DayGroup[] {
  const result: DayGroup[] = [];
  const processedGroups = new Set<string>();

  for (const day of days) {
    const gId = day.locationGroupId;
    const groupDef = gId ? locationGroups.find((g) => g.id === gId) : undefined;
    const key = gId ?? `ungrouped-${day.day}`;
    const isFirst = gId ? !processedGroups.has(gId) : true;

    let entry = result.find((g) => g.key === key);
    if (!entry) {
      entry = { key, groupDef: groupDef as DayGroup["groupDef"], isFirst, days: [] };
      result.push(entry);
    }

    entry.days.push(day);
    if (gId) processedGroups.add(gId);
  }

  return result;
}
