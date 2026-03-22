import Link from "next/link";
import { DESTINATIONS } from "@/lib/data/destinations";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";

export default function DestinationsPage() {
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
          {DESTINATIONS.map((dest) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              className="group block overflow-hidden rounded-xl bg-white
                shadow-[0_2px_20px_-4px_rgba(31,56,100,0.06)]
                hover:shadow-[0_8px_40px_-8px_rgba(31,56,100,0.12)]
                transition-shadow duration-300"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-warm-100">
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="w-full h-full object-cover
                    group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 sm:p-6">
                  <p className="text-xs tracking-widest uppercase text-white/60">
                    {dest.region}
                  </p>
                  <h2 className="font-serif text-2xl text-white tracking-tight mt-1">
                    {dest.name}
                  </h2>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {dest.tagline}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {dest.bestFor.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs tracking-wide text-navy bg-warm-100 rounded-full"
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
