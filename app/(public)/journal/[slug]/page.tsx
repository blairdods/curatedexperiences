import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/data/journal";
import { getJourneyBySlug } from "@/lib/data/journeys";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { JourneyCard } from "@/components/ui/journey-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Curated Experiences Journal`,
    description: article.excerpt,
  };
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const relatedJourneys = article.relatedJourneySlugs
    .map(getJourneyBySlug)
    .filter(Boolean);

  return (
    <>
      <Hero
        title={article.title}
        imageSrc={article.heroImage}
        imagePosition={article.heroImagePosition}
        compact
      />

      <Section narrow>
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-foreground-muted mb-10">
          <span className="tracking-[0.28em] font-semibold text-gold">
            {article.category}
          </span>
          <span className="text-stone">·</span>
          <span>{article.readTime}</span>
          <span className="text-stone">·</span>
          <span>
            {new Date(article.publishedAt).toLocaleDateString("en-NZ", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Article body */}
        <div
          className="text-[15px] text-foreground/80 leading-7 [&_h2]:font-serif [&_h2]:text-[34px] sm:[&_h2]:text-[42px] [&_h2]:text-navy [&_h2]:tracking-normal [&_h2]:leading-[1.08] [&_h2]:mt-14 [&_h2]:mb-5 [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:text-navy [&_h3]:mt-10 [&_h3]:mb-4 [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:mt-8 [&_h4]:mb-3 [&_p]:mt-6 [&_p:first-child]:mt-0 [&_ul]:my-6 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ol]:my-6 [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_li]:pl-2 [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-6 [&_blockquote]:font-serif [&_blockquote]:text-xl [&_blockquote]:italic [&_blockquote]:text-navy [&_hr]:my-10 [&_hr]:border-stone/40"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />

        {/* Author */}
        <div className="mt-16 pt-8 border-t border-stone/40">
          <p className="text-[10px] tracking-[0.28em] uppercase font-semibold text-gold mb-2">
            Written by
          </p>
          <p className="text-sm font-medium text-foreground">{article.author}</p>
        </div>
      </Section>

      {/* Related journeys */}
      {relatedJourneys.length > 0 && (
        <Section background="warm">
          <h2 className="font-serif text-2xl text-navy tracking-tight text-center mb-10">
            Related journeys
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {relatedJourneys.map((j) =>
              j ? (
                <JourneyCard
                  key={j.slug}
                  slug={j.slug}
                  title={j.title}
                  tagline={j.tagline}
                  durationDays={j.durationDays}
                  regions={j.regions.slice(0, 3)}
                  imageSrc={j.images[0]?.src}
                />
              ) : null
            )}
          </div>
        </Section>
      )}
    </>
  );
}
