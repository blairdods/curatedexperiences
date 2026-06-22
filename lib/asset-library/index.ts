import fs from "fs";
import path from "path";
import { cache } from "react";

export interface AssetRecord {
  assetId: string;
  title: string;
  region: string;
  location: string;
  licence: string;
  paidAdsOk: boolean;
  tags: string[];
  credit: string;
  fileType: string;
  fileSize: string;
  resolution: string;
  dateAdded: string;
  sourceUrl: string;
  filename: string; // basename of local file
  inLibrary: boolean;
}

const CSV_PATH = path.join(process.cwd(), "docs/_Images_Index.csv");
const IMAGES_DIR = path.join(process.cwd(), "asset-library/Images");

/** RFC 4180 CSV parser that handles quoted fields with embedded commas and newlines. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuote = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];
    if (inQuote) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
        } else {
          inQuote = false;
          i++;
        }
      } else {
        field += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuote = true;
        i++;
      } else if (ch === ",") {
        row.push(field);
        field = "";
        i++;
      } else if (ch === "\r" && text[i + 1] === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
        i += 2;
      } else if (ch === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
        i++;
      } else {
        field += ch;
        i++;
      }
    }
  }
  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const KNOWN_FILES: Set<string> = new Set(
  fs.existsSync(IMAGES_DIR) ? fs.readdirSync(IMAGES_DIR) : []
);

function extractFilename(localPath: string): string {
  // Windows path: C:\...\filename.jpg  OR  Unix path
  const parts = localPath.replace(/\\/g, "/").split("/");
  return parts[parts.length - 1] ?? "";
}

export const getAssets = cache((): AssetRecord[] => {
  const text = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parseCsv(text);
  if (rows.length < 2) return [];

  const header = rows[0].map((h) => h.trim());
  const COL = (name: string) => header.indexOf(name);

  const results: AssetRecord[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length < 2) continue;

    const get = (col: number) => (row[col] ?? "").trim();
    const inLibrary = get(COL("In Library")) === "Yes";
    const filename = extractFilename(get(COL("Local Path")));

    // Skip items not in the library or with no local file present
    if (!inLibrary || !filename || !KNOWN_FILES.has(filename)) continue;

    const tagsRaw = get(COL("Tags"));
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    results.push({
      assetId: get(COL("Asset ID")),
      title: get(COL("Title")),
      region: get(COL("Region")),
      location: get(COL("Location")),
      licence: get(COL("Licence")),
      paidAdsOk: get(COL("Paid Ads OK")).toLowerCase() === "yes",
      tags,
      credit: get(COL("Credit")),
      fileType: get(COL("File Type")).toUpperCase(),
      fileSize: get(COL("File Size")),
      resolution: get(COL("Resolution")),
      dateAdded: get(COL("Date Added")),
      sourceUrl: get(COL("Source URL")),
      filename,
      inLibrary,
    });
  }

  return results;
});

export function searchAssets(
  assets: AssetRecord[],
  {
    q = "",
    region = "",
    licence = "",
    paidAdsOk,
    fileType = "",
  }: {
    q?: string;
    region?: string;
    licence?: string;
    paidAdsOk?: boolean;
    fileType?: string;
  }
): AssetRecord[] {
  const query = q.toLowerCase().trim();
  return assets.filter((a) => {
    if (region && a.region.toLowerCase() !== region.toLowerCase()) return false;
    if (licence && a.licence !== licence) return false;
    if (paidAdsOk !== undefined && a.paidAdsOk !== paidAdsOk) return false;
    if (fileType && a.fileType !== fileType.toUpperCase()) return false;
    if (!query) return true;
    return (
      a.title.toLowerCase().includes(query) ||
      a.location.toLowerCase().includes(query) ||
      a.region.toLowerCase().includes(query) ||
      a.credit.toLowerCase().includes(query) ||
      a.tags.some((t) => t.toLowerCase().includes(query)) ||
      a.filename.toLowerCase().includes(query) ||
      a.assetId.includes(query)
    );
  });
}
