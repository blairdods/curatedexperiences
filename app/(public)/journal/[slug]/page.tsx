import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
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

const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="font-serif text-[34px] sm:text-[42px] text-navy tracking-normal leading-[1.08] mt-14 mb-5"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-[15px] text-foreground/80 leading-7" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="space-y-2 ml-1" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="flex items-start gap-3 text-[15px] text-foreground/80 leading-7">
      <span className="text-gold flex-shrink-0 mt-1">&#9672;</span>
      <span {...props} />
    </li>
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
};

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
        <div className="space-y-6">
          <MDXRemote source={article.source} components={mdxComponents} />
        </div>

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
