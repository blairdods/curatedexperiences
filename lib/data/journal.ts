import { createServiceClient } from "@/lib/supabase/server";
import { resolveJournalHtml } from "@/lib/journal-content";
import {
  parseImagePosition,
  type ImagePosition,
} from "@/lib/image-slots";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  heroImage: string;
  heroImagePosition?: ImagePosition;
  relatedJourneySlugs: string[];
}

export interface ArticleWithHtml extends Article {
  html: string;
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
    heroImagePosition: parseImagePosition(row.hero_image_position),
    relatedJourneySlugs: row.related_journey_slugs ?? [],
  };
}

export async function getArticles(): Promise<Article[]> {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("journal_articles")
    .select("*")
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

export async function getArticleBySlug(slug: string): Promise<ArticleWithHtml | undefined> {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("journal_articles")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) return undefined;
  return { ...mapRow(data), html: resolveJournalHtml(data.content) };
}
