"use client";

import { Hero } from "@/components/ui/hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { JourneyCard } from "@/components/ui/journey-card";
import { Testimonial } from "@/components/ui/testimonial";
import { Button } from "@/components/ui/button";

const PLACEHOLDER_JOURNEYS = [
  {
    slug: "south-island-odyssey",
    title: "South Island Odyssey",
    tagline:
      "From Queenstown's peaks to Fiordland's ancient waterways — the essential South Island experience.",
    durationDays: 14,
    regions: ["Queenstown", "Fiordland", "Wanaka"],
    imageSrc:
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80",
  },
  {
    slug: "wine-culinary-trail",
    title: "Wine & Culinary Trail",
    tagline:
      "Marlborough vineyards, Hawke's Bay estates, and Wellington's world-class dining scene.",
    durationDays: 10,
    regions: ["Marlborough", "Hawke's Bay", "Wellington"],
    imageSrc:
      "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&q=80",
  },
  {
    slug: "wilderness-adventure",
    title: "Wilderness & Adventure",
    tagline:
      "Heli-hiking glaciers, jet-boating canyons, and stargazing from the world's darkest skies.",
    durationDays: 12,
    regions: ["Aoraki", "West Coast", "Queenstown"],
    imageSrc:
      "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Hero
        title="New Zealand, as it was meant to be experienced"
        subtitle="Bespoke luxury journeys crafted by local experts who know every hidden lodge, every secret trail, and every sunset worth chasing."
        imageSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
        imageAlt="Milford Sound, Fiordland, New Zealand"
        cta={{
          label: "Start Planning",
          onClick: () =>
            window.dispatchEvent(new Event("ce:open-concierge")),
        }}
        secondaryCta={{
          label: "Explore Journeys",
          onClick: () =>
            document
              .getElementById("journeys")
              ?.scrollIntoView({ behavior: "smooth" }),
        }}
      />

      {/* Introduction */}
      <Section narrow>
        <div className="text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-warm-500 mb-6">
            A PPG Tours Venture
          </p>
          <p className="font-serif text-2xl sm:text-3xl leading-relaxed text-navy tracking-tight">
            We don&apos;t sell tours. We craft journeys — shaped around who you are,
            what moves you, and the New Zealand you&apos;ve been dreaming of.
          </p>
          <p className="mt-8 text-foreground-muted leading-relaxed max-w-lg mx-auto">
            Every experience is designed by Tony and Liam, two New Zealanders
            with decades of luxury travel expertise and an intimate knowledge of
            this extraordinary country.
          </p>
        </div>
      </Section>

      {/* Journeys */}
      <Section background="warm" id="journeys">
        <SectionHeader
          eyebrow="Our Journeys"
          title="Experiences that stay with you"
          subtitle="Each journey is a starting point — fully customisable around your interests, pace, and the season."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PLACEHOLDER_JOURNEYS.map((j) => (
            <JourneyCard key={j.slug} {...j} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            View All Journeys
          </Button>
        </div>
      </Section>

      {/* Testimonial */}
      <Section>
        <Testimonial
          quote="We've travelled the world, but nothing has come close to what Tony and the team crafted for us in New Zealand. Every single day exceeded our expectations."
          author="Sarah & David Chen"
          location="San Francisco, CA"
          journey="South Island Odyssey"
        />
      </Section>

      {/* Why CE */}
      <Section background="navy">
        <SectionHeader
          eyebrow="Why Curated Experiences"
          title="What makes us different"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12 text-center">
          {[
            {
              title: "Local expertise",
              description:
                "Born and raised in New Zealand, our curators know places that don't appear in any guidebook.",
            },
            {
              title: "Truly bespoke",
              description:
                "No two journeys are alike. Every itinerary is designed from scratch around your interests and pace.",
            },
            {
              title: "AI-powered planning",
              description:
                "Our concierge uses local knowledge to help you explore ideas — then our team brings them to life.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-serif text-xl text-white tracking-tight">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-white/60 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section narrow>
        <div className="text-center">
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-navy">
            Ready to start imagining?
          </h2>
          <p className="mt-4 text-foreground-muted leading-relaxed">
            Talk to our concierge about your dream New Zealand journey — no
            obligation, just inspiration.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              onClick={() =>
                window.dispatchEvent(new Event("ce:open-concierge"))
              }
            >
              Talk to Our Concierge
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
