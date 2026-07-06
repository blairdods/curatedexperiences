import { Section } from "@/components/ui/section";
import { getTermsPageContent } from "@/lib/legal/terms";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Terms & Conditions | Curated Experiences",
  description:
    "Booking terms and conditions for Curated Experiences — bespoke luxury travel across New Zealand.",
};

export default async function TermsPage() {
  const { effectiveDate, html } = await getTermsPageContent();

  return (
    <>
      <div className="bg-navy text-cream pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase font-medium text-gold mb-5">
            Legal
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl tracking-tight leading-tight">
            Terms &amp; Conditions
          </h1>
          <div className="mt-6 h-px w-10 bg-gold" />
          <p className="mt-7 text-cream/60 text-sm leading-relaxed">
            Effective {effectiveDate}. Please read these terms carefully before
            making a booking with us.
          </p>
        </div>
      </div>

      <Section narrow>
        <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed">
          <div
            className="[&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-navy [&_h2]:tracking-tight [&_h2]:mt-12 [&_h2]:mb-4 [&_h2:first-child]:mt-0 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:text-navy [&_h3]:tracking-tight [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:list-inside [&_ol]:mt-4 [&_ol]:space-y-2 [&_ol]:list-decimal [&_ol]:list-inside [&_li]:text-foreground/70 [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:text-gold [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <div className="border-t border-stone/40 pt-8 mt-12">
            <p className="text-xs text-foreground/50 leading-relaxed">
              These terms were last updated on {effectiveDate}. We may update
              these terms from time to time. The version in effect at the time
              your booking is confirmed will apply to your journey.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
