"use client";

import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/data/journal";
import { getVideosByPlacement } from "@/lib/data/videos";
import { VideoShowcase } from "@/components/ui/video-showcase";
import {
  getSlotImage,
  getSlotImages,
  homepageHeroSlotKey,
  type ImageSlotOverrides,
} from "@/lib/image-slots";

const TRUST_ITEMS = [
  {
    label: "World Travel Awards Winner",
    text: "New Zealand's Leading Destination Management Company 2025",
  },
  {
    label: "World Travel Awards Finalist",
    text: "New Zealand's Leading Tour Operator 2025 & 2026",
  },
  {
    label: "World Travel Awards Finalist",
    text: "New Zealand & Oceania Destination Management Company 2026",
  },
  {
    label: "Trusted By Leading Cruise Lines",
    text: "Silversea, Ponant, & Celebrity Cruises",
  },
];

const SIGNATURE_JOURNEYS = [
  {
    href: "/journeys/the-masterpiece",
    eyebrow: "The Masterpiece",
    title: "The definitive New Zealand journey.",
    text: "A composed introduction to the country's most remarkable lodges, landscapes, and private experiences.",
    meta: "15 days · Auckland · Taupo · Queenstown",
    imageSlot: "home.journey.masterpiece",
  },
  {
    href: "/journeys/the-epicurean",
    eyebrow: "The Epicurean",
    title: "A private study of food, wine, soil, and sea.",
    text: "A slower journey through producers, private cellars, chefs, coastlines, and the rituals of place.",
    meta: "10 days · Hawke's Bay · Central Otago",
    imageSlot: "home.journey.epicurean",
  },
  {
    href: "/journeys/the-expedition",
    eyebrow: "The Expedition",
    title: "Remote access and elemental scale.",
    text: "For travellers drawn to wilderness, private charter, alpine silence, and landscapes that feel privately opened.",
    meta: "12 days · Fiordland · Aoraki · West Coast",
    imageSlot: "home.journey.expedition",
  },
  {
    href: "/journeys/the-discovery",
    eyebrow: "The Discovery",
    title: "A poetic traverse from subtropical north to alpine south.",
    text: "Prestigious lodges, private charters, cultural encounters, and landscapes that shift with every chapter.",
    meta: "15 days · Auckland · Wairarapa · Queenstown",
    imageSlot: "home.journey.discovery",
  },
  {
    href: "/journeys/the-hidden-trail",
    eyebrow: "The Hidden Trail",
    title: "The best of both islands, quietly revealed.",
    text: "Private sailing, geothermal wonders, golden shores, and alpine horizons shaped into one seamless journey.",
    meta: "15 days · Bay of Islands · Taupo · Nelson · Queenstown",
    imageSlot: "home.journey.hidden-trail",
  },
  {
    href: "/journeys/the-southern-heart",
    eyebrow: "The Southern Heart",
    title: "The South Island in all its elemental contrast.",
    text: "Wildlife, wine country, glaciers, big skies, and remote coastlines connected by a dedicated private guide.",
    meta: "14 days · Kaikoura · Marlborough · West Coast · Aoraki",
    imageSlot: "home.journey.southern-heart",
  },
];

const DESTINATIONS = [
  {
    href: "/destinations/northland",
    title: "Northland & Bay of Islands",
    imageSlot: "home.destinations.northland",
  },
  {
    href: "/destinations/rotorua",
    title: "Taupo & Rotorua",
    imageSlot: "home.destinations.rotorua",
  },
  {
    href: "/destinations/central-otago",
    title: "Queenstown & Central Otago",
    imageSlot: "home.destinations.central-otago",
  },
];

type DesignJournalArticle = Omit<Article, "heroImage"> & {
  imageSlot: string;
};

const DESIGN_JOURNAL: DesignJournalArticle[] = [
  {
    slug: "when-to-visit-new-zealand",
    title: "When to visit New Zealand: a month-by-month guide",
    excerpt: "",
    category: "Travel Intelligence",
    author: "Curated Experiences",
    publishedAt: "",
    readTime: "",
    imageSlot: "home.journal.when-to-visit",
    relatedJourneySlugs: [],
  },
  {
    slug: "night-on-milford-sound",
    title: "Why we always add a night on Milford Sound",
    excerpt: "",
    category: "Wild Interior",
    author: "Curated Experiences",
    publishedAt: "",
    readTime: "",
    imageSlot: "home.journal.milford",
    relatedJourneySlugs: [],
  },
  {
    slug: "minaret-station",
    title: "Minaret Station: New Zealand's most remote luxury lodge",
    excerpt: "",
    category: "Lodge Notes",
    author: "Curated Experiences",
    publishedAt: "",
    readTime: "",
    imageSlot: "home.journal.minaret",
    relatedJourneySlugs: [],
  },
];

