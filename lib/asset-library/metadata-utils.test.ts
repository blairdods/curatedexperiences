import test from "node:test";
import assert from "node:assert/strict";
import {
  fieldsFromEmbeddedMetadata,
  formatFileSize,
  serializableMetadata,
  titleFromFilename,
} from "./metadata-utils";

test("humanises an image filename when no embedded title exists", () => {
  assert.equal(titleFromFilename("lake-wanaka_sunrise.jpg"), "Lake Wanaka Sunrise");
});

test("extracts useful editable fields from common EXIF and IPTC tags", () => {
  const result = fieldsFromEmbeddedMetadata({
    ObjectName: "Alpine landing",
    CaptionAbstract: "A helicopter beside an alpine lodge.",
    Artist: "Aroha Smith",
    CopyrightNotice: "Curated Experiences 2026",
    City: "Wānaka",
    ProvinceState: "Otago",
    Keywords: ["alpine", "helicopter", "luxury"],
    DateTimeOriginal: new Date("2026-06-01T03:04:05.000Z"),
    Make: "Canon",
    Model: "EOS R5",
    latitude: -44.694,
    longitude: 169.136,
  }, "fallback.jpg");

  assert.deepEqual(result, {
    title: "Alpine landing",
    description: "A helicopter beside an alpine lodge.",
    credit: "Aroha Smith",
    copyright: "Curated Experiences 2026",
    location: "Wānaka",
    region: "Otago",
    keywords: ["alpine", "helicopter", "luxury"],
    dateTaken: "2026-06-01T03:04:05.000Z",
    cameraMake: "Canon",
    cameraModel: "EOS R5",
    latitude: -44.694,
    longitude: 169.136,
  });
});

test("formats byte sizes and removes binary metadata before JSON storage", () => {
  assert.equal(formatFileSize(1_572_864), "1.50 MB");
  assert.deepEqual(serializableMetadata({ title: "Image", preview: Buffer.from("binary") }), { title: "Image" });
});
