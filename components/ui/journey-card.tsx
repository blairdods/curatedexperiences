import Link from "next/link";
import Image from "next/image";

interface JourneyCardProps {
  slug: string;
  title: string;
  tagline?: string;
  durationDays?: number;
  regions?: string[];
  imageSrc?: string;
  /** Set true when rendering on a navy background */
  dark?: boolean;
}

export function JourneyCard({
  slug,
  title,
  tagline,
  durationDays,
  regions,
  imageSrc,
  dark = false,
}: JourneyCardProps) {
  return (
    <Link
      href={`/journeys/${slug}`}
      className={`group block overflow-hidden ${dark ? "bg-cream/5" : "bg-stone/30"}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-warm-200">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-warm-200 to-stone" />
        )}
        {/* Region label overlay */}
        {regions && regions.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-navy-dark/70 to-transparent">
            <p className="text-xs tracking-[0.2em] uppercase font-medium text-gold">
              {regions[0]}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <h3 className={`font-serif font-medium text-xl tracking-tight transition-colors ${
          dark
            ? "text-cream group-hover:text-cream/80"
            : "text-navy group-hover:text-navy-light"
        }`}>
          {title}
        </h3>

        {tagline && (
          <p className={`mt-2 text-sm leading-relaxed line-clamp-2 ${
            dark ? "text-cream/50" : "text-foreground-muted"
          }`}>
            {tagline}
          </p>
        )}

        <div className={`mt-4 flex items-center gap-2 text-xs ${
          dark ? "text-cream/40" : "text-foreground-muted"
        }`}>
          {durationDays && (
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 opacity-50">
                <circle cx="8" cy="8" r="7" />
                <line x1="8" y1="4" x2="8" y2="8" strokeLinecap="round" />
                <line x1="8" y1="8" x2="11" y2="8" strokeLinecap="round" />
              </svg>
              {durationDays} days
            </span>
          )}
          {regions && regions.length > 1 && (
            <>
              <span className={dark ? "text-cream/20" : "text-stone"}>—</span>
              <span>{regions.slice(1).join(", ")}</span>
            </>
          )}
        </div>

        {/* Arrow */}
        <div className="mt-5 flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-medium text-gold">
          <span>Explore</span>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1">
            <line x1="2" y1="8" x2="14" y2="8" strokeLinecap="round" />
            <polyline points="9,3 14,8 9,13" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
