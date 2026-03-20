import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDestinationBySlug, DESTINATIONS } from "@/lib/data/destinations";
import { getJourneyBySlug } from "@/lib/data/journeys";
import { Hero } from "@/components/ui/hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { JourneyCard } from "@/components/ui/journey-card";
import { ConciergeCTAButton } from "@/components/ui/concierge-cta-button";

export async function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ region: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const dest = getDestinationBySlug(region);
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
  const dest = getDestinationBySlug(region);
  if (!dest) notFound();

  const relatedJourneys = dest.relatedJourneySlugs
    .map(getJourneyBySlug)
    .filter(Boolean);

  return (
    <>
      <Hero
        title={dest.name}
        subtitle={dest.tagline}
        imageSrc={dest.heroImage}
        compact
      />

      <Section>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-10">
            <span className="px-3 py-1 text-xs tracking-wide text-warm-500 bg-warm-100 rounded-full">
              {dest.region}
            </span>
            {dest.bestFor.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs tracking-wide text-navy bg-warm-100 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {dest.description.split("\n\n").map((p, i) => (
            <p
              key={i}
              className="text-foreground/80 leading-relaxed mb-6 last:mb-0"
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
              className="flex items-start gap-3 p-4 rounded-lg bg-white/60"
            >
              <span className="text-gold flex-shrink-0 mt-0.5">&#9672;</span>
              <span className="text-sm text-foreground/80">{h}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-foreground-muted">
          Best seasons: {dest.bestSeasons}
        </p>
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
          <h2 className="font-serif text-3xl tracking-tight text-white">
            Want to explore {dest.name}?
          </h2>
          <p className="mt-4 text-white/60 leading-relaxed">
            Talk to our concierge about building a journey that includes{" "}
            {dest.name} — tailored to exactly what you love.
          </p>
          <div className="mt-8">
            <ConciergeCTAButton variant="secondary" size="lg">
              Start Planning
            </ConciergeCTAButton>
          </div>
        </div>
      </Section>
    </>
  );
}
