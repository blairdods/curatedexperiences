import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/data/journal";
import { BackLink } from "@/components/admin/ui/back-link";
import { JournalForm } from "@/components/admin/journal-form";

export default async function EditJournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <div>
      <BackLink href="/admin/content?tab=journal" label="Back to Journal Articles" />
      <h1 className="font-serif text-2xl text-navy tracking-tight mb-6">
        Edit Article
      </h1>
      <JournalForm
        slug={slug}
        initialFrontmatter={{
          title: article.title,
          excerpt: article.excerpt,
          category: article.category,
          author: article.author,
          publishedAt: article.publishedAt,
          readTime: article.readTime,
          heroImage: article.heroImage,
          relatedJourneySlugs: article.relatedJourneySlugs,
        }}
        initialContent={article.html}
      />
    </div>
  );
}
