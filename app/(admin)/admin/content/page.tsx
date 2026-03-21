import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ContentQueue } from "@/components/admin/content-queue";
import { ARTICLES } from "@/lib/data/journal";
import { DESTINATIONS } from "@/lib/data/destinations";
import Link from "next/link";

export default async function ContentApprovalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: pending } = await supabase
    .from("content")
    .select("*")
    .eq("status", "pending_approval")
    .order("created_at", { ascending: false });

  const { data: dbContent } = await supabase
    .from("content")
    .select("*")
    .eq("status", "active")
    .order("updated_at", { ascending: false })
    .limit(10);

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy tracking-tight">
        Content
      </h1>
      <p className="text-sm text-foreground-muted mt-1">
        {pending?.length ?? 0} pending approval
      </p>

      {/* Pending approval */}
      <div className="mt-6">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
          Pending Approval
        </h2>
        <ContentQueue items={pending ?? []} />
      </div>

      {/* Static content: Journal articles */}
      <div className="mt-10">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
          Journal Articles
          <span className="ml-2 text-warm-400 normal-case tracking-normal">
            (static — edit in codebase)
          </span>
        </h2>
        <div className="space-y-2">
          {ARTICLES.map((article) => (
            <div
              key={article.slug}
              className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-warm-200"
            >
              <div>
                <p className="text-sm text-foreground">{article.title}</p>
                <p className="text-xs text-foreground-muted">
                  {article.category} — {article.readTime} — {article.publishedAt}
                </p>
              </div>
              <Link
                href={`/journal/${article.slug}`}
                className="text-xs text-navy hover:text-navy-light transition-colors"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Static content: Destinations */}
      <div className="mt-10">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
          Destinations
          <span className="ml-2 text-warm-400 normal-case tracking-normal">
            (static — edit in codebase)
          </span>
        </h2>
        <div className="space-y-2">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.slug}
              className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-warm-200"
            >
              <div>
                <p className="text-sm text-foreground">{dest.name}</p>
                <p className="text-xs text-foreground-muted">
                  {dest.region} — {dest.highlights.length} highlights
                </p>
              </div>
              <Link
                href={`/destinations/${dest.slug}`}
                className="text-xs text-navy hover:text-navy-light transition-colors"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* DB content (knowledge base) */}
      <div className="mt-10">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
          Knowledge Base
          <span className="ml-2 text-warm-400 normal-case tracking-normal">
            ({dbContent?.length ?? 0} records in database)
          </span>
        </h2>
        <div className="space-y-2">
          {(dbContent ?? []).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-warm-200"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground truncate">{item.title}</p>
                <p className="text-xs text-foreground-muted">
                  {item.type} — {item.source_type ?? "manual"}
                </p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 flex-shrink-0">
                Active
              </span>
            </div>
          ))}
          {(!dbContent || dbContent.length === 0) && (
            <p className="text-sm text-foreground-muted text-center py-8">
              No knowledge base content yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
