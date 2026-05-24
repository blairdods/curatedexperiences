import Image from "next/image";
import { Button } from "./button";

interface HeroProps {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  eyebrow?: string;
  cta?: { label: string; href?: string; onClick?: () => void };
  secondaryCta?: { label: string; href?: string; onClick?: () => void };
  overlay?: boolean;
  compact?: boolean;
  /** Set true on inner pages (adds top padding for fixed nav, centres text) */
  inner?: boolean;
}

export function Hero({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  eyebrow,
  cta,
  secondaryCta,
  overlay = true,
  compact = false,
  inner = false,
}: HeroProps) {
  return (
    <section
      className={`relative w-full flex items-end overflow-hidden
        ${compact ? "min-h-[55vh]" : "min-h-screen"}
        ${!imageSrc ? "bg-navy" : ""}`}
    >
      {/* Background image */}
      {imageSrc && (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/85 via-navy/40 to-navy/10" />
          )}
        </>
      )}

      {/* Content — left-aligned, sits above the bottom gradient */}
      <div className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10
        ${compact ? "pb-14 sm:pb-20 pt-36 sm:pt-44" : "pb-20 sm:pb-28"}`}
      >
        {eyebrow && (
          <p className="text-xs tracking-[0.3em] uppercase font-medium text-gold mb-5">
            {eyebrow}
          </p>
        )}

        <h1
          className={`font-serif font-semibold tracking-tight leading-[1.0]
            ${imageSrc ? "text-cream" : "text-cream"}
            ${compact
              ? "text-4xl sm:text-5xl lg:text-6xl max-w-3xl"
              : "text-6xl sm:text-7xl lg:text-8xl max-w-4xl"
            }`}
        >
          {title}
        </h1>

        {/* Gold rule */}
        {!compact && (
          <div className="mt-7 h-px w-12 bg-gold" />
        )}

        {subtitle && (
          <p
            className={`mt-6 text-base sm:text-lg leading-relaxed
              ${imageSrc ? "text-cream/75" : "text-cream/60"}
              ${compact ? "max-w-xl" : "max-w-lg"}`}
          >
            {subtitle}
          </p>
        )}

        {(cta || secondaryCta) && (
          <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
            {cta && (
              <Button
                variant="gold"
                size="lg"
                onClick={cta.onClick}
              >
                {cta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button
                variant="ghost"
                size="lg"
                onClick={secondaryCta.onClick}
                className="text-cream/70 hover:bg-cream/10 border border-cream/20"
              >
                {secondaryCta.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
