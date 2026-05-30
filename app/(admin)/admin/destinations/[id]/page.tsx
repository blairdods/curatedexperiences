import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { BackLink } from "@/components/admin/ui/back-link";
import { DestinationForm } from "@/components/admin/destination-form";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const serviceSupabase = await createServiceClient();
  const { data: dest } = await serviceSupabase
    .from("destinations")
    .select("*")
    .eq("id", id)
    .single();

  if (!dest) notFound();

  return (
    <div>
      <BackLink href="/admin/destinations" label="Back to Destinations" />
      <h1 className="font-serif text-2xl text-navy tracking-tight mb-6">
        Edit: {dest.name}
      </h1>
      <DestinationForm
        initialData={{
          id: dest.id,
          slug: dest.slug,
          name: dest.name,
          region: dest.region,
          tagline: dest.tagline ?? "",
          description: dest.description ?? "",
          highlights: dest.highlights ?? [],
          best_for: dest.best_for ?? [],
          best_seasons: dest.best_seasons ?? "",
          related_journey_slugs: dest.related_journey_slugs ?? [],
          hero_image: dest.hero_image ?? "",
          images: (dest.images as { src: string; alt: string }[]) ?? [],
          active: dest.active ?? true,
        }}
      />
    </div>
  );
}
