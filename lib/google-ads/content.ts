import "server-only";

import { createServiceClient } from "@/lib/supabase/server";
import { getAssets } from "@/lib/asset-library";
import { getUploadedAssets } from "@/lib/asset-library/uploaded";
import { getAssetThumbnailSrc } from "@/lib/asset-library/sources";

export type AdContentSourceType = "destination" | "journey" | "journal";

export interface AdContentSourceOption {
  id: string;
  type: AdContentSourceType;
  slug: string;
  title: string;
  subtitle: string;
  region: string;
  finalUrl: string;
}

export interface EligibleAdAsset {
  assetId: string;
  title: string;
  region: string;
  location: string;
  licence: string;
  credit: string;
  resolution: string;
  tags: string[];
  src: string;
  thumbnailSrc: string;
}

export async function getAdContentSources(): Promise<AdContentSourceOption[]> {
  const supabase = await createServiceClient();
  const [destinations, journeys, articles] = await Promise.all([
    supabase
      .from("destinations")
      .select("id, slug, name, tagline, region")
      .eq("active", true)
      .order("name"),
    supabase
      .from("tours")
      .select("id, slug, title, tagline, regions")
      .eq("active", true)
      .order("title"),
    supabase
      .from("journal_articles")
      .select("id, slug, title, excerpt, category")
      .order("published_at", { ascending: false }),
  ]);

  return [
    ...(destinations.data ?? []).map((row) => ({
      id: String(row.id),
      type: "destination" as const,
      slug: row.slug,
      title: row.name,
      subtitle: row.tagline ?? "",
      region: row.region ?? "",
      finalUrl: `https://curatedexperiences.com/destinations/${row.slug}`,
    })),
    ...(journeys.data ?? []).map((row) => ({
      id: String(row.id),
      type: "journey" as const,
      slug: row.slug,
      title: row.title,
      subtitle: row.tagline ?? "",
      region: (row.regions ?? []).join(", "),
      finalUrl: `https://curatedexperiences.com/journeys/${row.slug}`,
    })),
    ...(articles.data ?? []).map((row) => ({
      id: String(row.id),
      type: "journal" as const,
      slug: row.slug,
      title: row.title,
      subtitle: row.excerpt ?? "",
      region: row.category ?? "",
      finalUrl: `https://curatedexperiences.com/journal/${row.slug}`,
    })),
  ];
}

/**
 * Only assets with explicit paid usage permission and a live-server source are
 * exposed. Raw files in the ignored asset-library directory are never copied.
 */
export async function getEligibleAdAssets(): Promise<EligibleAdAsset[]> {
  const allAssets = [...await getUploadedAssets(), ...getAssets()];
  return allAssets
    .filter((asset) => asset.paidAdsOk)
    .flatMap((asset) => {
      // Prefer the provider-hosted durable source so ad drafts do not depend on
      // a large public file remaining in Git. Existing public URLs are fallback.
      const src = asset.contentSrc ?? asset.publicSrc;
      const thumbnailSrc = getAssetThumbnailSrc(asset);
      if (!src) return [];
      return [
        {
          assetId: asset.assetId,
          title: asset.title,
          region: asset.region,
          location: asset.location,
          licence: asset.licence,
          credit: asset.credit,
          resolution: asset.resolution,
          tags: asset.tags,
          src,
          thumbnailSrc: thumbnailSrc ?? src,
        },
      ];
    });
}

function tokens(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9āēīōū]+/g, " ")
      .split(/\s+/)
      .filter((token) => token.length >= 4)
  );
}

export async function rankEligibleAssets(
  source: AdContentSourceOption,
  assets?: EligibleAdAsset[]
): Promise<EligibleAdAsset[]> {
  const eligibleAssets = assets ?? await getEligibleAdAssets();
  const sourceTokens = tokens(
    `${source.title} ${source.subtitle} ${source.region} ${source.slug}`
  );
  return [...eligibleAssets].sort((a, b) => {
    const score = (asset: EligibleAdAsset) => {
      const assetTokens = tokens(
        `${asset.title} ${asset.region} ${asset.location} ${asset.tags.join(" ")}`
      );
      let value = 0;
      for (const token of sourceTokens) {
        if (assetTokens.has(token)) value += 1;
      }
      if (
        source.region &&
        asset.region.toLowerCase().includes(source.region.toLowerCase())
      ) {
        value += 4;
      }
      return value;
    };
    return score(b) - score(a);
  });
}

export async function getAdSourceContext(
  type: AdContentSourceType,
  id: string
): Promise<{ option: AdContentSourceOption; context: Record<string, unknown> } | null> {
  const supabase = await createServiceClient();

  if (type === "destination") {
    const { data } = await supabase
      .from("destinations")
      .select("id, slug, name, tagline, description, region, highlights, best_for, best_seasons")
      .eq("id", id)
      .eq("active", true)
      .single();
    if (!data) return null;
    return {
      option: {
        id: String(data.id),
        type,
        slug: data.slug,
        title: data.name,
        subtitle: data.tagline ?? "",
        region: data.region ?? "",
        finalUrl: `https://curatedexperiences.com/destinations/${data.slug}`,
      },
      context: data,
    };
  }

  if (type === "journey") {
    const { data } = await supabase
      .from("tours")
      .select("id, slug, title, tagline, narrative, duration_days, price_from_usd, regions, experience_tags, ideal_for, highlights")
      .eq("id", id)
      .eq("active", true)
      .single();
    if (!data) return null;
    return {
      option: {
        id: String(data.id),
        type,
        slug: data.slug,
        title: data.title,
        subtitle: data.tagline ?? "",
        region: (data.regions ?? []).join(", "),
        finalUrl: `https://curatedexperiences.com/journeys/${data.slug}`,
      },
      context: data,
    };
  }

  const { data } = await supabase
    .from("journal_articles")
    .select("id, slug, title, excerpt, category, content, related_journey_slugs")
    .eq("id", id)
    .single();
  if (!data) return null;
  return {
    option: {
      id: String(data.id),
      type,
      slug: data.slug,
      title: data.title,
      subtitle: data.excerpt ?? "",
      region: data.category ?? "",
      finalUrl: `https://curatedexperiences.com/journal/${data.slug}`,
    },
    context: { ...data, content: String(data.content ?? "").slice(0, 6000) },
  };
}
