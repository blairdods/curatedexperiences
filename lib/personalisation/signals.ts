import { type NextRequest } from "next/server";

/**
 * Visitor personalisation signals extracted at the edge.
 * These are set as cookies so client components can read them.
 */

export interface VisitorSignals {
  /** ISO country code from Vercel/CF geo headers */
  country: string;
  /** City name if available */
  city: string;
  /** true if country is US */
  isUS: boolean;
  /** Traffic source: google_ads | organic | social | direct | referral */
  source: string;
  /** UTM campaign name if present */
  campaign: string;
  /** Device type: mobile | tablet | desktop */
  device: string;
  /** true if visitor has been here before */
  returning: boolean;
  /** Hero variant to show */
  heroVariant: string;
  /** Featured journey slug to highlight */
  featuredJourney: string;
  /** CTA tone: direct | exploratory */
  ctaTone: string;
  /** Concierge opening message variant */
  conciergeVariant: string;
}

export function extractSignals(request: NextRequest): VisitorSignals {
  // --- Geo ---
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    "unknown";
  const city =
    request.headers.get("x-vercel-ip-city") ??
    request.headers.get("cf-ipcity") ??
    "";
  const isUS = country === "US";

  // --- Traffic source ---
  const url = new URL(request.url);
  const utmSource = url.searchParams.get("utm_source") ?? "";
  const utmMedium = url.searchParams.get("utm_medium") ?? "";
  const utmCampaign = url.searchParams.get("utm_campaign") ?? "";
  const referer = request.headers.get("referer") ?? "";

  let source = "direct";
  if (utmSource === "google" && utmMedium === "cpc") source = "google_ads";
  else if (utmSource) source = utmSource;
  else if (referer.includes("google.com")) source = "organic";
  else if (
    referer.includes("facebook.com") ||
    referer.includes("instagram.com")
  )
    source = "social";
  else if (referer && !referer.includes("curatedexperiences")) source = "referral";

  // --- Device ---
  const ua = request.headers.get("user-agent") ?? "";
  let device = "desktop";
  if (/mobile|android|iphone/i.test(ua)) device = "mobile";
  else if (/ipad|tablet/i.test(ua)) device = "tablet";

  // --- Returning visitor ---
  const returning = request.cookies.has("ce-visitor");

  // --- Derive personalisation variants ---
  const heroVariant = deriveHeroVariant(isUS, source, utmCampaign);
  const featuredJourney = deriveFeaturedJourney(utmCampaign, source);
  const ctaTone = source === "google_ads" ? "direct" : "exploratory";
  const conciergeVariant = deriveConciergeVariant(isUS, returning, source);

  return {
    country,
    city,
    isUS,
    source,
    campaign: utmCampaign,
    device,
    returning,
    heroVariant,
    featuredJourney,
    ctaTone,
    conciergeVariant,
  };
}

function deriveHeroVariant(
  isUS: boolean,
  source: string,
  campaign: string
): string {
  if (!isUS) return "international";
  if (source === "google_ads") {
    if (campaign.includes("adventure")) return "adventure-us";
    if (campaign.includes("wine") || campaign.includes("culinary"))
      return "culinary-us";
    return "luxury-us";
  }
  return "luxury-us";
}

function deriveFeaturedJourney(campaign: string, source: string): string {
  if (campaign.includes("adventure") || campaign.includes("wilderness"))
    return "the-expedition";
  if (campaign.includes("wine") || campaign.includes("culinary"))
    return "the-epicurean";
  if (campaign.includes("fiordland") || campaign.includes("south-island"))
    return "the-masterpiece";
  // Default based on source
  if (source === "google_ads") return "the-masterpiece";
  return "the-masterpiece";
}

function deriveConciergeVariant(
  isUS: boolean,
  returning: boolean,
  source: string
): string {
  if (returning) return "welcome-back";
  if (source === "google_ads") return "high-intent";
  if (isUS) return "us-visitor";
  return "default";
}
