import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidateJournal } from "@/lib/data/revalidate-journal";
import {
  hasMeaningfulJournalContent,
  resolveJournalHtml,
} from "@/lib/journal-content";
import { NextRequest, NextResponse } from "next/server";
import { parseImagePosition } from "@/lib/image-slots";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await params;
    const service = await createServiceClient();

    const { data, error } = await service
      .from("journal_articles")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      frontmatter: {
        title: data.title,
        excerpt: data.excerpt,
        category: data.category,
        author: data.author,
        publishedAt: data.published_at,
        readTime: data.read_time,
        heroImage: data.hero_image,
        heroImagePosition: parseImagePosition(data.hero_image_position),
        relatedJourneySlugs: data.related_journey_slugs ?? [],
      },
      content: resolveJournalHtml(data.content),
    });
  } catch (e) {
    console.error("[journal GET]", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await params;
    const { frontmatter, content } = await req.json();

    if (!frontmatter?.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!hasMeaningfulJournalContent(content)) {
      return NextResponse.json({ error: "Article body is required" }, { status: 400 });
    }

    const service = await createServiceClient();

    const { error } = await service
      .from("journal_articles")
      .update({
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
      })
      .eq("slug", slug);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    revalidateJournal(slug);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[journal PATCH]", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await params;
    const service = await createServiceClient();

    const { error } = await service
      .from("journal_articles")
      .delete()
      .eq("slug", slug);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    revalidateJournal(slug);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[journal DELETE]", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
