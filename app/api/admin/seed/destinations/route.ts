import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";
import { DESTINATIONS } from "@/lib/data/destinations";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await getUserRole(user.email);
  if (role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const serviceSupabase = await createServiceClient();

  // Find slugs already in DB
  const { data: existing } = await serviceSupabase.from("destinations").select("slug");
  const existingSlugs = new Set((existing ?? []).map((r) => r.slug));

  const toInsert = DESTINATIONS.filter((d) => !existingSlugs.has(d.slug)).map((d) => ({
    slug: d.slug,
    name: d.name,
    region: d.region,
    tagline: d.tagline,
    description: d.description,
    highlights: d.highlights,
    best_for: d.bestFor,
    best_seasons: d.bestSeasons,
    related_journey_slugs: d.relatedJourneySlugs,
    hero_image: d.heroImage,
    images: d.images,
    active: true,
  }));

  if (toInsert.length === 0) {
    return NextResponse.json({ seeded: 0, message: "All destinations already in database" });
  }

  const { error } = await serviceSupabase.from("destinations").insert(toInsert);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ seeded: toInsert.length, slugs: toInsert.map((d) => d.slug) });
}
