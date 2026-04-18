import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { BackLink } from "@/components/admin/ui/back-link";
import { BookingDetail } from "@/components/admin/booking-detail";
import { StatusBadge } from "@/components/admin/ui/status-badge";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const serviceSupabase = await createServiceClient();

  const { data: booking } = await serviceSupabase
    .from("bookings")
    .select("*, tours(title, slug), enquiries(name, email)")
    .eq("id", id)
    .single();

  if (!booking) notFound();

  const tourTitle =
    (booking.tours as { title: string; slug: string } | null)?.title ??
    "Custom Journey";

  return (
    <div>
      <BackLink href="/admin/bookings" label="Back to Bookings" />

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="font-serif text-2xl text-navy tracking-tight">
            {tourTitle}
          </h1>
          {booking.total_value_usd && (
            <p className="text-lg font-serif text-navy/70 mt-0.5">
              ${Number(booking.total_value_usd).toLocaleString()}
            </p>
          )}
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <BookingDetail booking={booking as Parameters<typeof BookingDetail>[0]["booking"]} />
    </div>
  );
}
