/**
 * Enrich accommodation records from public provider websites.
 *
 * This is deliberately separate from seed-concierge-knowledge.ts:
 * - this script gathers guest-facing property details into accommodations
 * - seed-concierge-knowledge.ts turns those records into concierge RAG content
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/enrich-accommodations.ts
 *   npx tsx --env-file=.env.local scripts/enrich-accommodations.ts --limit=10
 *   npx tsx --env-file=.env.local scripts/enrich-accommodations.ts --force
 */

import fs from "fs/promises";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const MODEL = "claude-haiku-4-5-20251001";
const REPORT_PATH = path.resolve("docs/accommodation-enrichment-report.json");

const missingWebsiteOverrides: Record<string, string> = {
  "hotel-fitzroy": "https://www.fablehotelsandresorts.com/hotels/hotel-fitzroy",
  "craggy-range-accommodation":
    "https://www.newzealand.com/int/plan/business/craggy-range-vineyard-cottages/",
  "moose-lodge":
    "https://www.newzealand.com/us/plan/business/moose-lodge-estate-1/",
};

const websiteCorrections: Record<string, string> = {
  "delamore-estate-waiheke": "https://www.delamorelodge.com/",
};

interface Accommodation {
  id: string;
  slug: string;
  name: string;
  tier: "platinum" | "gold" | "silver";
  region: string;
  location: string | null;
  property_type: string | null;
  description: string | null;
  highlights: string[] | null;
  website_url: string | null;
  notes: string | null;
}

interface EnrichedProfile {
  description: string;
  highlights: string[];
  best_for: string[];
  confidence: "high" | "medium" | "low";
}

interface ReportEntry {
  id: string;
  name: string;
  region: string;
  website_url: string | null;
  source_urls: string[];
  status: "updated" | "skipped" | "failed";
  confidence?: EnrichedProfile["confidence"];
  error?: string;
}

function argValue(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function hasArg(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function normalizeUrl(raw: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function textFromHtml(html: string): string {
  const withoutNoise = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ");

  const metaDescription =
    withoutNoise.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i
    )?.[1] ??
    withoutNoise.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i
    )?.[1] ??
    "";

  const title = withoutNoise.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const headings = [...withoutNoise.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)]
    .map((match) => match[1])
    .slice(0, 18);
  const paragraphs = [...withoutNoise.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => match[1])
    .slice(0, 45);

  return [title, metaDescription, ...headings, ...paragraphs]
    .join("\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12000);
}

function candidateLinks(baseUrl: string, html: string): string[] {
  const base = new URL(baseUrl);
  const candidates = new Set<string>();
  const patterns = [
    "accommodation",
    "rooms",
    "suites",
    "villas",
    "lodges",
    "stay",
    "about",
    "experiences",
    "dining",
  ];

  for (const match of html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)) {
    try {
      const url = new URL(match[1], base);
      if (url.hostname !== base.hostname) continue;
      const combined = `${url.pathname} ${match[0]}`.toLowerCase();
      if (patterns.some((pattern) => combined.includes(pattern))) {
        url.hash = "";
        candidates.add(url.toString());
      }
    } catch {
      continue;
    }
  }

  return [...candidates].slice(0, 2);
}

async function fetchPage(url: string): Promise<{ url: string; html: string } | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: {
        "User-Agent":
          "CuratedExperiencesBot/1.0 (+https://curatedexperiences.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) return null;

    return { url: response.url, html: await response.text() };
  } catch {
    return null;
  }
}

function publicNotes(notes: string | null): string {
  if (!notes) return "";

  return notes
    .split("|")
    .map((fragment) => fragment.trim())
    .filter(Boolean)
    .filter((fragment) => {
      const lower = fragment.toLowerCase();
      return ![
        "contract status",
        "original tier",
        "original type",
        "site inspection",
        "site visit",
        "rate",
        "commission",
        "contact",
        "tel",
        "mob",
        "email",
        "@",
        "agreement",
        "outreach",
      ].some((term) => lower.includes(term));
    })
    .join(" ")
    .slice(0, 1200);
}

async function gatherWebsiteText(
  accommodation: Accommodation
): Promise<{ sourceUrls: string[]; text: string }> {
  const websiteUrl =
    websiteCorrections[accommodation.slug] ??
    normalizeUrl(accommodation.website_url) ??
    missingWebsiteOverrides[accommodation.slug] ??
    null;

  if (!websiteUrl) {
    return { sourceUrls: [], text: publicNotes(accommodation.notes) };
  }

  const homepage = await fetchPage(websiteUrl);
  if (!homepage) {
    return { sourceUrls: [websiteUrl], text: publicNotes(accommodation.notes) };
  }

  const pages = [homepage];
  for (const link of candidateLinks(homepage.url, homepage.html)) {
    const page = await fetchPage(link);
    if (page) pages.push(page);
  }

  const sourceUrls = [...new Set(pages.map((page) => page.url))];
  const text = [
    ...pages.map((page) => textFromHtml(page.html)),
    publicNotes(accommodation.notes),
  ]
    .filter(Boolean)
    .join("\n\n---\n\n")
    .slice(0, 18000);

  return { sourceUrls, text };
}

