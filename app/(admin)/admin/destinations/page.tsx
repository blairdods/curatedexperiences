import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DestinationsList } from "@/components/admin/destinations-list";
import { DESTINATIONS } from "@/lib/data/destinations";
import Link from "next/link";

export default async function DestinationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const serviceSupabase = await createServiceClient();
  const { data: dbDestinations } = await serviceSupabase
    .from("destinations")
    .select("id, slug, name, region, tagline, highlights, best_for, active, updated_at")
    .order("region", { ascending: true })
    .order("name", { ascending: true });

  const hasDbDestinations = dbDestinations && dbDestinations.length > 0;
  const northCount = (dbDestinations ?? []).filter((d) => d.region === "North Island").length;
  const southCount = (dbDestinations ?? []).filter((d) => d.region === "South Island").length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-navy tracking-tight">Destinations</h1>
          <p className="text-sm text-foreground-muted mt-1">
            {hasDbDestinations
              ? `${dbDestinations.length} destinations — ${northCount} North Island, ${southCount} South Island`
              : `${DESTINATIONS.length} destinations (static placeholder data — add to database to edit)`}
          </p>
        </div>
        <Link
          href="/admin/destinations/new"
          className="px-4 py-2.5 text-sm font-medium rounded-lg bg-navy text-white hover:bg-navy-light transition-colors"
        >
          + Add Destination
        </Link>
      </div>

      <div className="mt-6">
        {hasDbDestinations ? (
          <DestinationsList destinations={dbDestinations} />
        ) : (
          <div className="space-y-3">
            {DESTINATIONS.map((dest) => (
              <div
                key={dest.slug}
                className="flex items-center gap-4 bg-white rounded-xl border border-warm-200 px-5 py-4"
              >
                <div className="w-2 h-2 rounded-full bg-warm-300 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{dest.name}</p>
                  <p className="text-xs text-foreground-muted">{dest.region} — static data</p>
                </div>
                <Link
                  href={`/destinations/${dest.slug}`}
                  target="_blank"
                  className="text-xs text-foreground-muted hover:text-foreground transition-colors flex-shrink-0"
                >
                  View
                </Link>
              </div>
            ))}
            <div className="mt-6 p-4 bg-gold/10 border border-gold/20 rounded-xl">
              <p className="text-sm text-navy font-medium">Destinations are currently static data</p>
              <p className="text-xs text-foreground-muted mt-1">
                Add your first destination via the button above to switch to database-managed content. Once any destination is in the database, all public destination pages will read from the database first.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
