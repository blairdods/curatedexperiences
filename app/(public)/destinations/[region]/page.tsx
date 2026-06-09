import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDestinationBySlug, DESTINATIONS, type Destination } from "@/lib/data/destinations";
import { getJourneyBySlug } from "@/lib/data/journeys";
import { createServiceClient } from "@/lib/supabase/server";
import { Hero } from "@/components/ui/hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { JourneyCard } from "@/components/ui/journey-card";
import { ConciergeCTAButton } from "@/components/ui/concierge-cta-button";
import { TouristDestinationSchema } from "@/components/ui/schema-markup";

export async function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ region: d.slug }));
}

async function getDestination(slug: string): Promise<Destination | null> {
  // Try database first
  try {
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("destinations")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (data) {
      return {
        slug: data.slug,
        name: data.name,
        region: data.region as "North Island" | "South Island",
        tagline: data.tagline ?? "",
        description: data.description ?? "",
        highlights: data.highlights ?? [],
        bestFor: data.best_for ?? [],
        bestSeasons: data.best_seasons ?? "",
        relatedJourneySlugs: data.related_journey_slugs ?? [],
        heroImage: data.hero_image ?? "",
        images: (data.images as { src: string; alt: string }[]) ?? [],
      };
    }
  } catch {
    // Fall through to static
  }

  return getDestinationBySlug(slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const dest = await getDestination(region);
  if (!dest) return {};
  return {
    title: `${dest.name} | Curated Experiences`,
    description: dest.tagline,
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const dest = await getDestination(region);
  if (!dest) notFound();

  const relatedJourneys = dest.relatedJourneySlugs
    .map(getJourneyBySlug)
    .filter(Boolean);

  return (
    <>
      <TouristDestinationSchema
        name={dest.name}
        description={dest.tagline}
        image={dest.heroImage}
      />
      <Hero
        title={dest.name}
        subtitle={dest.tagline}
        imageSrc={dest.heroImage}
        compact
      />

      <Section>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-10">
            <span className="border-t border-gold/40 pt-2 text-[10px] tracking-[0.16em] uppercase font-semibold text-gold">
              {dest.region}
            </span>
            {dest.bestFor.map((tag) => (
              <span
                key={tag}
                className="border-t border-navy/15 pt-2 text-[10px] tracking-[0.16em] uppercase font-semibold text-navy/55"
              >
                {tag}
              </span>
            ))}
          </div>

          {dest.description.split("\n\n").map((p, i) => (
            <p
              key={i}
              className="text-[15px] text-foreground/80 leading-7 mb-6 last:mb-0"
            >
              {p}
            </p>
          ))}
        </div>
      </Section>

      <Section background="warm">
        <SectionHeader title="Highlights" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {dest.highlights.map((h) => (
            <div
              key={h}
              className="flex items-start gap-3 border-t border-navy/12 bg-[#d8d1c5] p-5"
            >
              <span className="text-gold flex-shrink-0 mt-0.5">&#9672;</span>
              <span className="text-sm text-foreground/80">{h}</span>
            </div>
          ))}
        </div>
        {dest.bestSeasons && (
          <p className="mt-8 text-center text-[10px] uppercase tracking-[0.16em] text-foreground-muted">
            Best seasons: {dest.bestSeasons}
          </p>
        )}
      </Section>

      {relatedJourneys.length > 0 && (
        <Section>
          <SectionHeader
            eyebrow={`Journeys featuring ${dest.name}`}
            title="Explore these journeys"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {relatedJourneys.map((j) =>
              j ? (
                <JourneyCard
                  key={j.slug}
                  slug={j.slug}
                  title={j.title}
                  tagline={j.tagline}
                  durationDays={j.durationDays}
                  regions={j.regions.slice(0, 3)}
                  imageSrc={j.images[0]?.src}
                />
              ) : null
            )}
          </div>
        </Section>
      )}

      <Section background="navy" narrow>
        <div className="text-center">
          <h2 className="font-serif text-[38px] leading-[1.08] tracking-normal text-white">
            Want to explore {dest.name}?
          </h2>
          <p className="mt-4 text-white/60 leading-relaxed">
            Talk to our concierge about building a journey that includes{" "}
            {dest.name} — tailored to exactly what you love.
          </p>
          <div className="mt-8">
            <ConciergeCTAButton variant="gold" size="lg">
              Start Planning
            </ConciergeCTAButton>
          </div>
        </div>
      </Section>
    </>
  );
}
