import assert from "node:assert/strict";
import test from "node:test";

import {
  hasMeaningfulJournalContent,
  resolveJournalHtml,
  sanitizeJournalHtml,
} from "./journal-content";

test("converts legacy journal Markdown to semantic HTML", () => {
  const html = resolveJournalHtml(`Intro with **emphasis**.

## A heading

- First
- Second with *detail*`);

  assert.equal(
    html,
    [
      "<p>Intro with <strong>emphasis</strong>.</p>",
      "<h2>A heading</h2>",
      "<ul><li>First</li><li>Second with <em>detail</em></li></ul>",
    ].join("\n")
  );
});

test("keeps supported HTML and strips executable markup", () => {
  const html = sanitizeJournalHtml(
    '<h2 style="color:red">Safe</h2><script>alert(1)</script><p onclick="alert(1)">Copy <a href="javascript:alert(1)">here</a>.</p>'
  );

  assert.equal(html, '<h2>Safe</h2><p>Copy <a href="#">here</a>.</p>');
});

test("hardens external links", () => {
  assert.equal(
    sanitizeJournalHtml(
      '<a class="cta" href="https://example.com/story?topic=nz&amp;page=2">Story</a>'
    ),
    '<a href="https://example.com/story?topic=nz&amp;page=2" target="_blank" rel="noopener noreferrer">Story</a>'
  );
});

test("detects empty rich-text editor output", () => {
  assert.equal(hasMeaningfulJournalContent("<p><br></p>"), false);
  assert.equal(hasMeaningfulJournalContent("<p>&nbsp;</p>"), false);
  assert.equal(hasMeaningfulJournalContent("<p>Article copy</p>"), true);
});
