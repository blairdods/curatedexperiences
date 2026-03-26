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
    slug: "the-masterpiece",
    title: "The Masterpiece",
    tagline:
      "The definitive New Zealand odyssey. A 15-day symphony of 'Super Lodges' and private aviation, hand-crafted for those who refuse to compromise on icons.",
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
    slug: "the-epicurean",
    title: "The Epicurean",
    tagline:
      "A love letter to New Zealand's soil and sea. Move through world-renowned vineyards and meet the makers in their private cellars for an estate-to-table experience.",
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
    slug: "the-expedition",
    title: "The Expedition",
    tagline:
      "A journey into the profound silence of the wilderness. Navigate the deep-blue reaches of the fjords by private charter and retreat to tented luxury accessible only by air.",
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
  {
    slug: "the-discovery",
    title: "The Discovery",
    tagline:
      "A poetic traverse of our unique geography. Witness the dramatic shift from subtropical North to alpine South, focusing on the stories and 'in-between' secret viewpoints.",
    narrative: `The Discovery is designed for travellers who are visiting New Zealand for the first time and want to experience the essence of the country in a week. We've distilled decades of local knowledge into seven transformative days that capture what makes this place extraordinary.

From the cosmopolitan energy of Auckland to the geothermal wonders of Rotorua and the harbour beauty of Wellington, this journey gives you a taste of New Zealand's remarkable diversity — without rushing. Every experience is curated to be both accessible and profound.

This is not a highlights reel. It's a carefully composed introduction that will leave you planning your return before you've even left.`,
    durationDays: 7,
    priceFromUsd: 6500,
    regions: ["Auckland", "Rotorua", "Wellington"],
    experienceTags: ["Culture", "Geothermal", "City", "Nature"],
    idealFor: ["First-time visitors", "Couples", "Short breaks"],
    seasons: ["Year-round"],
    highlights: [
      "Auckland harbour sailing experience",
      "Private geothermal tour in Rotorua",
      "Māori cultural immersion",
      "Wellington's culinary scene",
      "Boutique wine tasting",
    ],
    inclusions: [
      "All boutique accommodation",
      "Private transfers throughout",
      "All guided experiences",
      "Selected dining experiences",
      "Personal curator support",
    ],
    itinerary: [
      { day: 1, title: "Arrive Auckland", description: "Welcome to New Zealand. Private transfer to your harbour-view hotel. Evening orientation dinner.", overnight: "Hotel DeBrett, Auckland" },
      { day: 2, title: "Auckland & Waiheke Island", description: "Morning sailing on the Hauraki Gulf. Afternoon ferry to Waiheke Island for vineyard lunch and olive oil tasting.", overnight: "Hotel DeBrett, Auckland" },
      { day: 3, title: "Fly to Rotorua", description: "Short flight to Rotorua. Private geothermal tour — bubbling mud pools, erupting geysers, and silica terraces.", overnight: "Regent of Rotorua" },
      { day: 4, title: "Rotorua — Māori culture", description: "Morning at Te Puia. Afternoon mountain biking through the Whakarewarewa Forest. Evening hāngī feast.", overnight: "Regent of Rotorua" },
      { day: 5, title: "To Wellington", description: "Scenic drive through the Waikato. Arrive in Wellington, New Zealand's creative capital. Evening at a chef's table.", overnight: "QT Wellington" },
      { day: 6, title: "Wellington food & culture", description: "Morning at Te Papa museum. Walking food tour through the laneways. Afternoon at a Martinborough vineyard.", overnight: "QT Wellington" },
      { day: 7, title: "Departure", description: "Morning at leisure. Private transfer to Wellington Airport.", highlights: ["Private airport transfer"] },
    ],
    images: [
      { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", alt: "Auckland harbour" },
      { src: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80", alt: "Rotorua geothermal" },
    ],
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    testimonial: {
      quote: "Seven days was all it took to fall completely in love with New Zealand. The Discovery gave us the perfect introduction.",
      author: "Emily & James Wright",
      location: "Chicago, IL",
    },
  },
  {
    slug: "the-hidden-trail",
    title: "The Hidden Trail",
    tagline:
      "For the independent spirit. We provide the luxury 4WD, the insider map, and the private ridgeline access; you provide the sense of adventure and the drive.",
    narrative: `The Hidden Trail exists for travellers who have done the highlights and want to go deeper. This is New Zealand beyond the postcards — remote valleys accessible only by helicopter, coastal trails where you won't see another soul, and lodges so tucked away they feel like the edge of the world.

We've spent years building relationships with the guides and lodge owners who operate in New Zealand's most remote corners. These are people who don't advertise, who don't appear on booking platforms, and who only accept guests through personal referral. When you travel The Hidden Trail, you're accessing a New Zealand that very few people will ever experience.

This journey requires a spirit of adventure and a willingness to be surprised. What you'll find is something money alone can't buy: authenticity.`,
    durationDays: 10,
    priceFromUsd: 18000,
    regions: ["Fiordland", "West Coast", "Stewart Island"],
    experienceTags: ["Remote", "Wildlife", "Hiking", "Wilderness"],
    idealFor: ["Experienced travellers", "Nature purists", "Photographers"],
    seasons: ["November–March"],
    highlights: [
      "Helicopter access to remote Fiordland valleys",
      "Stewart Island kiwi spotting at night",
      "West Coast wilderness lodge",
      "Private guided Hollyford Track section",
      "Doubtful Sound overnight — no other boats",
    ],
    inclusions: [
      "All remote lodge accommodation",
      "All helicopter and boat transfers",
      "Expert wilderness guides throughout",
      "All meals (lodges are all-inclusive)",
      "Satellite communication equipment",
    ],
    itinerary: [
      { day: 1, title: "Queenstown to the wild", description: "Helicopter from Queenstown directly into the heart of Fiordland. Land at a remote lodge accessible only by air.", overnight: "Remote Fiordland Lodge" },
      { day: 2, title: "Fiordland valleys", description: "Guided walk through valleys that see fewer than 100 visitors a year. Bird life is extraordinary — kea, tūī, bellbird.", overnight: "Remote Fiordland Lodge" },
      { day: 3, title: "Doubtful Sound", description: "Boat into Doubtful Sound. Overnight on the water — you'll likely be the only vessel in the entire fiord.", overnight: "Overnight vessel, Doubtful Sound" },
      { day: 4, title: "To the West Coast", description: "Transfer to the wild West Coast. Check in to a wilderness lodge nestled in ancient podocarp rainforest.", overnight: "Wilderness Lodge, West Coast" },
      { day: 5, title: "Rainforest and coast", description: "Guided walk through forest that has been growing for 80 million years. Afternoon on a deserted beach.", overnight: "Wilderness Lodge, West Coast" },
      { day: 6, title: "Fly to Stewart Island", description: "Flight to Stewart Island — New Zealand's third island, population 400. This is where kiwi roam free.", overnight: "Stewart Island Lodge" },
      { day: 7, title: "Kiwi spotting", description: "Guided night walk to see wild kiwi in their natural habitat. One of the most magical wildlife experiences in the world.", overnight: "Stewart Island Lodge" },
      { day: 8, title: "Ulva Island sanctuary", description: "Boat to Ulva Island — a predator-free bird sanctuary. Species found nowhere else on earth.", overnight: "Stewart Island Lodge" },
      { day: 9, title: "Return to Queenstown", description: "Flight back to Queenstown. Afternoon at leisure. Farewell dinner.", overnight: "Eichardt's Private Hotel" },
      { day: 10, title: "Departure", description: "Private transfer to Queenstown Airport.", highlights: ["Private airport transfer"] },
    ],
    images: [
      { src: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80", alt: "Remote Fiordland" },
      { src: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80", alt: "West Coast wilderness" },
    ],
    heroImage: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1920&q=80",
    testimonial: {
      quote: "The Hidden Trail showed us a New Zealand we didn't know existed. The kiwi spotting on Stewart Island was life-changing.",
      author: "Richard & Anne Chambers",
      location: "Boston, MA",
    },
  },
  {
    slug: "the-southern-heart",
    title: "The Southern Heart",
    tagline:
      "A concentrated immersion into the rugged beauty of the South. Experience the scale of massive glaciers, turquoise lakes, and the clearest night skies on the planet.",
    narrative: `The Southern Heart is a journey for two. It's designed around the moments that bring couples closer — a candlelit dinner in a lakeside lodge, a dawn walk through a mist-filled valley, a private hot pool overlooking mountains that seem to go on forever.

This is not a honeymoon package with rose petals on the bed. It's something more considered, more personal. We design each Southern Heart journey around the couple — their story, their passions, their pace. Some want adventure together. Others want stillness. Most want both.

The South Island is extraordinarily romantic, but not in the obvious way. Its romance is in the scale of the landscape, the intimacy of the lodges, and the feeling that in this place, time moves at whatever speed you choose.`,
    durationDays: 8,
    priceFromUsd: 14000,
    regions: ["Queenstown", "Wanaka", "Aoraki / Mount Cook"],
    experienceTags: ["Romance", "Wellness", "Scenic", "Wine"],
    idealFor: ["Couples", "Anniversaries", "Honeymoons"],
    seasons: ["Year-round (each season has its own romance)"],
    highlights: [
      "Private hot pool with mountain views",
      "Candlelit dinner at a lakeside lodge",
      "Couples' helicopter scenic flight",
      "Gibbston Valley private wine tasting",
      "Stargazing at Aoraki Dark Sky Reserve",
    ],
    inclusions: [
      "Premium lodge accommodation with lake/mountain views",
      "All private transfers and scenic flights",
      "Couples' experiences throughout",
      "Selected fine dining experiences",
      "In-room welcome amenities",
    ],
    itinerary: [
      { day: 1, title: "Arrive Queenstown", description: "Private transfer to your lakeside suite. Champagne welcome. Evening dinner overlooking Lake Wakatipu.", overnight: "Matakauri Lodge" },
      { day: 2, title: "Queenstown together", description: "Morning at your pace. Afternoon private wine tasting in Gibbston Valley. Evening at a restaurant chosen just for you.", overnight: "Matakauri Lodge" },
      { day: 3, title: "To Wanaka", description: "Scenic drive to Wanaka. Afternoon kayaking on the lake or simply enjoying the lodge's private hot pool.", overnight: "Minaret Station Alpine Lodge" },
      { day: 4, title: "Wanaka — sky and lake", description: "Couples' helicopter flight over the Southern Alps with a landing on a remote peak. Afternoon at leisure.", overnight: "Minaret Station Alpine Lodge" },
      { day: 5, title: "To Aoraki", description: "Transfer to Aoraki / Mount Cook. The landscape transforms as you enter the Mackenzie Country. Private hot pool with mountain views.", overnight: "The Hermitage" },
      { day: 6, title: "Aoraki — peak and stars", description: "Gentle Hooker Valley walk together. Evening stargazing at the Dark Sky Reserve — the Milky Way as you've never seen it.", overnight: "The Hermitage" },
      { day: 7, title: "Return to Queenstown", description: "Scenic return to Queenstown via Lake Tekapo. Farewell dinner — a meal that brings together the flavours of your journey.", overnight: "Eichardt's Private Hotel" },
      { day: 8, title: "Departure", description: "Private transfer to Queenstown Airport. Depart with memories you'll share for a lifetime.", highlights: ["Private airport transfer"] },
    ],
    images: [
      { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", alt: "Queenstown lakeside" },
      { src: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80", alt: "Southern Alps" },
    ],
    heroImage: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1920&q=80",
    testimonial: {
      quote: "Our anniversary trip was beyond anything we could have imagined. The stargazing at Aoraki was the most romantic moment of our lives.",
      author: "Lauren & Michael Torres",
      location: "Austin, TX",
    },
  },
];

export function getJourneyBySlug(slug: string): Journey | undefined {
  return JOURNEYS.find((j) => j.slug === slug);
}
