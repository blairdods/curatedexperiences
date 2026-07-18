import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { JourneysList } from "@/components/admin/journeys-list";
import { SeedImportButton } from "@/components/admin/seed-import-button";
import { JOURNEYS } from "@/lib/data/journeys";
import Link from "next/link";

export default async function JourneysManagementPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const serviceSupabase = await createServiceClient();
  const { data: dbJourneys } = await serviceSupabase
    .from("tours")
    .select("id, slug, title, tagline, active, duration_days, price_from_usd, regions, updated_at")
    .order("updated_at", { ascending: false });

  const hasDbJourneys = dbJourneys && dbJourneys.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-navy tracking-tight">
            Journeys
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            {hasDbJourneys
              ? `${dbJourneys.length} journeys in database`
              : `${JOURNEYS.length} journeys (static placeholder data)`}
          </p>
        </div>
        <Link
          href="/admin/journeys/new"
          className="px-4 py-2.5 text-sm font-medium rounded-lg bg-navy text-white hover:bg-navy-light transition-colors"
        >
          + Create Journey
        </Link>
      </div>

      {hasDbJourneys ? (
        <div className="mt-6">
          <JourneysList journeys={dbJourneys} />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          <div className="p-5 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-navy">Journeys are not yet in the database</p>
              <p className="text-xs text-foreground-muted mt-0.5">
                Import the {JOURNEYS.length} existing journeys to make them editable. This is a one-time action — it won&apos;t overwrite anything already in the database.
              </p>
            </div>
            <SeedImportButton
              endpoint="/api/admin/seed/journeys"
              label="journeys"
              count={JOURNEYS.length}
            />
          </div>
          {JOURNEYS.map((journey) => (
            <div
              key={journey.slug}
              className="bg-white rounded-xl border border-warm-200 px-5 py-4 flex items-center gap-4 opacity-60"
            >
              <div className="w-2 h-2 rounded-full bg-warm-300 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{journey.title}</p>
                <p className="text-xs text-foreground-muted truncate">{journey.tagline}</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-foreground-muted flex-shrink-0">
                <span>{journey.durationDays} days</span>
                <span className="max-w-[200px] truncate">{journey.regions.slice(0, 3).join(", ")}</span>
              </div>
              <Link
                href={`/journeys/${journey.slug}`}
                className="text-xs text-foreground-muted hover:text-foreground transition-colors flex-shrink-0"
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
