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
    narrative: `This is a sophisticated curated experience that infuses the "Big Three" of New Zealand luxury: Northland, Hawke's Bay, and the Southern Alps with exclusivity, seamless travel, and the most prestigious of properties.

For those who value space, grace, and the luxury of time. This itinerary isn't just a list of destinations; it is a personal recommendation from our own portfolio of lived experiences.

By anchoring your experience with a minimum of two nights at each of the country's most storied lodges, we ensure you transition from "tourist" to "guest." From the subtropical elegance of the far North to the dramatic alpine peaks of the deep South, discover the soul of the Islands through bespoke private tours, fine vintage wines & food and landscapes that defy description.`,
    durationDays: 15,
    priceFromUsd: 0,
    regions: ["Bay of Islands", "Auckland", "Taupo", "Hawke's Bay", "Ahuriri Valley", "Queenstown"],
    experienceTags: [
      "Super Lodges",
      "Private helicopter",
      "Golf",
      "Wine",
      "Glacier landing",
      "Sailing",
    ],
    idealFor: ["Luxury seekers", "Couples", "Discerning travellers"],
    seasons: ["Year-round"],
    highlights: [
      "Kauri Cliffs — 6,000-acre coastal estate and world-ranked golf",
      "Private helicopter to Mt Tarawera summit and geothermal valleys",
      "Private sailing charter on Lake Rotoiti with thermal hot pools",
      "The Farm at Cape Kidnappers — clifftop architecture and Tom Doak golf",
      "The Lindis — architectural sanctuary in the Ahuriri Valley",
      "Milford Sound heli-odyssey with glacier landing and gourmet picnic",
    ],
    inclusions: [
      "14 nights ultra-luxury accommodation across 6 iconic properties",
      "Kauri Cliffs, Huka Lodge, Cape Kidnappers, The Lindis, The Rees Hotel — all meals at lodges included",
      "Private 'Meet & Greet' airport transfers throughout",
      "Dedicated professional Driver/Guide and private vehicle",
      "Choice of bespoke Auckland excursion (Waiheke, Wildlife, Cultural, or West Coast)",
      "Private helicopter to Mt Tarawera and Orakei Korako geothermal valley",
      "Private sailing charter on Lake Rotoiti",
      "Private Milford Sound heli-odyssey with glacier landing",
    ],
    itinerary: [
      { day: 1, title: "Arrival & The Bay of Islands", description: "Touch down in Auckland and connect to Kerikeri. Your private chauffeur awaits to whisk you to The Lodge at Kauri Cliffs — a Hamptons-inspired sanctuary set upon 6,000 acres of coastal estate with sweeping Pacific views and world-renowned championship golf.", overnight: "The Lodge at Kauri Cliffs", highlights: ["Private airport meet & greet", "Kauri Cliffs coastal estate"] },
      { day: 2, title: "Kauri Cliffs: Coastal Discovery", description: "A day of total immersion. Wander to the famous Pink Beach for a private gourmet BBQ, explore the working farm via quad bike, enjoy a guided nature walk through ancient kauri forests, or play a round on the world-ranked greens.", overnight: "The Lodge at Kauri Cliffs", highlights: ["Pink Beach private BBQ", "World-ranked golf", "Ancient kauri forest walk"] },
      { day: 3, title: "Bay of Islands to Auckland", description: "After a final morning soak in the coastal air, transfer to Kerikeri for your flight to Auckland. Check into the Sofitel Auckland Viaduct Harbour — French 'Art de Vivre' overlooking the shimmering marina. Browse Commercial Bay and Britomart, or head to the water.", overnight: "Sofitel Auckland Viaduct Harbour", highlights: ["Kerikeri scenic flight", "Sofitel Viaduct Harbour"] },
      { day: 4, title: "Auckland: Bespoke Urban Experiences", description: "Tailor your day with one of four privately guided excursions: Waiheke Island Gourmet (oysters, vineyards, lunch), Nocturnal Wildlife Quest (twilight kiwi spotting), Indigenous Auckland (Māori history, private Haka), or The Wild West (rugged coast, winery lunch).", overnight: "Sofitel Auckland Viaduct Harbour", highlights: ["Choice of 4 private excursions", "Waiheke Island or West Coast"] },
      { day: 5, title: "The Glowworm Labyrinth to Huka Lodge", description: "Travel through rolling Waikato pastures to Waitomo. Descend into a silent, subterranean world of glowworm-lit caves before continuing to the legendary Huka Lodge — the birthplace of New Zealand luxury hospitality, nestled on the banks of the turquoise Waikato River.", overnight: "Huka Lodge", highlights: ["Footwhistle Glowworm Cave", "Huka Lodge — birthplace of NZ luxury"] },
      { day: 6, title: "Peaks, Springs & Private Sails", description: "A day of 'Fire and Water.' Private helicopter to the summit of Mt Tarawera, followed by an aerial tour of steaming geothermal valleys. Conclude at the pier for a private sailing charter on Lake Rotoiti — soak in hidden lakeside thermal pools and fish for rainbow trout.", overnight: "Huka Lodge", highlights: ["Mt Tarawera helicopter summit", "Orakei Korako geothermal", "Private sailing on Lake Rotoiti"] },
      { day: 7, title: "Huka Lodge: Estate Serenity", description: "Enjoy the 'Huka way of life.' Morning on the tennis courts or yoga lawn, afternoon exploring the heritage gardens. For the adventurous, private white-water rafting or a bespoke tasting in their world-class wine cellar.", overnight: "Huka Lodge", highlights: ["Heritage gardens", "Wine cellar tasting", "Day at leisure"] },
      { day: 8, title: "Over the Ranges to Cape Kidnappers", description: "Your Driver Guide takes you through the heart of Hawke's Bay — one of only 12 Great Wine Capitals of the World. Arrive at The Farm at Cape Kidnappers, where rugged clifftop architecture contrasts with rolling vineyards below. Multi-course degustation dinner to welcome you.", overnight: "The Farm at Cape Kidnappers", highlights: ["Hawke's Bay wine country", "Clifftop lodge", "Degustation dinner"] },
      { day: 9, title: "The Cape Kidnappers Experience", description: "Explore the 6,000-acre station via Can-Am, join a Kiwi discovery walk to see conservation in action, or play a round on the Tom Doak-designed course — frequently cited as a modern marvel of the golfing world.", overnight: "The Farm at Cape Kidnappers", highlights: ["6,000-acre station tour", "Tom Doak golf course", "Kiwi conservation walk"] },
      { day: 10, title: "To the Southern Alps", description: "Fly to Queenstown and transfer through the historic wine country of Bannockburn to the stunning Lindis Lodge — an architectural masterpiece that breathes with the landscape, blurring the lines between rugged high-country wilderness and world-class luxury.", overnight: "The Lindis", highlights: ["Bannockburn wine country", "The Lindis — architectural sanctuary"] },
      { day: 11, title: "High Country Immersion", description: "The Lindis is your private sanctuary in the vast Ahuriri Valley. Choose from heli-hiking with the helicopter landing on your front lawn, horse trekking through pristine alpine valleys, or private art workshops inspired by the 360-degree mountain views.", overnight: "The Lindis", highlights: ["Heli-hiking from the lodge", "Horse trekking", "360° mountain views"] },
      { day: 12, title: "To the Heart of Queenstown", description: "Transfer to The Rees Hotel — luxury lakeside accommodation directly on the shores of Lake Wakatipu. Explore Queenstown's vibrant dining scene before your grand finale tomorrow.", overnight: "The Rees Hotel, Queenstown", highlights: ["Lake Wakatipu views", "Queenstown dining"] },
      { day: 13, title: "The Ultimate Fiordland Heli-Odyssey", description: "Board your private helicopter for a definitive exploration of Milford Sound and the West Coast. Soar over hanging glaciers and thundering waterfalls, land on a remote beach for a gourmet picnic, and stand atop an ancient glacier.", overnight: "The Rees Hotel, Queenstown", highlights: ["Private helicopter Milford Sound", "Remote beach picnic", "Ancient glacier landing"] },
      { day: 14, title: "Queenstown at Leisure", description: "A day for personal discovery. Ascend the Skyline Gondola, explore all Queenstown has to offer, then glide across the lake aboard the historic TSS Earnslaw steamship to Walter Peak for an unforgettable farewell.", overnight: "The Rees Hotel, Queenstown", highlights: ["TSS Earnslaw cruise", "Walter Peak", "Skyline Gondola"] },
      { day: 15, title: "Homeward Bound", description: "Your New Zealand odyssey concludes. A private transfer takes you to Queenstown Airport, carrying memories of a landscape — and a level of service — that stays with you forever.", highlights: ["Private airport transfer"] },
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
    narrative: `Embark on a sophisticated New Zealand odyssey defined by private charters, alpine helicopters, and the country's most prestigious lodges. This curated journey invites you to settle into storied properties like Huka Lodge, The Farm at Cape Kidnappers, and Wharekauhau, concluding with a lakeside sanctuary at The Rees Hotel in Queenstown.

From clay-bird shooting and private farm tours to heli-landings on age-old glaciers, every detail is designed to surpass expectation. With multi-course degustation meals included at most stays and seamless private transfers throughout, you are invited to simply sit back and savour the luxury of time.`,
    durationDays: 15,
    priceFromUsd: 0,
    regions: ["Auckland", "Taupo", "Hawke's Bay", "Wairarapa", "Christchurch", "Queenstown"],
    experienceTags: ["Luxury Lodges", "Glowworms", "Helicopter", "Farm stays", "Wine", "Glacier landing"],
    idealFor: ["First-time visitors", "Luxury seekers", "Couples"],
    seasons: ["Year-round"],
    highlights: [
      "Huka Lodge — birthplace of New Zealand luxury hospitality",
      "Private helicopter tour of Tongariro National Park",
      "Private boat charter on Lake Taupo",
      "The Farm at Cape Kidnappers — 6,000 rolling acres",
      "Wharekauhau Country Estate — 5,500-acre working sheep station",
      "Behind-the-scenes Te Papa Museum tour",
      "Akaroa harbour cruise — Hector's Dolphins and Blue Penguins",
      "Milford Sound heli-cruise-heli with glacier landing",
    ],
    inclusions: [
      "14 nights ultra-luxury accommodation across 6 iconic properties",
      "Sofitel Auckland, Huka Lodge (all meals), Cape Kidnappers (B&D), Wharekauhau (B&D), Otahuna Lodge (5-course dinner), The Rees Hotel",
      "Private airport meet & greet and all transfers",
      "Choice of bespoke Auckland excursion (Waiheke, Wildlife, Cultural, or West Coast)",
      "Private Footwhistle Glowworm Cave tour",
      "Private helicopter to Tongariro National Park with wilderness landing",
      "Private boat charter on Lake Taupo",
      "Wharekauhau Farm Tour and Martinborough winery lunch",
      "Private Te Papa behind-the-scenes tour",
      "Akaroa harbour cruise and gourmet picnic",
      "Milford Sound heli-cruise-heli with glacier landing",
      "Choice of Queenstown signature experience (Wine Tour, Routeburn Hike, or Wilderness Safari & Stargazing)",
    ],
    itinerary: [
      { day: 1, title: "Arrive Auckland", description: "Welcome to New Zealand. Private transfer to the Sofitel Viaduct Harbour in the heart of the city's premier maritime precinct. Guaranteed early check-in, with time to explore Britomart boutiques or dine at Lava Dining.", overnight: "Sofitel Auckland Viaduct Harbour", highlights: ["Private airport meet & greet", "Sofitel Viaduct Harbour"] },
      { day: 2, title: "Auckland: Your Choice of Four Tours", description: "Tailor your day with one of four privately guided excursions: Waiheke Island Gourmet (oysters, vineyards, lunch), Nocturnal Wildlife Quest (twilight kiwi spotting), Indigenous Auckland (Māori history, private Haka), or The Wild West (rugged coast, winery lunch).", overnight: "Sofitel Auckland Viaduct Harbour", highlights: ["Choice of 4 private excursions"] },
      { day: 3, title: "Auckland to Taupo via Waitomo", description: "Travel through lush farmland to the King Country. Private candlelit experience of Footwhistle Cave — glowworms, ancient Moa bones, and a cathedral lit by magnesium torch. Continue to Lake Taupo and the acclaimed Huka Lodge.", overnight: "Huka Lodge", highlights: ["Footwhistle Glowworm Cave", "Huka Lodge"] },
      { day: 4, title: "Tongariro & Lake Taupo", description: "Fly south by helicopter into the Kaimanawa wilderness to search for wild horses. Land by the Rangitikei River, then continue to the World Heritage volcanoes — Ruapehu, Tongariro, and Ngauruhoe. Later, board your private boat on Lake Taupo.", overnight: "Huka Lodge", highlights: ["Helicopter to Tongariro", "Private Lake Taupo cruise", "Wild horse search"] },
      { day: 5, title: "Day at Leisure — Huka Lodge", description: "Stay in at Huka Lodge to enjoy a day of leisure. Relax in your luxurious suite with gourmet cuisine and a bottle of local wine.", overnight: "Huka Lodge", highlights: ["Day at leisure", "Gourmet lodge dining"] },
      { day: 6, title: "Huka Lodge to Cape Kidnappers", description: "Private tour to Hawke's Bay. Discover Art Deco Napier, meet a Māori elder, and take in scenic vistas. Arrive at The Farm at Cape Kidnappers — set atop 6,000 rolling acres with panoramic Pacific views. Pre-dinner drinks, hors d'oeuvres, and multi-course dinner included.", overnight: "The Farm at Cape Kidnappers", highlights: ["Art Deco Napier", "Cape Kidnappers lodge", "Degustation dinner"] },
      { day: 7, title: "Cape Kidnappers: Estate Discovery", description: "Explore the station via Can-Am, join a Kiwi Discovery Walk, visit the spectacular Gannet colony on the coastal cliffs, or enjoy a round of golf.", overnight: "The Farm at Cape Kidnappers", highlights: ["Can-Am station tour", "Gannet colony", "Golf"] },
      { day: 8, title: "Cape Kidnappers to Wharekauhau", description: "Scenic drive to Martinborough with a boutique winery lunch and tasting. Arrive at Wharekauhau Country Estate — a grand 5,500-acre working sheep station on the edge of Palliser Bay.", overnight: "Wharekauhau Country Estate", highlights: ["Martinborough wine lunch", "Wharekauhau — 5,500-acre estate"] },
      { day: 9, title: "Wharekauhau: Farm Heritage", description: "4-wheel drive tour of the estate. See sheep shearing demonstrations and sheep dogs in action — the activities that created New Zealand's farming heritage.", overnight: "Wharekauhau Country Estate", highlights: ["4WD farm tour", "Sheep shearing", "Working farm heritage"] },
      { day: 10, title: "Wharekauhau to Christchurch", description: "Private transfer to Wellington for a behind-the-scenes tour of Te Papa, the Museum of New Zealand. Explore the rugged coastline, then fly to Christchurch for a transfer to the historic Otahuna Lodge.", overnight: "Otahuna Lodge", highlights: ["Te Papa behind-the-scenes", "Otahuna Lodge"] },
      { day: 11, title: "Akaroa & Harbour Cruise", description: "Travel to the French-influenced village of Akaroa. Board a harbour cruise to spot Hector's Dolphins, NZ Fur Seals, and Little Blue Penguins. Gourmet picnic lunch in a scenic spot before exploring Akaroa.", overnight: "Otahuna Lodge", highlights: ["Hector's Dolphins", "Akaroa harbour cruise", "Gourmet picnic"] },
      { day: 12, title: "Otahuna to Queenstown", description: "Fly to Queenstown. Your private driver escorts you to The Rees Hotel, directly on the shores of Lake Wakatipu. Floor-to-ceiling windows frame the Remarkables. Evening glass from the award-winning Bacchus wine cellar.", overnight: "The Rees Hotel, Queenstown", highlights: ["The Rees Hotel", "Lake Wakatipu views", "Bacchus wine cellar"] },
      { day: 13, title: "Milford Sound Heli-Cruise-Heli", description: "Soar over the Southern Alps by private helicopter to Milford Sound for a boutique cruise. On the return flight, stand atop an ancient glacier for an exclusive high-country landing.", overnight: "The Rees Hotel, Queenstown", highlights: ["Private helicopter", "Milford Sound cruise", "Glacier landing"] },
      { day: 14, title: "Queenstown: Your Choice of Excursion", description: "Personalise your final day: Bannockburn & Gibbston Private Gourmet Wine Tour (underground cave, vineyard lunch), Routeburn Track Guided Hike (UNESCO wilderness), or Wilderness Safari & Stargazing (jet-boating, Bob's Peak dinner, guided stargazing).", overnight: "The Rees Hotel, Queenstown", highlights: ["Choice of 3 signature experiences"] },
      { day: 15, title: "Homeward Bound", description: "Your journey concludes as a private transfer takes you to Queenstown Airport.", highlights: ["Private airport transfer"] },
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
