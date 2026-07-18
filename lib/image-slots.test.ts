import assert from "node:assert/strict";
import test from "node:test";
import {
  getManagedImageStyle,
  normaliseImagePosition,
  parseImagePosition,
  parseImageSlotOverrides,
  serialiseImageSlotOverrides,
} from "./image-slots";

test("legacy image slot values remain valid without framing data", () => {
  assert.deepEqual(
    parseImageSlotOverrides(
      JSON.stringify({
        "page.about.hero": [{ src: "/hero.jpg", alt: "Mountain view" }],
      })
    ),
    {
      "page.about.hero": [{ src: "/hero.jpg", alt: "Mountain view" }],
    }
  );
});

test("image framing values are clamped to supported bounds", () => {
  assert.deepEqual(normaliseImagePosition({ x: -10, y: 140, zoom: 4 }), {
    x: 0,
    y: 100,
    zoom: 2,
  });
});

test("optional framing ignores non-object database values", () => {
  assert.equal(parseImagePosition(null), undefined);
  assert.equal(parseImagePosition("50% 50%"), undefined);
  assert.deepEqual(parseImagePosition({ x: 25, y: 75, zoom: 1.2 }), {
    x: 25,
    y: 75,
    zoom: 1.2,
  });
});

test("framing survives serialisation and produces website CSS variables", () => {
  const serialised = serialiseImageSlotOverrides({
    "home.difference.image": [
      {
        src: " /difference.jpg ",
        alt: " Fiordland ",
        position: { x: 35, y: 62, zoom: 1.25 },
      },
    ],
  });
  const parsed = parseImageSlotOverrides(serialised);
  const image = parsed["home.difference.image"][0];

  assert.deepEqual(image, {
    src: "/difference.jpg",
    alt: "Fiordland",
    position: { x: 35, y: 62, zoom: 1.25 },
  });
  assert.deepEqual(getManagedImageStyle(image), {
    "--image-position": "35% 62%",
    "--image-zoom": "1.25",
  });
});
