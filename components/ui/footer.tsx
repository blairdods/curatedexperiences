import Link from "next/link";

const FOOTER_LINKS = {
  Explore: [
    { href: "/journeys", label: "Journeys" },
    { href: "/destinations/south-island", label: "Destinations" },
    { href: "/journal", label: "Journal" },
    { href: "/stories", label: "Stories" },
  ],
  Company: [
    { href: "/about", label: "Our Story" },
    { href: "mailto:hello@curatedexperiences.com", label: "Contact" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy-dark text-white/70">
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl text-white tracking-tight">
              Curated Experiences
            </h3>
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
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Curated Experiences. All rights
            reserved.
          </p>
          <p className="text-xs text-white/30">
            A PPG Tours venture — World Travel Award winners
          </p>
        </div>
      </div>
    </footer>
  );
}
