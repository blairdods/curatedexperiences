import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AccommodationsList } from "@/components/admin/accommodations-list";
import { AccommodationImport } from "@/components/admin/accommodation-import";

export const metadata = { title: "Accommodations | CE Admin" };

export default async function AccommodationsPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string; region?: string; q?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const params = await searchParams;
  const serviceSupabase = await createServiceClient();

  let query = serviceSupabase
    .from("accommodations")
    .select("*")
    .order("name", { ascending: true });

  if (params.tier) query = query.eq("tier", params.tier);
  if (params.region) query = query.eq("region", params.region);
  if (params.q) query = query.ilike("name", `%${params.q}%`);

  const { data: accommodations } = await query;

  const { count: totalCount } = await serviceSupabase
    .from("accommodations")
    .select("id", { count: "exact", head: true });

  // Get region list for filter
  const { data: regionRows } = await serviceSupabase
    .from("accommodations")
    .select("region")
    .order("region");
  const regions = [...new Set((regionRows ?? []).map((r) => r.region))];

  const isFiltered = !!(params.q || params.tier || params.region);
  const counts = { platinum: 0, gold: 0, silver: 0 };
  for (const a of accommodations ?? []) {
    if (a.tier in counts) counts[a.tier as keyof typeof counts]++;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-navy tracking-tight">
            Accommodations
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            {isFiltered
              ? `${accommodations?.length ?? 0} of ${totalCount ?? 0} properties`
              : `${totalCount ?? 0} properties`}
          </p>
        </div>
        <Link
          href="/admin/accommodations/new"
          className="px-4 py-2.5 text-sm font-medium rounded-lg bg-navy text-white hover:bg-navy-light transition-colors"
        >
          + Add Property
        </Link>
      </div>

      <AccommodationImport />

      {/* Tier summary */}
      {!isFiltered && (totalCount ?? 0) > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          {(["platinum", "gold", "silver"] as const).map((tier) => (
            <Link
              key={tier}
              href={`/admin/accommodations?tier=${tier}`}
              className="bg-white rounded-xl border border-warm-200 px-5 py-4 hover:border-navy/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  tier === "platinum" ? "bg-navy/10 text-navy" :
                  tier === "gold" ? "bg-gold/15 text-gold-dark" :
                  "bg-stone/30 text-stone-dark"
                }`}>
                  {tier.charAt(0).toUpperCase() + tier.slice(1)}
                </span>
              </div>
              <p className="font-serif text-2xl text-navy mt-2">
                {counts[tier]}
              </p>
              <p className="text-xs text-foreground-muted mt-1">
                {tier === "platinum" ? "NZD 2,500–8,000+/night" :
                 tier === "gold" ? "NZD 800–2,500/night" :
                 "~NZD 600/night"}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Filters */}
      <form method="GET" className="mt-6 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Search properties..."
          className="px-3 py-2 text-sm border border-warm-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 w-56"
        />
        <select
          name="tier"
          defaultValue={params.tier ?? ""}
          className="px-3 py-2 text-sm border border-warm-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-navy/20"
        >
          <option value="">All tiers</option>
          <option value="platinum">Platinum</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
        </select>
        {regions.length > 0 && (
          <select
            name="region"
            defaultValue={params.region ?? ""}
            className="px-3 py-2 text-sm border border-warm-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-navy/20"
          >
            <option value="">All regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-navy text-white rounded-lg hover:bg-navy-light transition-colors"
        >
          Filter
        </button>
        {isFiltered && (
          <Link
            href="/admin/accommodations"
            className="px-4 py-2 text-sm border border-warm-200 rounded-lg hover:bg-warm-50 transition-colors"
          >
            Clear
          </Link>
        )}
      </form>

      {/* List */}
      <div className="mt-6">
        {(accommodations?.length ?? 0) === 0 ? (
          <div className="bg-white rounded-xl border border-warm-200 p-12 text-center">
            <p className="text-foreground-muted text-sm">
              {isFiltered
                ? "No properties match your filters."
                : "No properties yet. Add your first property to get started."}
            </p>
            {!isFiltered && (
              <Link
                href="/admin/accommodations/new"
                className="mt-4 inline-block px-4 py-2 text-sm bg-navy text-white rounded-lg hover:bg-navy-light transition-colors"
              >
                + Add Property
              </Link>
            )}
          </div>
        ) : (
          <AccommodationsList accommodations={accommodations ?? []} />
        )}
      </div>
    </div>
  );
}
