import { type ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "warm" | "navy";
  narrow?: boolean;
}

const backgrounds = {
  default: "bg-background",
  warm: "bg-warm-100",
  navy: "bg-navy text-white",
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
        <p className="text-xs tracking-[0.2em] uppercase text-warm-500 mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-lg text-foreground-muted leading-relaxed ${
            align === "center" ? "max-w-xl mx-auto" : "max-w-xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
