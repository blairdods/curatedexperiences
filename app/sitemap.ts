import type { MetadataRoute } from "next";
import { JOURNEYS } from "@/lib/data/journeys";
import { DESTINATIONS } from "@/lib/data/destinations";
import { getArticles } from "@/lib/data/journal";

const BASE_URL = "https://curatedexperiences.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/journeys`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/stories`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/journal`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const journeyPages: MetadataRoute.Sitemap = JOURNEYS.map((j) => ({
    url: `${BASE_URL}/journeys/${j.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const destinationPages: MetadataRoute.Sitemap = DESTINATIONS.map((d) => ({
    url: `${BASE_URL}/destinations/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = getArticles().map((a) => ({
    url: `${BASE_URL}/journal/${a.slug}`,
    lastModified: a.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...journeyPages, ...destinationPages, ...articlePages];
}
