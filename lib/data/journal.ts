import { createServiceClient } from "@/lib/supabase/server";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  heroImage: string;
  relatedJourneySlugs: string[];
}

export interface ArticleWithSource extends Article {
  source: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Article {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    category: row.category ?? "",
    author: row.author ?? "",
    publishedAt: row.published_at ?? "",
    readTime: row.read_time ?? "",
    heroImage: row.hero_image ?? "",
    relatedJourneySlugs: row.related_journey_slugs ?? [],
  };
}

export async function getArticles(): Promise<Article[]> {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("journal_articles")
    .select("slug, title, excerpt, category, author, published_at, read_time, hero_image, related_journey_slugs")
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

export async function getArticleSlugs(): Promise<string[]> {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("journal_articles")
    .select("slug");
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.slug);
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithSource | undefined> {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("journal_articles")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) return undefined;
  return { ...mapRow(data), source: data.content ?? "" };
}
