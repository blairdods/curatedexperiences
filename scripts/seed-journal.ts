/**
 * One-time script: seeds all MDX journal sources as HTML in journal_articles.
 * Run with: npx tsx scripts/seed-journal.ts
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";
import { resolveJournalHtml } from "../lib/journal-content";
const JOURNAL_DIR = path.join(process.cwd(), "content/journal");

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const files = fs.readdirSync(JOURNAL_DIR).filter((f) => f.endsWith(".mdx"));
  console.log(`Found ${files.length} articles to seed.\n`);

  let ok = 0;
  let fail = 0;

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(JOURNAL_DIR, file), "utf8");
    const { data, content } = matter(raw);

    const { error } = await supabase.from("journal_articles").upsert(
      {
        slug,
        title: data.title ?? slug,
        excerpt: data.excerpt ?? null,
        category: data.category ?? null,
        author: data.author ?? null,
        published_at: data.publishedAt ?? null,
        read_time: data.readTime ?? null,
        hero_image: data.heroImage ?? null,
        related_journey_slugs: data.relatedJourneySlugs ?? [],
        content: resolveJournalHtml(content),
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error(`✗ ${slug}: ${error.message}`);
      fail++;
    } else {
      console.log(`✓ ${slug}`);
      ok++;
    }
  }

  console.log(`\nDone: ${ok} seeded, ${fail} failed.`);
}

main().catch(console.error);
