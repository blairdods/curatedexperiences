"use client";

import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/data/journal";
import { getVideosByPlacement } from "@/lib/data/videos";
import { VideoShowcase } from "@/components/ui/video-showcase";

const A = (name: string) => `/assets/images/${name}`;

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
    image: A("233455-glenorchy-queenstown.jpg"),
  },
  {
    href: "/journeys/the-epicurean",
    eyebrow: "The Epicurean",
    title: "A private study of food, wine, soil, and sea.",
    text: "A slower journey through producers, private cellars, chefs, coastlines, and the rituals of place.",
    meta: "10 days · Hawke's Bay · Central Otago",
    image: A("233179-craggy-range-hawkes-bay.jpg"),
  },
  {
    href: "/journeys/the-expedition",
    eyebrow: "The Expedition",
    title: "Remote access and elemental scale.",
    text: "For travellers drawn to wilderness, private charter, alpine silence, and landscapes that feel privately opened.",
    meta: "12 days · Fiordland · Aoraki · West Coast",
    image: A("233456-franz-josef-west-coast.jpg"),
  },
];

const DESTINATIONS = [
  {
    href: "/destinations/northland",
    title: "Northland & Bay of Islands",
    image: A("229483-bay-of-islands-northland.jpg"),
  },
  {
    href: "/destinations/rotorua",
    title: "Taupo & Rotorua",
    image: A("229251-rotorua-bay-of-plenty.jpg"),
  },
  {
    href: "/destinations/central-otago",
    title: "Queenstown & Central Otago",
    image: A("230043-lake-wakatipu-queenstown.jpg"),
  },
];

const PRIVACY_POINTS = [
  {
    title: "Private Arrivals",
    text: "Transfers and access are planned to feel calm from the first moment.",
  },
  {
    title: "Discreet Hosting",
    text: "Guides and hosts are selected for judgement, presence, and restraint.",
  },
  {
    title: "Unseen Detail",
    text: "The work sits behind the experience, so each day unfolds naturally.",
  },
];

const DESIGN_JOURNAL: Article[] = [
  {
    slug: "when-to-visit-new-zealand",
    title: "When to visit New Zealand: a month-by-month guide",
    excerpt: "",
    category: "Travel Intelligence",
    author: "Curated Experiences",
    publishedAt: "",
    readTime: "",
    heroImage: A("233207-aoraki-mt-cook-canterbury.jpg"),
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
    heroImage: A("230334-milford-sound-fiordland.jpg"),
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
    heroImage: A("233448-minaret-station-wanaka.jpg"),
    relatedJourneySlugs: [],
  },
];

function openConcierge() {
  window.dispatchEvent(new Event("ce:open-concierge"));
}

function journalItems(articles: Article[]) {
  if (!articles.length) return DESIGN_JOURNAL;
  return DESIGN_JOURNAL.map((fallback, index) => {
    const article = articles[index];
    if (!article) return fallback;
    return {
      ...article,
      category: article.category || fallback.category,
      heroImage: article.heroImage || fallback.heroImage,
    };
  });
}

