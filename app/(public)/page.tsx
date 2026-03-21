"use client";

import Link from "next/link";
import { useSignals } from "@/lib/personalisation/use-signals";
import { Section, SectionHeader } from "@/components/ui/section";
import { JourneyCard } from "@/components/ui/journey-card";
import { Testimonial } from "@/components/ui/testimonial";
import { Button } from "@/components/ui/button";
import { JOURNEYS } from "@/lib/data/journeys";
import { ARTICLES } from "@/lib/data/journal";

// --- Hero variants by personalisation signal ---
const HERO_VARIANTS: Record<
  string,
  { title: string; subtitle: string; image: string }
> = {
  "luxury-us": {
    title: "New Zealand, as it was meant to be experienced",
    subtitle:
      "Bespoke luxury journeys crafted by local experts who know every hidden lodge, every secret trail, and every sunset worth chasing.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  },
  "adventure-us": {
    title: "The adventure of a lifetime starts here",
    subtitle:
      "Glacier heli-hikes, canyon jet boats, and starlit skies — New Zealand's most extraordinary experiences, designed for you.",
    image:
      "https://images.unsplash.com/photo-1469521669194-babb45599def?w=1920&q=80",
  },
  "culinary-us": {
    title: "Taste New Zealand at its finest",
    subtitle:
      "From Marlborough's world-famous vineyards to Wellington's MICHELIN-recognised restaurants — a culinary journey like no other.",
    image:
      "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1920&q=80",
  },
  international: {
    title: "Discover Aotearoa New Zealand",
    subtitle:
      "A land of extraordinary beauty, warm hospitality, and journeys designed around what moves you.",
    image:
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1920&q=80",
  },
};

// --- Journey order by featured signal ---
function getOrderedJourneys(featured: string) {
  const sorted = [...JOURNEYS];
  const idx = sorted.findIndex((j) => j.slug === featured);
  if (idx > 0) {
    const [item] = sorted.splice(idx, 1);
    sorted.unshift(item);
  }
  return sorted;
}

export default function HomePage() {
  const signals = useSignals();
  const hero =
    HERO_VARIANTS[signals.heroVariant] ?? HERO_VARIANTS["luxury-us"];
  const journeys = getOrderedJourneys(signals.featuredJourney);
  const ctaLabel =
    signals.ctaTone === "direct" ? "Start Planning Now" : "Start Planning";

  return (
    <>
      {/* Personalised Hero */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
        <img
          src={hero.image}
          alt="New Zealand landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/70 via-navy-dark/30 to-navy-dark/10" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.1] text-white">
            {hero.title}
          </h1>
          <p className="mt-6 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto text-white/80">
            {hero.subtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() =>
                window.dispatchEvent(new Event("ce:open-concierge"))
              }
            >
              {ctaLabel}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
              onClick={() =>
                document
                  .getElementById("journeys")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Journeys
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <div className="bg-white border-b border-warm-200">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs tracking-wide text-foreground-muted">
          <span className="flex items-center gap-2">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-gold">
              <path d="M8 0l2.5 5 5.5.8-4 3.8 1 5.4L8 12.5 2.5 15l1-5.4L0 5.8l5.5-.8z" />
            </svg>
            World Travel Award Winners
          </span>
          <span className="text-warm-300">|</span>
          <span>20+ Years NZ Travel Expertise</span>
          <span className="text-warm-300">|</span>
          <span>Trusted by Silversea, Ponant & MSC</span>
          <span className="text-warm-300">|</span>
          <span>100% Bespoke Journeys</span>
        </div>
      </div>

      {/* Introduction */}
      <Section narrow>
        <div className="text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-warm-500 mb-6">
            A PPG Tours Venture
          </p>
          <p className="font-serif text-2xl sm:text-3xl leading-relaxed text-navy tracking-tight">
            We don&apos;t sell tours. We craft journeys — shaped around who you
            are, what moves you, and the New Zealand you&apos;ve been dreaming
            of.
          </p>
          <p className="mt-8 text-foreground-muted leading-relaxed max-w-lg mx-auto">
            Every experience is designed by Tony and Liam, two New Zealanders
            with decades of luxury travel expertise and an intimate knowledge of
            this extraordinary country.
          </p>
        </div>
      </Section>

      {/* Featured Journeys (ordered by personalisation) */}
      <Section background="warm" id="journeys">
        <SectionHeader
          eyebrow="Our Journeys"
          title="Experiences that stay with you"
          subtitle="Each journey is a starting point — fully customisable around your interests, pace, and the season."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {journeys.map((j) => (
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
        <div className="mt-12 text-center">
          <Link href="/journeys">
            <Button variant="outline" size="lg">
              View All Journeys
            </Button>
          </Link>
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

      {/* Journal Teaser */}
      <Section>
        <SectionHeader
          eyebrow="From the Journal"
          title="Stories & Inspiration"
          subtitle="Insights from our curators on New Zealand travel, destinations, and the art of slow exploration."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {ARTICLES.slice(0, 3).map((article) => (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              className="group block"
            >
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-warm-100 mb-4">
                <img
                  src={article.heroImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-xs tracking-widest uppercase text-warm-500">
                {article.category}
              </p>
              <h3 className="mt-2 font-serif text-lg text-navy tracking-tight group-hover:text-navy-light transition-colors">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-foreground-muted leading-relaxed line-clamp-2">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/journal">
            <Button variant="outline" size="md">
              Read the Journal
            </Button>
          </Link>
        </div>
      </Section>

      {/* CTA */}
      <Section narrow background="warm">
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
