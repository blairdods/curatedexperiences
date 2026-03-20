/**
 * JSON-LD Schema markup components for SEO.
 */

interface SchemaProps {
  data: Record<string, unknown>;
}

export function SchemaMarkup({ data }: SchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  return (
    <SchemaMarkup
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Curated Experiences",
        url: "https://curatedexperiences.com",
        description:
          "Bespoke luxury travel experiences across New Zealand, crafted by local experts for discerning travellers.",
        foundingDate: "2026",
        founders: [
          { "@type": "Person", name: "Tony" },
          { "@type": "Person", name: "Liam" },
        ],
        parentOrganization: {
          "@type": "Organization",
          name: "PPG Tours",
        },
        areaServed: {
          "@type": "Country",
          name: "New Zealand",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: "hello@curatedexperiences.com",
        },
      }}
    />
  );
}

export function TouristDestinationSchema({
  name,
  description,
  image,
}: {
  name: string;
  description: string;
  image: string;
}) {
  return (
    <SchemaMarkup
      data={{
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        name,
        description,
        image,
        touristType: ["Luxury travellers", "Adventure seekers", "Couples"],
        geo: {
          "@type": "GeoCoordinates",
          addressCountry: "NZ",
        },
      }}
    />
  );
}

export function TravelActionSchema({
  name,
  description,
  image,
  price,
  duration,
  url,
}: {
  name: string;
  description: string;
  image: string;
  price: number;
  duration: number;
  url: string;
}) {
  return (
    <SchemaMarkup
      data={{
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name,
        description,
        image,
        url,
        touristType: "Luxury travellers",
        provider: {
          "@type": "Organization",
          name: "Curated Experiences",
          url: "https://curatedexperiences.com",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: price.toString(),
          priceValidUntil: new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000
          ).toISOString().split("T")[0],
          availability: "https://schema.org/InStock",
        },
        itinerary: {
          "@type": "ItemList",
          numberOfItems: duration,
        },
      }}
    />
  );
}

export function ReviewSchema({
  reviewBody,
  author,
  itemReviewed,
}: {
  reviewBody: string;
  author: string;
  itemReviewed: string;
}) {
  return (
    <SchemaMarkup
      data={{
        "@context": "https://schema.org",
        "@type": "Review",
        reviewBody,
        author: { "@type": "Person", name: author },
        itemReviewed: {
          "@type": "TouristTrip",
          name: itemReviewed,
          provider: {
            "@type": "Organization",
            name: "Curated Experiences",
          },
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
      }}
    />
  );
}
