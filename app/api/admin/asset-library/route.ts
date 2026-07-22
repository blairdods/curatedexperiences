import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAssets, searchAssets } from "@/lib/asset-library";
import { getUploadedAssets, uploadedRowToAsset } from "@/lib/asset-library/uploaded";
import { extractAssetMetadata } from "@/lib/asset-library/extract-metadata";
import { getUserRole } from "@/lib/auth/roles";
import { createServiceClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit/log";
import { randomUUID } from "node:crypto";

const BUCKET = "asset-library";
const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

function formText(formData: FormData, key: string, maxLength: number): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function validUrl(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function extensionForMimeType(mimeType: string): string {
  return ({
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  } as Record<string, string>)[mimeType] ?? "img";
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q") ?? "";
  const region = searchParams.get("region") ?? "";
  const licence = searchParams.get("licence") ?? "";
  const fileType = searchParams.get("fileType") ?? "";
  const paidAdsOkParam = searchParams.get("paidAdsOk");
  const paidAdsOk = paidAdsOkParam === "true" ? true : paidAdsOkParam === "false" ? false : undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = Math.min(9999, parseInt(searchParams.get("perPage") ?? "60", 10));

  const all = [...await getUploadedAssets(), ...getAssets()];
  const filtered = searchAssets(all, { q, region, licence, paidAdsOk, fileType });

  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const items = filtered.slice((page - 1) * perPage, page * perPage);

  // Send facets from the full filtered result (pre-pagination) for the filter UI
  const regions = [...new Set(all.map((a) => a.region).filter(Boolean))].sort();
  const licences = [...new Set(all.map((a) => a.licence).filter(Boolean))].sort();
  const fileTypes = [...new Set(all.map((a) => a.fileType).filter(Boolean))].sort();

  return NextResponse.json({
    items,
    total,
    page,
    totalPages,
    perPage,
    facets: { regions, licences, fileTypes },
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await getUserRole(user.email);
  if (role !== "admin") {
    return NextResponse.json({ error: "Only administrators can upload library assets" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose an image to upload" }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Images must be 10 MB or smaller" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let metadata;
  try {
    metadata = await extractAssetMetadata(buffer, file.name);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to read image metadata" },
      { status: 400 }
    );
  }
  if (!ALLOWED_MIME_TYPES.includes(metadata.mimeType)) {
    return NextResponse.json({ error: "Unsupported image format" }, { status: 400 });
  }

  const title = formText(formData, "title", 200) || metadata.title;
  const altText = formText(formData, "altText", 300) || title;
  const sourceUrl = formText(formData, "sourceUrl", 2_000);
  const licence = formText(formData, "licence", 160);
  const adStatusInput = formText(formData, "adStatus", 30);
  const adStatus = ["approved", "not_approved", "pending"].includes(adStatusInput)
    ? adStatusInput as "approved" | "not_approved" | "pending"
    : "pending";
  if (!title || !licence) {
    return NextResponse.json({ error: "Title and licence are required" }, { status: 400 });
  }
  if (!validUrl(sourceUrl)) {
    return NextResponse.json({ error: "Source URL must be a valid http(s) URL" }, { status: 400 });
  }

  const tags = [...new Set(formText(formData, "tags", 2_000)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 50))];
  const id = randomUUID();
  const assetId = `CE-${id.slice(0, 8).toUpperCase()}`;
  const now = new Date();
  const storagePath = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${id}.${extensionForMimeType(metadata.mimeType)}`;
  const service = await createServiceClient();

  // This is idempotent when the migration has already created the bucket.
  await service.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_SIZE_BYTES,
    allowedMimeTypes: ALLOWED_MIME_TYPES,
  });
  const { error: uploadError } = await service.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType: metadata.mimeType, upsert: false });
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: { publicUrl } } = service.storage.from(BUCKET).getPublicUrl(storagePath);
  const row = {
    id,
    asset_id: assetId,
    title,
    alt_text: altText,
    description: formText(formData, "description", 5_000) || metadata.description || null,
    region: formText(formData, "region", 120) || metadata.region || null,
    location: formText(formData, "location", 240) || metadata.location || null,
    licence,
    ad_status: adStatus,
    tags: tags.length ? tags : metadata.keywords.slice(0, 50),
    credit: formText(formData, "credit", 240) || metadata.credit || null,
    copyright: formText(formData, "copyright", 500) || metadata.copyright || null,
    usage_notes: formText(formData, "usageNotes", 3_000) || null,
    source_url: sourceUrl || null,
    original_filename: file.name.slice(0, 500),
    storage_path: storagePath,
    public_url: publicUrl,
    mime_type: metadata.mimeType,
    file_size_bytes: file.size,
    width: metadata.width,
    height: metadata.height,
    image_metadata: metadata,
    uploaded_by: user.id,
    uploaded_by_email: user.email,
  };
  const { data, error: insertError } = await service
    .from("asset_library_assets")
    .insert(row)
    .select("*")
    .single();

  if (insertError) {
    await service.storage.from(BUCKET).remove([storagePath]);
    const migrationHint = insertError.code === "42P01" || insertError.code === "PGRST205"
      ? " Apply migration 00036_asset_library_uploads.sql first."
      : "";
    return NextResponse.json({ error: `${insertError.message}${migrationHint}` }, { status: 500 });
  }

  await logAudit({
    entityType: "asset_library_asset",
    entityId: assetId,
    action: "uploaded",
    changes: { after: { title, licence, adStatus, storagePath } },
    userEmail: user.email,
  });

  return NextResponse.json({ asset: uploadedRowToAsset(data) }, { status: 201 });
}
