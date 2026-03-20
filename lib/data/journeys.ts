import type { ItineraryDay } from "@/components/ui/itinerary-accordion";

export interface Journey {
  slug: string;
  title: string;
  tagline: string;
  narrative: string;
  durationDays: number;
  priceFromUsd: number;
  regions: string[];
  experienceTags: string[];
  idealFor: string[];
  seasons: string[];
  highlights: string[];
  inclusions: string[];
  itinerary: ItineraryDay[];
  images: { src: string; alt: string }[];
  heroImage: string;
  testimonial?: {
    quote: string;
    author: string;
    location: string;
  };
}

export const JOURNEYS: Journey[] = [
  {
    slug: "south-island-odyssey",
    title: "South Island Odyssey",
    tagline:
      "From Queenstown's peaks to Fiordland's ancient waterways — the essential South Island experience.",
    narrative: `There's a moment on your first morning in Queenstown when the lake catches the light and the Remarkables turn gold, and you understand why people come back to New Zealand year after year. The South Island Odyssey is built around those moments — not the postcard version, but the real thing, experienced at a pace that lets you actually feel it.

We'll take you from the alpine energy of Queenstown through the hushed grandeur of Fiordland, across to the mirror-still lakes of Wanaka, and up through the Mackenzie Country where the skies are so clear the stars feel close enough to touch. Each day is designed to balance adventure with stillness — a glacier helicopter flight in the morning, a long lunch at a vineyard in the afternoon.

This isn't a tour. It's a conversation with a landscape that has been millions of years in the making.`,
    durationDays: 14,
    priceFromUsd: 12500,
    regions: ["Queenstown", "Fiordland", "Wanaka", "Aoraki / Mount Cook"],
    experienceTags: [
      "Hiking",
      "Scenic flights",
      "Wildlife",
      "Stargazing",
      "Cruising",
    ],
    idealFor: ["Couples", "Active travellers", "Nature lovers"],
    seasons: ["October–April (best)", "Year-round (varies)"],
    highlights: [
      "Milford Sound overnight cruise",
      "Helicopter flight to a glacier",
      "Routeburn Track guided day hike",
      "Dark sky stargazing at Aoraki",
      "Private wine tasting in Gibbston Valley",
    ],
    inclusions: [
      "All luxury accommodation (lodges and boutique hotels)",
      "Private transfers and scenic flights",
      "All guided experiences and activities",
      "Selected meals at recommended restaurants",
      "24/7 concierge support throughout",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Queenstown",
        description:
          "Private transfer from the airport to your lakeside lodge. Settle in, breathe the mountain air, and enjoy a welcome dinner overlooking Lake Wakatipu.",
        overnight: "Eichardt's Private Hotel, Queenstown",
        highlights: ["Private airport transfer", "Welcome dinner"],
      },
      {
        day: 2,
        title: "Queenstown at your pace",
        description:
          "A day to find your rhythm. Choose between a morning jet boat ride on the Shotover River, a leisurely gondola ride with views to the Remarkables, or simply wander the lakefront. Afternoon wine tasting in the Gibbston Valley.",
        overnight: "Eichardt's Private Hotel, Queenstown",
        highlights: [
          "Gibbston Valley wine tasting",
          "Shotover jet boat (optional)",
        ],
      },
      {
        day: 3,
        title: "Glenorchy & the Routeburn",
        description:
          "Drive the stunning road to Glenorchy — Middle-earth country at its finest. Guided day hike on the Routeburn Track, one of New Zealand's Great Walks, with a packed gourmet lunch by the river.",
        overnight: "Camp Glenorchy Eco Retreat",
        highlights: [
          "Routeburn Track guided hike",
          "Glenorchy scenic drive",
          "Gourmet trail lunch",
        ],
      },
      {
        day: 4,
        title: "Into Fiordland",
        description:
          "Transfer to Te Anau, the gateway to Fiordland National Park. Afternoon visit to the Te Anau Glowworm Caves — an underground world of luminous wonder. Evening at leisure in this peaceful lakeside town.",
        overnight: "Fiordland Lodge, Te Anau",
        highlights: [
          "Te Anau Glowworm Caves",
          "Fiordland National Park entry",
        ],
      },
      {
        day: 5,
        title: "Milford Sound overnight",
        description:
          "The drive to Milford Sound is a journey in itself — through ancient beech forest, mirror lakes, and the dramatic Homer Tunnel. Board your overnight vessel for an intimate cruise through the fiord. Watch the sunset paint Mitre Peak gold.",
        overnight: "Overnight cruise, Milford Sound",
        highlights: [
          "Milford Road scenic drive",
          "Overnight fiord cruise",
          "Mitre Peak sunset",
        ],
      },
      {
        day: 6,
        title: "Milford Sound to Wanaka",
        description:
          "Wake to the sound of waterfalls. Morning kayaking in the fiord before transferring to Wanaka via the Crown Range — New Zealand's highest sealed road with staggering views.",
        overnight: "Minaret Station Alpine Lodge",
        highlights: [
          "Morning kayak in Milford Sound",
          "Crown Range crossing",
        ],
      },
      {
        day: 7,
        title: "Wanaka — lake and sky",
        description:
          "A day in Wanaka, where the pace slows and the lake stretches to the mountains. Choose between a guided hike to Roy's Peak, a scenic flight over the Southern Alps, or simply enjoy the lakefront.",
        overnight: "Minaret Station Alpine Lodge",
        highlights: [
          "Roy's Peak hike (optional)",
          "Southern Alps scenic flight (optional)",
        ],
      },
      {
        day: 8,
        title: "Helicopter to a glacier",
        description:
          "The highlight of many a New Zealand journey — a helicopter flight to the Franz Josef or Fox Glacier, landing on the ice for a guided walk. Afternoon transfer towards Aoraki / Mount Cook.",
        overnight: "The Hermitage, Aoraki / Mount Cook",
        highlights: [
          "Glacier helicopter landing",
          "Guided ice walk",
          "Aoraki / Mount Cook views",
        ],
      },
      {
        day: 9,
        title: "Aoraki / Mount Cook",
        description:
          "A day in the shadow of New Zealand's highest peak. Walk the Hooker Valley Track — a gentle trail through alpine meadows to a glacier lake. Evening stargazing at the Aoraki Mackenzie Dark Sky Reserve.",
        overnight: "The Hermitage, Aoraki / Mount Cook",
        highlights: [
          "Hooker Valley Track",
          "Dark Sky Reserve stargazing",
        ],
      },
      {
        day: 10,
        title: "Lake Tekapo & Mackenzie Country",
        description:
          "Drive through the golden tussock of the Mackenzie Country to Lake Tekapo. Visit the Church of the Good Shepherd, and enjoy a scenic flight over the turquoise lakes.",
        overnight: "Lakestone Lodge, Lake Tekapo",
        highlights: [
          "Church of the Good Shepherd",
          "Scenic flight over turquoise lakes",
        ],
      },
      {
        day: 11,
        title: "To Queenstown via Arrowtown",
        description:
          "Return to the Queenstown region via the charming gold-rush village of Arrowtown. Browse the galleries and boutiques, then enjoy a long lunch at one of Central Otago's finest restaurants.",
        overnight: "Eichardt's Private Hotel, Queenstown",
        highlights: ["Arrowtown village", "Central Otago dining"],
      },
      {
        day: 12,
        title: "Free day — your choice",
        description:
          "A day entirely at your discretion. Bungee jump at the Kawarau Bridge, take a scenic cruise on Lake Wakatipu aboard the TSS Earnslaw, play a round of golf, or simply relax at the hotel spa.",
        overnight: "Eichardt's Private Hotel, Queenstown",
        highlights: ["Your choice of activity", "Spa or adventure"],
      },
      {
        day: 13,
        title: "Farewell dinner",
        description:
          "A final day to soak in Queenstown. Evening farewell dinner at a restaurant we've chosen just for you — a meal that brings together the flavours of your journey.",
        overnight: "Eichardt's Private Hotel, Queenstown",
        highlights: ["Curated farewell dinner"],
      },
      {
        day: 14,
        title: "Departure",
        description:
          "Private transfer to Queenstown Airport. Depart with memories of a New Zealand you'll carry with you always.",
        highlights: ["Private airport transfer"],
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80",
        alt: "Milford Sound, Fiordland",
      },
      {
        src: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80",
        alt: "Mount Cook, Canterbury",
      },
      {
        src: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80",
        alt: "Lake Wanaka",
      },
      {
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        alt: "Queenstown",
      },
    ],
    heroImage:
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1920&q=80",
    testimonial: {
      quote:
        "We've travelled the world, but nothing has come close to what Tony and the team crafted for us in New Zealand. Every single day exceeded our expectations.",
      author: "Sarah & David Chen",
      location: "San Francisco, CA",
    },
  },
  {
    slug: "wine-culinary-trail",
    title: "Wine & Culinary Trail",
    tagline:
      "Marlborough vineyards, Hawke's Bay estates, and Wellington's world-class dining scene.",
    narrative: `New Zealand's food and wine scene has quietly become one of the world's most exciting — and this journey takes you straight to its heart. From the sauvignon blanc vineyards of Marlborough to the bold reds of Hawke's Bay, with Wellington's inventive restaurant scene in between, this is a journey for people who believe that what you eat and drink is as much a part of travel as what you see.

We've designed this itinerary around the people behind the food — the winemakers who'll open a barrel just for you, the chef who forages from the hills behind her restaurant, the olive oil producer whose family has worked the same grove for three generations. These are the moments that make a culinary journey feel personal, not like a tour.

In 2026, the MICHELIN Guide arrives in New Zealand for the first time. This journey takes you to the restaurants and producers that we believe will define the conversation.`,
    durationDays: 10,
    priceFromUsd: 9800,
    regions: ["Marlborough", "Hawke's Bay", "Wellington", "Wairarapa"],
    experienceTags: [
      "Wine tasting",
      "Fine dining",
      "Cooking classes",
      "Farm visits",
    ],
    idealFor: ["Couples", "Food enthusiasts", "Wine lovers"],
    seasons: ["February–April (harvest)", "Year-round"],
    highlights: [
      "Private cellar door tastings in Marlborough",
      "MICHELIN-recognised restaurants in Wellington",
      "Hawke's Bay estate lunch with winemaker",
      "Artisan cheese and olive oil producers",
      "Wellington night market and waterfront dining",
    ],
    inclusions: [
      "All boutique accommodation",
      "Private wine tours with expert guides",
      "Selected fine dining experiences",
      "Cooking class with a local chef",
      "All transfers between regions",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Marlborough",
        description:
          "Fly into Blenheim and transfer to your vineyard lodge. Afternoon orientation tasting at a family-owned estate.",
        overnight: "The Marlborough Lodge",
        highlights: ["Welcome wine tasting"],
      },
      {
        day: 2,
        title: "Marlborough wine country",
        description:
          "A full day exploring Marlborough's finest wineries with a private guide. From iconic sauvignon blanc to exceptional méthode traditionnelle, this is New Zealand winemaking at its best.",
        overnight: "The Marlborough Lodge",
        highlights: [
          "Private winery tours",
          "Vineyard lunch",
        ],
      },
      {
        day: 3,
        title: "Marlborough Sounds",
        description:
          "A morning boat cruise through the Queen Charlotte Sound — wine country meets the sea. Afternoon visit to an artisan cheese producer.",
        overnight: "Bay of Many Coves Resort",
        highlights: [
          "Queen Charlotte Sound cruise",
          "Artisan cheese tasting",
        ],
      },
      {
        day: 4,
        title: "To Wellington",
        description:
          "Ferry across Cook Strait — one of the world's great short sea crossings. Arrive in Wellington, New Zealand's creative capital. Evening at a chef's table restaurant.",
        overnight: "QT Wellington",
        highlights: [
          "Cook Strait ferry crossing",
          "Chef's table dinner",
        ],
      },
      {
        day: 5,
        title: "Wellington food scene",
        description:
          "Morning at Wellington's harbourside market. Walking food tour through the city's laneway restaurants and cafés. Afternoon cooking class with a Wellington chef.",
        overnight: "QT Wellington",
        highlights: [
          "Harbourside market",
          "Cooking class",
          "Laneway food tour",
        ],
      },
      {
        day: 6,
        title: "Wairarapa wine region",
        description:
          "Day trip to the Wairarapa — home to some of New Zealand's finest pinot noir. Visit boutique producers in Martinborough, followed by lunch at a vineyard restaurant.",
        overnight: "QT Wellington",
        highlights: [
          "Martinborough pinot noir",
          "Vineyard restaurant lunch",
        ],
      },
      {
        day: 7,
        title: "Fly to Hawke's Bay",
        description:
          "Short flight to Napier, the Art Deco capital. Settle into your estate accommodation among the vines. Evening dinner at a Hawke's Bay institution.",
        overnight: "The Farm at Cape Kidnappers",
        highlights: [
          "Art Deco Napier",
          "Estate accommodation",
        ],
      },
      {
        day: 8,
        title: "Hawke's Bay estates",
        description:
          "Visit the grand estates of Hawke's Bay — bold syrah, elegant chardonnay, and long lunches overlooking the vines. A private session with a winemaker who'll share barrels not yet released.",
        overnight: "The Farm at Cape Kidnappers",
        highlights: [
          "Barrel tasting with winemaker",
          "Estate lunch",
        ],
      },
      {
        day: 9,
        title: "Olive oil, honey & farewell",
        description:
          "Morning visits to artisan producers — olive oil, honey, and charcuterie. Afternoon at leisure to enjoy the estate. Farewell dinner bringing together the flavours of the journey.",
        overnight: "The Farm at Cape Kidnappers",
        highlights: [
          "Artisan producer visits",
          "Farewell dinner",
        ],
      },
      {
        day: 10,
        title: "Departure",
        description:
          "Transfer to Napier Airport or connect to your next New Zealand destination.",
        highlights: ["Private transfer"],
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&q=80",
        alt: "Marlborough vineyards",
      },
      {
        src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
        alt: "Fine dining",
      },
      {
        src: "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=800&q=80",
        alt: "Wellington harbour",
      },
    ],
    heroImage:
      "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1920&q=80",
    testimonial: {
      quote:
        "The wine knowledge was incredible — but it was the people we met and the stories behind every bottle that made this trip unforgettable.",
      author: "Michael & Patricia Ross",
      location: "Napa Valley, CA",
    },
  },
  {
    slug: "wilderness-adventure",
    title: "Wilderness & Adventure",
    tagline:
      "Heli-hiking glaciers, jet-boating canyons, and stargazing from the world's darkest skies.",
    narrative: `This is New Zealand for people who want to feel alive. Not reckless — exhilarated. The kind of travel where you land a helicopter on a glacier before breakfast, jet-boat through a canyon after lunch, and spend the evening watching the Milky Way from a place where light pollution simply doesn't exist.

The Wilderness & Adventure journey takes you to the South Island's most dramatic landscapes, but always with a level of comfort and expertise that means you can push your boundaries without ever feeling out of your depth. Our guides are the best in the country — mountaineers, pilots, and naturalists who've spent their lives in these mountains and rivers.

Every day offers a choice: go bigger or go deeper. Heli-hike a glacier or walk a gentle valley trail. Jet-boat a river or kayak a lake. The itinerary flexes around you.`,
    durationDays: 12,
    priceFromUsd: 15000,
    regions: ["Queenstown", "West Coast", "Aoraki / Mount Cook", "Fiordland"],
    experienceTags: [
      "Heli-hiking",
      "Jet boating",
      "Glacier walks",
      "Stargazing",
      "Kayaking",
    ],
    idealFor: ["Active couples", "Adventure seekers", "Thrill lovers"],
    seasons: ["November–March (summer)", "June–August (winter skiing)"],
    highlights: [
      "Glacier heli-hike on Franz Josef",
      "Shotover Canyon jet boat",
      "Milford Sound kayaking",
      "Dark sky stargazing at Aoraki",
      "Skydive over Queenstown (optional)",
    ],
    inclusions: [
      "All premium lodge accommodation",
      "All adventure activities as described",
      "Helicopter transfers and scenic flights",
      "Expert guides throughout",
      "All meals at selected restaurants and lodges",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive Queenstown",
        description:
          "Arrive into Queenstown and transfer to your adventure lodge. Evening briefing on the journey ahead over dinner.",
        overnight: "Azur Lodge, Queenstown",
        highlights: ["Welcome dinner and journey briefing"],
      },
      {
        day: 2,
        title: "Canyon and sky",
        description:
          "Morning Shotover Canyon jet boat — the original New Zealand adrenaline rush. Afternoon option: bungee at the Kawarau Bridge or a scenic helicopter flight over the Remarkables.",
        overnight: "Azur Lodge, Queenstown",
        highlights: [
          "Shotover jet boat",
          "Bungee or heli-flight (your choice)",
        ],
      },
      {
        day: 3,
        title: "Ben Lomond summit",
        description:
          "Guided hike to the summit of Ben Lomond — a full-day alpine challenge with 360-degree views from the top. One of the South Island's most rewarding day hikes.",
        overnight: "Azur Lodge, Queenstown",
        highlights: [
          "Ben Lomond summit hike",
          "360-degree alpine views",
        ],
      },
      {
        day: 4,
        title: "Fly to the West Coast",
        description:
          "Scenic flight over the Southern Alps to the West Coast. The landscape shifts from alpine to rainforest in minutes. Check in to your eco-lodge nestled in the bush.",
        overnight: "Te Waonui Forest Retreat, Franz Josef",
        highlights: ["Southern Alps scenic flight"],
      },
      {
        day: 5,
        title: "Glacier heli-hike",
        description:
          "The signature experience: helicopter to Franz Josef Glacier, then a guided walk on the ice. The scale is humbling — blue crevasses, ice caves, and a river of ice stretching to the mountains.",
        overnight: "Te Waonui Forest Retreat, Franz Josef",
        highlights: [
          "Helicopter to Franz Josef Glacier",
          "Guided ice walk",
          "Blue ice caves",
        ],
      },
      {
        day: 6,
        title: "West Coast wilderness",
        description:
          "A day exploring the wild West Coast — walk through ancient podocarp rainforest, visit the coastal blowholes at Punakaiki, and spot Hector's dolphins from the shore.",
        overnight: "Te Waonui Forest Retreat, Franz Josef",
        highlights: [
          "Rainforest walk",
          "Punakaiki blowholes",
          "Hector's dolphins",
        ],
      },
      {
        day: 7,
        title: "Across to Aoraki",
        description:
          "Transfer through the Haast Pass and Mackenzie Country to Aoraki / Mount Cook. The landscape transforms from lush coast to golden tussock to alpine grandeur.",
        overnight: "The Hermitage, Aoraki / Mount Cook",
        highlights: ["Haast Pass scenic drive"],
      },
      {
        day: 8,
        title: "Aoraki — peak and stars",
        description:
          "Guided Hooker Valley Track in the morning. Optional scenic flight around Mount Cook's summit. Evening: Dark Sky Reserve stargazing — the Milky Way as you've never seen it.",
        overnight: "The Hermitage, Aoraki / Mount Cook",
        highlights: [
          "Hooker Valley Track",
          "Dark Sky Reserve stargazing",
        ],
      },
      {
        day: 9,
        title: "To Fiordland",
        description:
          "Drive south through the Mackenzie Country to Te Anau, the gateway to Fiordland. Afternoon glowworm cave visit.",
        overnight: "Fiordland Lodge, Te Anau",
        highlights: ["Te Anau Glowworm Caves"],
      },
      {
        day: 10,
        title: "Milford Sound kayaking",
        description:
          "Drive the spectacular Milford Road. Full-day guided kayaking in Milford Sound — paddle beneath waterfalls, alongside dolphins, and under the gaze of Mitre Peak.",
        overnight: "Fiordland Lodge, Te Anau",
        highlights: [
          "Milford Sound kayaking",
          "Waterfall paddling",
          "Dolphin encounters",
        ],
      },
      {
        day: 11,
        title: "Return to Queenstown",
        description:
          "Scenic transfer back to Queenstown. Free afternoon — optional skydive over the Remarkables, or simply enjoy the spa. Farewell dinner at a restaurant overlooking the lake.",
        overnight: "Azur Lodge, Queenstown",
        highlights: [
          "Skydive (optional)",
          "Farewell dinner",
        ],
      },
      {
        day: 12,
        title: "Departure",
        description:
          "Private transfer to Queenstown Airport. Depart New Zealand with stories that will last a lifetime.",
        highlights: ["Private airport transfer"],
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80",
        alt: "Franz Josef Glacier",
      },
      {
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        alt: "Queenstown adventure",
      },
      {
        src: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80",
        alt: "Milford Sound kayaking",
      },
    ],
    heroImage:
      "https://images.unsplash.com/photo-1469521669194-babb45599def?w=1920&q=80",
    testimonial: {
      quote:
        "Landing on that glacier was the single most incredible moment of my life. And then somehow every day after that topped it.",
      author: "Jake Morrison",
      location: "Denver, CO",
    },
  },
];

export function getJourneyBySlug(slug: string): Journey | undefined {
  return JOURNEYS.find((j) => j.slug === slug);
}
