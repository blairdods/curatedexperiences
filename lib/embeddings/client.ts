const VOYAGE_API_URL = "https://api.voyageai.com/v1/embeddings";
const MODEL = "voyage-3-large";
const DIMENSIONS = 1536;

interface VoyageResponse {
  data: { embedding: number[] }[];
}

async function callVoyage(input: string[]): Promise<VoyageResponse> {
  const res = await fetch(VOYAGE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input,
      model: MODEL,
      output_dimension: DIMENSIONS,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Voyage API error ${res.status}: ${err}`);
  }

  return res.json();
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const result = await callVoyage([text]);
  return result.data[0].embedding;
}

export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  const batchSize = 128;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const result = await callVoyage(batch);
    for (const item of result.data) {
      allEmbeddings.push(item.embedding);
    }
  }

  return allEmbeddings;
}