function parseJson(text: string): EnrichedProfile {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : cleaned) as EnrichedProfile;
}

async function generateProfile(
  accommodation: Accommodation,
  sourceUrls: string[],
  sourceText: string
): Promise<EnrichedProfile> {
  if (sourceText.trim().length < 350) {
    throw new Error("Insufficient public source text to create a specific profile");
  }

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 700,
    temperature: 0,
    system:
      "You write concise, factual luxury travel accommodation profiles. Use only the supplied source text and metadata. Do not copy marketing copy verbatim. Do not invent amenities, awards, room counts, rates, contact details, contract status, commissions, or availability. Do not include email, phone, supplier contacts, or wholesale/commercial details. Return strict JSON only.",
    messages: [
      {
        role: "user",
        content: `Create a guest-facing accommodation profile for the concierge knowledge base.

Metadata:
Name: ${accommodation.name}
Tier: ${accommodation.tier}
Region: ${accommodation.region}
Location: ${accommodation.location ?? "unknown"}
Property type: ${accommodation.property_type ?? "unknown"}
Source URLs: ${sourceUrls.join(", ") || "none"}

Source text:
${sourceText}

Return JSON with:
{
  "description": "80-120 words, guest-facing, specific, no contacts/rates/internal notes",
  "highlights": ["4-6 short factual bullets, each under 12 words"],
  "best_for": ["2-4 short traveller-fit phrases"],
  "confidence": "high | medium | low"
}`,
      },
    ],
  });

  const content = message.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("")
    .trim();

  const profile = parseJson(content);

  return {
    description: profile.description.trim(),
    highlights: profile.highlights.slice(0, 6).map((item) => item.trim()),
    best_for: profile.best_for.slice(0, 4).map((item) => item.trim()),
    confidence: profile.confidence,
  };
}

async function main() {
  const limit = Number(argValue("limit") ?? "0");
  const force = hasArg("force");

  const { data, error } = await supabase
    .from("accommodations")
    .select(
      "id,slug,name,tier,region,location,property_type,description,highlights,website_url,notes"
    )
    .eq("active", true)
    .order("region", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;

  let accommodations = (data ?? []) as Accommodation[];
  if (!force) {
    accommodations = accommodations.filter(
      (item) => !item.description || !item.highlights?.length
    );
  }
  if (limit > 0) accommodations = accommodations.slice(0, limit);

  const report: ReportEntry[] = [];

  console.log(
    `Enriching ${accommodations.length} accommodation records${force ? " (force)" : ""}...\n`
  );

  for (let i = 0; i < accommodations.length; i += 1) {
    const accommodation = accommodations[i];
    const websiteUrl =
      websiteCorrections[accommodation.slug] ??
      normalizeUrl(accommodation.website_url) ??
      missingWebsiteOverrides[accommodation.slug] ??
      null;

    process.stdout.write(
      `[${i + 1}/${accommodations.length}] ${accommodation.name}... `
    );

    try {
      const gathered = await gatherWebsiteText(accommodation);
      const profile = await generateProfile(
        accommodation,
        gathered.sourceUrls,
        gathered.text
      );

      if (
        profile.confidence === "low" &&
        /unable to create|insufficient valid|does not match|not match/i.test(
          profile.description
        )
      ) {
        throw new Error(profile.description);
      }

      const highlights = [
        ...profile.highlights,
        ...profile.best_for.map((item) => `Best for: ${item}`),
      ].slice(0, 8);

      const { error: updateError } = await supabase
        .from("accommodations")
        .update({
          description: profile.description,
          highlights,
          website_url: websiteCorrections[accommodation.slug]
            ? websiteUrl
            : accommodation.website_url ?? websiteUrl,
        })
        .eq("id", accommodation.id);

      if (updateError) throw updateError;

      report.push({
        id: accommodation.id,
        name: accommodation.name,
        region: accommodation.region,
        website_url: websiteUrl,
        source_urls: gathered.sourceUrls,
        status: "updated",
        confidence: profile.confidence,
      });

      console.log(`updated (${profile.confidence})`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (force) {
        await supabase
          .from("accommodations")
          .update({ description: null, highlights: null })
          .eq("id", accommodation.id);
      }
      report.push({
        id: accommodation.id,
        name: accommodation.name,
        region: accommodation.region,
        website_url: websiteUrl,
        source_urls: [],
        status: "failed",
        error: errorMessage,
      });
      console.log(`failed: ${errorMessage}`);
    }
  }

  await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });
  await fs.writeFile(
    REPORT_PATH,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        updated: report.filter((entry) => entry.status === "updated").length,
        failed: report.filter((entry) => entry.status === "failed").length,
        entries: report,
      },
      null,
      2
    )
  );

  console.log(`\nReport written to ${REPORT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
