import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";
import { sendPaymentLinkEmail } from "@/lib/email/send";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await getUserRole(user.email);
  if (!role || !["admin", "curator"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const serviceSupabase = await createServiceClient();

  const { data: booking } = await serviceSupabase
    .from("bookings")
    .select("id, deposit_amount, stripe_payment_link_url, enquiries(name, email)")
    .eq("id", id)
    .single();

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const enquiry = booking.enquiries as unknown as { name: string | null; email: string | null } | null;
  const clientEmail = enquiry?.email;
  const clientName = enquiry?.name ?? "Guest";

  if (!clientEmail) {
    return NextResponse.json({ error: "No email address on file for this client" }, { status: 400 });
  }

  if (!booking.stripe_payment_link_url) {
    return NextResponse.json({ error: "Generate the payment link first" }, { status: 400 });
  }

  const depositAmount = Number(booking.deposit_amount ?? 0);

  await sendPaymentLinkEmail({
    email: clientEmail,
    clientName,
    depositAmountUsd: depositAmount,
    paymentUrl: booking.stripe_payment_link_url,
    curatorName: user.email.split("@")[0],
  });

  // Audit
  await serviceSupabase.from("audit_log").insert({
    entity_type: "booking",
    entity_id: id,
    action: "payment_link_emailed",
    performed_by: user.email,
    changes: { after: { sent_to: clientEmail } },
  });

  return NextResponse.json({ sent: true, to: clientEmail });
}
