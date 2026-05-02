import fs from "fs";
import path from "path";
import matter from "gray-matter";

const JOURNAL_DIR = path.join(process.cwd(), "content/journal");

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

function parseArticleFile(filename: string): Article {
  const slug = filename.replace(/\.mdx$/, "");
  const filePath = path.join(JOURNAL_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    category: data.category,
    author: data.author,
    publishedAt: data.publishedAt,
    readTime: data.readTime,
    heroImage: data.heroImage,
    relatedJourneySlugs: data.relatedJourneySlugs ?? [],
  };
}

export function getArticles(): Article[] {
  const files = fs
    .readdirSync(JOURNAL_DIR)
    .filter((f) => f.endsWith(".mdx"));

  return files
    .map(parseArticleFile)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getArticleSlugs(): string[] {
  return fs
    .readdirSync(JOURNAL_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getArticleBySlug(slug: string): ArticleWithSource | undefined {
  const filePath = path.join(JOURNAL_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    category: data.category,
    author: data.author,
    publishedAt: data.publishedAt,
    readTime: data.readTime,
    heroImage: data.heroImage,
    relatedJourneySlugs: data.relatedJourneySlugs ?? [],
    source: content,
  };
}
