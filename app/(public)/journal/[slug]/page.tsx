import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticleBySlug, getArticleSlugs } from "@/lib/data/journal";
import { getJourneyBySlug } from "@/lib/data/journeys";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { JourneyCard } from "@/components/ui/journey-card";

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Curated Experiences Journal`,
    description: article.excerpt,
  };
}

const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="font-serif text-2xl sm:text-3xl text-navy tracking-tight mt-12 mb-4"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-foreground/80 leading-relaxed" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="space-y-2 ml-1" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="flex items-start gap-3 text-foreground/80 leading-relaxed">
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
  const article = getArticleBySlug(slug);
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
        <div className="flex items-center gap-3 text-xs text-foreground-muted mb-10">
          <span className="tracking-widest uppercase text-warm-500">
            {article.category}
          </span>
          <span className="text-warm-300">|</span>
          <span>{article.readTime}</span>
          <span className="text-warm-300">|</span>
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
        <div className="mt-16 pt-8 border-t border-warm-200">
          <p className="text-xs tracking-widest uppercase text-warm-500 mb-1">
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
