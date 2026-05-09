import type { ItineraryDay, LocationGroup } from "@/lib/data/itinerary-types";

export interface DaySelection {
  selectedActivities: string[];
}

export interface ItineraryCustomization {
  /** locationGroupId -> adjusted night count */
  dayAdjustments: Record<string, number>;
  /** day number -> selected activities */
  daySelections: Record<number, DaySelection>;
  /** Total adjusted duration including day adjustments */
  totalDays: number;
}

export interface RefinerState {
  dayAdjustments: Record<string, number>;
  daySelections: Record<number, DaySelection>;
}

export type RefinerAction =
  | { type: "ADJUST_DAYS"; locationGroupId: string; delta: number }
  | { type: "TOGGLE_ACTIVITY"; day: number; activity: string }
  | { type: "RESET" };

export function buildDefaultState(
  locationGroups: LocationGroup[],
  itinerary: ItineraryDay[]
): RefinerState {
  const dayAdjustments: Record<string, number> = {};
  for (const g of locationGroups) {
    dayAdjustments[g.id] = g.dayEnd - g.dayStart + 1;
  }

  const daySelections: Record<number, DaySelection> = {};
  for (const day of itinerary) {
    if (day.freedomOfChoice?.length) {
      daySelections[day.day] = { selectedActivities: [] };
    }
  }

  return { dayAdjustments, daySelections };
}

export function refinerReducer(
  state: RefinerState,
  action: RefinerAction,
  locationGroups: LocationGroup[]
): RefinerState {
  switch (action.type) {
    case "ADJUST_DAYS": {
      const group = locationGroups.find((g) => g.id === action.locationGroupId);
      if (!group) return state;

      const current = state.dayAdjustments[action.locationGroupId] ?? (group.dayEnd - group.dayStart + 1);
      const next = current + action.delta;

      // Clamp to min/max
      if (next < group.minDays || next > group.maxDays) return state;

      return {
        ...state,
        dayAdjustments: {
          ...state.dayAdjustments,
          [action.locationGroupId]: next,
        },
      };
    }

    case "TOGGLE_ACTIVITY": {
      const current = state.daySelections[action.day]?.selectedActivities ?? [];
      const exists = current.includes(action.activity);

      return {
        ...state,
        daySelections: {
          ...state.daySelections,
          [action.day]: {
            selectedActivities: exists
              ? current.filter((a) => a !== action.activity)
              : [...current, action.activity],
          },
        },
      };
    }

    case "RESET":
      return state;

    default:
      return state;
  }
}
