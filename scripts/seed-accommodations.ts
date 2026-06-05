/**
 * One-time import: reads CURATED EXPERIENCES SUPPLIER DIRECTORY.xlsx
 * and upserts all properties into the accommodations table.
 *
 * Usage: npx tsx --env-file=.env.local scripts/seed-accommodations.ts
 */
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";
import path from "path";

const FILE = path.resolve(
  process.env.XLSX_PATH ||
    "/Users/blairdods/Downloads/CURATED EXPERIENCES SUPPLIER DIRECTORY.xlsx"
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Normalise tier ────────────────────────────────────────────────────────────
function normaliseTier(raw: string | null | undefined): "platinum" | "gold" | "silver" {
  const t = (raw ?? "").toLowerCase().trim();
  if (t.startsWith("platinum")) return "platinum";
  if (t.startsWith("gold")) return "gold";
  return "silver"; // silver, sustainable, blank → silver
}

// ── Normalise property type ───────────────────────────────────────────────────
function normalisePropertyType(
  raw: string | null | undefined
): "lodge" | "hotel" | "boutique_hotel" | "camp" | "villa" | "retreat" | "other" {
  const t = (raw ?? "").toLowerCase().trim();
  if (
    t.includes("lodge") ||
    t.includes("station") ||
    t.includes("fishing")
  )
    return "lodge";
  if (
    t.includes("boutique hotel") ||
    t.includes("boutique b&b") ||
    t.includes("boutique suites") ||
    t.includes("boutique")
  )
    return "boutique_hotel";
  if (
    t.includes("villa") ||
    t.includes("architectural") ||
    t.includes("exclusive-use") ||
    t.includes("private villa")
  )
    return "villa";
  if (
    t.includes("retreat") ||
    t.includes("vineyard accommodation") ||
    t.includes("serviced apartment")
  )
    return "retreat";
  if (
    t.includes("hotel") ||
    t.includes("resort") ||
    t.includes("golf resort") ||
    t.includes("luxury hotel")
  )
    return "hotel";
  return "other";
}

// ── Slug ──────────────────────────────────────────────────────────────────────
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const wb = XLSX.readFile(FILE);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, {
    header: [
      "property_id", "region", "area", "name", "property_type", "tier",
      "address", "website_url", "contact_name", "contact_email",
      "booking_email", "contract_status", "contract_expiry", "notes", "last_updated",
    ],
    range: 2, // skip title row + header row (0-indexed: row 2 = index 2)
    defval: "",
  });

  const records = rows
    .filter((r) => r.name && r.name.trim())
    .map((r) => ({
      slug: toSlug(r.name.trim()),
      name: r.name.trim(),
      tier: normaliseTier(r.tier),
      region: r.region?.trim() || "Unknown",
      location: r.area?.trim() || null,
      property_type: normalisePropertyType(r.property_type),
      website_url: r.website_url?.trim() || null,
      contact_name: r.contact_name?.trim() || null,
      contact_email: r.contact_email?.trim() || null,
      contracted: r.contract_status?.trim() === "Secured",
      notes: [
        r.contract_status?.trim() && `Contract status: ${r.contract_status.trim()}`,
        r.tier?.trim() && `Original tier: ${r.tier.trim()}`,
        r.property_type?.trim() && `Original type: ${r.property_type.trim()}`,
        r.notes?.trim(),
      ]
        .filter(Boolean)
        .join(" | ") || null,
      active: r.contract_status?.trim() !== "Opening Late 2027",
    }));

  console.log(`Importing ${records.length} properties...\n`);

  let ok = 0;
  let fail = 0;

  for (const record of records) {
    const { error } = await supabase
      .from("accommodations")
      .upsert(record, { onConflict: "slug" });

    if (error) {
      console.error(`✗ ${record.name}: ${error.message}`);
      fail++;
    } else {
      console.log(`✓ [${record.tier.padEnd(8)}] ${record.name}`);
      ok++;
    }
  }

  console.log(`\nDone: ${ok} imported, ${fail} failed.`);
}

main().catch(console.error);
