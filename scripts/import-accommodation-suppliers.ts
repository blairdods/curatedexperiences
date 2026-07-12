/**
 * Refresh accommodation suppliers from the Curated Experiences supplier directory.
 *
 * Usage:
 *   npm run import:accommodations -- --file="/path/to/Supplier Directory.xlsx"
 *   npm run import:accommodations -- --csv="/path/to/Supplier Directory.csv" --dry-run
 *   npm run import:accommodations -- --file="/path/to/file.xlsx" --deactivate-missing
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import {
  parseSupplierDirectory,
  toAccommodationSlug,
} from "../lib/accommodations/supplier-directory";

const DEFAULT_FILE = "/Users/blairdods/Downloads/CURATED EXPERIENCES SUPPLIER DIRECTORY (1).xlsx";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function argValue(name: string): string | undefined {
  const prefix = `${name}=`;
  return process.argv.slice(2).find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function hasArg(name: string): boolean {
  return process.argv.includes(name);
}

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

async function main() {
  const filePath = path.resolve(
    argValue("--file") ?? argValue("--csv") ?? process.env.CSV_PATH ?? DEFAULT_FILE
  );
  const dryRun = hasArg("--dry-run");
  const deactivateMissing = hasArg("--deactivate-missing");
  const { records, warnings } = parseSupplierDirectory(fs.readFileSync(filePath), filePath);

  const { data: existingData, error: existingError } = await supabase
    .from("accommodations")
    .select("id,property_id,slug,name,notes,active");
  if (existingError) throw existingError;

  const existing = existingData ?? [];
  const existingByPropertyId = new Map(
    existing
      .filter((record) => record.property_id)
      .map((record) => [record.property_id as string, record])
  );
  const usedSlugs = new Set(existing.map((record) => record.slug as string));
  const imported = records.map((record) => {
    const match = existingByPropertyId.get(record.property_id);
    if (match) return { ...record, slug: match.slug as string };
    return { ...record, slug: uniqueSlug(record.slug, record.property_id, usedSlugs) };
  });

  const sourceIds = new Set(imported.map((record) => record.property_id));
  const inserted = imported.filter((record) => !existingByPropertyId.has(record.property_id));
  const updated = imported.filter((record) => existingByPropertyId.has(record.property_id));
  const missing = existing.filter(
    (record) => record.property_id && !sourceIds.has(record.property_id as string) && record.active
  );

  console.log(`Source file: ${filePath}`);
  console.log(`Valid source rows: ${imported.length}`);
  console.log(`Rows to insert: ${inserted.length}`);
  console.log(`Rows to update: ${updated.length}`);
  console.log(`Rows skipped with warnings: ${warnings.length}`);
  warnings.forEach((warning) => console.warn(`- ${warning}`));
  console.log(
    `Existing active supplier rows missing from source: ${missing.length}${
      deactivateMissing ? " (will mark inactive)" : ""
    }`
  );

  if (dryRun) {
    console.log("Dry run only. No database changes made.");
    return;
  }

  const { error: upsertError } = await supabase
    .from("accommodations")
    .upsert(imported, { onConflict: "property_id" });
  if (upsertError) throw upsertError;

  let deactivated = 0;
  if (deactivateMissing) {
    const importDate = new Date().toISOString().slice(0, 10);
    for (const record of missing) {
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
    `Done: ${imported.length} imported, ${inserted.length} inserted, ${updated.length} updated, ${deactivated} marked inactive.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
