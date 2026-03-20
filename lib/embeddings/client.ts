const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Generate an embedding using Supabase's built-in gte-small model
 * via the Edge Function. Returns a 384-dimensional vector.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Call the Edge Function directly for a single text embedding
  const res = await fetch(`${SUPABASE_URL}/functions/v1/embed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embedding error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.embedding;
}

/**
 * Trigger embedding generation for specific record IDs.
 * The Edge Function fetches the records, generates embeddings, and stores them.
 */
export async function embedRecords(
  ids: string[],
  table: "content" | "tours" = "content"
): Promise<{ embedded: number; failed: number }> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/embed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ ids, table }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embed error ${res.status}: ${err}`);
  }

  return res.json();
}
