/**
 * Tourism New Zealand content scraper
 *
 * Scrapes 5 TNZ resources, extracts text, stores in Supabase content table,
 * and triggers the embedding pipeline.
 *
 * Usage:
 *   npx tsx scripts/scrape-tnz.ts
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VOYAGE_API_KEY
 */

import puppeteer from "puppeteer";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse");
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

const SOURCES = [
  {
    url: "https://www.tourismnewzealand.com/insights/tourism-data/",
    title: "Tourism New Zealand — Tourism Data & Insights",
    type: "destination",
    regionTags: ["new-zealand"],
    crawlLinks: true,
    linkPattern: /\/insights\//,
    maxLinks: 10,
  },
  {
    url: "https://www.tourismnewzealand.com/insights/visitorprofiles/",
    title: "Tourism New Zealand — Visitor Profiles",
    type: "destination",
    regionTags: ["new-zealand"],
    crawlLinks: true,
    linkPattern: /\/insights\/visitorprofiles\//,
    maxLinks: 15,
  },
  {
    url: "https://traveltrade.newzealand.com/",
    title: "NZ Travel Trade — Overview",
    type: "destination",
    regionTags: ["new-zealand"],
    crawlLinks: true,
    linkPattern: /traveltrade\.newzealand\.com/,
    maxLinks: 10,
  },
  {
    url: "https://traveltrade.newzealand.com/training-and-inspiration/new-zealand-specialist-programme/",
    title: "NZ Specialist Training Programme",
    type: "destination",
    regionTags: ["new-zealand"],
    crawlLinks: true,
    linkPattern: /training-and-inspiration/,
    maxLinks: 15,
  },
];

