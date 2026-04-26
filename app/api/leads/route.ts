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

  const hasConciergeContext = source === "concierge_email_capture" && conversation_summary;

  // --- Try to merge with existing lead ---
  // Two merge strategies:
  // 1. Concierge brief creates a lead with no email → visitor provides email → merge
  // 2. Same email submitted twice (e.g. concierge then contact form) → merge
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  // Strategy 1: Find recent concierge lead without email (brief was generated but no email captured)
  const { data: noEmailLead } = await supabase
    .from("enquiries")
    .select("id, ai_brief, intent_score, source")
    .eq("source", "concierge")
    .is("email", null)
    .gte("created_at", twoHoursAgo)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Strategy 2: Find any recent lead with the same email
  const { data: sameEmailLead } = !noEmailLead
    ? await supabase
        .from("enquiries")
        .select("id, ai_brief, intent_score, source")
        .eq("email", email)
        .gte("created_at", twoHoursAgo)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()
    : { data: null };

  const existingLead = noEmailLead || sameEmailLead;

  if (existingLead) {
    // Merge: update the existing lead with new details
    const transcriptNote = conversation_summary
      ? `\n\n---\nConversation transcript:\n${conversation_summary.slice(0, 2000)}`
      : "";
    const mergedBrief = existingLead.ai_brief
      ? `${existingLead.ai_brief}${transcriptNote}`
      : conversation_summary
        ? `Visitor provided email during concierge conversation. Transcript:\n\n${conversation_summary.slice(0, 2000)}`
        : existingLead.ai_brief;

    const updates: Record<string, unknown> = {
      email,
      intent_score: Math.max(existingLead.intent_score ?? 0, 6),
    };
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (mergedBrief) updates.ai_brief = mergedBrief;
    if (interests?.length) updates.interests = interests;

    const { error: updateError } = await supabase
      .from("enquiries")
      .update(updates)
      .eq("id", existingLead.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Log activity
    const mergeSource = source === "concierge_email_capture" ? "concierge inline form" : source ?? "form";
    supabase
      .from("lead_activities")
      .insert({
        enquiry_id: existingLead.id,
        type: "contact_captured",
        description: `Email captured via ${mergeSource} — merged with existing ${existingLead.source} lead`,
        created_by: "system",
      })
      .then(() => {}, () => {});

    // Send welcome email
    sendWelcomeEmail(email, name).catch((err) =>
      console.error("Welcome email failed:", err)
    );

    return NextResponse.json({ id: existingLead.id, status: "merged" });
  }

  // --- No existing lead to merge — create new ---
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
      nurture_sequence: "mid:pending",
      intent_score: hasConciergeContext ? 5 : 3,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log activity
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

  // Send welcome email
  sendWelcomeEmail(email, name).catch((err) =>
    console.error("Welcome email failed:", err)
  );

  return NextResponse.json({ id: data.id, status: "received" });
}
