import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email/send";

export async function POST(request: Request) {
  const body = await request.json();

  const { name, email, phone, source, utm_campaign, journey_interest, interests, conversation_summary } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  // Build ai_brief from conversation if available
  const hasConciergeContext = source === "concierge_email_capture" && conversation_summary;
  const ai_brief = hasConciergeContext
    ? `Visitor provided email during concierge conversation. Transcript:\n\n${conversation_summary.slice(0, 2000)}`
    : undefined;

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
      ai_brief,
      status: "new",
      // Start mid-intent nurture for email captures (no concierge brief)
      nurture_sequence: "mid:pending",
      intent_score: hasConciergeContext ? 5 : 3,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log activity for the lead
  if (data?.id) {
    supabase
      .from("lead_activities")
      .insert({
        enquiry_id: data.id,
        type: "lead_created",
        description: hasConciergeContext
          ? `Lead created via concierge email capture (with conversation context)`
          : `Lead created via ${source ?? "direct"}`,
        created_by: "system",
      })
      .then(() => {}, (err) => console.error("Activity log failed:", err));
  }

  // Send welcome email (fire-and-forget)
  sendWelcomeEmail(email, name).catch((err) =>
    console.error("Welcome email failed:", err)
  );

  return NextResponse.json({ id: data.id, status: "received" });
}
