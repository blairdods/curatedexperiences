import Link from "next/link";
import { DESTINATIONS, type Destination } from "@/lib/data/destinations";
import { createServiceClient } from "@/lib/supabase/server";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";

async function getDestinations(): Promise<Destination[]> {
  try {
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("destinations")
      .select("slug, name, region, tagline, best_for, hero_image, images, highlights, best_seasons, related_journey_slugs, description")
      .eq("active", true)
      .order("region", { ascending: true })
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
  const destinations = await getDestinations();

  return (
    <>
      <Hero
        title="Destinations"
        subtitle="From ancient fiords to alpine peaks, wine country to starlit skies — discover the New Zealand we know and love."
        imageSrc="https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1920&q=80"
        imageAlt="New Zealand landscape"
        compact
      />

      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {destinations.map((dest) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              className="group block overflow-hidden bg-stone/25"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-warm-200">
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="w-full h-full object-cover
                    group-hover:scale-103 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 sm:p-6">
                  <p className="text-xs tracking-[0.25em] uppercase font-medium text-gold">
                    {dest.region}
                  </p>
                  <h2 className="font-serif font-medium text-2xl text-cream tracking-tight mt-1">
                    {dest.name}
                  </h2>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {dest.tagline}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {dest.bestFor.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs tracking-[0.1em] uppercase font-medium text-navy/70 bg-stone/40"
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
