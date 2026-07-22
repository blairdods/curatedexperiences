"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID || "G-XSB4LZMTX5";
const GADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-18032876556";
const ENHANCED_CONVERSIONS_ENABLED =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ENHANCED_CONVERSIONS === "true";

// Google Ads conversion labels.
// Create each conversion action in Google Ads UI → Goals → Conversions → New conversion action.
// Paste the generated label (e.g. "AbCdEfGhI") into the corresponding slot below.
// Until a label is set, the Google Ads call is skipped — GA4 tracking still fires.
const GADS_CONVERSION_LABELS = {
  lead_created: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || "",
  email_captured: process.env.NEXT_PUBLIC_GOOGLE_ADS_EMAIL_LABEL || "",
  concierge_engaged:
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CONCIERGE_LABEL || "",
  intent_score_high:
    process.env.NEXT_PUBLIC_GOOGLE_ADS_HIGH_INTENT_LABEL || "",
  ai_brief_generated:
    process.env.NEXT_PUBLIC_GOOGLE_ADS_BRIEF_LABEL || "",
} as const;

export type ConversionType = keyof typeof GADS_CONVERSION_LABELS;

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_ID || typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_path: pathname,
    });
  }, [pathname]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          var ceConsentMatch = document.cookie.match(/(?:^|; )ce-consent=([^;]*)/);
          var ceConsent = ceConsentMatch ? decodeURIComponent(ceConsentMatch[1]) : '';
          var ceNeedsConsent = document.cookie.indexOf('ce-needs-consent=1') !== -1;
          var ceGranted = ceConsent === 'accepted' || (!ceNeedsConsent && ceConsent !== 'declined');
          gtag('consent', 'default', {
            analytics_storage: ceGranted ? 'granted' : 'denied',
            ad_storage: ceGranted ? 'granted' : 'denied',
            ad_user_data: ceGranted ? 'granted' : 'denied',
            ad_personalization: ceGranted ? 'granted' : 'denied',
            wait_for_update: 500
          });
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
          });
          gtag('config', '${GADS_ID}');
        `}
      </Script>
    </>
  );
}

/** Send a named event to GA4. Call from any client component. */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

/**
 * Fire a Google Ads conversion event.
 * Also fires the equivalent GA4 event so both systems receive the signal.
 * No-ops silently if the conversion label has not been configured yet.
 */
export function trackConversion(
  type: ConversionType,
  options?: {
    value?: number;
    currency?: string;
    params?: Record<string, string | number | boolean>;
    userData?: { email?: string; phone_number?: string };
  }
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  // Always fire to GA4
  window.gtag("event", type, options?.params);

  // Only fire to Google Ads once a label has been added
  const label = GADS_CONVERSION_LABELS[type];
  if (!label) return;

  if (ENHANCED_CONVERSIONS_ENABLED && options?.userData) {
    window.gtag("set", "user_data", options.userData);
  }

  window.gtag("event", "conversion", {
    send_to: `${GADS_ID}/${label}`,
    value: options?.value ?? 0,
    currency: options?.currency ?? "NZD",
    ...options?.params,
  });
}
