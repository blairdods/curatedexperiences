import { Button } from "./button";

interface HeroProps {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
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
          <img
            src={imageSrc}
            alt={imageAlt ?? ""}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/70 via-navy-dark/30 to-navy-dark/10" />
          )}
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h1
          className={`font-serif font-normal tracking-tight leading-[1.1]
            ${imageSrc ? "text-white" : "text-navy"}
            ${compact ? "text-4xl sm:text-5xl" : "text-5xl sm:text-6xl lg:text-7xl"}`}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className={`mt-6 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto
              ${imageSrc ? "text-white/80" : "text-foreground-muted"}`}
          >
            {subtitle}
          </p>
        )}

        {(cta || secondaryCta) && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {cta && (
              <Button
                variant={imageSrc ? "primary" : "primary"}
                size="lg"
                onClick={cta.onClick}
              >
                {cta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button
                variant={imageSrc ? "ghost" : "outline"}
                size="lg"
                onClick={secondaryCta.onClick}
                className={imageSrc ? "text-white hover:bg-white/10" : ""}
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
