import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");
  const q = searchParams.get("q");

  const serviceSupabase = await createServiceClient();
  let query = serviceSupabase
    .from("destinations")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (region) query = query.eq("region", region);
  if (q) query = query.ilike("name", `%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ destinations: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as Record<string, unknown>;

  if (!body.name || !body.region) {
    return NextResponse.json({ error: "Name and region are required" }, { status: 400 });
  }

  // Auto-generate slug from name if not provided
  if (!body.slug) {
    body.slug = String(body.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const serviceSupabase = await createServiceClient();

  if (body.sort_order == null) {
    const { data: lastDestination, error: orderError } = await serviceSupabase
      .from("destinations")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    body.sort_order = (lastDestination?.sort_order ?? -1) + 1;
  }

  const { data, error } = await serviceSupabase
    .from("destinations")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/destinations");
  revalidatePath("/destinations/[region]", "page");

  return NextResponse.json({ destination: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await getUserRole(user.email);
  if (!role || !["admin", "curator"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json() as { orderedIds?: unknown };
  if (
    !Array.isArray(body.orderedIds) ||
    body.orderedIds.length === 0 ||
    !body.orderedIds.every((id): id is string => typeof id === "string") ||
    new Set(body.orderedIds).size !== body.orderedIds.length
  ) {
    return NextResponse.json(
      { error: "orderedIds must be a non-empty array of unique destination IDs" },
      { status: 400 }
    );
  }

  const serviceSupabase = await createServiceClient();
  const { data: existingDestinations, error: lookupError } = await serviceSupabase
    .from("destinations")
    .select("id");

  if (lookupError) {
    return NextResponse.json({ error: lookupError.message }, { status: 500 });
  }

  const existingIds = new Set(
    (existingDestinations ?? []).map((destination) => destination.id)
  );
  if (
    existingIds.size !== body.orderedIds.length ||
    !body.orderedIds.every((id) => existingIds.has(id))
  ) {
    return NextResponse.json(
      { error: "The order must include every destination exactly once" },
      { status: 400 }
    );
  }

  const results = await Promise.all(
    body.orderedIds.map((id, sortOrder) =>
      serviceSupabase
        .from("destinations")
        .update({ sort_order: sortOrder })
        .eq("id", id)
    )
  );
  const updateError = results.find((result) => result.error)?.error;

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  revalidatePath("/destinations");

  return NextResponse.json({ ok: true });
}
