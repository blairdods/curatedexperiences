import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-05-27.dahlia",
  });
}

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
    .select("id, deposit_amount, stripe_payment_link_id, stripe_payment_link_url, enquiries(name, email)")
    .eq("id", id)
    .single();

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const depositAmount = Number(booking.deposit_amount ?? 0);
  if (depositAmount <= 0) {
    return NextResponse.json(
      { error: "Deposit amount must be set on the booking before generating a payment link" },
      { status: 400 }
    );
  }

  // Return existing link if already generated
  if (booking.stripe_payment_link_url) {
    return NextResponse.json({ url: booking.stripe_payment_link_url });
  }

  const enquiry = booking.enquiries as unknown as { name: string | null } | null;
  const clientName = enquiry?.name ?? "Guest";

  // Create a one-time Stripe price
  const stripe = getStripe();
  const price = await stripe.prices.create({
    currency: "usd",
    unit_amount: Math.round(depositAmount * 100), // convert to cents
    product_data: {
      name: `Curated Experiences — Deposit (${clientName})`,
    },
  });

  // Create the payment link
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: price.id, quantity: 1 }],
    after_completion: {
      type: "hosted_confirmation",
      hosted_confirmation: {
        custom_message: "Thank you — your deposit has been received. Your Curated Experiences curator will be in touch shortly.",
      },
    },
    metadata: { booking_id: id },
  });

  // Save link to booking
  await serviceSupabase
    .from("bookings")
    .update({
      stripe_payment_link_id: paymentLink.id,
      stripe_payment_link_url: paymentLink.url,
    })
    .eq("id", id);

  // Audit log
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/admin/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      entityType: "booking",
      entityId: id,
      action: "payment_link_generated",
      changes: { after: { stripe_payment_link_url: paymentLink.url } },
    }),
  });

  return NextResponse.json({ url: paymentLink.url });
}
