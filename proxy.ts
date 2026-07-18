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

  // Persist UTM params for attribution
  const url = new URL(request.url);
  const utmCampaign = url.searchParams.get("utm_campaign");
  if (utmCampaign) {
    response.cookies.set("ce-utm-campaign", utmCampaign, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });
  }

  const utmSource = url.searchParams.get("utm_source");
  if (utmSource) {
    response.cookies.set("ce-utm-source", utmSource, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
