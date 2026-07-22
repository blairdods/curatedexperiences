import "server-only";

import { createServiceClient } from "@/lib/supabase/server";
import type { AssetRecord } from ".";
import { formatFileSize } from "./metadata-utils";

interface UploadedAssetRow {
  id: string;
  asset_id: string;
  title: string;
  alt_text: string | null;
  description: string | null;
  region: string | null;
  location: string | null;
  licence: string;
  ad_status: AssetRecord["adStatus"];
  tags: string[] | null;
  credit: string | null;
  copyright: string | null;
  usage_notes: string | null;
  source_url: string | null;
  original_filename: string;
  public_url: string;
  mime_type: string;
  file_size_bytes: number;
  width: number;
  height: number;
  image_metadata: Record<string, unknown> | null;
  created_at: string;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function uploadedRowToAsset(row: UploadedAssetRow): AssetRecord {
  const metadata = row.image_metadata ?? {};
  const camera = [text(metadata.cameraMake), text(metadata.cameraModel)].filter(Boolean).join(" ");
  return {
    assetId: row.asset_id,
    source: "uploaded",
    title: row.title,
    altText: row.alt_text ?? row.title,
    description: row.description ?? "",
    region: row.region ?? "",
    location: row.location ?? "",
    licence: row.licence,
    adStatus: row.ad_status,
    paidAdsOk: row.ad_status === "approved",
    tags: row.tags ?? [],
    credit: row.credit ?? "",
    copyright: row.copyright ?? "",
    usageNotes: row.usage_notes ?? "",
    fileType: row.mime_type.split("/")[1]?.toUpperCase() ?? "IMAGE",
    fileSize: formatFileSize(Number(row.file_size_bytes)),
    resolution: `${row.width} × ${row.height}`,
    dateAdded: row.created_at,
    dateTaken: text(metadata.dateTaken),
    camera,
    latitude: numberOrNull(metadata.latitude),
    longitude: numberOrNull(metadata.longitude),
    sourceUrl: row.source_url ?? "",
    filename: row.original_filename,
    publicSrc: row.public_url,
    hasLocalFile: false,
    thumbnailSrc: row.public_url,
    contentSrc: row.public_url,
  };
}

export async function getUploadedAssets(): Promise<AssetRecord[]> {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("asset_library_assets")
    .select("*")
    .order("created_at", { ascending: false });

  // Allow application code to deploy before the accompanying migration is
  // applied; other database failures should remain visible.
  if (error?.code === "42P01" || error?.code === "PGRST205") return [];
  if (error) throw new Error(`Unable to load uploaded assets: ${error.message}`);
  return ((data ?? []) as UploadedAssetRow[]).map(uploadedRowToAsset);
}
