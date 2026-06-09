import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = {
  Explore: [
    { href: "/journeys",     label: "Journeys" },
    { href: "/destinations", label: "Destinations" },
    { href: "/journal",      label: "Journal" },
    { href: "/stories",      label: "Stories" },
  ],
  Company: [
    { href: "/about",           label: "Our Story" },
    { href: "/terms",           label: "Privacy" },
    { href: "/terms",           label: "Terms" },
    { href: "tel:0800287283",   label: "0800 CURATE" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy text-cream/48">
      <div className="mx-auto max-w-[1120px] px-6 pb-12 pt-12 sm:px-10 sm:pt-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1.35fr_0.7fr_0.7fr_1fr]">
          <div>
            <Image
              src="/homepage-draft/9cf76b02ac6a6a86dfb8ce66b57c03f6a861ab1a.png"
              alt="Curated Experiences"
              width={295}
              height={40}
              className="h-8 w-auto"
            />
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold/70">
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={`${heading}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-[12px] hover:text-cream transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold/70">
              Contact
            </h4>
            <div className="space-y-3 text-[12px]">
              <p>Auckland, New Zealand</p>
              <a href="tel:0800287283" className="block hover:text-cream">
                0800 CURATE
              </a>
              <a href="mailto:discover@curatedexperiences.co.nz" className="block hover:text-cream">
                discover@curatedexperiences.co.nz
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 text-[11px] text-cream/28 sm:flex-row sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Curated Experiences. All rights reserved.
          </p>
          <p>Privacy · Terms</p>
        </div>
      </div>
    </footer>
  );
}
