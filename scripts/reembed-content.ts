/**
 * Re-embed content records missing embeddings via Supabase Edge Function (gte-small).
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/reembed-content.ts
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

async function embedBatch(ids: string[], table: string) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/embed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({ ids, table }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Edge Function error ${res.status}: ${err}`);
  }

  return res.json();
}

async function main() {
  console.log("🔄 Re-embedding content via Supabase gte-small\n");

  // Fetch content records without embeddings
  const { data: records, error } = await supabase
    .from("content")
    .select("id")
    .is("embedding", null)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("DB error:", error.message);
    process.exit(1);
  }

  console.log(`Found ${records.length} records without embeddings\n`);

  if (records.length === 0) {
    console.log("Nothing to embed.");
    return;
  }

  // Process in batches of 10
  const batchSize = 10;
  let totalEmbedded = 0;
  let totalFailed = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const ids = batch.map((r) => r.id);

    console.log(
      `  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)} (${ids.length} records)...`
    );

    try {
      const result = await embedBatch(ids, "content");
      totalEmbedded += result.embedded;
      totalFailed += result.failed;
      console.log(`    ✓ ${result.embedded} embedded, ${result.failed} failed`);
    } catch (err) {
      console.log(`    ✗ ${(err as Error).message}`);
      totalFailed += ids.length;
    }
  }

  console.log(`\n✅ Done. Embedded: ${totalEmbedded}, Failed: ${totalFailed}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
