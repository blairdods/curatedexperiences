import { cookies } from "next/headers";
import { getArticles } from "@/lib/data/journal";
import { getActiveDestinations } from "@/lib/data/destinations-server";
import { getImageSlotOverrides } from "@/lib/image-slot-settings";
import HomePage from "./home-client";

async function getHeroVariant(): Promise<string> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("ce-signals")?.value;
  if (!raw) return "luxury-us";

  try {
    const parsed = JSON.parse(raw) as { heroVariant?: unknown };
    return typeof parsed.heroVariant === "string"
      ? parsed.heroVariant
      : "luxury-us";
  } catch {
    return "luxury-us";
  }
}

export default async function Page() {
  const [articles, imageSlots, heroVariant, destinations] = await Promise.all([
    getArticles().catch(() => []),
    getImageSlotOverrides(),
    getHeroVariant(),
    getActiveDestinations(),
  ]);

  return (
    <HomePage
      articles={articles}
      imageSlots={imageSlots}
      heroVariant={heroVariant}
      destinations={destinations.map(
        ({ slug, name, region, tagline }) => ({
          slug,
          name,
          region,
          tagline,
        })
      )}
    />
  );
}
