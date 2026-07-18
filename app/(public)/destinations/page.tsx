import Link from "next/link";
import Image from "next/image";
import { DESTINATIONS, type Destination } from "@/lib/data/destinations";
import { createServiceClient } from "@/lib/supabase/server";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { DestinationMap } from "@/components/ui/destination-map";
import { getImageSlotOverrides } from "@/lib/image-slot-settings";
import { getSlotImage } from "@/lib/image-slots";

export const revalidate = 60;

async function getDestinations(): Promise<Destination[]> {
  try {
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("destinations")
      .select("slug, name, region, tagline, best_for, hero_image, images, highlights, best_seasons, related_journey_slugs, description")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (data && data.length > 0) {
      return data.map((d) => ({
        slug: d.slug,
        name: d.name,
        region: d.region as "North Island" | "South Island",
        tagline: d.tagline ?? "",
        description: d.description ?? "",
        highlights: d.highlights ?? [],
        bestFor: d.best_for ?? [],
        bestSeasons: d.best_seasons ?? "",
        relatedJourneySlugs: d.related_journey_slugs ?? [],
        heroImage: d.hero_image ?? "",
        images: (d.images as { src: string; alt: string }[]) ?? [],
      }));
    }
  } catch {
    // Fall through to static
  }

  return DESTINATIONS;
}

export default async function DestinationsPage() {
  const [destinations, imageSlots] = await Promise.all([
    getDestinations(),
    getImageSlotOverrides(),
  ]);
  const heroImage = getSlotImage(imageSlots, "page.destinations.hero");

  return (
    <>
      <Hero
        eyebrow="Destinations"
        title="Distinct regions, one rhythm."
        subtitle="From private lodges and alpine landscapes to vineyards, coastlines, and cultural encounters, every place is considered for how it contributes to the rhythm of the wider journey."
        imageSrc={heroImage.src}
        imageAlt={heroImage.alt}
        compact
      />

      <Section background="navy">
        <div className="mb-12 grid items-end gap-7 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
              Find your place
            </p>
            <h2 className="mt-6 font-serif text-[38px] font-medium leading-[1.06] text-cream sm:text-[46px]">
              Explore New Zealand, region by region.
            </h2>
          </div>
          <p className="max-w-[560px] text-[14px] leading-7 text-cream/55">
            Move through the map or browse by island. Each destination opens a
            closer look at the character, experiences, and pace of that place.
          </p>
        </div>
        <DestinationMap destinations={destinations} />
      </Section>

      <Section>
        <div className="mb-12 sm:mb-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
            The complete collection
          </p>
          <h2 className="mt-6 max-w-[620px] font-serif text-[38px] font-medium leading-[1.06] text-navy sm:text-[46px]">
            Every region, considered in its own right.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {destinations.map((dest) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              className="group block overflow-hidden bg-[#d8d1c5]"
            >
              <div className="relative aspect-[1.45] overflow-hidden bg-warm-200">
                <Image
                  src={dest.heroImage}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 sm:p-6">
                  <p className="text-[10px] tracking-[0.28em] uppercase font-semibold text-gold">
                    {dest.region}
                  </p>
                  <h2 className="font-serif font-medium text-[28px] leading-[1.08] text-cream tracking-normal mt-2">
                    {dest.name}
                  </h2>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-[13px] text-navy/58 leading-6">
                  {dest.tagline}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {dest.bestFor.map((tag) => (
                    <span
                      key={tag}
                      className="border-t border-navy/15 pt-2 text-[10px] tracking-[0.16em] uppercase font-semibold text-navy/45"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
