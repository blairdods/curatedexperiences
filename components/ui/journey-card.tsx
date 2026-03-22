import Link from "next/link";
import Image from "next/image";

interface JourneyCardProps {
  slug: string;
  title: string;
  tagline?: string;
  durationDays?: number;
  regions?: string[];
  imageSrc?: string;
}

export function JourneyCard({
  slug,
  title,
  tagline,
  durationDays,
  regions,
  imageSrc,
}: JourneyCardProps) {
  return (
    <Link
      href={`/journeys/${slug}`}
      className="group block overflow-hidden rounded-xl bg-white
        shadow-[0_2px_20px_-4px_rgba(31,56,100,0.06)]
        hover:shadow-[0_8px_40px_-8px_rgba(31,56,100,0.12)]
        transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-warm-100">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-warm-200 to-warm-300" />
        )}
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <h3 className="font-serif text-xl tracking-tight text-navy group-hover:text-navy-light transition-colors">
          {title}
        </h3>

        {tagline && (
          <p className="mt-2 text-sm text-foreground-muted leading-relaxed line-clamp-2">
            {tagline}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3 text-xs text-foreground-muted">
          {durationDays && (
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 opacity-50">
                <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <line x1="8" y1="4" x2="8" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="8" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {durationDays} days
            </span>
          )}
          {regions && regions.length > 0 && (
            <span className="text-warm-400">|</span>
          )}
          {regions && (
            <span>{regions.join(", ")}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
