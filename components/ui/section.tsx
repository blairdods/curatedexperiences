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
  warm:    "bg-[#e4e0d6]",
  stone:   "bg-[#d8d1c5]",
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
    <section id={id} className={`py-24 sm:py-[108px] ${backgrounds[background]} ${className}`}>
      <div className={`mx-auto px-6 sm:px-10 ${narrow ? "max-w-3xl" : "max-w-[1120px]"}`}>
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
    <div className={`mb-12 sm:mb-14 ${align === "center" ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="text-[10px] tracking-[0.32em] uppercase font-semibold text-gold mb-6">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif font-medium text-[38px] sm:text-[46px] tracking-normal leading-[1.06]">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-7 text-[14px] leading-7 opacity-70 ${
            align === "center" ? "max-w-xl mx-auto" : "max-w-xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
