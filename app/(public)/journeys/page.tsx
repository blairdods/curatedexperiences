import { JOURNEYS } from "@/lib/data/journeys";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { JourneyCard } from "@/components/ui/journey-card";
import { getImageSlotOverrides } from "@/lib/image-slot-settings";
import { getSlotImage } from "@/lib/image-slots";

export default async function JourneysPage() {
  const imageSlots = await getImageSlotOverrides();
  const heroImage = getSlotImage(imageSlots, "page.journeys.hero");

  return (
    <>
      <Hero
        eyebrow="Signature Journeys"
        title="Considered frameworks, never fixed itineraries."
        subtitle="Take a moment to be inspired by some of our signature journeys. Every journey can be customised to evolve around your interests, pace and preferences for travelling."
        imageSrc={heroImage.src}
        imageAlt={heroImage.alt}
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
              showPrimaryRegion={false}
              dark
            />
          ))}
        </div>
      </Section>
    </>
  );
}
