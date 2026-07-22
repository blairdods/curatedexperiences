import "server-only";

import { cookies } from "next/headers";

const MAX_ATTRIBUTION_VALUE_LENGTH = 2048;

export interface AttributionInput {
  source?: unknown;
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
  utm_term?: unknown;
  utm_content?: unknown;
  gclid?: unknown;
  gbraid?: unknown;
  wbraid?: unknown;
  landing_page?: unknown;
}

export interface LeadAttribution {
  source: string;
  capture_surface: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  landing_page: string | null;
}

function clean(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, MAX_ATTRIBUTION_VALUE_LENGTH) : null;
}

/**
 * Resolve the marketing source independently from the UI surface that captured
 * the lead. Browser-provided values win only when present; otherwise the
 * server-owned attribution cookies set by proxy.ts are used.
 */
export async function resolveLeadAttribution(
  input: AttributionInput
): Promise<LeadAttribution> {
  const cookieStore = await cookies();
  const fromCookie = (name: string) => clean(cookieStore.get(name)?.value);
  const value = (bodyValue: unknown, cookieName: string) =>
    clean(bodyValue) ?? fromCookie(cookieName);

  const captureSurface = clean(input.source);
  const utmSource = value(input.utm_source, "ce-utm-source");
  const utmMedium = value(input.utm_medium, "ce-utm-medium");
  const gclid = value(input.gclid, "ce-gclid");
  const gbraid = value(input.gbraid, "ce-gbraid");
  const wbraid = value(input.wbraid, "ce-wbraid");
  const hasGoogleClickId = Boolean(gclid || gbraid || wbraid);
  const isGoogleCpc =
    utmSource?.toLowerCase() === "google" &&
    ["cpc", "paid", "ppc"].includes(utmMedium?.toLowerCase() ?? "");

  let source = captureSurface ?? "direct";
  if (hasGoogleClickId || isGoogleCpc) source = "google_ads";
  else if (utmSource) source = utmSource;

  return {
    source,
    capture_surface: captureSurface,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: value(input.utm_campaign, "ce-utm-campaign"),
    utm_term: value(input.utm_term, "ce-utm-term"),
    utm_content: value(input.utm_content, "ce-utm-content"),
    gclid,
    gbraid,
    wbraid,
    landing_page: value(input.landing_page, "ce-landing-page"),
  };
}
