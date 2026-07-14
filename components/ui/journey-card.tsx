import Link from "next/link";
import Image from "next/image";

interface JourneyCardProps {
  slug: string;
  title: string;
  tagline?: string;
  durationDays?: number;
  regions?: string[];
  imageSrc?: string;
  /** Set false to hide the primary region above the journey title */
  showPrimaryRegion?: boolean;
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
  showPrimaryRegion = true,
  dark = false,
}: JourneyCardProps) {
  return (
    <Link
      href={`/journeys/${slug}`}
      className={`group block overflow-hidden ${dark ? "bg-[#d8d1c5] text-navy" : "bg-[#d8d1c5] text-navy"}`}
    >
      <div className="relative aspect-[1.45] overflow-hidden bg-warm-200">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-[#d8d1c5]" />
        )}
      </div>

      <div className="min-h-[230px] p-6">
        {showPrimaryRegion && regions && regions.length > 0 && (
          <p className="text-[10px] tracking-[0.28em] uppercase font-semibold text-gold">
            {regions[0]}
          </p>
        )}

        <h3 className={`${showPrimaryRegion ? "mt-4" : ""} font-serif font-medium text-[26px] leading-[1.08] tracking-normal text-navy transition-colors group-hover:text-navy-light`}>
          {title}
        </h3>

        {tagline && (
          <p className="mt-4 text-[13px] leading-6 line-clamp-3 text-navy/58">
            {tagline}
          </p>
        )}

        <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-navy/35">
          {durationDays && (
            <span>{durationDays} days</span>
          )}
          {regions && regions.length > 1 && (
            <>
              <span>·</span>
              <span>{regions.slice(1).join(", ")}</span>
            </>
          )}
        </div>

        <div className="mt-6 flex items-center gap-2 text-[11px] tracking-[0.24em] uppercase font-semibold text-gold">
          <span>View Journey</span>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1">
            <line x1="2" y1="8" x2="14" y2="8" strokeLinecap="round" />
            <polyline points="9,3 14,8 9,13" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