function journalItems(articles: Article[], imageSlots: ImageSlotOverrides) {
  const fallbackJournal = DESIGN_JOURNAL.map((article) => ({
    ...article,
    heroImage: getSlotImage(imageSlots, article.imageSlot).src,
  })) satisfies Article[];

  if (!articles.length) return fallbackJournal;
  return DESIGN_JOURNAL.map((fallback, index) => {
    const article = articles[index];
    const fallbackImage = getSlotImage(imageSlots, fallback.imageSlot).src;
    if (!article) return { ...fallback, heroImage: fallbackImage };
    return {
      ...article,
      category: article.category || fallback.category,
      heroImage: article.heroImage || fallbackImage,
    };
  });
}

export default function HomePage({
  articles,
  imageSlots,
  heroVariant,
}: {
  articles: Article[];
  imageSlots: ImageSlotOverrides;
  heroVariant: string;
}) {
  const heroPoster = getSlotImages(
    imageSlots,
    homepageHeroSlotKey(heroVariant)
  )[0];
  const featuredArticles = journalItems(articles, imageSlots);
  const differenceImage = getSlotImage(imageSlots, "home.difference.image");
  const destinationFeatureImage = getSlotImage(
    imageSlots,
    "home.destinations.feature"
  );

  return (
    <div className="ce-homepage-exact bg-cream text-navy">
      <section className="relative h-[100svh] max-h-[100svh] min-h-0 overflow-hidden bg-navy text-cream md:h-auto md:max-h-none md:min-h-[1018px]">
        <div className="absolute inset-0" data-slot="home-hero-video">
          {heroPoster?.src ? (
            <Image
              src={heroPoster.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          ) : null}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={heroPoster?.src}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden"
          >
            <source
              src="/media/hero-video-curated-experiences.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,20,32,0.68)_0%,rgba(10,20,32,0.3)_48%,rgba(10,20,32,0.03)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,20,32,0.32)_0%,rgba(10,20,32,0)_46%)]" />

        <div className="relative z-10 mx-auto flex h-full min-h-0 max-w-[1120px] items-start px-6 pt-[clamp(7rem,16svh,9rem)] md:h-auto md:min-h-[1018px] md:items-center md:px-0 md:pt-20">
          <div className="max-w-[610px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-gold">
              The New Zealand Luxury Travel Experts
            </p>
            <div className="mt-4 h-px w-[300px] max-w-full bg-cream/38" />
            <h1 className="mt-6 font-serif text-[56px] font-medium leading-[1.02] text-cream sm:text-[68px] md:text-[76px]">
              New Zealand,
              <br />
              composed entirely
              <br />
              around you.
            </h1>
            <p className="mt-8 max-w-[430px] text-[15px] leading-7 text-cream/72">
              Personalized luxury experiences, curated by an award-winning
              agency with a deep understanding of place.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-[82px] md:px-0 md:py-[88px]">
        <div className="mx-auto grid max-w-[1120px] items-start gap-20 md:grid-cols-[520px_460px] md:gap-[140px]">
          <div className="pt-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
              The Curated Difference
            </p>
            <h2 className="mt-6 font-serif text-[38px] font-medium leading-[1.06] text-navy md:text-[46px]">
              Exceptional private travel built on deep local knowledge and
              seamlessly blended service.
            </h2>
            <p className="mt-8 max-w-[475px] text-[15px] leading-7 text-foreground-muted">
              Part of the PPG Tours group, a New Zealand-owned travel company
              with more than two decades’ of experience creating and delivering
              private journeys across New Zealand. We will curate your journey
              to reflect your interests, pace and style of travel, creating an
              experience that feels effortless, personal and unforgettable.
            </p>
          </div>
          <div className="relative aspect-[0.77] w-full overflow-hidden">
            <Image
              src={differenceImage.src}
              alt={differenceImage.alt}
              fill
              loading="eager"
              sizes="460px"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-[58px] md:px-0 md:py-[62px]">
        <div className="mx-auto max-w-[1120px] bg-[#cfc5b7] px-10 py-10 md:min-h-[325px] md:px-12">
          <p className="text-[11px] font-semibold uppercase leading-none tracking-[0.42em] text-gold">
            Powered By PPG
          </p>
          <h2 className="mt-8 max-w-[980px] font-sans text-[18px] font-medium leading-[1.7] text-navy md:text-[19px]">
            Recognised as New Zealand&apos;s Leading Destination Management
            Company for 2025 at the World Travel Awards, we are driven by an
            unwavering commitment to excellence in every journey we create.
          </h2>
          <div className="mt-7 h-px bg-gold/30" />
          <div className="mt-7 grid gap-x-24 gap-y-7 md:grid-cols-2">
            {TRUST_ITEMS.map((item) => (
              <div key={`${item.label}-${item.text}`}>
                <p className="text-[11px] font-semibold uppercase leading-none tracking-[0.42em] text-navy/52">
                  {item.label}
                </p>
                <p className="mt-4 text-[15px] font-medium leading-snug text-navy md:text-[16px]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experiences" className="bg-navy px-6 py-[104px] text-cream md:px-0">
        <div className="mx-auto max-w-[1250px]">
          <div className="ml-0 max-w-[720px] md:ml-[72px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
              Signature Journeys
            </p>
            <h2 className="mt-6 font-serif text-[38px] font-medium leading-[1.06] md:text-[46px]">
              Thoughtfully considered foundations, never fixed itineraries.
            </h2>
            <p className="mt-7 max-w-[560px] text-[14px] leading-7 text-cream/56">
              Take a moment to be inspired by some of our Signature journeys.
              Every journey can be customised to evolve around your pace and
              preferences for travelling.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {SIGNATURE_JOURNEYS.map((journey) => (
              <Link
                key={journey.title}
                href={journey.href}
                className="group block bg-[#d8d1c5] text-navy"
              >
                <div className="relative aspect-[1.45] overflow-hidden">
                  <Image
                    src={getSlotImage(imageSlots, journey.imageSlot).src}
                    alt={journey.title}
                    fill
                    loading="eager"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="min-h-[246px] px-6 py-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
                    {journey.eyebrow}
                  </p>
                  <h3 className="mt-4 font-serif text-[26px] font-medium leading-[1.08]">
                    {journey.title}
                  </h3>
                  <p className="mt-4 text-[13px] leading-6 text-navy/58">
                    {journey.text}
                  </p>
                  <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/35">
                    {journey.meta}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      <HomeVideoSection />

      <section className="px-6 py-[108px] md:px-0">
        <div className="mx-auto grid max-w-[1120px] gap-16 md:grid-cols-[360px_1fr] md:gap-[110px]">
          <div className="pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
              Destinations
            </p>
            <h2 className="mt-6 font-serif text-[38px] font-medium leading-[1.08] text-navy md:text-[46px]">
              A World of difference
            </h2>
            <p className="mt-8 text-[14px] leading-7 text-foreground-muted">
              From the rich culture, diverse landscapes of the North Island to
              the breathtaking alpine scenery of the South Island, every journey
              is carefully curated to showcase the very best of New Zealand.
            </p>
            <Link
              href="/destinations"
              className="mt-8 inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-gold"
            >
              View All Destinations +
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_250px]">
            <Link
              href="/destinations/fiordland"
              className="group relative min-h-[570px] overflow-hidden"
            >
              <Image
                src={destinationFeatureImage.src}
                alt={destinationFeatureImage.alt}
                fill
                loading="eager"
                sizes="430px"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
              <p className="absolute bottom-6 left-6 font-serif text-[25px] text-cream">
                Fiordland &amp; the Southern
                <br />
                Alps
              </p>
            </Link>
            <div className="grid gap-3">
              {DESTINATIONS.map((destination) => (
                <Link
                  key={destination.title}
                  href={destination.href}
                  className="group relative min-h-[178px] overflow-hidden"
                >
                  <Image
                    src={getSlotImage(imageSlots, destination.imageSlot).src}
                    alt={destination.title}
                    fill
                    loading="eager"
                    sizes="250px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/65 via-transparent to-transparent" />
                  <p className="absolute bottom-4 left-4 font-serif text-[18px] leading-tight text-cream">
                    {destination.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div
        className="flex h-16 items-center bg-navy px-6 md:h-20 md:px-0"
        aria-hidden="true"
      >
        <div className="mx-auto flex w-full max-w-[1120px] items-center gap-5">
          <div className="h-px flex-1 bg-gold/35" />
          <div className="h-2.5 w-2.5 rotate-45 border border-gold/70" />
          <div className="h-px flex-1 bg-gold/35" />
        </div>
      </div>

      <section className="px-6 py-[96px] md:px-0">
        <div className="mx-auto max-w-[1120px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
            Journal
          </p>
          <h2 className="mt-6 max-w-[560px] font-serif text-[42px] font-medium leading-[1.06] text-navy md:text-[54px]">
            Insight creates exceptional Journeys.
          </h2>
          <p className="mt-7 max-w-[620px] text-[14px] leading-7 text-foreground-muted">
            Explore our collection of insights, perspectives and practical
            information to inspire your New Zealand journey.
          </p>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {featuredArticles.map((article) => (
              <Link key={article.slug} href={`/journal/${article.slug}`} className="group block">
                <div className="relative aspect-[1.7] overflow-hidden">
                  <Image
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    loading="eager"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
                  {article.category}
                </p>
                <h3 className="mt-3 font-serif text-[24px] font-medium leading-[1.12] text-navy">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>

          <Link
            href="/journal"
            className="mt-10 inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-gold"
          >
            Read The Journal +
          </Link>
        </div>
      </section>

    </div>
  );
}

function HomeVideoSection() {
  const videos = getVideosByPlacement("home");
  if (!videos.length) return null;

  return (
    <section className="bg-navy px-6 py-[96px] md:px-0">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid gap-16 md:grid-cols-[380px_1fr] md:gap-[100px] items-start">
          <div className="pt-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
              New Zealand in motion
            </p>
            <h2 className="mt-6 font-serif text-[38px] font-medium leading-[1.06] text-cream md:text-[46px]">
              Some places ask
              <br />
              to be seen moving.
            </h2>
            <p className="mt-8 max-w-[340px] text-[14px] leading-7 text-cream/56">
              These are the landscapes, experiences, and moments that define a
              private New Zealand journey.
            </p>
          </div>
          <VideoShowcase videos={videos} dark />
        </div>
      </div>
    </section>
  );
}
