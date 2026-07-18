import "server-only";

import {
  DESTINATIONS,
  type Destination,
} from "@/lib/data/destinations";
import { createServiceClient } from "@/lib/supabase/server";

export async function getActiveDestinations(): Promise<Destination[]> {
  try {
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("destinations")
      .select(
        "slug, name, region, tagline, best_for, hero_image, images, highlights, best_seasons, related_journey_slugs, description"
      )
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (data && data.length > 0) {
      return data.map((destination) => ({
        slug: destination.slug,
        name: destination.name,
        region: destination.region as "North Island" | "South Island",
        tagline: destination.tagline ?? "",
        description: destination.description ?? "",
        highlights: destination.highlights ?? [],
        bestFor: destination.best_for ?? [],
        bestSeasons: destination.best_seasons ?? "",
        relatedJourneySlugs: destination.related_journey_slugs ?? [],
        heroImage: destination.hero_image ?? "",
        images:
          (destination.images as { src: string; alt: string }[]) ?? [],
      }));
    }
  } catch {
    // Keep the public pages available if the database is temporarily offline.
  }

  return DESTINATIONS;
}
