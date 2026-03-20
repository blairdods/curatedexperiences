import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { JourneysList } from "@/components/admin/journeys-list";

export default async function JourneysManagementPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: journeys } = await supabase
    .from("tours")
    .select("id, slug, title, tagline, active, duration_days, price_from_usd, regions, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy tracking-tight">
        Journeys
      </h1>
      <p className="text-sm text-foreground-muted mt-1">
        {journeys?.length ?? 0} journeys in database
      </p>
      <div className="mt-6">
        <JourneysList journeys={journeys ?? []} />
      </div>
    </div>
  );
}
