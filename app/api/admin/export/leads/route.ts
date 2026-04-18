import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = user.email ? await getUserRole(user.email) : null;
  if (!role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const status = url.searchParams.get("status");

  const serviceSupabase = await createServiceClient();
  let query = serviceSupabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to);
  if (status) query = query.eq("status", status);

  const { data: leads, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const headers = [
    "Name", "Email", "Phone", "Source", "Campaign", "Status",
    "Assigned To", "Intent Score", "Budget Signal", "Journey Preference",
    "Group Size", "Group Composition", "Interests", "Created At",
  ];

  const rows = (leads ?? []).map((l) => [
    l.name, l.email, l.phone, l.source, l.utm_campaign, l.status,
    l.assigned_to, l.intent_score, l.budget_signal, l.journey_type_pref,
    l.group_size, l.group_composition, (l.interests as string[] | null)?.join("; "),
    l.created_at,
  ]);

  const escapeCsv = (v: unknown) => {
    const str = String(v ?? "");
    return str.includes(",") || str.includes('"') || str.includes("\n")
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };

  const csv = [
    headers.join(","),
    ...rows.map((r) => r.map(escapeCsv).join(",")),
  ].join("\n");

  const date = new Date().toISOString().split("T")[0];
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="leads-${date}.csv"`,
    },
  });
}
