"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import type { Journey, LocationGroup } from "@/lib/data/itinerary-types";
import type { ItineraryCustomization, RefinerState } from "./types";
import { buildDefaultState, refinerReducer } from "./types";

interface ItineraryRefinerContextValue {
  state: RefinerState;
  locationGroups: LocationGroup[];
  totalDays: number;
  selectedActivityCount: number;
  adjustDays: (locationGroupId: string, delta: number) => void;
  toggleActivity: (day: number, activity: string) => void;
  reset: () => void;
  captureCustomization: () => ItineraryCustomization;
}

const RefinerContext = createContext<ItineraryRefinerContextValue | null>(null);

export function ItineraryRefinerProvider({
  journey,
  children,
}: {
  journey: Journey;
  children: React.ReactNode;
}) {
  const groups = journey.locationGroups ?? [];

  const [state, dispatch] = useReducer(
    (s: RefinerState, action: { type: string; locationGroupId?: string; delta?: number; day?: number; activity?: string }) => {
      return refinerReducer(
        s,
        action as { type: "ADJUST_DAYS" | "TOGGLE_ACTIVITY" | "RESET"; locationGroupId: string; delta: number; day: number; activity: string },
        groups
      );
    },
    { dayAdjustments: {}, daySelections: {} },
    () => buildDefaultState(groups, journey.itinerary)
  );

  const totalDays = useMemo(() => {
    // Base duration minus default group days, plus adjusted days
    let total = 0;
    const baseDuration = journey.durationDays;

    // Count days NOT in any location group (e.g., departure day)
    const groupedDayNums = new Set<number>();
    for (const g of groups) {
      for (let d = g.dayStart; d <= g.dayEnd; d++) {
        groupedDayNums.add(d);
      }
    }
    // Non-grouped days (e.g., departure day 15)
    const ungroupedDays = journey.itinerary.filter(
      (d) => !groupedDayNums.has(d.day)
    ).length;

    // Sum adjusted group days
    const adjustedGroupDays = groups.reduce(
      (sum, g) => sum + (state.dayAdjustments[g.id] ?? (g.dayEnd - g.dayStart + 1)),
      0
    );

    return adjustedGroupDays + ungroupedDays;
  }, [state.dayAdjustments, groups, journey.itinerary, journey.durationDays]);

  const selectedActivityCount = useMemo(() => {
    return Object.values(state.daySelections).reduce(
      (sum, sel) => sum + sel.selectedActivities.length,
      0
    );
  }, [state.daySelections]);

  const adjustDays = useCallback(
    (locationGroupId: string, delta: number) => {
      dispatch({ type: "ADJUST_DAYS", locationGroupId, delta });
    },
    []
  );

  const toggleActivity = useCallback(
    (day: number, activity: string) => {
      dispatch({ type: "TOGGLE_ACTIVITY", day, activity });
    },
    []
  );

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const captureCustomization = useCallback((): ItineraryCustomization => {
    return {
      dayAdjustments: { ...state.dayAdjustments },
      daySelections: { ...state.daySelections },
      totalDays,
    };
  }, [state.dayAdjustments, state.daySelections, totalDays]);

  const value = useMemo(
    () => ({
      state,
      locationGroups: groups,
      totalDays,
      selectedActivityCount,
      adjustDays,
      toggleActivity,
      reset,
      captureCustomization,
    }),
    [state, groups, totalDays, selectedActivityCount, adjustDays, toggleActivity, reset, captureCustomization]
  );

  return (
    <RefinerContext.Provider value={value}>{children}</RefinerContext.Provider>
  );
}

export function useItineraryRefiner(): ItineraryRefinerContextValue | null {
  return useContext(RefinerContext);
}
