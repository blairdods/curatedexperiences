import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { extractSignals } from "@/lib/personalisation/signals";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // --- Supabase session refresh ---
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  await supabase.auth.getUser();

  // --- Visitor personalisation ---
  const signals = extractSignals(request);

  // Set personalisation cookie (JSON, 30-day expiry)
  response.cookies.set("ce-signals", JSON.stringify({
    heroVariant: signals.heroVariant,
    featuredJourney: signals.featuredJourney,
    ctaTone: signals.ctaTone,
    conciergeVariant: signals.conciergeVariant,
    country: signals.country,
    device: signals.device,
    source: signals.source,
  }), {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
    sameSite: "lax",
  });

  // Set consent requirement flag for EU/EEA visitors
  const EU_COUNTRIES = new Set([
    "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE",
    "IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE",
    // EEA non-EU
    "IS","LI","NO",
    // UK (post-Brexit, still applies GDPR equivalent)
    "GB",
    // Switzerland
    "CH",
  ]);
  if (EU_COUNTRIES.has(signals.country) && !request.cookies.has("ce-consent")) {
    response.cookies.set("ce-needs-consent", "1", {
      maxAge: 60 * 60, // 1 hour — re-evaluate on next session if not yet accepted
      path: "/",
      sameSite: "lax",
    });
  }

  // Mark as visited for returning visitor detection
  if (!request.cookies.has("ce-visitor")) {
    response.cookies.set("ce-visitor", "1", {
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });
  }

  // Persist last-touch paid-media parameters for server-side lead attribution.
  // These cookies contain no personal data and are never used to source media.
  const url = new URL(request.url);
  const attributionParams = [
    ["utm_source", "ce-utm-source"],
    ["utm_medium", "ce-utm-medium"],
    ["utm_campaign", "ce-utm-campaign"],
    ["utm_term", "ce-utm-term"],
    ["utm_content", "ce-utm-content"],
    ["gclid", "ce-gclid"],
    ["gbraid", "ce-gbraid"],
    ["wbraid", "ce-wbraid"],
  ] as const;
  const hasAttribution = attributionParams.some(([param]) =>
    url.searchParams.has(param)
  );
  const attributionCookieOptions = {
    maxAge: 90 * 24 * 60 * 60,
    path: "/",
    sameSite: "lax" as const,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  for (const [param, cookieName] of attributionParams) {
    const value = url.searchParams.get(param);
    if (value) {
      response.cookies.set(cookieName, value.slice(0, 2048), attributionCookieOptions);
    }
  }

  if (hasAttribution) {
    response.cookies.set(
      "ce-landing-page",
      `${url.pathname}${url.search}`.slice(0, 2048),
      attributionCookieOptions
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
