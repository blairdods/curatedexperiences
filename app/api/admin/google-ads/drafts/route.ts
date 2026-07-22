import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/roles";
import { anthropic, MODELS } from "@/lib/claude/client";
import {
  getAdSourceContext,
  getEligibleAdAssets,
  type AdContentSourceType,
} from "@/lib/google-ads/content";

const FORBIDDEN_COPY =
  /\b(amazing|awesome|incredible|book now|limited time|package|deal|tour|hidden gem|bucket list)\b/i;
const BASE_NEGATIVES = [
  "cheap",
  "budget",
  "backpacker",
  "hostel",
  "group tour",
  "coach tour",
  "discount",
  "free",
  "campervan",
  "flights only",
  "car hire",
];

function fit(value: unknown, maxLength: number): string {
  const source = typeof value === "string" ? value.trim() : "";
  if (source.length <= maxLength) return source;
  const clipped = source.slice(0, maxLength + 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return (lastSpace > maxLength * 0.6
    ? clipped.slice(0, lastSpace)
    : source.slice(0, maxLength)
  ).replace(/[\s,;:–—-]+$/, "");
}

function uniqueStrings(values: unknown, maxLength: number): string[] {
  if (!Array.isArray(values)) return [];
  return Array.from(
    new Set(
      values
        .map((value) => fit(value, maxLength))
        .filter((value) => value && !FORBIDDEN_COPY.test(value))
    )
  );
}

function keywordStrings(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return Array.from(
    new Set(
      values
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 20)
    )
  );
}

function parseJsonObject(text: string): Record<string, unknown> {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  const parsed = JSON.parse(cleaned) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Ad generator did not return an object");
  }
  return parsed as Record<string, unknown>;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await getUserRole(user.email);
  if (!role || !["admin", "curator"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    sourceType?: AdContentSourceType;
    sourceId?: string;
    campaignName?: string;
    adGroupName?: string;
    selectedAssetIds?: string[];
  };
  if (
    !body.sourceType ||
    !["destination", "journey", "journal"].includes(body.sourceType) ||
    !body.sourceId
  ) {
    return NextResponse.json(
      { error: "A valid live content source is required" },
      { status: 400 }
    );
  }

  const source = await getAdSourceContext(body.sourceType, body.sourceId);
  if (!source) {
    return NextResponse.json({ error: "Content source not found" }, { status: 404 });
  }

  const requestedIds = new Set(body.selectedAssetIds ?? []);
  const selectedAssets = getEligibleAdAssets().filter((asset) =>
    requestedIds.has(asset.assetId)
  );
  if (selectedAssets.length !== requestedIds.size) {
    return NextResponse.json(
      { error: "One or more media assets are not approved for paid advertising" },
      { status: 400 }
    );
  }

  const prompt = `You create draft Google Search responsive ads for Curated Experiences, a luxury New Zealand travel company serving affluent US travellers.

LIVE CONTENT (the only source of factual claims):
${JSON.stringify(source.context, null, 2)}

Rules:
- Return JSON only.
- Provide 10 distinct headlines, each 30 characters or fewer.
- Provide 4 distinct descriptions, each 90 characters or fewer.
- Provide 8-16 high-intent keyword themes. Keywords may contain search-language such as "tour", but ad copy may not.
- Provide a one-sentence rationale.
- Warm, unhurried, confident, personal; never corporate or urgent.
- Do not use these words in headlines or descriptions: amazing, awesome, incredible, book now, limited time, package, deal, tour, hidden gem, bucket list.
- Prefer: journey, experience, curated, private, bespoke, personalised, expert.
- Use one CTA direction: Start Planning.
- Do not invent prices, awards, access, partnerships, availability, response times, or superlatives.
- Do not mention AI.

Schema:
{"headlines":["..."],"descriptions":["..."],"keywords":["..."],"rationale":"..."}`;

  let generated: Record<string, unknown>;
  try {
    const message = await anthropic.messages.create({
      model: MODELS.agent,
      max_tokens: 1800,
      messages: [{ role: "user", content: prompt }],
    });
    const output = message.content
      .filter((item) => item.type === "text")
      .map((item) => (item.type === "text" ? item.text : ""))
      .join("");
    generated = parseJsonObject(output);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Unable to generate draft: ${message}` },
      { status: 502 }
    );
  }

  const fallbackHeadlines = [
    source.option.title,
    "Bespoke New Zealand",
    "Private Journeys, Curated",
    "Start Planning Your Journey",
    "New Zealand, Made Personal",
    "Designed Around You",
  ].map((value) => fit(value, 30));
  const fallbackDescriptions = [
    fit(
      `Explore ${source.option.title} through a private journey designed around you.`,
      90
    ),
    "New Zealand experiences shaped around your pace, interests, and sense of discovery.",
    "Thoughtful local expertise, private experiences, and a journey that is entirely yours.",
  ].map((value) => fit(value, 90));
  const headlines = Array.from(
    new Set([...uniqueStrings(generated.headlines, 30), ...fallbackHeadlines])
  ).slice(0, 15);
  const descriptions = Array.from(
    new Set([
      ...uniqueStrings(generated.descriptions, 90),
      ...fallbackDescriptions,
    ])
  ).slice(0, 4);
  const keywords = keywordStrings(generated.keywords);

  const service = await createServiceClient();
  const { data: draft, error: insertError } = await service
    .from("google_ads_ad_drafts")
    .insert({
      source_type: source.option.type,
      source_id: source.option.id,
      source_slug: source.option.slug,
      source_title: source.option.title,
      campaign_name:
        fit(body.campaignName, 255) || `US | Search | ${source.option.title}`,
      ad_group_name: fit(body.adGroupName, 255) || source.option.title,
      final_url: source.option.finalUrl,
      headlines,
      descriptions,
      keywords,
      negative_keywords: BASE_NEGATIVES,
      selected_asset_ids: selectedAssets.map((asset) => asset.assetId),
      asset_snapshot: selectedAssets,
      rationale: fit(generated.rationale, 1000),
      status: "draft",
      generated_by_email: user.email,
    })
    .select("*")
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  await service.from("audit_log").insert({
    entity_type: "google_ads_ad_draft",
    entity_id: draft.id,
    action: "created",
    changes: {
      source_type: source.option.type,
      source_slug: source.option.slug,
      selected_asset_ids: selectedAssets.map((asset) => asset.assetId),
    },
    user_email: user.email,
  });

  return NextResponse.json({ draft });
}
