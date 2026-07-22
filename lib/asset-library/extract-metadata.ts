import "server-only";

import { parse } from "exifr";
import sharp from "sharp";
import {
  fieldsFromEmbeddedMetadata,
  serializableMetadata,
  type ExtractedAssetMetadata,
} from "./metadata-utils";

const FORMAT_MIME: Record<string, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  heif: "image/avif",
  avif: "image/avif",
};

export async function extractAssetMetadata(
  buffer: Buffer,
  filename: string
): Promise<ExtractedAssetMetadata> {
  const image = sharp(buffer, { animated: false, limitInputPixels: 100_000_000 });
  const imageMetadata = await image.metadata();
  const format = imageMetadata.format;
  const mimeType = FORMAT_MIME[format];
  if (format === "heif" && imageMetadata.compression !== "av1") {
    throw new Error("HEIC images are not supported. Export the image as AVIF, JPEG, PNG, or WebP.");
  }
  if (!mimeType || !Object.values(FORMAT_MIME).includes(mimeType)) {
    throw new Error("Unsupported image format. Use JPEG, PNG, WebP, GIF, or AVIF.");
  }

  let rawTags: Record<string, unknown> = {};
  try {
    rawTags = (await parse(buffer, {
      tiff: true,
      exif: true,
      gps: true,
      xmp: true,
      iptc: true,
      jfif: true,
      ihdr: true,
      makerNote: false,
      userComment: true,
      sanitize: true,
      mergeOutput: true,
    })) ?? {};
  } catch {
    // Many valid web images do not contain embedded metadata. Sharp's
    // authoritative technical metadata is still retained below.
  }

  const suggested = fieldsFromEmbeddedMetadata(rawTags, filename);
  return {
    width: imageMetadata.autoOrient.width || imageMetadata.width,
    height: imageMetadata.autoOrient.height || imageMetadata.height,
    format,
    mimeType,
    orientation: imageMetadata.orientation ?? null,
    density: imageMetadata.density ?? null,
    colourSpace: imageMetadata.space,
    hasAlpha: imageMetadata.hasAlpha,
    pages: imageMetadata.pages ?? 1,
    ...suggested,
    embedded: (serializableMetadata(rawTags) as Record<string, unknown>) ?? {},
  };
}
