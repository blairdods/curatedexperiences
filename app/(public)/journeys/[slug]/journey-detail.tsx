"use client";

import { Hero } from "@/components/ui/hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { ItineraryAccordion } from "@/components/ui/itinerary-accordion";
import { Testimonial } from "@/components/ui/testimonial";
import { ImageGrid } from "@/components/ui/image-grid";
import { StickyCta } from "@/components/ui/sticky-cta";
import { JourneyCard } from "@/components/ui/journey-card";
import { Button } from "@/components/ui/button";
import { JOURNEYS, type Journey } from "@/lib/data/journeys";

export function JourneyDetail({ journey }: { journey: Journey }) {
  const relatedJourneys = JOURNEYS.filter(
    (j) => j.slug !== journey.slug
  ).slice(0, 2);

  return (
    <>
      {/* Hero */}
      <Hero
        title={journey.title}
        subtitle={journey.tagline}
        imageSrc={journey.heroImage}
        compact
        cta={{
          label: "Start Planning This Journey",
          onClick: () =>
            window.dispatchEvent(new Event("ce:open-concierge")),
        }}
      />

      {/* Main content + sticky sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-16">
          {/* Left column — content */}
          <div>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-10">
              {journey.idealFor.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs tracking-wide text-navy bg-warm-100 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {journey.seasons.slice(0, 1).map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 text-xs tracking-wide text-warm-500 bg-warm-100 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Narrative */}
            <div className="prose-ce">
              {journey.narrative.split("\n\n").map((p, i) => (
                <p
                  key={i}
                  className="text-foreground/80 leading-relaxed mb-6 last:mb-0"
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Highlights */}
            <div className="mt-16">
              <h2 className="font-serif text-2xl sm:text-3xl text-navy tracking-tight mb-8">
                Key experiences
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {journey.highlights.map((h) => (
                  <div
                    key={h}
                    className="flex items-start gap-3 p-4 rounded-lg bg-warm-100/50"
                  >
                    <span className="text-gold flex-shrink-0 mt-0.5">&#9672;</span>
                    <span className="text-sm text-foreground/80">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div className="mt-16">
              <ImageGrid images={journey.images} columns={2} />
            </div>

            {/* Itinerary */}
            <div className="mt-16">
              <h2 className="font-serif text-2xl sm:text-3xl text-navy tracking-tight mb-8">
                Day by day
              </h2>
              <ItineraryAccordion days={journey.itinerary} />
            </div>

            {/* Inclusions */}
            <div className="mt-16">
              <h2 className="font-serif text-2xl sm:text-3xl text-navy tracking-tight mb-6">
                What&apos;s included
              </h2>
              <ul className="space-y-3">
                {journey.inclusions.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-foreground/80"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      className="w-4 h-4 flex-shrink-0 mt-0.5 text-gold"
                    >
                      <path
                        d="M3 8l3.5 3.5L13 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile CTA */}
            <div className="mt-12 lg:hidden">
              <Button
                size="lg"
                className="w-full"
                onClick={() =>
                  window.dispatchEvent(new Event("ce:open-concierge"))
                }
              >
                Start Planning This Journey
              </Button>
              <p className="mt-3 text-center text-xs text-foreground-muted">
                Every journey is fully customisable
              </p>
            </div>
          </div>

          {/* Right column — sticky CTA (desktop) */}
          <div>
            <StickyCta
              title={journey.title}
              priceFrom={journey.priceFromUsd}
              duration={journey.durationDays}
            />
          </div>
        </div>
      </div>

      {/* Testimonial */}
      {journey.testimonial && (
        <Section background="warm">
          <Testimonial
            quote={journey.testimonial.quote}
            author={journey.testimonial.author}
            location={journey.testimonial.location}
            journey={journey.title}
          />
        </Section>
      )}

      {/* Related journeys */}
      <Section>
        <SectionHeader
          eyebrow="More to explore"
          title="You might also love"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {relatedJourneys.map((j) => (
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
