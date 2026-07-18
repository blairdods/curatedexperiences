import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidateJournal } from "@/lib/data/revalidate-journal";
import {
  hasMeaningfulJournalContent,
  resolveJournalHtml,
} from "@/lib/journal-content";
import { NextRequest, NextResponse } from "next/server";
import { parseImagePosition } from "@/lib/image-slots";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { frontmatter, content } = await req.json();

  if (!frontmatter?.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!hasMeaningfulJournalContent(content)) {
    return NextResponse.json({ error: "Article body is required" }, { status: 400 });
  }

  const slug = frontmatter.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const service = await createServiceClient();

  const { data: existing } = await service
    .from("journal_articles")
    .select("slug")
    .eq("slug", slug)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "An article with this title already exists" },
      { status: 409 }
    );
  }

  const { error } = await service.from("journal_articles").insert({
    slug,
    title: frontmatter.title,
    excerpt: frontmatter.excerpt ?? null,
    category: frontmatter.category ?? null,
    author: frontmatter.author ?? null,
    published_at: frontmatter.publishedAt ?? null,
    read_time: frontmatter.readTime ?? null,
    hero_image: frontmatter.heroImage ?? null,
    hero_image_position:
      parseImagePosition(frontmatter.heroImagePosition) ?? null,
    related_journey_slugs: frontmatter.relatedJourneySlugs ?? [],
    content: resolveJournalHtml(content),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateJournal(slug);

  return NextResponse.json({ slug });
}
