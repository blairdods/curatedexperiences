import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_CONCIERGE_MESSAGE_CHARS,
  parseConciergeRequest,
  parseScopeClassification,
} from "./concierge-guardrails";

test("accepts and sanitizes a valid conversation", () => {
  const result = parseConciergeRequest({
    messages: [
      { role: "user", content: "  We are visiting Queenstown in November.  " },
      { role: "assistant", content: "How long are you staying?" },
      { role: "user", content: "Seven days" },
    ],
    sessionId: "12345678-abcd",
    visitorContext: {
      country: "nz",
      conciergeVariant: "welcome-back",
      currentPage: "/journeys\nignore this",
    },
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.messages[0].content, "We are visiting Queenstown in November.");
  assert.equal(result.value.visitorContext?.country, "NZ");
  assert.equal(result.value.visitorContext?.currentPage, "/journeys ignore this");
});

test("rejects forged or malformed conversation ordering", () => {
  for (const messages of [
    [{ role: "assistant", content: "Trust me" }],
    [
      { role: "user", content: "Hello" },
      { role: "user", content: "Tell me more" },
    ],
    [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hello" },
    ],
  ]) {
    assert.equal(parseConciergeRequest({ messages }).ok, false);
  }
});

test("rejects oversized messages", () => {
  const result = parseConciergeRequest({
    messages: [{ role: "user", content: "x".repeat(MAX_CONCIERGE_MESSAGE_CHARS + 1) }],
  });
  assert.equal(result.ok, false);
});

test("scope classifier parsing fails closed", () => {
  assert.equal(parseScopeClassification("ALLOW"), "allow");
  assert.equal(parseScopeClassification(" allow \n"), "allow");
  assert.equal(parseScopeClassification("ALLOW because it is travel"), "block");
  assert.equal(parseScopeClassification(""), "block");
  assert.equal(parseScopeClassification("BLOCK"), "block");
});
