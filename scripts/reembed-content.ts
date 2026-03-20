/**
 * Re-embed content records that are missing embeddings.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/reembed-content.ts
 *
 * With fast rate (after adding Voyage payment method):
 *   VOYAGE_FAST=1 npx tsx --env-file=.env.local scripts/reembed-content.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY!;
const FAST = process.env.VOYAGE_FAST === "1";
const DELAY = FAST ? 500 : 21000;

async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: [text],
      model: "voyage-3-large",
      output_dimension: 1024,
    }),
  });

  if (res.status === 429) {
    console.log("  ⏳ Rate limited, waiting 25s...");
    await new Promise((r) => setTimeout(r, 25000));
    return generateEmbedding(text); // retry once
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Voyage ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}

async function main() {
  console.log(`🔄 Re-embedding content (${FAST ? "fast" : "slow"} mode)\n`);

  // Fetch content records without embeddings
  const { data: records, error } = await supabase
    .from("content")
    .select("id, title, body, type")
    .is("embedding", null)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("DB error:", error.message);
    process.exit(1);
  }

  console.log(`Found ${records.length} records without embeddings\n`);

  let embedded = 0;
  let failed = 0;

  for (const record of records) {
    const text = `[${record.type || "content"}]\n\n${record.title || ""}\n\n${record.body || ""}`.slice(0, 4000);

    try {
      const embedding = await generateEmbedding(text);

      const { error: updateErr } = await supabase
        .from("content")
        .update({ embedding })
        .eq("id", record.id);

      if (updateErr) {
        console.log(`  ✗ ${record.title?.slice(0, 50)}: ${updateErr.message}`);
        failed++;
      } else {
        console.log(`  ✓ ${record.title?.slice(0, 60)}`);
        embedded++;
      }
    } catch (err) {
      console.log(`  ✗ ${record.title?.slice(0, 50)}: ${(err as Error).message}`);
      failed++;
    }

    await new Promise((r) => setTimeout(r, DELAY));
  }

  console.log(`\n✅ Done. Embedded: ${embedded}, Failed: ${failed}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
