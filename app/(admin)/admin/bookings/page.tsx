import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ExportButton } from "@/components/admin/export-button";

const COLUMNS = [
  { key: "confirmed", label: "Confirmed" },
  { key: "deposit", label: "Deposit Paid" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

export default async function BookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const serviceSupabase = await createServiceClient();
  const { data: bookings } = await serviceSupabase
    .from("bookings")
    .select("*, tours(title)")
    .order("created_at", { ascending: false });

  const byStatus = COLUMNS.map((col) => ({
    ...col,
    bookings: (bookings ?? []).filter((b) => b.status === col.key),
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-navy tracking-tight">
            Bookings
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            {bookings?.length ?? 0} total bookings
          </p>
        </div>
        <ExportButton endpoint="/api/admin/export/bookings" label="Export CSV" />
      </div>

      {/* Kanban */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {byStatus.map((col) => (
          <div key={col.key}>
            <h3 className="text-xs tracking-widest uppercase text-foreground-muted mb-3">
              {col.label}
              <span className="ml-2 text-warm-400">
                {col.bookings.length}
              </span>
            </h3>
            <div className="space-y-3">
              {col.bookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/admin/bookings/${booking.id}`}
                  className="block bg-white rounded-lg p-4 border border-warm-200 shadow-sm hover:shadow-md hover:border-navy/20 transition-all"
                >
                  <p className="text-sm font-medium text-foreground">
                    {(booking.tours as { title: string } | null)?.title ?? "Custom Journey"}
                  </p>
                  {booking.total_value_usd && (
                    <p className="text-lg font-serif text-navy mt-1">
                      ${Number(booking.total_value_usd).toLocaleString()}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-xs text-foreground-muted">
                    {booking.start_date && (
                      <span>
                        {new Date(booking.start_date).toLocaleDateString(
                          "en-NZ",
                          { day: "numeric", month: "short" }
                        )}
                      </span>
                    )}
                    {booking.guests && (
                      <span>{(booking.guests as unknown[]).length} guests</span>
                    )}
                  </div>
                </Link>
              ))}
              {col.bookings.length === 0 && (
                <div className="text-center py-8 text-xs text-foreground-muted bg-warm-50/50 rounded-lg border border-dashed border-warm-200">
                  No bookings
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
