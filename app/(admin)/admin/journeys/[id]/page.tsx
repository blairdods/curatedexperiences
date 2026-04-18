import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { BackLink } from "@/components/admin/ui/back-link";
import { JourneyForm } from "@/components/admin/journey-form";

export default async function EditJourneyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const serviceSupabase = await createServiceClient();

  const { data: journey } = await serviceSupabase
    .from("tours")
    .select("*")
    .eq("id", id)
    .single();

  if (!journey) notFound();

  return (
    <div>
      <BackLink href="/admin/journeys" label="Back to Journeys" />
      <h1 className="font-serif text-2xl text-navy tracking-tight mb-6">
        Edit: {journey.title}
      </h1>
      <JourneyForm
        initialData={{
          id: journey.id,
          slug: journey.slug,
          title: journey.title,
          tagline: journey.tagline ?? "",
          duration_days: journey.duration_days ?? 10,
          price_from_usd: journey.price_from_usd ?? 0,
          journey_type: journey.journey_type ?? [],
          regions: journey.regions ?? [],
          experience_tags: journey.experience_tags ?? [],
          theme_tags: journey.theme_tags ?? [],
          ideal_for: journey.ideal_for ?? [],
          seasons: journey.seasons ?? [],
          highlights: journey.highlights ?? [],
          inclusions: journey.inclusions ?? [],
          itinerary_days: (journey.itinerary_days ?? []) as Parameters<typeof JourneyForm>[0]["initialData"] extends undefined ? never : NonNullable<Parameters<typeof JourneyForm>[0]["initialData"]>["itinerary_days"],
          media: (journey.media ?? []) as { src: string; alt: string }[],
          active: journey.active ?? true,
        }}
      />
    </div>
  );
}
