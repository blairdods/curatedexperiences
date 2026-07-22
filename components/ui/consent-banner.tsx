"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only if middleware flagged this visitor as needing consent
    // and they haven't already accepted
    const needsConsent = document.cookie.includes("ce-needs-consent=1");
    const hasConsented = document.cookie.includes("ce-consent=");
    if (needsConsent && !hasConsented) {
      // Visibility is derived from browser cookies after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  const accept = () => {
    document.cookie = "ce-consent=accepted; max-age=" + (365 * 24 * 60 * 60) + "; path=/; samesite=lax";
    document.cookie = "ce-needs-consent=; max-age=0; path=/";
    window.gtag?.("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
    setVisible(false);
  };

  const decline = () => {
    document.cookie = "ce-consent=declined; max-age=" + (365 * 24 * 60 * 60) + "; path=/; samesite=lax";
    document.cookie = "ce-needs-consent=; max-age=0; path=/";
    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto bg-navy text-cream rounded-xl shadow-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-cream/80 leading-relaxed flex-1">
          We use cookies to personalise your experience and analyse site traffic.
          See our{" "}
          <Link href="/privacy" className="text-cream underline underline-offset-2 hover:text-gold transition-colors">
            privacy policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="text-xs text-cream/50 hover:text-cream/80 transition-colors whitespace-nowrap"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-xs font-medium bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors whitespace-nowrap"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
