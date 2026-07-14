import fs from "fs";
import path from "path";
import { cache } from "react";
import remoteImages from "./remote-images.json";

interface RemoteImageRecord {
  thumbnailSrc: string;
  contentSrc: string;
}

const REMOTE_IMAGES = remoteImages as Record<string, RemoteImageRecord>;

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
  filename: string;
  /** `/assets/images/[filename]` if committed to git, null otherwise. */
  publicSrc: string | null;
  /** True when the raw file is available in asset-library/Images (local dev only). */
  hasLocalFile: boolean;
  /** Optimized catalogue thumbnail hosted by the asset provider. */
  thumbnailSrc: string | null;
  /** Public web-ready image hosted by the asset provider. */
  contentSrc: string | null;
}

const CSV_PATH = path.join(process.cwd(), "docs/_Images_Index.csv");
const IMAGES_DIR = path.join(process.cwd(), "asset-library/Images");
const PUBLIC_DIR = path.join(process.cwd(), "public/assets/images");

/** RFC 4180 CSV parser — handles quoted fields with embedded commas and newlines. */
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
        if (text[i + 1] === '"') { field += '"'; i += 2; }
        else { inQuote = false; i++; }
      } else { field += ch; i++; }
    } else {
      if (ch === '"') { inQuote = true; i++; }
      else if (ch === ",") { row.push(field); field = ""; i++; }
      else if (ch === "\r" && text[i + 1] === "\n") { row.push(field); rows.push(row); row = []; field = ""; i += 2; }
      else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; }
      else { field += ch; i++; }
    }
  }
  if (field || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

function extractFilename(localPath: string): string {
  const parts = localPath.replace(/\\/g, "/").split("/");
  return parts[parts.length - 1] ?? "";
}

// Built once at startup — which files are available in each location
const PUBLIC_FILES = new Set(
  fs.existsSync(PUBLIC_DIR) ? fs.readdirSync(PUBLIC_DIR) : []
);
const LOCAL_FILES = new Set(
  fs.existsSync(IMAGES_DIR) ? fs.readdirSync(IMAGES_DIR) : []
);

export const getAssets = cache((): AssetRecord[] => {
  if (!fs.existsSync(CSV_PATH)) return [];
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

    if (!inLibrary || !filename) continue;

    const tagsRaw = get(COL("Tags"));
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const assetId = get(COL("Asset ID"));
    const remoteImage = REMOTE_IMAGES[assetId];

    results.push({
      assetId,
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
      publicSrc: PUBLIC_FILES.has(filename) ? `/assets/images/${filename}` : null,
      hasLocalFile: LOCAL_FILES.has(filename),
      thumbnailSrc: remoteImage?.thumbnailSrc ?? null,
      contentSrc: remoteImage?.contentSrc ?? null,
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
