import Link from "next/link";
import Image from "next/image";
import { FooterContactLink } from "./footer-contact-link";

const FOOTER_LINKS = {
  Explore: [
    { href: "/journeys",     label: "Journeys" },
    { href: "/destinations", label: "Destinations" },
    { href: "/journal",      label: "Journal" },
    { href: "/stories",      label: "Stories" },
  ],
  Company: [
    { href: "/about",           label: "Our Story" },
    { href: "/terms",           label: "Terms & Conditions" },
    { href: "tel:+6498895828",  label: "Call Us" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy text-cream/60">
      {/* Gold rule at top */}
      <div className="h-px bg-gold/40" />

      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">

          {/* Brand */}
          <div>
            <Image
              src="/logos/CE_Horizontal_NB_1200x400.svg"
              alt="Curated Experiences"
              width={180}
              height={60}
              className="h-8 w-auto opacity-90"
            />
            <p className="mt-4 text-sm leading-relaxed max-w-xs">
              Bespoke luxury travel across New Zealand, crafted by local experts
              for discerning travellers.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs tracking-[0.25em] uppercase font-medium text-cream/30 mb-5">
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-cream transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {heading === "Company" && (
                <ul className="space-y-3 mt-3">
                  <li><FooterContactLink /></li>
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Gold rule divider */}
        <div className="mt-16 h-px bg-gold/25" />

        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream/30">
            &copy; {new Date().getFullYear()} Curated Experiences&trade;. All rights reserved.
          </p>
          <p className="text-xs text-cream/30">
            A PPG Tours venture — Best NZ DMC, World Travel Awards 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
