import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { JourneysList } from "@/components/admin/journeys-list";
import { JOURNEYS } from "@/lib/data/journeys";
import Link from "next/link";

export default async function JourneysManagementPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: dbJourneys } = await supabase
    .from("tours")
    .select("id, slug, title, tagline, active, duration_days, price_from_usd, regions, updated_at")
    .order("updated_at", { ascending: false });

  const hasDbJourneys = dbJourneys && dbJourneys.length > 0;

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy tracking-tight">
        Journeys
      </h1>

      {hasDbJourneys ? (
        <>
          <p className="text-sm text-foreground-muted mt-1">
            {dbJourneys.length} journeys in database
          </p>
          <div className="mt-6">
            <JourneysList journeys={dbJourneys} />
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-foreground-muted mt-1">
            {JOURNEYS.length} journeys (static placeholder data — will move to database after content session)
          </p>
          <div className="mt-6 space-y-3">
            {JOURNEYS.map((journey) => (
              <div
                key={journey.slug}
                className="bg-white rounded-xl border border-warm-200 px-5 py-4 flex items-center gap-4"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {journey.title}
                  </p>
                  <p className="text-xs text-foreground-muted truncate">
                    {journey.tagline}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-foreground-muted flex-shrink-0">
                  <span>{journey.durationDays} days</span>
                  <span>${journey.priceFromUsd.toLocaleString()}</span>
                  <span className="max-w-[200px] truncate">
                    {journey.regions.slice(0, 3).join(", ")}
                  </span>
                </div>
                <Link
                  href={`/journeys/${journey.slug}`}
                  className="text-xs text-navy hover:text-navy-light transition-colors flex-shrink-0"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
