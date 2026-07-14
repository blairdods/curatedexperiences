import fs from "node:fs/promises";
import path from "node:path";

interface SourceAsset {
  assetId: string;
  sourceUrl: string;
}

interface RemoteImageRecord {
  thumbnailSrc: string;
  contentSrc: string;
}

const CSV_PATH = path.join(process.cwd(), "docs/_Images_Index.csv");
const OUTPUT_PATH = path.join(process.cwd(), "lib/asset-library/remote-images.json");
const CONCURRENCY = 16;
const ATTEMPTS = 3;

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuote) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuote = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuote = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function readSourceAssets(csv: string): SourceAsset[] {
  const rows = parseCsv(csv);
  const header = rows[0]?.map((value) => value.replace(/^\uFEFF/, "").trim()) ?? [];
  const assetIdIndex = header.indexOf("Asset ID");
  const sourceUrlIndex = header.indexOf("Source URL");
  const inLibraryIndex = header.indexOf("In Library");

  return rows.slice(1).flatMap((row) => {
    if (row[inLibraryIndex]?.trim() !== "Yes") return [];
    const assetId = row[assetIdIndex]?.trim();
    const sourceUrl = row[sourceUrlIndex]?.trim();
    return assetId && sourceUrl ? [{ assetId, sourceUrl }] : [];
  });
}

function decodeHtml(value: string): string {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"');
}

function extractRemoteImages(html: string): RemoteImageRecord | null {
  const thumbnailMatch =
    html.match(/<meta\s+property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ??
    html.match(/<meta\s+content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  const contentMatch = html.match(/["']contentUrl["']\s*:\s*["']([^"']+)["']/i);
  const thumbnailSrc = thumbnailMatch?.[1] ? decodeHtml(thumbnailMatch[1]) : null;
  const contentSrc = contentMatch?.[1] ? decodeHtml(contentMatch[1]) : thumbnailSrc;

  if (!thumbnailSrc || !contentSrc) return null;

  const allowedHost = (value: string) => {
    try {
      return new URL(value).hostname === "cdn-syd.brandkit.com";
    } catch {
      return false;
    }
  };

  return allowedHost(thumbnailSrc) && allowedHost(contentSrc)
    ? { thumbnailSrc, contentSrc }
    : null;
}

async function fetchRemoteImage(asset: SourceAsset): Promise<RemoteImageRecord> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const response = await fetch(asset.sourceUrl, {
        headers: { "User-Agent": "CuratedExperiencesAssetLibrary/1.0" },
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const images = extractRemoteImages(await response.text());
      if (!images) throw new Error("No supported image metadata found");
      return images;
    } catch (error) {
      lastError = error;
      if (attempt < ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 400));
      }
    }
  }

  throw new Error(`${asset.assetId}: ${String(lastError)}`);
}

async function main() {
  const assets = readSourceAssets(await fs.readFile(CSV_PATH, "utf8"));
  let existing: Record<string, RemoteImageRecord> = {};
  try {
    existing = JSON.parse(await fs.readFile(OUTPUT_PATH, "utf8"));
  } catch {
    // The first refresh starts with an empty catalogue.
  }

  const results: Record<string, RemoteImageRecord> = { ...existing };
  const failures: string[] = [];
  let cursor = 0;
  let completed = 0;

  async function worker() {
    while (cursor < assets.length) {
      const asset = assets[cursor++];
      try {
        results[asset.assetId] = await fetchRemoteImage(asset);
      } catch (error) {
        failures.push(String(error));
      }
      completed++;
      if (completed % 100 === 0 || completed === assets.length) {
        process.stdout.write(`Resolved ${completed}/${assets.length} assets\n`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  const ordered = Object.fromEntries(
    assets.flatMap(({ assetId }) => (results[assetId] ? [[assetId, results[assetId]]] : []))
  );
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(ordered, null, 2)}\n`);

  if (failures.length > 0) {
    process.stderr.write(`${failures.length} assets could not be resolved:\n${failures.join("\n")}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(`Saved ${Object.keys(ordered).length} image records to ${OUTPUT_PATH}\n`);
  }
}

main().catch((error) => {
  process.stderr.write(`${String(error)}\n`);
  process.exitCode = 1;
});
