import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";
import { JOURNEYS } from "@/lib/data/journeys";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await getUserRole(user.email);
  if (role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const serviceSupabase = await createServiceClient();

  // Find slugs already in DB
  const { data: existing } = await serviceSupabase.from("tours").select("slug");
  const existingSlugs = new Set((existing ?? []).map((r) => r.slug));

  const toInsert = JOURNEYS.filter((j) => !existingSlugs.has(j.slug)).map((j) => ({
    slug: j.slug,
    title: j.title,
    tagline: j.tagline,
    narrative: j.narrative,
    duration_days: j.durationDays,
    price_from_usd: j.priceFromUsd,
    regions: j.regions,
    experience_tags: j.experienceTags,
    ideal_for: j.idealFor,
    seasons: j.seasons,
    highlights: j.highlights,
    inclusions: j.inclusions,
    // Store itinerary days preserving the static format — public page handles both shapes
    itinerary_days: j.itinerary as unknown as Record<string, unknown>[],
    media: j.heroImage
      ? [{ src: j.heroImage, alt: j.title }, ...j.images.filter((img) => img.src !== j.heroImage)]
      : j.images,
    active: true,
  }));

  if (toInsert.length === 0) {
    return NextResponse.json({ seeded: 0, message: "All journeys already in database" });
  }

  const { error } = await serviceSupabase.from("tours").insert(toInsert);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ seeded: toInsert.length, slugs: toInsert.map((j) => j.slug) });
}
