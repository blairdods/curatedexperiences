import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ContentQueue } from "@/components/admin/content-queue";
import { getArticles, getArticleSlugs } from "@/lib/data/journal";
import { DESTINATIONS } from "@/lib/data/destinations";
import Link from "next/link";

const TABS = [
  { id: "pending", label: "Pending Approval" },
  { id: "knowledge-base", label: "Knowledge Base" },
  { id: "journal", label: "Journal Articles" },
  { id: "destinations", label: "Destinations" },
] as const;

type Tab = (typeof TABS)[number]["id"];

export default async function ContentApprovalPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { tab = "pending" } = await searchParams;
  const activeTab = (TABS.some((t) => t.id === tab) ? tab : "pending") as Tab;

  const serviceSupabase = await createServiceClient();

  // Counts for all tabs (lightweight)
  const [{ count: pendingCount }, { count: kbCount }] = await Promise.all([
    serviceSupabase
      .from("content")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_approval"),
    serviceSupabase
      .from("content")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
  ]);

  const journalCount = getArticleSlugs().length;
  const destinationCount = DESTINATIONS.length;

  // Full data only for the active tab
  const pending =
    activeTab === "pending"
      ? (
          await serviceSupabase
            .from("content")
            .select("*")
            .eq("status", "pending_approval")
            .order("created_at", { ascending: false })
        ).data
      : null;

  const dbContent =
    activeTab === "knowledge-base"
      ? (
          await serviceSupabase
            .from("content")
            .select("*")
            .eq("status", "active")
            .order("updated_at", { ascending: false })
            .limit(50)
        ).data
      : null;

  const articles = activeTab === "journal" ? getArticles() : [];

  const counts: Record<Tab, number> = {
    pending: pendingCount ?? 0,
    "knowledge-base": kbCount ?? 0,
    journal: journalCount,
    destinations: destinationCount,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-navy tracking-tight">
          Content
        </h1>
        {activeTab === "knowledge-base" && (
          <Link
            href="/admin/content/new"
            className="px-4 py-2.5 text-sm font-medium rounded-lg bg-navy text-white hover:bg-navy-light transition-colors"
          >
            + Add Content
          </Link>
        )}
        {activeTab === "journal" && (
          <Link
            href="/admin/content/journal/new"
            className="px-4 py-2.5 text-sm font-medium rounded-lg bg-navy text-white hover:bg-navy-light transition-colors"
          >
            + New Article
          </Link>
        )}
      </div>

      {/* Tab nav */}
      <div className="flex gap-0 border-b border-warm-200 mb-6 -mx-1">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/admin/content?tab=${t.id}`}
            className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === t.id
                ? "border-navy text-navy font-medium"
                : "border-transparent text-foreground-muted hover:text-foreground"
            }`}
          >
            {t.label}
            {counts[t.id] > 0 && (
              <span
                className={`ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full ${
                  activeTab === t.id
                    ? "bg-navy/10 text-navy"
                    : "bg-warm-100 text-warm-400"
                }`}
              >
                {counts[t.id]}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Pending Approval */}
      {activeTab === "pending" && (
        <div>
          {(pendingCount ?? 0) === 0 ? (
            <p className="text-sm text-foreground-muted text-center py-12">
              No items pending approval.
            </p>
          ) : (
            <ContentQueue items={pending ?? []} />
          )}
        </div>
      )}

      {/* Knowledge Base */}
      {activeTab === "knowledge-base" && (
        <div className="space-y-2">
          {(dbContent ?? []).map((item) => (
            <Link
              key={item.id}
              href={`/admin/content/${item.id}`}
              className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-warm-200 hover:border-navy/20 hover:shadow-sm transition-all"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground truncate">{item.title}</p>
                <p className="text-xs text-foreground-muted">
                  {item.type} — {item.source_type ?? "manual"}
                  {item.region_tags?.length
                    ? ` — ${(item.region_tags as string[]).join(", ")}`
                    : ""}
                </p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 flex-shrink-0 ml-3">
                Active
              </span>
            </Link>
          ))}
          {(!dbContent || dbContent.length === 0) && (
            <p className="text-sm text-foreground-muted text-center py-12">
              No knowledge base content yet.{" "}
              <Link
                href="/admin/content/new"
                className="text-navy hover:text-navy-light"
              >
                Add your first entry
              </Link>
            </p>
          )}
        </div>
      )}

      {/* Journal Articles */}
      {activeTab === "journal" && (
        <div className="space-y-2">
          {articles.map((article) => (
            <div
              key={article.slug}
              className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-warm-200"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground truncate">
                  {article.title}
                </p>
                <p className="text-xs text-foreground-muted">
                  {article.category} — {article.readTime} —{" "}
                  {article.publishedAt}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                <Link
                  href={`/admin/content/journal/${article.slug}`}
                  className="text-xs text-navy hover:text-navy-light transition-colors"
                >
                  Edit
                </Link>
                <Link
                  href={`/journal/${article.slug}`}
                  className="text-xs text-foreground-muted hover:text-foreground transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Destinations */}
      {activeTab === "destinations" && (
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
                className="text-xs text-foreground-muted hover:text-foreground transition-colors"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
