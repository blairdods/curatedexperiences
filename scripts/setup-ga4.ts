import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  const sqlPath = "supabase/migrations/00020_ga4_analytics.sql";

  console.log("=== GA4 Analytics Setup ===\n");
  console.log(`Supabase project: ${supabaseUrl}\n`);

  // Check what exists
  const tables = ["ga4_daily_metrics", "search_console_metrics", "ga4_event_goals"];
  const status: string[] = [];

  for (const table of tables) {
    const { error } = await supabase.from(table).select("id").limit(1);
    if (error && error.message?.includes("does not exist")) {
      status.push(`  ${table}: MISSING`);
    } else if (error) {
      status.push(`  ${table}: ERROR - ${error.message}`);
    } else {
      status.push(`  ${table}: OK`);
    }
  }

  console.log("Current table status:");
  console.log(status.join("\n"));

  const allMissing = status.every((s) => s.includes("MISSING"));
  if (allMissing) {
    console.log("\n--- Migration SQL (run in Supabase SQL Editor) ---\n");
    console.log(fs.readFileSync(sqlPath, "utf8"));
    console.log("\n--- End ---\n");

    console.log("To apply migration via CLI:");
    console.log("  supabase db push");
    console.log("  (requires SUPABASE_DB_PASSWORD env var)\n");

    console.log("Or open Supabase Dashboard → SQL Editor → paste and run the SQL above.\n");
    console.log("Then configure env vars:");
    console.log("  GA4_PROPERTY_ID=<your GA4 numeric ID>");
    console.log("  GA4_CLIENT_EMAIL=<service-account>@<project>.iam.gserviceaccount.com");
    console.log("  GA4_PRIVATE_KEY=<private key from JSON key file>");
  } else {
    console.log("\nSome or all tables already exist. Migration may have been applied.");
  }
}

main().catch(console.error);
