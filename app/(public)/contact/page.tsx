import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { CONTACT_EMAIL, PHONE_NUMBERS } from "@/lib/contact-details";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Curated Experiences to begin planning a private, tailor-made journey through New Zealand.",
  alternates: { canonical: "/contact" },
};

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

export default function ContactPage() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

  return (
    <section className="min-h-screen bg-navy px-6 pb-24 pt-[152px] text-cream sm:px-10 sm:pb-32 sm:pt-[176px]">
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-12 h-px w-full bg-gold/28" />
        <div className="grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-36">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-gold">
              Private New Zealand travel
            </p>
            <h1 className="mt-7 max-w-[520px] font-serif text-[48px] font-medium leading-[1.02] text-cream sm:text-[62px]">
              Your New Zealand experience begins here
            </h1>
            <p className="mt-7 max-w-[420px] text-[15px] leading-7 text-cream/62">
              Enquire today to start planning
            </p>

            <div className="mt-12 space-y-9 border-t border-cream/12 pt-9">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 text-gold">
                  <MailIcon />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cream/36">
                    Email
                  </p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="mt-2 block text-[14px] text-cream transition-colors hover:text-gold"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-0.5 text-gold">
                  <PhoneIcon />
                </span>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cream/36">
                    Speak with a curator
                  </p>
                  <div className="mt-3 space-y-3">
                    {PHONE_NUMBERS.map((phone) => (
                      <p key={phone.region} className="text-[13px] leading-6">
                        <span className="inline-block min-w-[104px] text-cream/42">
                          {phone.region}
                        </span>
                        <a
                          href={phone.href}
                          className="text-cream transition-colors hover:text-gold"
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

          <ContactForm siteKey={siteKey} />
        </div>
      </div>
    </section>
  );
}
