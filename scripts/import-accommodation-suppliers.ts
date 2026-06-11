/**
 * Refresh accommodation suppliers from the Curated Experiences supplier directory.
 *
 * Usage:
 *   npm run import:accommodations -- --csv="/path/to/Supplier Directory.csv" --deactivate-missing
 *   npx tsx --env-file=.env.local scripts/import-accommodation-suppliers.ts --dry-run
 */
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "path";

type Tier = "platinum" | "gold" | "silver";
type PropertyType =
  | "lodge"
  | "hotel"
  | "boutique_hotel"
  | "camp"
  | "villa"
  | "retreat"
  | "other";

interface SupplierRow {
  property_id: string;
  region: string;
  area: string;
  name: string;
  property_type: string;
  tier: string;
  address: string;
  website_url: string;
  contact_name: string;
  contact_email: string;
  booking_email: string;
  contract_status: string;
  contract_expiry: string;
  notes: string;
  last_updated: string;
}

interface AccommodationRecord {
  slug: string;
  name: string;
  tier: Tier;
  region: string;
  location: string | null;
  property_type: PropertyType;
  website_url: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contracted: boolean;
  notes: string | null;
  active: boolean;
}

interface SluggedSupplierRow extends SupplierRow {
  import_slug: string;
}

const DEFAULT_FILE = path.resolve(
  "/Users/blairdods/Downloads/CURATED EXPERIENCES SUPPLIER DIRECTORY.xlsx - Supplier Directory.csv"
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const websiteOverrides: Record<string, string> = {
  "rathmoy-estate-lodge": "https://www.rathmoy.co.nz/",
};

const columns = [
  "property_id",
  "region",
  "area",
  "name",
  "property_type",
  "tier",
  "address",
  "website_url",
  "contact_name",
  "contact_email",
  "booking_email",
  "contract_status",
  "contract_expiry",
  "notes",
  "last_updated",
] as const;

function argValue(name: string): string | undefined {
  const prefix = `${name}=`;
  return process.argv
    .slice(2)
    .find((arg) => arg.startsWith(prefix))
    ?.slice(prefix.length);
}

function hasArg(name: string): boolean {
  return process.argv.includes(name);
}

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function cleanName(value: unknown): string {
  return clean(value).replace(/[,\s]+$/g, "");
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normaliseTier(raw: string | null | undefined): Tier {
  const tier = clean(raw).toLowerCase();
  if (tier.startsWith("platinum")) return "platinum";
  if (tier.startsWith("gold")) return "gold";
  return "silver";
}

function normalisePropertyType(raw: string | null | undefined): PropertyType {
  const type = clean(raw).toLowerCase();

  if (
    type.includes("lodge") ||
    type.includes("station") ||
    type.includes("fishing")
  ) {
    return "lodge";
  }

  if (
    type.includes("boutique") ||
    type.includes("b&b") ||
    type.includes("bed and breakfast")
  ) {
    return "boutique_hotel";
  }

  if (
    type.includes("villa") ||
    type.includes("hut") ||
    type.includes("residence") ||
    type.includes("exclusive-use") ||
    type.includes("private")
  ) {
    return "villa";
  }

  if (
    type.includes("retreat") ||
    type.includes("vineyard") ||
    type.includes("estate") ||
    type.includes("serviced apartment") ||
    type.includes("apartment")
  ) {
    return "retreat";
  }

  if (
    type.includes("hotel") ||
    type.includes("resort") ||
    type.includes("golf")
  ) {
    return "hotel";
  }

  return "other";
}

function parseDate(value: string): number {
  const timestamp = Date.parse(clean(value));
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function tierScore(row: SupplierRow): number {
  const tier = clean(row.tier).toLowerCase();
  if (tier.startsWith("platinum")) return 300;
  if (tier.startsWith("gold")) return 200;
  if (tier.startsWith("silver")) return 100;
  return 0;
}

function rowScore(row: SupplierRow): number {
  let score = tierScore(row);
  if (clean(row.property_id).includes("-SUS-")) score -= 50;
  if (clean(row.property_id).endsWith("-000")) score -= 10;
  if (clean(row.last_updated)) score += 8;
  if (clean(row.contact_name)) score += 4;
  if (clean(row.contact_email) || clean(row.booking_email)) score += 3;
  if (clean(row.notes)) score += 2;
  score += Math.min(parseDate(row.last_updated) / 1000000000000, 2);
  return score;
}

function isContracted(row: SupplierRow): boolean {
  const status = clean(row.contract_status).toLowerCase();
  if (status.includes("awaiting contract")) return false;
  return (
    status.includes("secured") ||
    status.includes("contracted portal") ||
    status.includes("portal access confirmed")
  );
}

function isActive(row: SupplierRow): boolean {
  return !clean(row.contract_status)
    .toLowerCase()
    .includes("opening late 2027");
}

function valueOrNull(value: string): string | null {
  const cleaned = clean(value);
  return cleaned || null;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function emailOrNull(value: string): string | null {
  const cleaned = clean(value);
  return cleaned && isEmail(cleaned) ? cleaned : null;
}

function buildNotes(row: SupplierRow): string | null {
  const bookingEmail = emailOrNull(row.booking_email);
  const fragments = [
    clean(row.property_id)
      ? `Supplier directory ID: ${clean(row.property_id)}`
      : null,
    clean(row.contract_status)
      ? `Contract status: ${clean(row.contract_status)}`
      : null,
    clean(row.contract_expiry)
      ? `Contract expiry: ${clean(row.contract_expiry)}`
      : null,
    clean(row.tier) ? `Original tier: ${clean(row.tier)}` : null,
    clean(row.property_type)
      ? `Original type: ${clean(row.property_type)}`
      : null,
    clean(row.address) ? `Address: ${clean(row.address)}` : null,
    bookingEmail ? `Booking email: ${bookingEmail}` : null,
    clean(row.last_updated)
      ? `Supplier directory last updated: ${clean(row.last_updated)}`
      : null,
    clean(row.notes) || null,
  ].filter(Boolean);

  return fragments.length ? fragments.join(" | ") : null;
}

function duplicateSlug(row: SupplierRow, baseSlug: string): string {
  return [
    baseSlug,
    toSlug(clean(row.region)),
    toSlug(clean(row.area)),
    toSlug(clean(row.tier)),
  ]
    .filter(Boolean)
    .join("-");
}

function assignImportSlugs(rows: SupplierRow[]): SluggedSupplierRow[] {
  const grouped = new Map<string, SupplierRow[]>();

  for (const row of rows) {
    const name = cleanName(row.name);
    if (!name) continue;

    const baseSlug = toSlug(name);
    const existing = grouped.get(baseSlug) ?? [];
    existing.push(row);
    grouped.set(baseSlug, existing);
  }

  const used = new Set<string>();
  const sluggedRows: SluggedSupplierRow[] = [];

  for (const [baseSlug, groupRows] of grouped) {
    if (groupRows.length === 1) {
      used.add(baseSlug);
      sluggedRows.push({ ...groupRows[0], import_slug: baseSlug });
      continue;
    }

    const sorted = [...groupRows].sort((a, b) => rowScore(b) - rowScore(a));
    sorted.forEach((row, index) => {
      let importSlug = index === 0 ? baseSlug : duplicateSlug(row, baseSlug);

      if (!importSlug || used.has(importSlug)) {
        let suffix = 2;
        const fallbackSlug = importSlug || baseSlug;
        while (used.has(`${fallbackSlug}-${suffix}`)) suffix += 1;
        importSlug = `${fallbackSlug}-${suffix}`;
      }

      used.add(importSlug);
      sluggedRows.push({ ...row, import_slug: importSlug });
    });
  }

  return sluggedRows;
}

function toAccommodationRecord(row: SluggedSupplierRow): AccommodationRecord {
  const name = cleanName(row.name);

  return {
    slug: row.import_slug,
    name,
    tier: normaliseTier(row.tier),
    region: clean(row.region) || "Unknown",
    location: clean(row.area) || null,
    property_type: normalisePropertyType(row.property_type),
    website_url:
      websiteOverrides[toSlug(name)] ??
      valueOrNull(row.website_url),
    contact_name: valueOrNull(row.contact_name),
    contact_email:
      emailOrNull(row.contact_email) ?? emailOrNull(row.booking_email),
    contracted: isContracted(row),
    notes: buildNotes(row),
    active: isActive(row),
  };
}

function loadRecords(filePath: string): AccommodationRecord[] {
  const workbook = filePath.toLowerCase().endsWith(".csv")
    ? XLSX.read(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""), {
        type: "string",
        raw: false,
      })
    : XLSX.readFile(filePath, { raw: false });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<SupplierRow>(worksheet, {
    header: [...columns],
    range: 2,
    defval: "",
    raw: false,
  });

  return assignImportSlugs(rows)
    .map(toAccommodationRecord)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

async function main() {
  const filePath = path.resolve(
    argValue("--csv") ?? argValue("--file") ?? process.env.CSV_PATH ?? DEFAULT_FILE
  );
  const dryRun = hasArg("--dry-run");
  const deactivateMissing = hasArg("--deactivate-missing");

  const records = loadRecords(filePath);
  const sourceSlugs = new Set(records.map((record) => record.slug));

  const { data: existingData, error: existingError } = await supabase
    .from("accommodations")
    .select("id,slug,name,notes,active");

  if (existingError) throw existingError;

  const existing = existingData ?? [];
  const existingSlugs = new Set(existing.map((record) => record.slug as string));
  const newRecords = records.filter((record) => !existingSlugs.has(record.slug));
  const matchedRecords = records.filter((record) => existingSlugs.has(record.slug));
  const missingRecords = existing.filter(
    (record) => !sourceSlugs.has(record.slug as string) && record.active
  );

  console.log(`Source file: ${filePath}`);
  console.log(`Source accommodation rows: ${records.length}`);
  console.log(`Existing accommodation rows: ${existing.length}`);
  console.log(`New rows to insert: ${newRecords.length}`);
  console.log(`Existing rows to update: ${matchedRecords.length}`);
  console.log(
    `Existing active rows missing from source: ${missingRecords.length}${
      deactivateMissing ? " (will mark inactive)" : ""
    }`
  );

  if (newRecords.length) {
    console.log(`\nNew: ${newRecords.map((record) => record.name).join(", ")}`);
  }

  if (missingRecords.length) {
    console.log(
      `\nMissing from source: ${missingRecords
        .map((record) => record.name)
        .join(", ")}`
    );
  }

  if (dryRun) {
    console.log("\nDry run only. No database changes made.");
    return;
  }

  const { error: upsertError } = await supabase
    .from("accommodations")
    .upsert(records, { onConflict: "slug" });

  if (upsertError) throw upsertError;

  let deactivated = 0;
  if (deactivateMissing && missingRecords.length) {
    const importDate = new Date().toISOString().slice(0, 10);

    for (const record of missingRecords) {
      const note = `Marked inactive by supplier directory import ${importDate}: not present in refreshed source file.`;
      const notes = [record.notes, note].filter(Boolean).join(" | ");
      const { error } = await supabase
        .from("accommodations")
        .update({ active: false, notes })
        .eq("id", record.id);

      if (error) throw error;
      deactivated += 1;
    }
  }

  console.log(
    `\nDone: ${records.length} upserted, ${newRecords.length} inserted, ${matchedRecords.length} updated, ${deactivated} marked inactive.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
