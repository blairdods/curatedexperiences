import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email/send";

export async function POST(request: Request) {
  const body = await request.json();

  const { name, email, phone, source, utm_campaign, journey_interest, interests } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from("enquiries")
    .insert({
      name,
      email,
      phone,
      source: source ?? "direct",
      utm_campaign,
      journey_interest,
      interests,
      status: "new",
      // Start mid-intent nurture for email captures (no concierge brief)
      nurture_sequence: "mid:pending",
      intent_score: 3,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send welcome email (fire-and-forget)
  sendWelcomeEmail(email, name).catch((err) =>
    console.error("Welcome email failed:", err)
  );

  return NextResponse.json({ id: data.id, status: "received" });
}
