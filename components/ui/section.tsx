import { type ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "warm" | "stone" | "navy";
  narrow?: boolean;
}

const backgrounds = {
  default: "bg-background",
  warm:    "bg-warm-100",
  stone:   "bg-stone/30",
  navy:    "bg-navy text-cream",
};

export function Section({
  children,
  className = "",
  id,
  background = "default",
  narrow = false,
}: SectionProps) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${backgrounds[background]} ${className}`}>
      <div className={`mx-auto px-6 ${narrow ? "max-w-3xl" : "max-w-7xl"}`}>
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-12 sm:mb-16 ${align === "center" ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="text-xs tracking-[0.25em] uppercase text-gold font-medium mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-5xl tracking-tight">
        {title}
      </h2>
      {/* Gold rule — the CE editorial language */}
      <div className={`mt-5 h-px w-12 bg-gold ${align === "center" ? "mx-auto" : ""}`} />
      {subtitle && (
        <p
          className={`mt-6 text-base text-foreground-muted leading-relaxed ${
            align === "center" ? "max-w-xl mx-auto" : "max-w-xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
