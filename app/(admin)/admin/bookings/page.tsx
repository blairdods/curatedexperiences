import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ExportButton } from "@/components/admin/export-button";
import { BookingKanban } from "@/components/admin/booking-kanban";

export default async function BookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const serviceSupabase = await createServiceClient();
  const { data: bookings } = await serviceSupabase
    .from("bookings")
    .select("*, tours(title)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-navy tracking-tight">
            Bookings
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            {bookings?.length ?? 0} total bookings — drag cards to change status
          </p>
        </div>
        <ExportButton endpoint="/api/admin/export/bookings" label="Export CSV" />
      </div>

      <div className="mt-6">
        <BookingKanban bookings={bookings ?? []} />
      </div>
    </div>
  );
}
