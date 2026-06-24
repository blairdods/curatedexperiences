"use client";

import { useSyncExternalStore } from "react";

export interface ClientSignals {
  heroVariant: string;
  featuredJourney: string;
  ctaTone: string;
  conciergeVariant: string;
  country: string;
  device: string;
  source: string;
  isUS: boolean;
  isSingapore: boolean;
}

const DEFAULT_SIGNALS: ClientSignals = {
  heroVariant: "luxury-us",
  featuredJourney: "the-masterpiece",
  ctaTone: "exploratory",
  conciergeVariant: "default",
  country: "unknown",
  device: "desktop",
  source: "direct",
  isUS: false,
  isSingapore: false,
};

let lastCookieValue = "";
let lastSignals = DEFAULT_SIGNALS;

export function useSignals(): ClientSignals {
  return useSyncExternalStore(
    () => () => {},
    readSignalsFromCookie,
    () => DEFAULT_SIGNALS
  );
}

function readSignalsFromCookie(): ClientSignals {
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith("ce-signals="));

  if (!cookie) return DEFAULT_SIGNALS;

  if (cookie === lastCookieValue) return lastSignals;

  try {
    lastCookieValue = cookie;
    lastSignals = {
      ...DEFAULT_SIGNALS,
      ...JSON.parse(decodeURIComponent(cookie.split("=").slice(1).join("="))),
    };
    return lastSignals;
  } catch {
    lastCookieValue = cookie;
    lastSignals = DEFAULT_SIGNALS;
    return DEFAULT_SIGNALS;
  }
}
