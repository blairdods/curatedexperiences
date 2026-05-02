"use client";

import Link from "next/link";
import Image from "next/image";
import { useSignals } from "@/lib/personalisation/use-signals";
import { Section, SectionHeader } from "@/components/ui/section";
import { JourneyCard } from "@/components/ui/journey-card";
import { Testimonial } from "@/components/ui/testimonial";
import { Button } from "@/components/ui/button";
import { JOURNEYS } from "@/lib/data/journeys";
import type { Article } from "@/lib/data/journal";

// --- Hero variants by personalisation signal ---
const HERO_VARIANTS: Record<
  string,
  { title: string; subtitle: string; image: string }
> = {
  "luxury-us": {
    title: "New Zealand, Reimagined.",
    subtitle:
      "Where world-class luxury meets untouched wilderness. Your personal curator awaits.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  },
  "adventure-us": {
    title: "New Zealand, Reimagined.",
    subtitle:
      "Glacier heli-hikes, canyon jet boats, and starlit skies — extraordinary experiences, designed for you.",
    image:
      "https://images.unsplash.com/photo-1469521669194-babb45599def?w=1920&q=80",
  },
  "culinary-us": {
    title: "New Zealand, Reimagined.",
    subtitle:
      "From Marlborough's world-famous vineyards to MICHELIN-recognised restaurants — a culinary journey like no other.",
    image:
      "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1920&q=80",
  },
  international: {
    title: "New Zealand, Reimagined.",
    subtitle:
      "Curated Experiences for the discerning traveller. From glacial peaks to private vineyards, your journey is curated by us, but authored by you.",
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

export default function HomePage({ articles }: { articles: Article[] }) {
  const signals = useSignals();
  const hero =
    HERO_VARIANTS[signals.heroVariant] ?? HERO_VARIANTS["luxury-us"];
  const journeys = getOrderedJourneys(signals.featuredJourney);
  const ctaLabel =
    signals.ctaTone === "direct" ? "Begin Your Journey" : "Begin Your Journey";

  return (
    <>
      {/* Hero */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={hero.image}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Alpine_Lodge_Helicopter_Landing_Video.mp4" type="video/mp4" />
        </video>
        {/* Fallback image for browsers that don't autoplay */}
        <Image
          src={hero.image}
          alt="New Zealand landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover -z-10"
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
                  .getElementById("experiences")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Experiences
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-white border-b border-warm-200">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs tracking-wide text-foreground-muted">
          <span className="flex items-center gap-2">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-gold">
              <path d="M8 0l2.5 5 5.5.8-4 3.8 1 5.4L8 12.5 2.5 15l1-5.4L0 5.8l5.5-.8z" />
            </svg>
            Best NZ DMC — World Travel Awards 2025
          </span>
          <span className="text-warm-300">|</span>
          <span className="flex items-center gap-2">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-gold">
              <path d="M8 0l2.5 5 5.5.8-4 3.8 1 5.4L8 12.5 2.5 15l1-5.4L0 5.8l5.5-.8z" />
            </svg>
            2026 Finalist — NZ Tour Operator &amp; DMC of the Year
          </span>
          <span className="text-warm-300">|</span>
          <span>Trusted by Silversea, Ponant &amp; Celebrity Cruises</span>
          <span className="text-warm-300">|</span>
          <span>NZ-Owned &amp; Operated — 20+ Years</span>
        </div>
      </div>

      {/* Experiences (Gallery Style) */}
      <Section background="warm" id="experiences">
        <SectionHeader
          eyebrow="Our Experiences"
          title="Six Signature Journeys"
          subtitle="Each experience is a starting point — fully customisable around your desires, pace, and the season."
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
      </Section>

      {/* The "Curated" Difference */}
      <Section narrow>
        <div className="text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-warm-500 mb-6">
            The &ldquo;Curated&rdquo; Difference
          </p>
          <p className="font-serif text-2xl sm:text-3xl leading-relaxed text-navy tracking-tight">
            Every journey is a masterwork — never a template.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-3xl mx-auto">
          {[
            {
              title: "Curated vs. Created",
              description:
                "We don't just create trips; we curate moments. Every experience is a blueprint, calibrated to your specific pace and heartbeat.",
            },
            {
              title: "Exclusive Access",
              description:
                "We open doors to private estates and 'closed-to-public' lodges that remain invisible to the standard traveller.",
            },
            {
              title: "Local Wisdom",
              description:
                "Based in NZ, we know the secret tides, the hidden tracks, and the best tables. We are your on-the-ground experts.",
            },
            {
              title: "Your Personal Curators",
              description:
                "We care about you. Your dedicated travel designer is with you from first conversation through every day on the ground — ensuring your experience is seamless, safe, and spectacular.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-serif text-lg text-navy tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonial */}
      <Section>
        <Testimonial
          quote="We've travelled the world, but nothing has come close to what Tony and the team crafted for us in New Zealand. Every single day exceeded our expectations."
          author="Sarah & David Chen"
          location="San Francisco, CA"
          journey="The Masterpiece"
        />
      </Section>

      {/* Heritage of Excellence */}
      <Section background="navy">
        <SectionHeader
          eyebrow="Heritage of Excellence"
          title="The PPG Collective"
        />
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-white/70 leading-relaxed">
            Curated Experiences is the luxury travel division of the PPG
            Collective — comprising PPG Tours and PPG Events. For over two
            decades, PPG has set the standard for premium experiences in New
            Zealand and the Pacific.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-serif text-lg text-white tracking-tight">
                PPG Tours
              </h3>
              <p className="mt-2 text-sm text-white/50 leading-relaxed">
                Best New Zealand DMC — World Travel Awards 2025.
                Trusted by Silversea, Ponant, Celebrity, and MSC for bespoke
                shore excursions and VIP land programs across New Zealand.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-lg text-white tracking-tight">
                PPG Events
              </h3>
              <p className="mt-2 text-sm text-white/50 leading-relaxed">
                Premium event management across New Zealand. Corporate
                retreats, incentive programs, and milestone celebrations
                delivered with precision and flair.
              </p>
            </div>
          </div>
          <div className="mt-10 p-6 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs tracking-widest uppercase text-white/40 mb-2">
              Why This Matters
            </p>
            <p className="text-sm text-white/70 leading-relaxed">
              Luxury is easy to promise, but difficult to deliver in the remote
              corners of New Zealand. Because Curated Experiences&trade; is powered by
              the Best New Zealand DMC (World Travel Awards 2025), we don&apos;t
              just book your travel — we own the logistics. From our private
              fleet to our &apos;closed-door&apos; relationships with lodge
              owners, your journey is secured by the most decorated travel team
              in the country.
            </p>
          </div>
        </div>
      </Section>

      {/* Privacy & Discretion */}
      <Section>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-warm-500 mb-6">
            A Covenant of Discretion
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-navy">
            Your Privacy, Our Promise
          </h2>
          <p className="mt-6 text-foreground-muted leading-relaxed">
            We understand that our guests value privacy as much as they value
            extraordinary experiences. Curated Experiences maintains the highest
            standards of discretion.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              {
                title: "Confidential planning",
                description:
                  "All communications and itinerary details are handled through secure, private channels.",
              },
              {
                title: "Absolute Privacy",
                description:
                  "For our high-profile guests, we provide an 'off-grid' experience.",
              },
              {
                title: "Secure Logistics",
                description:
                  "NDA-bound staffing, private terminal arrivals, and exclusive-use 'buy-out' lodge stays to ensure your journey remains entirely confidential.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl bg-warm-100/50"
              >
                <h3 className="text-sm font-medium text-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-foreground-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Journal Teaser */}
      <Section background="warm">
        <SectionHeader
          eyebrow="From the Journal"
          title="Stories & Inspiration"
          subtitle="Insights from our curators on New Zealand travel, destinations, and the art of slow exploration."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {articles.slice(0, 3).map((article) => (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              className="group block"
            >
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-warm-100 mb-4">
                <Image
                  src={article.heroImage}
                  alt={article.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
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
      <Section narrow>
        <div className="text-center">
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-navy">
            Begin Your Journey
          </h2>
          <p className="mt-4 text-foreground-muted leading-relaxed">
            Talk to your personal curator about your dream New Zealand
            experience — no obligation, just inspiration.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() =>
                window.dispatchEvent(new Event("ce:open-concierge"))
              }
            >
              Start a Conversation
            </Button>
            <a
              href="tel:+6498895828"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm tracking-wide text-navy border border-navy/20
                rounded-lg hover:bg-navy/5 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              Call +64 9 889 5828
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
