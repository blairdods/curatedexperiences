import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import Image from "next/image";

const STORIES = [
  {
    quote:
      "We've travelled the world, but nothing has come close to what Tony and the team crafted for us in New Zealand. Every single day exceeded our expectations.",
    story:
      "Sarah and David came to us looking for a two-week South Island adventure for their 25th anniversary. They wanted hiking, wine, and landscapes that would take their breath away. We built a journey from Queenstown to Fiordland to Wanaka, with a helicopter glacier landing and an overnight cruise in Milford Sound. David later told us the stargazing at Aoraki was the most moving experience of his life.",
    author: "Sarah & David Chen",
    location: "San Francisco, CA",
    journey: "The Masterpiece",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80",
  },
  {
    quote:
      "The wine knowledge was incredible — but it was the people we met and the stories behind every bottle that made this trip unforgettable.",
    story:
      "Michael and Patricia are serious wine collectors from Napa. They'd visited Bordeaux, Tuscany, and the Barossa — but New Zealand wasn't on their radar. We took them from Marlborough's sauvignon blanc to Central Otago's pinot noir to Hawke's Bay's syrah, with private cellar door tastings and winemaker lunches. They've since bought a case of Central Otago pinot noir and are planning a return trip.",
    author: "Michael & Patricia Ross",
    location: "Napa Valley, CA",
    journey: "The Epicurean",
    image: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&q=80",
  },
  {
    quote:
      "Landing on that glacier was the single most incredible moment of my life. And then somehow every day after that topped it.",
    story:
      "Jake is the kind of traveller who needs to be moving. He'd done Patagonia, Iceland, and Nepal, and wanted something that would push his boundaries. We built a 12-day itinerary focused on the most dramatic experiences the South Island offers — glacier heli-hikes, canyon jet boats, Milford Sound kayaking, and a summit hike up Ben Lomond. He's already booked his next trip.",
    author: "Jake Morrison",
    location: "Denver, CO",
    journey: "The Expedition",
    image: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80",
  },
];

export default function StoriesPage() {
  return (
    <>
      <Hero
        eyebrow="Traveller Stories"
        title="Journeys remembered by the way they felt."
        subtitle="Not star ratings, but considered accounts of journeys shaped around people, pace, and place."
        imageSrc="/homepage-draft/0bf62082fa80fc2ba4b8adb0cbd36d6c2aff6d51.png"
        compact
      />

      <Section>
        <div className="space-y-24">
          {STORIES.map((story, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-10 lg:gap-16 items-center`}
            >
              {/* Image */}
              <div className="relative w-full lg:w-1/2 aspect-[1.25] overflow-hidden bg-warm-100">
                <Image
                  src={story.image}
                  alt={story.journey}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2">
                <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
                  {story.journey}
                </p>
                <blockquote className="font-serif text-[30px] sm:text-[38px] text-navy leading-[1.08] tracking-normal">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
                <p className="mt-7 text-[14px] text-foreground/70 leading-7">
                  {story.story}
                </p>
                <div className="mt-6">
                  <p className="text-sm font-medium text-navy">
                    {story.author}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-foreground-muted mt-2">
                    {story.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