export default function HomePage({ articles }: { articles: Article[] }) {
  const featuredArticles = journalItems(articles);

  return (
    <div className="ce-homepage-exact bg-cream text-navy">
      <style>{`main:has(.ce-homepage-exact) + footer { display: none; }`}</style>

      <section className="relative min-h-[1010px] overflow-hidden bg-navy text-cream md:min-h-[1018px]">
        <Image
          src={A("233206-aoraki-mt-cook-canterbury.jpg")}
          alt="Aoraki / Mount Cook rising above the Southern Alps, New Zealand"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,20,32,0.68)_0%,rgba(10,20,32,0.3)_48%,rgba(10,20,32,0.03)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,20,32,0.32)_0%,rgba(10,20,32,0)_46%)]" />

        <div className="relative z-10 mx-auto flex min-h-[1010px] max-w-[1120px] items-center px-6 pt-20 md:min-h-[1018px] md:px-0">
          <div className="max-w-[610px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-gold">
              Private New Zealand Travel
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
              Private travel designed with precision, restraint, and a deep
              understanding of place.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-[58px] md:px-0 md:py-[62px]">
        <div className="mx-auto max-w-[1120px] bg-[#cfc5b7] px-10 py-10 md:min-h-[325px] md:px-12">
          <p className="text-[11px] font-semibold uppercase leading-none tracking-[0.42em] text-gold">
            Powered By PPG
          </p>
          <h2 className="mt-8 max-w-[980px] font-sans text-[18px] font-medium leading-[1.7] text-navy md:text-[19px]">
            Recognised by the World Travel Awards, trusted by leading cruise
            lines, and New Zealand owned and operated for more than 20 years.
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

      <section className="px-6 py-[82px] md:px-0 md:py-[88px]">
        <div className="mx-auto grid max-w-[1120px] items-start gap-20 md:grid-cols-[520px_460px] md:gap-[140px]">
          <div className="pt-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
              The Curated Difference
            </p>
            <h2 className="mt-6 font-serif text-[38px] font-medium leading-[1.06] text-navy md:text-[46px]">
              We do not sell itineraries.
              <br />
              We shape time.
            </h2>
            <p className="mt-8 max-w-[475px] text-[15px] leading-7 text-foreground-muted">
              Curated Experiences designs private New Zealand travel around who
              you are, how you want to travel, and the experiences you are drawn
              to. Every itinerary is shaped with a clear understanding of how
              the day should unfold, where time should be shaped with intention,
              and how each arrangement should feel effortless.
            </p>
          </div>
          <div className="relative aspect-[0.77] w-full overflow-hidden">
            <Image
              src={A("230332-milford-sound-fiordland.jpg")}
              alt="Milford Sound, Fiordland — Mitre Peak reflected in dawn-still water"
              fill
              loading="eager"
              sizes="460px"
              className="object-cover object-center"
            />
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
              Considered frameworks, never fixed
              <br />
              itineraries.
            </h2>
            <p className="mt-7 max-w-[560px] text-[14px] leading-7 text-cream/56">
              Each journey begins as a point of orientation, then is reshaped
              around your pace, preferences, season, and reason for travelling.
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
                    src={journey.image}
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

          <Link
            href="/journeys"
            className="mt-10 inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-gold md:ml-[72px]"
          >
            View The Full Collection +
          </Link>
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
              Distinct regions,
              <br />
              one rhythm.
            </h2>
            <p className="mt-8 text-[14px] leading-7 text-foreground-muted">
              From private lodges and alpine landscapes to vineyards, coastlines,
              and cultural encounters, every place is considered for how it
              contributes to the rhythm of the wider journey.
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
                src={A("233461-milford-sound-fiordland.jpg")}
                alt="Milford Sound, Fiordland — towering granite walls and waterfalls"
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
                    src={destination.image}
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

      <section className="px-6 pb-[104px] md:px-0">
        <div className="mx-auto grid max-w-[1120px] gap-12 bg-[#d8d1c5] px-10 py-12 md:grid-cols-[0.9fr_1.1fr] md:px-14">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
              Local Knowledge
            </p>
            <h2 className="mt-6 font-serif text-[36px] font-medium leading-[1.08] text-navy md:text-[44px]">
              Shaped by New Zealand,
              <br />
              held by experience.
            </h2>
            <p className="mt-7 max-w-[390px] text-[14px] leading-7 text-navy/62">
              Curated Experiences is supported by PPG, a New Zealand-owned team
              with more than two decades of experience designing and delivering
              private travel across the country.
            </p>
          </div>
          <div className="space-y-7">
            <div className="border-t border-navy/14 pt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
                Built For Nuance
              </p>
              <p className="mt-3 text-[14px] leading-7 text-navy/66">
                Every journey is shaped with an understanding of season,
                distance, weather, pace, and the small details that change how a
                place is felt.
              </p>
            </div>
            <div className="border-t border-navy/14 pt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
                Quiet Coordination
              </p>
              <p className="mt-3 text-[14px] leading-7 text-navy/66">
                Behind the visible itinerary sits careful planning, trusted local
                relationships, and the ability to adjust without drawing
                attention to the work.
              </p>
            </div>
            <div className="border-t border-navy/14 pt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
                A Sense Of Place
              </p>
              <p className="mt-3 text-[14px] leading-7 text-navy/66">
                The result is travel that feels considered in the moment,
                grounded in New Zealand, and held with calm precision from
                beginning to end.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy px-6 py-[104px] text-cream md:px-0">
        <div className="mx-auto grid max-w-[1120px] items-center gap-18 md:grid-cols-[480px_1fr] md:gap-[118px]">
          <div className="relative aspect-[0.86] overflow-hidden">
            <Image
              src={A("233460-glenorchy-queenstown.jpg")}
              alt="Glenorchy, Queenstown — alpine valley reflected in the still waters of Lake Wakatipu"
              fill
              loading="eager"
              sizes="480px"
              className="object-cover object-center"
            />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
              Privacy &amp; Discretion
            </p>
            <h2 className="mt-6 font-serif text-[42px] font-medium leading-[1.05] md:text-[56px]">
              Arranged quietly,
              <br />
              held with care.
            </h2>
            <p className="mt-8 max-w-[455px] text-[15px] leading-7 text-cream/60">
              For clients who value privacy, the best arrangements are often the
              least visible. We manage arrivals, guiding, timing, and access with
              quiet care.
            </p>
            <div className="mt-9 space-y-6">
              {PRIVACY_POINTS.map((point) => (
                <div key={point.title}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
                    {point.title}
                  </p>
                  <p className="mt-2 max-w-[420px] text-[13px] leading-6 text-cream/50">
                    {point.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-[96px] md:px-0">
        <div className="mx-auto max-w-[1120px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
            Journal
          </p>
          <h2 className="mt-6 max-w-[560px] font-serif text-[42px] font-medium leading-[1.06] text-navy md:text-[54px]">
            Before a journey begins,
            <br />
            there is a way of seeing.
          </h2>
          <p className="mt-7 max-w-[620px] text-[14px] leading-7 text-foreground-muted">
            Selected perspectives on timing, remote places, and the details that
            shape a more considered New Zealand journey.
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

      <section className="bg-navy px-6 py-[112px] text-center text-cream md:px-0">
        <div className="mx-auto max-w-[620px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
            Private Journeys
          </p>
          <h2 className="mt-6 font-serif text-[38px] font-medium leading-[1.08] md:text-[46px]">
            Begin with a conversation.
          </h2>
          <p className="mx-auto mt-7 max-w-[520px] text-[14px] leading-7 text-cream/56">
            Every journey begins quietly: with timing, preferences, privacy, and
            the details that matter before anything is designed.
          </p>
          <button
            onClick={openConcierge}
            className="mt-9 border border-gold px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold transition-colors hover:bg-gold hover:text-navy"
          >
            Plan A Private Journey +
          </button>
        </div>
      </section>

      <footer className="bg-navy px-6 pb-12 pt-9 text-cream/48 md:px-0">
        <div className="mx-auto grid max-w-[1120px] gap-10 md:grid-cols-[1.35fr_0.7fr_0.7fr_1fr]">
          <div>
            <Image
              src="/logos/CE_Horizontal_NB_1200x400.svg"
              alt="Curated Experiences"
              width={295}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold/70">
              Explore
            </p>
            <div className="mt-4 space-y-2 text-[12px]">
              <Link href="/journeys" className="block hover:text-cream">Journeys</Link>
              <Link href="/destinations" className="block hover:text-cream">Destinations</Link>
              <Link href="/journal" className="block hover:text-cream">Journal</Link>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold/70">
              Company
            </p>
            <div className="mt-4 space-y-2 text-[12px]">
              <Link href="/about" className="block hover:text-cream">Our Story</Link>
              <Link href="/terms" className="block hover:text-cream">Privacy</Link>
              <button onClick={openConcierge} className="block hover:text-cream">
                Enquire
              </button>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold/70">
              Contact
            </p>
            <div className="mt-4 space-y-2 text-[12px]">
              <p>Enquire</p>
              <p>Auckland, New Zealand</p>
              <a href="tel:0800287283" className="block hover:text-cream">0800 287 283</a>
              <a href="mailto:discover@curatedexperiences.co.nz" className="block hover:text-cream">
                discover@curatedexperiences.co.nz
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-14 flex max-w-[1120px] flex-col gap-3 text-[11px] text-cream/28 md:flex-row md:justify-between">
          <p>&copy; 2026 Curated Experiences. All rights reserved.</p>
          <p>Privacy · Terms</p>
        </div>
      </footer>
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
