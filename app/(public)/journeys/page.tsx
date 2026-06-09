import { JOURNEYS } from "@/lib/data/journeys";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { JourneyCard } from "@/components/ui/journey-card";

export default function JourneysPage() {
  return (
    <>
      <Hero
        eyebrow="Signature Journeys"
        title="Considered frameworks, never fixed itineraries."
        subtitle="Each journey begins as a point of orientation, then is reshaped around your pace, preferences, season, and reason for travelling."
        imageSrc="/homepage-draft/e7df34af1180e68943e14157c7d064f99c0af99c.png"
        imageAlt="Lake Wakatipu and alpine ridgeline"
        compact
      />

      <Section background="navy">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {JOURNEYS.map((j) => (
            <JourneyCard
              key={j.slug}
              slug={j.slug}
              title={j.title}
              tagline={j.tagline}
              durationDays={j.durationDays}
              regions={j.regions.slice(0, 3)}
              imageSrc={j.images[0]?.src}
              dark
            />
          ))}
        </div>
      </Section>
    </>
  );
}
