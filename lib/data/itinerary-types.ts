/**
 * Shared itinerary types used across public-facing journey components.
 */

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  overnight?: string;
  highlights?: string[];
  /** Optional activities the traveller can choose from on this day */
  freedomOfChoice?: string[];
  /** Links this day to a location group for the itinerary refiner */
  locationGroupId?: string;
}

export interface LocationGroup {
  /** Unique id matching locationGroupId on days */
  id: string;
  /** Display label e.g. "Bay of Islands" */
  label: string;
  /** 1-based first day number in this group */
  dayStart: number;
  /** 1-based last day number in this group */
  dayEnd: number;
  /** Minimum nights the traveller can stay */
  minDays: number;
  /** Maximum nights the traveller can stay */
  maxDays: number;
  /** Primary accommodation at this location */
  accommodation?: string;
}
