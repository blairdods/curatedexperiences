"use client";

import { useMemo } from "react";

export interface ClientSignals {
  heroVariant: string;
  featuredJourney: string;
  ctaTone: string;
  conciergeVariant: string;
  country: string;
  device: string;
  source: string;
}

const DEFAULT_SIGNALS: ClientSignals = {
  heroVariant: "luxury-us",
  featuredJourney: "south-island-odyssey",
  ctaTone: "exploratory",
  conciergeVariant: "default",
  country: "unknown",
  device: "desktop",
  source: "direct",
};

export function useSignals(): ClientSignals {
  return useMemo(() => {
    if (typeof document === "undefined") return DEFAULT_SIGNALS;

    const cookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith("ce-signals="));

    if (!cookie) return DEFAULT_SIGNALS;

    try {
      return {
        ...DEFAULT_SIGNALS,
        ...JSON.parse(decodeURIComponent(cookie.split("=").slice(1).join("="))),
      };
    } catch {
      return DEFAULT_SIGNALS;
    }
  }, []);
}
