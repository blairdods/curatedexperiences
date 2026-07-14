import type { AssetRecord } from "./index";

type AssetSources = Pick<
  AssetRecord,
  "contentSrc" | "filename" | "hasLocalFile" | "publicSrc" | "thumbnailSrc"
>;

function localImageSrc(filename: string): string {
  return `/api/admin/asset-library/image/${encodeURIComponent(filename)}`;
}

/** Best lightweight source for admin search results and previews. */
export function getAssetThumbnailSrc(asset: AssetSources): string | null {
  if (asset.thumbnailSrc) return asset.thumbnailSrc;
  if (asset.publicSrc) return asset.publicSrc;
  if (asset.contentSrc) return asset.contentSrc;
  if (asset.hasLocalFile) return localImageSrc(asset.filename);
  return null;
}

/** Best durable source to save when an asset is attached to public content. */
export function getAssetContentSrc(asset: AssetSources): string | null {
  if (asset.publicSrc) return asset.publicSrc;
  if (asset.contentSrc) return asset.contentSrc;
  if (asset.hasLocalFile) return localImageSrc(asset.filename);
  return null;
}
