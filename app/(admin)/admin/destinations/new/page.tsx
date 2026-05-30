import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BackLink } from "@/components/admin/ui/back-link";
import { DestinationForm } from "@/components/admin/destination-form";

export default async function NewDestinationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div>
      <BackLink href="/admin/destinations" label="Back to Destinations" />
      <h1 className="font-serif text-2xl text-navy tracking-tight mb-6">New Destination</h1>
      <DestinationForm />
    </div>
  );
}
