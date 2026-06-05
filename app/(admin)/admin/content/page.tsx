import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ContentQueue } from "@/components/admin/content-queue";
import { getArticles } from "@/lib/data/journal";
import { DESTINATIONS } from "@/lib/data/destinations";
import { JOURNEYS } from "@/lib/data/journeys";
import Link from "next/link";

const TABS = [
  { id: "destinations", label: "Destinations" },
  { id: "journeys", label: "Journeys" },
  { id: "journal", label: "Journal Articles" },
  { id: "pending", label: "Pending Approval" },
  { id: "knowledge-base", label: "Knowledge Base" },
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

  const { tab = "destinations" } = await searchParams;
  const activeTab = (TABS.some((t) => t.id === tab) ? tab : "destinations") as Tab;

  const serviceSupabase = await createServiceClient();

  // Lightweight counts for all tabs
  const [
    { count: pendingCount },
    { count: kbCount },
    { count: destinationCount },
    { count: journeyCount },
  ] = await Promise.all([
    serviceSupabase
      .from("content")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_approval"),
    serviceSupabase
      .from("content")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    serviceSupabase.from("destinations").select("*", { count: "exact", head: true }),
    serviceSupabase.from("tours").select("*", { count: "exact", head: true }),
  ]);

  const journalCount = await serviceSupabase
    .from("journal_articles")
    .select("*", { count: "exact", head: true })
    .then(({ count }) => count ?? 0);

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

  const articles = activeTab === "journal" ? await getArticles() : [];

  const dbDestinations =
    activeTab === "destinations"
      ? (
          await serviceSupabase
            .from("destinations")
            .select("id, slug, name, region, active")
            .order("region", { ascending: true })
            .order("name", { ascending: true })
        ).data
      : null;

  const dbJourneys =
    activeTab === "journeys"
      ? (
          await serviceSupabase
            .from("tours")
            .select("id, slug, title, tagline, active, duration_days, price_from_usd")
            .order("updated_at", { ascending: false })
        ).data
      : null;

  const counts: Record<Tab, number> = {
    destinations: destinationCount ?? DESTINATIONS.length,
    journeys: journeyCount ?? JOURNEYS.length,
    journal: journalCount,
    pending: pendingCount ?? 0,
    "knowledge-base": kbCount ?? 0,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-navy tracking-tight">Content</h1>
        {activeTab === "destinations" && (
          <Link
            href="/admin/destinations/new"
            className="px-4 py-2.5 text-sm font-medium rounded-lg bg-navy text-white hover:bg-navy-light transition-colors"
          >
            + Add Destination
          </Link>
        )}
        {activeTab === "journeys" && (
          <Link
            href="/admin/journeys/new"
            className="px-4 py-2.5 text-sm font-medium rounded-lg bg-navy text-white hover:bg-navy-light transition-colors"
          >
            + Create Journey
          </Link>
        )}
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

      {/* Destinations */}
      {activeTab === "destinations" && (
        <div className="space-y-2">
          {(dbDestinations ?? []).map((dest) => (
            <div
              key={dest.id}
              className="flex items-center gap-4 bg-white px-4 py-3 rounded-lg border border-warm-200"
            >
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${dest.active ? "bg-green-500" : "bg-warm-300"}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{dest.name}</p>
                <p className="text-xs text-foreground-muted">{dest.region}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link
                  href={`/admin/destinations/${dest.id}`}
                  className="text-xs text-navy hover:text-navy-light transition-colors"
                >
                  Edit
                </Link>
                <Link
                  href={`/destinations/${dest.slug}`}
                  target="_blank"
                  className="text-xs text-foreground-muted hover:text-foreground transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
          {(!dbDestinations || dbDestinations.length === 0) && (
            <div className="text-center py-12">
              <p className="text-sm text-foreground-muted mb-3">
                No destinations in the database yet. Ask Blair to run the one-time import.
              </p>
              <Link
                href="/admin/destinations/new"
                className="text-sm text-navy hover:text-navy-light"
              >
                + Add your first destination
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Journeys */}
      {activeTab === "journeys" && (
        <div className="space-y-2">
          {(dbJourneys ?? []).map((journey) => (
            <div
              key={journey.id}
              className="flex items-center gap-4 bg-white px-4 py-3 rounded-lg border border-warm-200"
            >
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${journey.active ? "bg-green-500" : "bg-warm-300"}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{journey.title}</p>
                <p className="text-xs text-foreground-muted truncate">{journey.tagline}</p>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-xs text-foreground-muted flex-shrink-0">
                {journey.duration_days && <span>{journey.duration_days}d</span>}
                {journey.price_from_usd && (
                  <span>${journey.price_from_usd.toLocaleString()}</span>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link
                  href={`/admin/journeys/${journey.id}`}
                  className="text-xs text-navy hover:text-navy-light transition-colors"
                >
                  Edit
                </Link>
                <Link
                  href={`/journeys/${journey.slug}`}
                  target="_blank"
                  className="text-xs text-foreground-muted hover:text-foreground transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
          {(!dbJourneys || dbJourneys.length === 0) && (
            <div className="text-center py-12">
              <p className="text-sm text-foreground-muted mb-3">
                No journeys in the database yet. Ask Blair to run the one-time import.
              </p>
              <Link
                href="/admin/journeys/new"
                className="text-sm text-navy hover:text-navy-light"
              >
                + Create your first journey
              </Link>
            </div>
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
                <p className="text-sm text-foreground truncate">{article.title}</p>
                <p className="text-xs text-foreground-muted">
                  {article.category} — {article.readTime} — {article.publishedAt}
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
                  target="_blank"
                  className="text-xs text-foreground-muted hover:text-foreground transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

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
              <Link href="/admin/content/new" className="text-navy hover:text-navy-light">
                Add your first entry
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
