import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BackLink } from "@/components/admin/ui/back-link";
import { JourneyForm } from "@/components/admin/journey-form";

export default async function NewJourneyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div>
      <BackLink href="/admin/journeys" label="Back to Journeys" />
      <h1 className="font-serif text-2xl text-navy tracking-tight mb-6">
        Create Journey
      </h1>
      <JourneyForm />
    </div>
  );
}