const PDF_SOURCE = {
  url: "https://www.tourismnewzealand.com/assets/insights/market-overview/21402-TNZ-Insights-MarketSnapshots-2025-USA-v6a.pdf",
  title: "USA Visitor Market Snapshot 2025",
  type: "destination",
  regionTags: ["new-zealand"],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function chunk(text: string, size = 1000, overlap = 200): string[] {
  const cleaned = text.replace(/\n{3,}/g, "\n\n").trim();
  if (cleaned.length <= size) return [cleaned];

  const chunks: string[] = [];
  let start = 0;

  while (start < cleaned.length) {
    let end = start + size;

    if (end < cleaned.length) {
      const para = cleaned.lastIndexOf("\n\n", end);
      if (para > start + size * 0.5) {
        end = para;
      } else {
        const sentence = cleaned.lastIndexOf(". ", end);
        if (sentence > start + size * 0.5) end = sentence + 1;
      }
    } else {
      end = cleaned.length;
    }

    const c = cleaned.slice(start, end).trim();
    if (c.length > 50) chunks.push(c);

    const nextStart = end - overlap;
    // Ensure forward progress
    start = nextStart <= start ? end : nextStart;
    if (start >= cleaned.length) break;
  }

  return chunks;
}

async function generateEmbedding(
  text: string,
  retries = 3
): Promise<number[]> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VOYAGE_API_KEY}`,
      },
      body: JSON.stringify({
        input: [text],
        model: "voyage-3-large",
        output_dimension: 1024,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.data[0].embedding;
    }

    if (res.status === 429 && attempt < retries - 1) {
      const wait = (attempt + 1) * 22000; // 22s, 44s backoff (3 RPM = 20s between)
      console.log(`  ⏳ Rate limited, waiting ${wait / 1000}s...`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }

    const err = await res.text();
    throw new Error(`Voyage API error ${res.status}: ${err}`);
  }

  throw new Error("Max retries exceeded");
}

async function storeAndEmbed(
  title: string,
  body: string,
  type: string,
  sourceUrl: string,
  regionTags: string[]
) {
  // Generate embedding
  const textForEmbed = `[${type}]\n\n${title}\n\n${body}`.slice(0, 4000);
  let embedding: number[] | null = null;

  try {
    embedding = await generateEmbedding(textForEmbed);
  } catch (err) {
    console.error(`  ⚠ Embedding failed: ${(err as Error).message}`);
  }

  const { error } = await supabase.from("content").insert({
    type,
    title,
    body,
    source_type: "tnz_research",
    region_tags: regionTags,
    embedding,
    status: "active",
  });

  if (error) {
    console.error(`  ✗ DB insert failed: ${error.message}`);
    return false;
  }

  console.log(
    `  ✓ Stored: "${title.slice(0, 60)}..." (${body.length} chars, ${embedding ? "embedded" : "no embedding"})`
  );
  return true;
}

// ---------------------------------------------------------------------------
// Scraper
// ---------------------------------------------------------------------------

async function scrapePage(
  browser: puppeteer.Browser,
  url: string
): Promise<{ text: string; links: string[] }> {
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Wait for content to render
    await new Promise((r) => setTimeout(r, 2000));

    const result = await page.evaluate(() => {
      // Remove nav, footer, scripts, styles
      const removeSelectors = [
        "nav",
        "footer",
        "script",
        "style",
        "noscript",
        ".cookie-banner",
        ".nav",
        ".footer",
        "#header",
        "#footer",
      ];
      removeSelectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => el.remove());
      });

      const main =
        document.querySelector("main") ||
        document.querySelector("article") ||
        document.querySelector('[role="main"]') ||
        document.querySelector(".content") ||
        document.body;

      const text = main?.innerText || "";

      // Collect links
      const links: string[] = [];
      document.querySelectorAll("a[href]").forEach((a) => {
        const href = (a as HTMLAnchorElement).href;
        if (href && href.startsWith("http")) links.push(href);
      });

      return { text, links: [...new Set(links)] };
    });

    return result;
  } catch (err) {
    console.error(`  ⚠ Failed to scrape ${url}: ${(err as Error).message}`);
    return { text: "", links: [] };
  } finally {
    await page.close();
  }
}

async function scrapePdf(url: string): Promise<string> {
  console.log(`\n📄 Downloading PDF: ${url}`);

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
  });

  if (!res.ok) {
    console.error(`  ✗ PDF download failed: ${res.status}`);
    return "";
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const pdf = await pdfParse(buffer);
  console.log(
    `  ✓ Extracted ${pdf.numpages} pages, ${pdf.text.length} chars`
  );
  return pdf.text;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Validate env
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing SUPABASE env vars. Check .env.local");
    process.exit(1);
  }
  if (!VOYAGE_API_KEY) {
    console.error("Missing VOYAGE_API_KEY. Check .env.local");
    process.exit(1);
  }

  console.log("🚀 TNZ Content Scraper\n");

  let totalStored = 0;
  let totalFailed = 0;

  // ---- Web sources ----
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  for (const source of SOURCES) {
    console.log(`\n🌐 Scraping: ${source.title}`);
    console.log(`   ${source.url}`);

    const { text, links } = await scrapePage(browser, source.url);

    if (text.length < 100) {
      console.log("  ⚠ Too little content extracted, skipping");
      totalFailed++;
      continue;
    }

    // Chunk and store the main page
    const chunks = chunk(text);
    console.log(`  Found ${chunks.length} chunks from main page`);

    for (let i = 0; i < chunks.length; i++) {
      const chunkTitle = `${source.title} (part ${i + 1}/${chunks.length})`;
      const ok = await storeAndEmbed(
        chunkTitle,
        chunks[i],
        source.type,
        source.url,
        source.regionTags
      );
      if (ok) totalStored++;
      else totalFailed++;

      // Rate limit Voyage API
      // Rate limit: 21s for free tier (3 RPM), 500ms with payment method
      await new Promise((r) => setTimeout(r, process.env.VOYAGE_FAST === "1" ? 500 : 21000));
    }

    // Crawl linked pages if configured
    if (source.crawlLinks && links.length > 0) {
      const relevantLinks = links
        .filter((l) => source.linkPattern.test(l))
        .filter((l) => l !== source.url)
        .slice(0, source.maxLinks);

      if (relevantLinks.length > 0) {
        console.log(`  Crawling ${relevantLinks.length} linked pages...`);
      }

      for (const link of relevantLinks) {
        const subResult = await scrapePage(browser, link);
        if (subResult.text.length < 100) continue;

        const subChunks = chunk(subResult.text);
        const pageTitle = link.split("/").filter(Boolean).pop() || "page";

        for (let i = 0; i < subChunks.length; i++) {
          const t = `${source.title} — ${pageTitle} (part ${i + 1}/${subChunks.length})`;
          const ok = await storeAndEmbed(
            t,
            subChunks[i],
            source.type,
            link,
            source.regionTags
          );
          if (ok) totalStored++;
          else totalFailed++;

          // Rate limit: 21s for free tier (3 RPM), 500ms with payment method
      await new Promise((r) => setTimeout(r, process.env.VOYAGE_FAST === "1" ? 500 : 21000));
        }
      }
    }
  }

  await browser.close();

  // ---- PDF source ----
  const pdfText = await scrapePdf(PDF_SOURCE.url);

  if (pdfText.length > 100) {
    const pdfChunks = chunk(pdfText);
    console.log(`  Found ${pdfChunks.length} chunks from PDF`);

    for (let i = 0; i < pdfChunks.length; i++) {
      const t = `${PDF_SOURCE.title} (part ${i + 1}/${pdfChunks.length})`;
      const ok = await storeAndEmbed(
        t,
        pdfChunks[i],
        PDF_SOURCE.type,
        PDF_SOURCE.url,
        PDF_SOURCE.regionTags
      );
      if (ok) totalStored++;
      else totalFailed++;

      // Rate limit: 21s for free tier (3 RPM), 500ms with payment method
      await new Promise((r) => setTimeout(r, process.env.VOYAGE_FAST === "1" ? 500 : 21000));
    }
  } else {
    console.log("  ⚠ PDF extraction yielded too little text");
    totalFailed++;
  }

  // ---- Summary ----
  console.log("\n" + "=".repeat(50));
  console.log(`✅ Done! Stored: ${totalStored}, Failed: ${totalFailed}`);
  console.log("=".repeat(50));
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
