export interface Chunk {
  text: string;
  index: number;
}

const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_OVERLAP = 200;

export function chunkText(
  text: string,
  chunkSize = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_OVERLAP
): Chunk[] {
  if (!text || text.trim().length === 0) return [];

  const cleaned = text.replace(/\n{3,}/g, "\n\n").trim();

  // If text is short enough, return as single chunk
  if (cleaned.length <= chunkSize) {
    return [{ text: cleaned, index: 0 }];
  }

  const chunks: Chunk[] = [];
  let start = 0;
  let index = 0;

  while (start < cleaned.length) {
    let end = start + chunkSize;

    if (end < cleaned.length) {
      // Try to break at paragraph boundary
      const paragraphBreak = cleaned.lastIndexOf("\n\n", end);
      if (paragraphBreak > start + chunkSize * 0.5) {
        end = paragraphBreak;
      } else {
        // Fall back to sentence boundary
        const sentenceBreak = cleaned.lastIndexOf(". ", end);
        if (sentenceBreak > start + chunkSize * 0.5) {
          end = sentenceBreak + 1;
        }
      }
    } else {
      end = cleaned.length;
    }

    chunks.push({ text: cleaned.slice(start, end).trim(), index });
    index++;

    start = end - overlap;
    if (start >= cleaned.length) break;
  }

  return chunks;
}

export function prepareContentForEmbedding(
  title: string,
  body: string,
  type?: string
): string {
  const parts: string[] = [];
  if (type) parts.push(`[${type}]`);
  if (title) parts.push(title);
  if (body) parts.push(body);
  return parts.join("\n\n");
}
