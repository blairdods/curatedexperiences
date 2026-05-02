import Link from "next/link";
import { getArticles } from "@/lib/data/journal";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";

export default function JournalPage() {
  const articles = getArticles();

  return (
    <>
      <Hero
        title="Journal"
        subtitle="Insights, stories, and inspiration for your New Zealand journey."
        imageSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
        compact
      />

      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              className="group block"
            >
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-warm-100 mb-4">
                <img
                  src={article.heroImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-xs tracking-widest uppercase text-warm-500">
                {article.category}
              </p>
              <h2 className="mt-2 font-serif text-xl text-navy tracking-tight group-hover:text-navy-light transition-colors">
                {article.title}
              </h2>
              <p className="mt-2 text-sm text-foreground-muted leading-relaxed line-clamp-2">
                {article.excerpt}
              </p>
              <p className="mt-3 text-xs text-warm-400">
                {article.readTime}
              </p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
