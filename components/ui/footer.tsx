import Link from "next/link";
import Image from "next/image";

const COMPANY_LINKS = [
  { href: "/about", label: "Our story" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms" },
];

const PHONE_NUMBERS = [
  {
    region: "New Zealand",
    display: "0800 Curate   0800 287 283",
    href: "tel:0800287283",
  },
  { region: "USA", display: "1-800-267-4520", href: "tel:+18002674520" },
  {
    region: "Australia",
    display: "1800 417 674",
    href: "tel:+611800417674",
  },
  { region: "Singapore", display: "+65 3158 3354", href: "tel:+6531583354" },
];

const PARTNER_LOGOS = [
  {
    src: "/assets/images/logos/PPG-Tours.svg",
    alt: "PPG Tours",
    width: 137,
    height: 64,
    className: "h-10 w-auto invert sm:h-12",
  },
  {
    src: "/logos/nz-fern-blue.png",
    alt: "Tourism New Zealand FernMark licence number 100920",
    width: 512,
    height: 512,
    className: "h-20 w-20 sm:h-24 sm:w-24",
  },
  {
    src: "/logos/tia-white.png",
    alt: "Tourism Industry Aotearoa",
    width: 250,
    height: 102,
    className: "h-10 w-auto sm:h-12",
  },
  {
    src: "/assets/images/logos/100-per-cent-Pure-NZ-White.svg",
    alt: "100% Pure New Zealand",
    width: 580,
    height: 294,
    className: "h-12 w-auto sm:h-14",
  },
  {
    src: "/assets/images/logos/Sustainable-Event-Supplier.svg",
    alt: "New Zealand Sustainable Event Supplier",
    width: 53,
    height: 62,
    className: "h-16 w-auto sm:h-20",
    panelClassName: "rounded-sm bg-white px-3 py-2",
  },
  {
    src: "/assets/images/logos/Travelife-Partner.svg",
    alt: "Travelife Partner — Committed to sustainability",
    width: 980,
    height: 381,
    className: "h-12 w-auto sm:h-14",
    panelClassName: "rounded-sm bg-white px-3 py-2",
  },
  {
    src: "/assets/images/logos/Tiaki_WordMark_Black.png",
    alt: "Tiaki",
    width: 1596,
    height: 2132,
    className: "h-20 w-auto invert sm:h-24",
  },
];

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M6.5 8.25H3.25V21H6.5V8.25ZM4.88 3A1.88 1.88 0 1 0 4.88 6.75 1.88 1.88 0 0 0 4.88 3ZM21 13.7c0-3.84-2.05-5.62-4.79-5.62-2.2 0-3.19 1.21-3.74 2.06V8.25H9.22V21h3.25v-6.31c0-1.66.31-3.27 2.37-3.27 2.03 0 2.06 1.9 2.06 3.38V21H21v-7.3Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M13.7 21v-8.2h2.75l.41-3.2H13.7V7.56c0-.93.26-1.56 1.59-1.56H17V3.14A22.77 22.77 0 0 0 14.52 3c-2.45 0-4.13 1.5-4.13 4.25V9.6H7.62v3.2h2.77V21h3.31Z" />
    </svg>
  );
}

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

        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-center gap-x-6 gap-y-8 px-6 pb-16 sm:gap-x-10 sm:px-10 lg:gap-x-12 md:pb-20">
          {PARTNER_LOGOS.map((logo) => (
            <div
              key={logo.src}
              className="flex min-h-24 min-w-[112px] items-center justify-center sm:min-w-[128px] lg:min-w-[140px]"
            >
              <span
                className={`inline-flex items-center justify-center ${logo.panelClassName ?? ""}`}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className={`${logo.className} object-contain`}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1120px] px-6 pb-12 pt-12 sm:px-10 sm:pt-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[0.9fr_0.55fr_1.45fr] md:gap-16">
          <div>
            <Image
              src="/logos/CE_Horizontal_NB_1200x400.svg"
              alt="Curated Experiences"
              width={1200}
              height={400}
              className="h-auto w-full"
            />

            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold/70">
              Follow us
            </p>
            <p className="mt-2 text-[12px] text-cream/48">Stay connected</p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://www.instagram.com/bycuratedexperiences/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Curated Experiences on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition-colors hover:border-gold hover:text-gold"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.facebook.com/bycuratedexperiences/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Curated Experiences on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition-colors hover:border-gold hover:text-gold"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.linkedin.com/company/curatedexperiences"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Curated Experiences on LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition-colors hover:border-gold hover:text-gold"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold/70">
              Company
            </h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-[12px] transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold/70">
              Contact
            </h4>
            <div className="space-y-7 text-[12px]">
              <a
                href="mailto:discover@curatedexperiences.co.nz"
                className="flex items-start gap-4 text-cream/58 transition-colors hover:text-cream"
              >
                <span className="text-gold">
                  <MailIcon />
                </span>
                <span className="break-all">discover@curatedexperiences.co.nz</span>
              </a>

              <div className="flex items-start gap-4">
                <span className="text-gold">
                  <PhoneIcon />
                </span>
                <div className="space-y-3">
                  {PHONE_NUMBERS.map((phone) => (
                    <p key={phone.region} className="leading-5">
                      <span className="mr-2 text-cream/38">{phone.region}:</span>
                      <a
                        href={phone.href}
                        className="text-cream/64 transition-colors hover:text-cream"
                      >
                        {phone.display}
                      </a>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 text-[11px] text-cream/28">
          <p>
            &copy; {new Date().getFullYear()} Curated Experiences. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
