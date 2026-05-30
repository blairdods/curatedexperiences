import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AccommodationForm } from "@/components/admin/accommodation-form";

export const metadata = { title: "Add Property | CE Admin" };

export default async function NewAccommodationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-navy tracking-tight">
          Add Property
        </h1>
        <p className="text-sm text-foreground-muted mt-1">
          Add a new accommodation to the property database.
        </p>
      </div>
      <AccommodationForm />
    </div>
  );
}
