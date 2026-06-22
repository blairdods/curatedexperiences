import Link from "next/link";
import Image from "next/image";
import { getArticles } from "@/lib/data/journal";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";

export default async function JournalPage() {
  const articles = await getArticles().catch(() => []);

  return (
    <>
      <Hero
        eyebrow="Journal"
        title="Before a journey begins, there is a way of seeing."
        subtitle="Selected perspectives on timing, remote places, and the details that shape a more considered New Zealand journey."
        imageSrc="/assets/images/233207-aoraki-mt-cook-canterbury.jpg"
        compact
      />

      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              className="group block"
            >
              <div className="relative aspect-[1.7] overflow-hidden bg-warm-200 mb-6">
                <Image
                  src={article.heroImage}
                  alt={article.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="text-[10px] tracking-[0.28em] uppercase font-semibold text-gold">
                {article.category}
              </p>
              <h2 className="mt-3 font-serif font-medium text-[26px] leading-[1.1] text-navy tracking-normal group-hover:text-navy-light transition-colors">
                {article.title}
              </h2>
              <p className="mt-4 text-[13px] text-foreground-muted leading-6 line-clamp-3">
                {article.excerpt}
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-foreground-muted/60">
                {article.readTime}
              </p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
