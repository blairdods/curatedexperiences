import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";
import {
  parseSupplierDirectory,
  toAccommodationSlug,
  type SupplierDirectoryRecord,
} from "@/lib/accommodations/supplier-directory";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function uniqueSlug(base: string, propertyId: string, used: Set<string>): string {
  if (!used.has(base)) {
    used.add(base);
    return base;
  }

  const suffix = toAccommodationSlug(propertyId) || "property";
  let candidate = `${base}-${suffix}`;
  let count = 2;
  while (used.has(candidate)) {
    candidate = `${base}-${suffix}-${count}`;
    count += 1;
  }
  used.add(candidate);
  return candidate;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await getUserRole(user.email);
  if (!role || !["admin", "curator"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an XLSX or CSV file to import." }, { status: 400 });
  }

  const lowerName = file.name.toLowerCase();
  if (!lowerName.endsWith(".xlsx") && !lowerName.endsWith(".csv")) {
    return NextResponse.json({ error: "Only .xlsx and .csv files are supported." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "The file is larger than the 5 MB upload limit." }, { status: 413 });
  }

  let records: SupplierDirectoryRecord[];
  let warnings: string[];
  try {
    const parsed = parseSupplierDirectory(new Uint8Array(await file.arrayBuffer()), file.name);
    records = parsed.records;
    warnings = parsed.warnings;
  } catch (error) {
    const message = error instanceof Error ? error.message : "The spreadsheet could not be read.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const serviceSupabase = await createServiceClient();
  const { data: existing, error: existingError } = await serviceSupabase
    .from("accommodations")
    .select("id,property_id,slug");

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  const existingByPropertyId = new Map(
    (existing ?? [])
      .filter((row) => row.property_id)
      .map((row) => [row.property_id as string, row])
  );
  const usedSlugs = new Set((existing ?? []).map((row) => row.slug as string));
  const imported = records.map((record) => {
    const match = existingByPropertyId.get(record.property_id);
    if (match) return { ...record, slug: match.slug as string };
    return { ...record, slug: uniqueSlug(record.slug, record.property_id, usedSlugs) };
  });

  const updated = imported.filter((record) => existingByPropertyId.has(record.property_id)).length;
  const inserted = imported.length - updated;
  const { error: upsertError } = await serviceSupabase
    .from("accommodations")
    .upsert(imported, { onConflict: "property_id" });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({ imported: imported.length, inserted, updated, warnings });
}
