import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  console.log("=== Google Search Console Setup ===\n");
  console.log(`Supabase project: ${supabaseUrl}\n`);

  const { error } = await supabase.from("search_console_metrics").select("id").limit(1);
  if (error && error.message?.includes("does not exist")) {
    console.log("search_console_metrics table: MISSING");
    console.log("\nRun the migration SQL from supabase/migrations/00020_ga4_analytics.sql\n");
    console.log("To apply via CLI:");
    console.log("  supabase db push\n");
    console.log("Or open Supabase Dashboard -> SQL Editor -> paste and run the SQL above.\n");
    return;
  }

  console.log("search_console_metrics table: OK\n");

  const envVars = ["GSC_SITE_URL", "GSC_CLIENT_EMAIL", "GSC_PRIVATE_KEY"];
  const missing = envVars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    console.log("Missing env vars:");
    missing.forEach((v) => console.log(`  - ${v}`));
    console.log("\nConfigure them in .env.local:\n");
    console.log(`GSC_SITE_URL=https://yourdomain.com`);
    console.log(`GSC_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com`);
    console.log(`GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"`);
    console.log("\nThen add the service account email as an owner in Google Search Console.");
    return;
  }

  console.log("Env vars: all configured\n");

  console.log("Target SEO queries to track:");
  const targetQueries = [
    "luxury new zealand travel",
    "bespoke new zealand tours",
    "new zealand luxury holiday",
    "fiordland luxury lodge",
    "new zealand wine tour",
    "curated experiences new zealand",
  ];
  targetQueries.forEach((q) => console.log(`  - ${q}`));

  console.log("\nTo verify the integration, run:");
  console.log('  tsx --env-file=.env.local -e \'const{syncAll}=require("./lib/analytics/search-console");syncAll(7).then(console.log)\'');
}

main().catch(console.error);
