import { Section } from "@/components/ui/section";
import { getPrivacyPageContent } from "@/lib/legal/privacy";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Privacy Policy | Curated Experiences",
  description:
    "How Curated Experiences collects, uses, stores, and protects personal information.",
};

export default async function PrivacyPage() {
  const { effectiveDate, html } = await getPrivacyPageContent();

  return (
    <>
      <div className="bg-navy text-cream pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase font-medium text-gold mb-5">
            Legal
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl tracking-tight leading-tight">
            Privacy Policy
          </h1>
          <div className="mt-6 h-px w-10 bg-gold" />
          <p className="mt-7 text-cream/60 text-sm leading-relaxed">
            Effective {effectiveDate}. This policy explains how we handle and
            protect your personal information.
          </p>
        </div>
      </div>

      <Section narrow>
        <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed">
          <div
            className="[&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-navy [&_h2]:tracking-tight [&_h2]:mt-12 [&_h2]:mb-4 [&_h2:first-child]:mt-0 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:text-navy [&_h3]:tracking-tight [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:text-foreground/70 [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:text-gold [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <div className="border-t border-stone/40 pt-8 mt-12">
            <p className="text-xs text-foreground/50 leading-relaxed">
              This policy was last updated on {effectiveDate}. We may update it
              from time to time by publishing the revised policy on this page.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
