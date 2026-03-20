import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getJourneyBySlug, JOURNEYS } from "@/lib/data/journeys";
import { JourneyDetail } from "./journey-detail";

export async function generateStaticParams() {
  return JOURNEYS.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const journey = getJourneyBySlug(slug);
  if (!journey) return {};

  return {
    title: `${journey.title} | Curated Experiences`,
    description: journey.tagline,
    openGraph: {
      title: `${journey.title} | Curated Experiences`,
      description: journey.tagline,
      type: "website",
      images: [{ url: journey.heroImage }],
    },
  };
}

export default async function JourneyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const journey = getJourneyBySlug(slug);

  if (!journey) notFound();

  return <JourneyDetail journey={journey} />;
}
