export interface Destination {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  description: string;
  highlights: string[];
  bestFor: string[];
  bestSeasons: string;
  relatedJourneySlugs: string[];
  heroImage: string;
  images: { src: string; alt: string }[];
}

export const DESTINATIONS: Destination[] = [
  {
    slug: "fiordland",
    name: "Fiordland",
    region: "South Island",
    tagline: "Ancient rainforest, mirror-still fiords, and a silence that stays with you.",
    description: `Fiordland is New Zealand at its most primordial. This is a landscape carved by glaciers over millions of years — towering granite walls dropping straight into water so still it doubles the sky. Milford Sound is the headline act, but the real magic is in the quiet: the morning mist lifting off Doubtful Sound, the birdsong on the Kepler Track, the way the light changes every hour in this place where the Tasman Sea meets the mountains.

For American travellers, Fiordland consistently ranks as the most memorable part of a New Zealand visit. 70% of US holiday visitors explore a national park, and Fiordland is the crown jewel. The overnight cruises here are genuinely transformative — falling asleep to the sound of waterfalls and waking to a fiord you have entirely to yourself.`,
    highlights: [
      "Milford Sound overnight cruise",
      "Doubtful Sound wilderness cruise",
      "Kepler Track guided day hike",
      "Te Anau Glowworm Caves",
      "Fiordland crested penguin spotting",
    ],
    bestFor: ["Nature lovers", "Photographers", "Couples"],
    bestSeasons: "October–April, though winter has a haunting beauty",
    relatedJourneySlugs: ["the-masterpiece", "the-expedition", "the-hidden-trail"],
    heroImage: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1920&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80", alt: "Milford Sound" },
      { src: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80", alt: "Doubtful Sound" },
    ],
  },
  {
    slug: "queenstown",
    name: "Queenstown",
    region: "South Island",
    tagline: "Adventure capital meets luxury lakeside living.",
    description: `Queenstown is a town that shouldn't exist — built on the edge of a glacial lake, surrounded by mountains so dramatic they've stood in for Middle-earth. It's famous for adrenaline (bungee, jet boats, skydiving), but the Queenstown we love is also a place of exceptional wine, world-class restaurants, and some of New Zealand's most beautiful hiking.

82% of American visitors to New Zealand pass through Queenstown, and it's easy to see why. The Remarkables catch the sunrise. Gibbston Valley produces pinot noir that rivals Burgundy. And on a clear night, the stars over Lake Wakatipu are enough to make you rethink your priorities.`,
    highlights: [
      "Shotover Canyon jet boat",
      "Gibbston Valley wine tasting",
      "Glenorchy and the Routeburn Track",
      "TSS Earnslaw vintage steamship cruise",
      "Skyline Gondola and luge",
    ],
    bestFor: ["Active travellers", "Couples", "Families"],
    bestSeasons: "Year-round — summer for hiking, winter for skiing",
    relatedJourneySlugs: ["the-masterpiece", "the-expedition", "the-southern-heart", "the-hidden-trail"],
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", alt: "Queenstown lakefront" },
      { src: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80", alt: "The Remarkables" },
    ],
  },
  {
    slug: "marlborough",
    name: "Marlborough",
    region: "South Island",
    tagline: "World-famous sauvignon blanc, pristine sounds, and artisan producers.",
    description: `Marlborough is where New Zealand wine was born — or at least where it became world-famous. The Wairau Valley stretches between mountain ranges, bathed in more sunshine than almost anywhere else in the country, producing sauvignon blanc that changed the global wine conversation.

But Marlborough is more than wine. The Marlborough Sounds are a labyrinth of waterways, islands, and sheltered bays where the Queen Charlotte Track winds through native bush. The artisan food scene here is exceptional — olive oil, honey, cheese, and seafood pulled straight from the Sounds.`,
    highlights: [
      "Private cellar door wine tastings",
      "Queen Charlotte Sound cruise",
      "Queen Charlotte Track hiking",
      "Artisan cheese and olive oil producers",
      "Seafood cruise in the Sounds",
    ],
    bestFor: ["Wine lovers", "Food enthusiasts", "Couples"],
    bestSeasons: "February–April for harvest, December–March for the Sounds",
    relatedJourneySlugs: ["the-epicurean", "the-southern-heart"],
    heroImage: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1920&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&q=80", alt: "Marlborough vineyards" },
    ],
  },
  {
    slug: "aoraki-mount-cook",
    name: "Aoraki / Mount Cook",
    region: "South Island",
    tagline: "New Zealand's highest peak, glacial lakes, and the world's clearest skies.",
    description: `Aoraki / Mount Cook is the roof of New Zealand — 3,724 metres of ice and rock that dominates the Southern Alps. But you don't need to be a mountaineer to feel its power. The Hooker Valley Track is a gentle walk through alpine meadows to a glacier lake, and the night sky here is in a class of its own.

The Aoraki Mackenzie International Dark Sky Reserve is one of only a handful in the world. On a clear night, the Milky Way is so vivid it casts shadows. For American travellers — especially from light-polluted cities — this is often the most unexpectedly moving part of a New Zealand journey.`,
    highlights: [
      "Hooker Valley Track",
      "Dark Sky Reserve stargazing",
      "Glacier helicopter landing",
      "Tasman Glacier boat tour",
      "Mount Cook alpine scenic flight",
    ],
    bestFor: ["Nature lovers", "Stargazers", "Photographers"],
    bestSeasons: "October–April for hiking, year-round for stargazing",
    relatedJourneySlugs: ["the-masterpiece", "the-expedition", "the-southern-heart"],
    heroImage: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=1920&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80", alt: "Aoraki / Mount Cook" },
    ],
  },
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}
