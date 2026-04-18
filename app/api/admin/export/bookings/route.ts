import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const status = url.searchParams.get("status");

  const serviceSupabase = await createServiceClient();
  let query = serviceSupabase
    .from("bookings")
    .select("*, tours(title), enquiries(name, email)")
    .order("created_at", { ascending: false });

  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to);
  if (status) query = query.eq("status", status);

  const { data: bookings, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const headers = [
    "Journey", "Guest Name", "Guest Email", "Status",
    "Start Date", "End Date", "Total Value (USD)", "Deposit Amount",
    "Deposit Paid", "Balance Due Date", "Balance Paid", "Gross Margin %",
    "Created At",
  ];

  const rows = (bookings ?? []).map((b) => {
    const tours = b.tours as { title: string } | null;
    const enquiries = b.enquiries as { name: string | null; email: string | null } | null;
    return [
      tours?.title, enquiries?.name, enquiries?.email, b.status,
      b.start_date, b.end_date, b.total_value_usd, b.deposit_amount,
      b.deposit_paid_at, b.balance_due_date, b.balance_paid_at,
      b.gross_margin_pct, b.created_at,
    ];
  });

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
      "Content-Disposition": `attachment; filename="bookings-${date}.csv"`,
    },
  });
}
