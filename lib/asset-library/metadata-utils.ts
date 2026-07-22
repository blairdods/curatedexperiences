export interface ExtractedAssetMetadata {
  width: number;
  height: number;
  format: string;
  mimeType: string;
  orientation: number | null;
  density: number | null;
  colourSpace: string;
  hasAlpha: boolean;
  pages: number;
  title: string;
  description: string;
  credit: string;
  copyright: string;
  location: string;
  region: string;
  keywords: string[];
  dateTaken: string;
  cameraMake: string;
  cameraModel: string;
  latitude: number | null;
  longitude: number | null;
  embedded: Record<string, unknown>;
}

/**
 * PostgreSQL text/jsonb cannot store U+0000, and malformed image metadata can
 * also contain lone UTF-16 surrogates. Remove or repair both before any
 * extracted or user-editable text reaches Supabase.
 */
export function databaseSafeString(value: string): string {
  let result = "";
  for (const character of value) {
    const codePoint = character.codePointAt(0);
    if (codePoint === 0) continue;
    if (codePoint != null && codePoint >= 0xD800 && codePoint <= 0xDFFF) {
      result += "\uFFFD";
    } else {
      result += character;
    }
  }
  return result;
}

function firstString(tags: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = tags[key];
    if (typeof value === "string" && databaseSafeString(value).trim()) {
      return databaseSafeString(value).trim();
    }
    if (Array.isArray(value)) {
      const text = value.find((item) => typeof item === "string" && databaseSafeString(item).trim());
      if (typeof text === "string") return databaseSafeString(text).trim();
    }
  }
  return "";
}

function firstNumber(tags: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = tags[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return null;
}

function isoDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  if (typeof value === "string" && value.trim()) {
    const safeValue = databaseSafeString(value).trim();
    const parsed = new Date(safeValue);
    return Number.isNaN(parsed.getTime()) ? safeValue : parsed.toISOString();
  }
  return "";
}

function keywordList(value: unknown): string[] {
  const values = Array.isArray(value) ? value : typeof value === "string" ? value.split(/[;,]/) : [];
  return [...new Set(values.flatMap((item) => {
    if (typeof item !== "string") return [];
    return item.split(/[;,]/).map((part) => databaseSafeString(part).trim()).filter(Boolean);
  }))];
}

export function titleFromFilename(filename: string): string {
  return databaseSafeString(filename)
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = units[0];
  for (let index = 1; index < units.length && value >= 1024; index += 1) {
    value /= 1024;
    unit = units[index];
  }
  return `${value.toFixed(value >= 10 ? 1 : 2)} ${unit}`;
}

export function serializableMetadata(value: unknown, depth = 0): unknown {
  if (depth > 5 || value == null) return value == null ? value : undefined;
  if (typeof value === "string") return databaseSafeString(value).slice(0, 10_000);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value.toISOString();
  if (ArrayBuffer.isView(value)) return undefined;
  if (Array.isArray(value)) {
    return value.slice(0, 200).map((item) => serializableMetadata(item, depth + 1)).filter((item) => item !== undefined);
  }
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .slice(0, 300)
        .map(([key, item]) => [databaseSafeString(key).slice(0, 500), serializableMetadata(item, depth + 1)])
        .filter((entry) => entry[0] && entry[1] !== undefined)
    );
  }
  return undefined;
}

export function fieldsFromEmbeddedMetadata(
  rawTags: Record<string, unknown>,
  filename: string
) {
  const title = firstString(rawTags, ["ObjectName", "Title", "XPTitle", "ImageDescription"]);
  const description = firstString(rawTags, ["Caption-Abstract", "CaptionAbstract", "Description", "ImageDescription", "XPComment"]);
  const credit = firstString(rawTags, ["Artist", "Creator", "By-line", "Byline", "Credit"]);
  const copyright = firstString(rawTags, ["Copyright", "CopyrightNotice", "Rights"]);
  const location = firstString(rawTags, ["Sub-location", "SubLocation", "Location", "City"]);
  const region = firstString(rawTags, ["Province-State", "ProvinceState", "State"]);
  const keywordValue = ["Keywords", "Subject", "XPKeywords", "HierarchicalSubject"]
    .map((key) => rawTags[key])
    .find((value) => value != null);
  const dateTakenValue = ["DateTimeOriginal", "CreateDate", "DateCreated", "ModifyDate"]
    .map((key) => rawTags[key])
    .find((value) => value != null);

  return {
    title: title || titleFromFilename(filename),
    description,
    credit,
    copyright,
    location,
    region,
    keywords: keywordList(keywordValue),
    dateTaken: isoDate(dateTakenValue),
    cameraMake: firstString(rawTags, ["Make"]),
    cameraModel: firstString(rawTags, ["Model"]),
    latitude: firstNumber(rawTags, ["latitude", "GPSLatitude"]),
    longitude: firstNumber(rawTags, ["longitude", "GPSLongitude"]),
  };
}
