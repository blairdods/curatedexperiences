import { JOURNEYS } from "@/lib/data/journeys";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { JourneyCard } from "@/components/ui/journey-card";

export default function JourneysPage() {
  return (
    <>
      <Hero
        title="Our Journeys"
        subtitle="Every journey is a starting point — fully customisable around your interests, pace, and the season."
        imageSrc="https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1920&q=80"
        imageAlt="Lake Wanaka, New Zealand"
        compact
      />

      <Section>
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
            />
          ))}
        </div>
      </Section>
    </>
  );
}
