/**
 * Concierge trigger logic.
 *
 * Triggers:
 * 1. Auto-trigger: soft prompt after 45s on journey pages
 * 2. Exit intent: mouse leaves viewport on high-value pages
 * 3. CTA trigger: external components can open the concierge
 *
 * All triggers respect a "dismissed" state — if the user closes
 * the concierge without interacting, don't re-trigger for that session.
 */

const DISMISSED_KEY = "ce-concierge-dismissed";

export function wasDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(DISMISSED_KEY) === "true";
}

export function markDismissed() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DISMISSED_KEY, "true");
}

/** Triggered state is per-page-path — navigating to a different journey
 *  page should allow the timer to fire again. Dismissed state is global. */
function triggeredKey(pathname: string): string {
  // Normalize: strip trailing slash and query params
  const normalized = pathname.replace(/\/$/, "").split("?")[0];
  return `ce-concierge-triggered:${normalized}`;
}

export function wasTriggered(pathname: string): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(triggeredKey(pathname)) === "true";
}

export function markTriggered(pathname: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(triggeredKey(pathname), "true");
}

/** Pages where auto-trigger and exit intent are active */
export function isHighValuePage(pathname: string): boolean {
  return (
    pathname.startsWith("/journeys/") ||
    pathname.startsWith("/destinations/") ||
    pathname === "/"
  );
}

/** Pages where the 45s timer trigger fires */
export function isTourPage(pathname: string): boolean {
  return pathname.startsWith("/journeys/");
}
