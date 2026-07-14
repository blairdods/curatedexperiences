const ALLOWED_TAGS = new Set([
  "p",
  "h2",
  "h3",
  "h4",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "br",
  "hr",
]);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&(?!(?:[a-z][a-z0-9]+|#\d+|#x[0-9a-f]+);)/gi, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMarkdownToHtml(value: string) {
  return escapeHtml(value)
    .replace(
      /\[([^\]]+)]\((https?:\/\/[^)]+|mailto:[^)]+|tel:[^)]+|\/[^)]+|#[^)]+)\)/g,
      '<a href="$2">$1</a>'
    )
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>");
}

/**
 * Converts the limited Markdown used by the original journal seed files into
 * semantic HTML. This is a compatibility bridge; journal writes use HTML.
 */
export function markdownToJournalHtml(markdown: string) {
  const blocks: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let listItems: string[] = [];

  const flushList = () => {
    if (!listType || listItems.length === 0) return;
    blocks.push(`<${listType}>${listItems.join("")}</${listType}>`);
    listType = null;
    listItems = [];
  };

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      continue;
    }

    const unorderedItem = line.match(/^[-*]\s+(.+)$/);
    if (unorderedItem) {
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      listItems.push(`<li>${inlineMarkdownToHtml(unorderedItem[1])}</li>`);
      continue;
    }

    const orderedItem = line.match(/^\d+\.\s+(.+)$/);
    if (orderedItem) {
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      listItems.push(`<li>${inlineMarkdownToHtml(orderedItem[1])}</li>`);
      continue;
    }

    flushList();

    if (/^#{1,2}\s+/.test(line)) {
      blocks.push(`<h2>${inlineMarkdownToHtml(line.replace(/^#{1,2}\s+/, ""))}</h2>`);
    } else if (/^###\s+/.test(line)) {
      blocks.push(`<h3>${inlineMarkdownToHtml(line.replace(/^###\s+/, ""))}</h3>`);
    } else if (/^####\s+/.test(line)) {
      blocks.push(`<h4>${inlineMarkdownToHtml(line.replace(/^####\s+/, ""))}</h4>`);
    } else if (/^>\s?/.test(line)) {
      blocks.push(`<blockquote>${inlineMarkdownToHtml(line.replace(/^>\s?/, ""))}</blockquote>`);
    } else if (/^(-{3,}|\*{3,})$/.test(line)) {
      blocks.push("<hr>");
    } else {
      blocks.push(`<p>${inlineMarkdownToHtml(line)}</p>`);
    }
  }

  flushList();
  return blocks.join("\n");
}

/**
 * Sanitizes journal HTML to the small semantic subset supported by the editor.
 * All attributes are removed except safe link destinations.
 */
export function sanitizeJournalHtml(html: string) {
  const withoutDangerousContent = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<(script|style|iframe|object|embed|svg|math|form)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
      ""
    );

  return withoutDangerousContent.replace(
    /<\/?([a-z][a-z0-9-]*)\b[^>]*>/gi,
    (tag, rawName: string) => {
      const name = rawName.toLowerCase();
      if (!ALLOWED_TAGS.has(name)) return "";

      const isClosing = /^<\//.test(tag);
      if (isClosing) return name === "br" || name === "hr" ? "" : `</${name}>`;
      if (name === "br" || name === "hr") return `<${name}>`;

      if (name === "a") {
        const hrefMatch = tag.match(/\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
        const href = hrefMatch?.[1] ?? hrefMatch?.[2] ?? hrefMatch?.[3] ?? "";
        const safeHref = /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(href) ? href : "#";
        const external = /^https?:\/\//i.test(safeHref);
        return `<a href="${escapeHtmlAttribute(safeHref)}"${
          external ? ' target="_blank" rel="noopener noreferrer"' : ""
        }>`;
      }

      return `<${name}>`;
    }
  );
}

export function resolveJournalHtml(content?: unknown) {
  const value = typeof content === "string" ? content.trim() : "";
  if (!value) return "";

  const html = /<[a-z][\s\S]*>/i.test(value)
    ? value
    : markdownToJournalHtml(value);

  return sanitizeJournalHtml(html);
}

export function hasMeaningfulJournalContent(content?: unknown) {
  return (typeof content === "string" ? content : "")
    .replace(/<[^>]*>/g, "")
    .replace(/&(?:nbsp|#160);/gi, " ")
    .trim().length > 0;
}
