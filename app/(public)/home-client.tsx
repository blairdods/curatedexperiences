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

const HERO_VARIANTS: Record<
  string,
  { title: string; subtitle: string; image: string }
> = {
  "luxury-us": {
    title: "New Zealand,\nPersonally Curated.",
    subtitle:
      "Private journeys for discerning travellers. Designed from first conversation to final farewell.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  },
  "adventure-us": {
    title: "New Zealand,\nPersonally Curated.",
    subtitle:
      "Glacier heli-hikes, canyon jet boats, and starlit skies — designed for those who seek more.",
    image:
      "https://images.unsplash.com/photo-1469521669194-babb45599def?w=1920&q=80",
  },
  "culinary-us": {
    title: "New Zealand,\nPersonally Curated.",
    subtitle:
      "From Marlborough's world-renowned vineyards to MICHELIN-recognised restaurants — a journey built around flavour.",
    image:
      "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1920&q=80",
  },
  international: {
    title: "New Zealand,\nPersonally Curated.",
    subtitle:
      "From glacial peaks to private vineyards — your journey is curated by us, authored by you.",
    image:
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1920&q=80",
  },
};

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
  const hero = HERO_VARIANTS[signals.heroVariant] ?? HERO_VARIANTS["luxury-us"];
  const journeys = getOrderedJourneys(signals.featuredJourney);

  return (
    <>
      {/* ─── HERO — full-screen, nav overlays top ─── */}
      <section className="relative w-full min-h-screen flex items-end overflow-hidden">
        <video
          autoPlay muted loop playsInline
          poster={hero.image}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Alpine_Lodge_Helicopter_Landing_Video.mp4" type="video/mp4" />
        </video>
        <Image
          src={hero.image}
          alt="New Zealand landscape"
          fill priority sizes="100vw"
          className="object-cover -z-10"
        />
        {/* Gradient heavier at base for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/40 to-transparent" />

        {/* Content — left-aligned at bottom of frame */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pb-20 sm:pb-28">
          <p className="text-xs tracking-[0.3em] uppercase font-medium text-gold mb-6">
            New Zealand Travel
          </p>
          <h1 className="font-serif font-semibold text-cream text-6xl sm:text-7xl lg:text-8xl tracking-tight leading-[1.0] max-w-4xl whitespace-pre-line">
            {hero.title}
          </h1>
          <div className="mt-7 h-px w-12 bg-gold" />
          <p className="mt-7 text-base sm:text-lg text-cream/70 leading-relaxed max-w-lg">
            {hero.subtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
            <Button
              variant="gold"
              size="lg"
              onClick={() => window.dispatchEvent(new Event("ce:open-concierge"))}
            >
              Begin Your Journey
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-cream/70 hover:bg-cream/10 border border-cream/20"
              onClick={() => document.getElementById("experiences")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Experiences
            </Button>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <div className="bg-navy border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-5 flex flex-wrap items-center justify-start gap-x-10 gap-y-2 text-xs tracking-[0.15em] uppercase text-cream/40">
          <span className="flex items-center gap-2">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-gold flex-shrink-0">
              <path d="M8 0l2.5 5 5.5.8-4 3.8 1 5.4L8 12.5 2.5 15l1-5.4L0 5.8l5.5-.8z" />
            </svg>
            Best NZ DMC — World Travel Awards 2025
          </span>
          <span className="text-cream/20 hidden sm:inline">·</span>
          <span>2026 Finalist — NZ Tour Operator &amp; DMC of the Year</span>
          <span className="text-cream/20 hidden sm:inline">·</span>
          <span>Trusted by Silversea, Ponant &amp; Celebrity Cruises</span>
          <span className="text-cream/20 hidden sm:inline">·</span>
          <span>NZ-Owned &amp; Operated — 20+ Years</span>
        </div>
      </div>

      {/* ─── EDITORIAL INTRO — ESSENCE split layout ─── */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase font-medium text-gold mb-5">
                The Curated Difference
              </p>
              <h2 className="font-serif font-medium text-navy text-4xl sm:text-5xl tracking-tight leading-[1.05]">
                We don&apos;t create trips.<br />We curate time.
              </h2>
              <div className="mt-6 h-px w-10 bg-gold" />
              <p className="mt-8 text-base text-foreground-muted leading-relaxed">
                Every journey we design begins with a conversation — not a catalogue.
                We listen to what moves you, what slows you down, what you&apos;ve never
                quite found elsewhere. Then we build something that answers it precisely.
              </p>
              <p className="mt-5 text-base text-foreground-muted leading-relaxed">
                We open doors that don&apos;t appear on booking platforms: private estates,
                closed-to-public lodges, the guide who knows the mountain like the back of
                his hand, the table that isn&apos;t on the menu.
              </p>
              <div className="mt-10">
                <Button
                  variant="gold"
                  size="md"
                  onClick={() => window.dispatchEvent(new Event("ce:open-concierge"))}
                >
                  Start a Conversation
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=900&q=80"
                alt="New Zealand landscape"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── JOURNEYS GRID ─── */}
      <Section background="navy" id="experiences">
        <SectionHeader
          eyebrow="Six Signature Journeys"
          title="Curators of Exceptional Experiences"
          subtitle="Each journey is a starting point — fully remade around you."
          align="left"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {journeys.map((j) => (
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

      {/* ─── TESTIMONIAL ─── */}
      <Section background="default">
        <Testimonial
          quote="We've travelled the world, but nothing has come close to what Tony and the team crafted for us in New Zealand. Every single day exceeded our expectations."
          author="Sarah & David Chen"
          location="San Francisco, CA"
          journey="The Masterpiece"
        />
      </Section>

      {/* ─── CURATORS — dark editorial split ─── */}
      <section className="bg-navy py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative aspect-[3/4] overflow-hidden order-2 lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=900&q=80"
                alt="New Zealand wilderness"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-xs tracking-[0.3em] uppercase font-medium text-gold mb-5">
                Heritage of Excellence
              </p>
              <h2 className="font-serif font-medium text-cream text-4xl sm:text-5xl tracking-tight leading-[1.05]">
                The PPG Collective
              </h2>
              <div className="mt-6 h-px w-10 bg-gold" />
              <p className="mt-8 text-base text-cream/60 leading-relaxed">
                Curated Experiences is the luxury travel division of the PPG Collective —
                comprising PPG Tours and PPG Events. For over two decades, PPG has set the
                standard for premium experiences in New Zealand and the Pacific.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="border-t border-gold/30 pt-5">
                  <p className="font-serif text-cream text-lg tracking-tight">PPG Tours</p>
                  <p className="mt-2 text-xs text-cream/40 leading-relaxed">
                    Best New Zealand DMC — World Travel Awards 2025. Trusted by Silversea, Ponant, Celebrity and MSC.
                  </p>
                </div>
                <div className="border-t border-gold/30 pt-5">
                  <p className="font-serif text-cream text-lg tracking-tight">PPG Events</p>
                  <p className="mt-2 text-xs text-cream/40 leading-relaxed">
                    Premium event management across New Zealand — corporate retreats, incentive programs, milestone celebrations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRIVACY ─── */}
      <Section background="default" narrow>
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] uppercase font-medium text-gold mb-6">
            A Covenant of Discretion
          </p>
          <h2 className="font-serif font-medium text-3xl sm:text-4xl tracking-tight text-navy">
            Your Privacy, Our Promise
          </h2>
          <div className="mt-6 h-px w-10 bg-gold mx-auto" />
          <p className="mt-8 text-foreground-muted leading-relaxed">
            We understand that our guests value privacy as much as they value
            extraordinary experiences.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-0 text-left">
            {[
              {
                title: "Confidential planning",
                description:
                  "All communications and itinerary details handled through secure, private channels.",
              },
              {
                title: "Absolute privacy",
                description:
                  "For our high-profile guests, we provide a fully off-grid experience.",
              },
              {
                title: "Secure logistics",
                description:
                  "NDA-bound staffing, private terminal arrivals, and exclusive-use lodge buy-outs.",
              },
            ].map((item, i) => (
              <div key={item.title} className={`p-8 bg-stone/20 ${i > 0 ? "border-l border-stone/40" : ""}`}>
                <div className="w-6 h-px bg-gold mb-4" />
                <h3 className="text-sm font-medium text-navy mb-2">{item.title}</h3>
                <p className="text-xs text-foreground-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── JOURNAL ─── */}
      <Section background="warm">
        <SectionHeader
          eyebrow="From the Journal"
          title="The Art of Slow Travel"
          subtitle="Insights from our curators on New Zealand destinations, lodges, and the craft of slow exploration."
          align="left"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {articles.slice(0, 3).map((article) => (
            <Link key={article.slug} href={`/journal/${article.slug}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden bg-warm-200 mb-5">
                <Image
                  src={article.heroImage}
                  alt={article.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                />
              </div>
              <p className="text-xs tracking-[0.25em] uppercase font-medium text-gold">
                {article.category}
              </p>
              <h3 className="mt-2 font-serif font-medium text-lg text-navy tracking-tight group-hover:text-navy-light transition-colors">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-foreground-muted leading-relaxed line-clamp-2">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-14">
          <Link href="/journal">
            <Button variant="gold" size="md">Read the Journal</Button>
          </Link>
        </div>
      </Section>

      {/* ─── FINAL CTA — dark editorial ─── */}
      <section className="bg-navy py-28 sm:py-36">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <p className="text-xs tracking-[0.3em] uppercase font-medium text-gold mb-6">
            Let&apos;s Design Something Exceptional
          </p>
          <h2 className="font-serif font-semibold text-cream text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.0] max-w-3xl">
            Begin Your Journey
          </h2>
          <div className="mt-8 h-px w-12 bg-gold" />
          <p className="mt-8 text-base text-cream/60 leading-relaxed max-w-lg">
            Talk to your personal curator about your New Zealand experience.
            No obligation — just a conversation.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-start gap-5">
            <Button
              variant="gold"
              size="lg"
              onClick={() => window.dispatchEvent(new Event("ce:open-concierge"))}
            >
              Start a Conversation
            </Button>
            <a
              href="tel:+6498895828"
              className="inline-flex items-center gap-2 px-8 py-4 text-xs tracking-[0.2em] uppercase font-medium
                text-cream/50 border border-cream/15 hover:border-cream/30 hover:text-cream/70 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 flex-shrink-0">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              Call +64 9 889 5828
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
