import Link from "next/link";
import { FooterContactLink } from "./footer-contact-link";

const FOOTER_LINKS = {
  Explore: [
    { href: "/journeys", label: "Journeys" },
    { href: "/destinations", label: "Destinations" },
    { href: "/journal", label: "Journal" },
    { href: "/stories", label: "Stories" },
  ],
  Company: [
    { href: "/about", label: "Our Story" },
    { href: "tel:+6498895828", label: "Call Us" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy-dark text-white/70">
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
          {/* Brand */}
          <div>
            <img
              src="/curated-experiences.png"
              alt="Curated Experiences"
              className="h-10 w-auto brightness-0 invert opacity-90"
            />
            <p className="mt-3 text-sm leading-relaxed max-w-xs">
              Bespoke luxury travel across New Zealand, crafted by local experts
              for discerning travellers.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs tracking-widest uppercase text-white/40 mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {heading === "Company" && (
                <ul className="space-y-2.5 mt-2.5">
                  <li><FooterContactLink /></li>
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Curated Experiences&trade;. All rights
            reserved.
          </p>
          <p className="text-xs text-white/30">
            A PPG Tours venture — Best NZ DMC, World Travel Awards 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
