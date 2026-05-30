import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { AccommodationForm } from "@/components/admin/accommodation-form";

export const metadata = { title: "Edit Property | CE Admin" };

export default async function EditAccommodationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const serviceSupabase = await createServiceClient();
  const { data: accommodation } = await serviceSupabase
    .from("accommodations")
    .select("*")
    .eq("id", id)
    .single();

  if (!accommodation) notFound();

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-navy tracking-tight">
          {accommodation.name}
        </h1>
        <p className="text-sm text-foreground-muted mt-1">
          Edit property details.
        </p>
      </div>
      <AccommodationForm accommodation={accommodation} />
    </div>
  );
}
