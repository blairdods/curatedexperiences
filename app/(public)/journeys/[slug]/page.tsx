import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getJourneyBySlug, JOURNEYS, type Journey } from "@/lib/data/journeys";
import type { ItineraryDay } from "@/lib/data/itinerary-types";
import { createServiceClient } from "@/lib/supabase/server";
import { TravelActionSchema } from "@/components/ui/schema-markup";
import { JourneyDetail } from "./journey-detail";

export const revalidate = 60; // re-fetch from DB at most once per minute

export async function generateStaticParams() {
  return JOURNEYS.map((j) => ({ slug: j.slug }));
}

async function getJourney(slug: string): Promise<Journey | null> {
  // Try database first
  try {
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("tours")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (data) {
      const media = (data.media ?? []) as { src: string; alt: string }[];
      // Map DB itinerary_days to the ItineraryDay format the public page expects
      const itinerary: ItineraryDay[] = ((data.itinerary_days ?? []) as Record<string, unknown>[]).map((d) => ({
        day: d.day as number,
        title: d.title as string ?? "",
        description: d.description as string ?? "",
        overnight: d.accommodation as string ?? d.overnight as string ?? undefined,
        highlights: (d.activities as string[]) ?? (d.highlights as string[]) ?? [],
        locationGroupId: d.locationGroupId as string ?? undefined,
      }));

      return {
        slug: data.slug,
        title: data.title,
        tagline: data.tagline ?? "",
        narrative: (data as Record<string, unknown>).narrative as string ?? data.tagline ?? "",
        durationDays: data.duration_days ?? 10,
        priceFromUsd: data.price_from_usd ?? 0,
        regions: data.regions ?? [],
        experienceTags: data.experience_tags ?? [],
        idealFor: data.ideal_for ?? [],
        seasons: data.seasons ?? [],
        highlights: data.highlights ?? [],
        inclusions: data.inclusions ?? [],
        itinerary,
        images: media,
        heroImage: media[0]?.src ?? "",
      };
    }
  } catch {
    // Fall through to static data
  }

  // Fall back to static data
  return getJourneyBySlug(slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const journey = await getJourney(slug);
  if (!journey) return {};

  return {
    title: `${journey.title} | Curated Experiences`,
    description: journey.tagline,
    openGraph: {
      title: `${journey.title} | Curated Experiences`,
      description: journey.tagline,
      type: "website",
      images: journey.heroImage ? [{ url: journey.heroImage }] : undefined,
    },
  };
}

export default async function JourneyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const journey = await getJourney(slug);

  if (!journey) notFound();

  return (
    <>
      <TravelActionSchema
        name={journey.title}
        description={journey.tagline}
        image={journey.heroImage}
        price={journey.priceFromUsd}
        duration={journey.durationDays}
        url={`https://curatedexperiences.com/journeys/${slug}`}
      />
      <JourneyDetail journey={journey} />
    </>
  );
}
