import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";
import { logAudit } from "@/lib/audit/log";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = await getUserRole(user.email);
    if (!role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { enquiry_id, journey_type_pref } = await request.json();
    if (!enquiry_id) {
      return NextResponse.json({ error: "enquiry_id required" }, { status: 400 });
    }

    const serviceSupabase = await createServiceClient();

    // Check if booking already exists
    const { data: existing } = await serviceSupabase
      .from("bookings")
      .select("id")
      .eq("enquiry_id", enquiry_id)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ id: existing[0].id, existing: true });
    }

    // Try to match a tour by journey preference
    let tourId = null;
    if (journey_type_pref) {
      const { data: tour } = await serviceSupabase
        .from("tours")
        .select("id")
        .ilike("title", `%${journey_type_pref}%`)
        .limit(1)
        .single();
      tourId = tour?.id ?? null;
    }

    const { data: booking, error } = await serviceSupabase
      .from("bookings")
      .insert({
        enquiry_id,
        tour_id: tourId,
        status: "deposit",
      })
      .select("id")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await logAudit({
      entityType: "booking",
      entityId: booking.id,
      action: "created",
      changes: { after: { enquiry_id, tour_id: tourId } },
      userEmail: user.email,
    });

    return NextResponse.json({ id: booking.id });
  } catch (err) {
    console.error("Create booking error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
