import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const JOURNAL_DIR = path.join(process.cwd(), "content/journal");

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

  const slug = frontmatter.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const filePath = path.join(JOURNAL_DIR, `${slug}.mdx`);
  if (fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "An article with this title already exists" },
      { status: 409 }
    );
  }

  const output = matter.stringify("\n" + (content ?? ""), frontmatter);
  fs.writeFileSync(filePath, output, "utf8");

  return NextResponse.json({ slug });
}
