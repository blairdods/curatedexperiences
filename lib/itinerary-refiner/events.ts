import type { ItineraryCustomization } from "./types";

export const CONCIERGE_OPEN_EVENT = "ce:open-concierge";

export interface ConciergeOpenDetail {
  customization?: ItineraryCustomization;
  journeySlug?: string;
}

/**
 * Dispatch the concierge open event with optional itinerary customization context.
 * Call this from CTA buttons to pass user refinements to the concierge.
 */
export function dispatchOpenConcierge(detail?: ConciergeOpenDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CONCIERGE_OPEN_EVENT, { detail }));
}
