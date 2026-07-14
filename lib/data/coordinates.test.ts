import assert from "node:assert/strict";
import test from "node:test";

import { getRouteForJourney } from "./coordinates";
import {
  formatDayLabel,
  groupRouteMarkers,
} from "../../components/ui/journey-map";

test("turns route stop days into complete day ranges", () => {
  const route = getRouteForJourney("the-expedition", 12);

  assert.deepEqual(
    route.map(({ name, dayStart, dayEnd }) => ({ name, dayStart, dayEnd })),
    [
      { name: "Queenstown", dayStart: 1, dayEnd: 3 },
      { name: "Franz Josef", dayStart: 4, dayEnd: 6 },
      { name: "Aoraki / Mount Cook", dayStart: 7, dayEnd: 8 },
      { name: "Manapouri", dayStart: 9, dayEnd: 9 },
      { name: "Milford Sound", dayStart: 10, dayEnd: 10 },
      { name: "Queenstown", dayStart: 11, dayEnd: 12 },
    ]
  );
});

test("combines repeat visits at one location instead of overlapping markers", () => {
  const markers = groupRouteMarkers(getRouteForJourney("the-expedition", 12));
  const queenstown = markers.find(({ names }) => names.includes("Queenstown"));

  assert.ok(queenstown);
  assert.deepEqual(queenstown.visits, [
    { dayStart: 1, dayEnd: 3 },
    { dayStart: 11, dayEnd: 12 },
  ]);
  assert.equal(formatDayLabel(queenstown.visits), "Days 1\u20133, 11\u201312");
});

test("uses singular wording for a one-day stop", () => {
  assert.equal(formatDayLabel([{ dayStart: 9, dayEnd: 9 }]), "Day 9");
});
