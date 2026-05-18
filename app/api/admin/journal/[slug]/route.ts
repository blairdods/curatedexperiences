import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const JOURNAL_DIR = path.join(process.cwd(), "content/journal");

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const filePath = path.join(JOURNAL_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return NextResponse.json({ frontmatter: data, content });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const filePath = path.join(JOURNAL_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { frontmatter, content } = await req.json();
  const output = matter.stringify("\n" + (content ?? ""), frontmatter);
  fs.writeFileSync(filePath, output, "utf8");

  return NextResponse.json({ success: true });
}
