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
}: HeroProps) {
  return (
    <section
      className={`relative w-full flex items-center overflow-hidden
        ${compact ? "min-h-[520px] sm:min-h-[600px]" : "min-h-screen"}
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
            <>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,20,32,0.72)_0%,rgba(10,20,32,0.34)_48%,rgba(10,20,32,0.08)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,20,32,0.38)_0%,rgba(10,20,32,0)_50%)]" />
            </>
          )}
        </>
      )}

      <div className={`relative z-10 w-full max-w-[1120px] mx-auto px-6 sm:px-10
        ${compact ? "pt-24 sm:pt-32" : "pt-24"}`}
      >
        {eyebrow && (
          <p className="text-[10px] tracking-[0.32em] uppercase font-semibold text-gold mb-5">
            {eyebrow}
          </p>
        )}

        <h1
          className={`font-serif font-medium tracking-normal leading-[1.04]
            ${imageSrc ? "text-cream" : "text-cream"}
            ${compact
              ? "text-[48px] sm:text-[66px] max-w-[760px]"
              : "text-[64px] sm:text-[86px] max-w-4xl"
            }`}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className={`mt-7 text-[15px] sm:text-[16px] leading-7
              ${imageSrc ? "text-cream/75" : "text-cream/60"}
              ${compact ? "max-w-[560px]" : "max-w-lg"}`}
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
