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
    { href: "/contact",         label: "Contact" },
    { href: "/terms",           label: "Privacy" },
    { href: "/terms",           label: "Terms" },
    { href: "tel:0800287283",   label: "0800 CURATE" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy text-cream/48">
      <div className="border-b border-cream/10">
        <div className="mx-auto grid max-w-[1120px] items-end gap-8 px-6 py-16 sm:px-10 md:grid-cols-[1fr_auto] md:py-20">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
              Private Journeys
            </p>
            <h2 className="mt-5 max-w-[780px] font-serif text-[36px] font-medium leading-[1.08] text-cream sm:text-[44px]">
              Start planning your unforgettable journey to New Zealand with our
              award-winning team
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex w-fit items-center border border-gold px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold transition-colors hover:bg-gold hover:text-navy"
          >
            Contact us
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1120px] px-6 pb-12 pt-12 sm:px-10 sm:pt-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1.35fr_0.7fr_0.7fr_1fr]">
          <div>
            <Image
              src="/logos/CE_Horizontal_NB_1200x400.svg"
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
          <p className="flex gap-2">
            <Link href="/terms" className="hover:text-cream transition-colors">
              Privacy
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms" className="hover:text-cream transition-colors">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
