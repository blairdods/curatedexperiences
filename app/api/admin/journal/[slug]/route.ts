import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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
        relatedJourneySlugs: data.related_journey_slugs ?? [],
      },
      content: data.content ?? "",
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
        related_journey_slugs: frontmatter.relatedJourneySlugs ?? [],
        content: content ?? "",
      })
      .eq("slug", slug);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

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

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[journal DELETE]", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
