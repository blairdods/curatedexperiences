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
}: HeroProps) {
  return (
    <section
      className={`relative w-full flex items-center justify-center overflow-hidden
        ${compact ? "min-h-[50vh]" : "min-h-[85vh]"}`}
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
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/75 via-navy/30 to-navy/10" />
          )}
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {eyebrow && (
          <p className="text-xs tracking-[0.25em] uppercase font-medium text-gold mb-5">
            {eyebrow}
          </p>
        )}

        <h1
          className={`font-serif font-semibold tracking-tight leading-[1.05]
            ${imageSrc ? "text-cream" : "text-navy"}
            ${compact ? "text-4xl sm:text-5xl" : "text-5xl sm:text-6xl lg:text-7xl"}`}
        >
          {title}
        </h1>

        {/* Gold rule below hero headline */}
        {!compact && (
          <div className="mt-6 h-px w-10 bg-gold mx-auto" />
        )}

        {subtitle && (
          <p
            className={`mt-6 text-base sm:text-lg leading-relaxed max-w-xl mx-auto
              ${imageSrc ? "text-cream/80" : "text-foreground-muted"}`}
          >
            {subtitle}
          </p>
        )}

        {(cta || secondaryCta) && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {cta && (
              <Button
                variant={imageSrc ? "gold" : "primary"}
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
                className={imageSrc ? "text-cream/80 hover:bg-cream/10 border border-cream/20" : ""}
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
