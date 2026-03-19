import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

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
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // TODO: Trigger email notification to Tony/Liam via Resend

  return NextResponse.json({ id: data.id, status: "received" });
}
