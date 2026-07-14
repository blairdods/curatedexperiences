import assert from "node:assert/strict";
import test from "node:test";
import { getAssets, type AssetRecord } from "./index";
import { getAssetContentSrc, getAssetThumbnailSrc } from "./sources";

test("every indexed asset has deploy-safe thumbnail and content sources", () => {
  const assets = getAssets();

  assert.ok(assets.length > 0);
  assert.deepEqual(
    assets.filter((asset) => !asset.thumbnailSrc || !asset.contentSrc),
    []
  );
});

test("asset source helpers prefer thumbnail CDN and durable public content paths", () => {
  const asset = {
    filename: "example.jpg",
    hasLocalFile: true,
    publicSrc: "/assets/images/example.jpg",
    thumbnailSrc: "https://cdn-syd.brandkit.com/example-thumbnail.webp",
    contentSrc: "https://cdn-syd.brandkit.com/example-content.webp",
  } satisfies Pick<
    AssetRecord,
    "contentSrc" | "filename" | "hasLocalFile" | "publicSrc" | "thumbnailSrc"
  >;

  assert.equal(getAssetThumbnailSrc(asset), asset.thumbnailSrc);
  assert.equal(getAssetContentSrc(asset), asset.publicSrc);
});

test("asset source helpers fall back to remote content before local-only files", () => {
  const asset = {
    filename: "example image.jpg",
    hasLocalFile: true,
    publicSrc: null,
    thumbnailSrc: null,
    contentSrc: "https://cdn-syd.brandkit.com/example-content.webp",
  } satisfies Pick<
    AssetRecord,
    "contentSrc" | "filename" | "hasLocalFile" | "publicSrc" | "thumbnailSrc"
  >;

  assert.equal(
    getAssetThumbnailSrc(asset),
    asset.contentSrc
  );
  assert.equal(getAssetContentSrc(asset), asset.contentSrc);
});
