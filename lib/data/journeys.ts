import type { ItineraryDay, LocationGroup } from "@/lib/data/itinerary-types";

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
  /** Location groups for the itinerary refiner — journeys without this show the static accordion */
  locationGroups?: LocationGroup[];
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
      "Kauri Cliffs, Park Hyatt, Huka Lodge, Cape Kidnappers, The Lindis, Matakauri Lodge — all meals at lodges included",
      "Private 'Meet & Greet' airport transfers throughout",
      "Dedicated professional Driver/Guide and private vehicle",
      "Choice of bespoke Auckland excursion (Waiheke, Wildlife, Cultural, or West Coast)",
      "Private helicopter to Mt Tarawera and Orakei Korako geothermal valley",
      "Private sailing charter on Lake Rotoiti",
      "Private Milford Sound heli-odyssey with glacier landing",
    ],
    itinerary: [
      { day: 1, title: "Arrival & The Bay of Islands", description: "Touch down in Auckland and connect to Kerikeri. Your private chauffeur awaits to whisk you to The Lodge at Kauri Cliffs — a Hamptons-inspired sanctuary set upon 6,000 acres of coastal estate with sweeping Pacific views and world-renowned championship golf.", overnight: "The Lodge at Kauri Cliffs", highlights: ["Private airport meet & greet", "Kauri Cliffs coastal estate"], locationGroupId: "bay-of-islands" },
      { day: 2, title: "Kauri Cliffs: Coastal Discovery", description: "A day of total immersion. Wander to the famous Pink Beach for a private gourmet BBQ, explore the working farm via quad bike, enjoy a guided nature walk through ancient kauri forests, or play a round on the world-ranked greens.", overnight: "The Lodge at Kauri Cliffs", highlights: ["Pink Beach private BBQ", "World-ranked golf", "Ancient kauri forest walk"], freedomOfChoice: ["Championship golf on the world-ranked course", "Pink Beach gourmet BBQ with estate wines", "Guided walk through ancient kauri forest", "Working farm quad bike tour"], locationGroupId: "bay-of-islands" },
      { day: 3, title: "Bay of Islands to Auckland", description: "After a final morning soak in the coastal air, transfer to Kerikeri for your flight to Auckland. Check into the Park Hyatt Auckland — a refined waterfront sanctuary in the heart of the Viaduct. Browse Commercial Bay and Britomart, or head to the water.", overnight: "Park Hyatt Auckland", highlights: ["Kerikeri scenic flight", "Park Hyatt Auckland"], locationGroupId: "auckland" },
      { day: 4, title: "Auckland: Bespoke Urban Experiences", description: "Tailor your day with one of four privately guided excursions: Waiheke Island Gourmet (oysters, vineyards, lunch), Nocturnal Wildlife Quest (twilight kiwi spotting), Indigenous Auckland (Māori history, private Haka), or The Wild West (rugged coast, winery lunch).", overnight: "Park Hyatt Auckland", highlights: ["Choice of 4 private excursions", "Waiheke Island or West Coast"], locationGroupId: "auckland" },
      { day: 5, title: "The Glowworm Labyrinth to Huka Lodge", description: "Travel through rolling Waikato pastures to Waitomo. Descend into a silent, subterranean world of glowworm-lit caves before continuing to the legendary Huka Lodge — the birthplace of New Zealand luxury hospitality, nestled on the banks of the turquoise Waikato River.", overnight: "Huka Lodge", highlights: ["Footwhistle Glowworm Cave", "Huka Lodge — birthplace of NZ luxury"], locationGroupId: "taupo" },
      { day: 6, title: "Peaks, Springs & Private Sails", description: "A day of 'Fire and Water.' Private helicopter to the summit of Mt Tarawera, followed by an aerial tour of steaming geothermal valleys. Conclude at the pier for a private sailing charter on Lake Rotoiti — soak in hidden lakeside thermal pools and fish for rainbow trout.", overnight: "Huka Lodge", highlights: ["Mt Tarawera helicopter summit", "Orakei Korako geothermal", "Private sailing on Lake Rotoiti"], locationGroupId: "taupo" },
      { day: 7, title: "Huka Lodge: Estate Serenity", description: "Enjoy the 'Huka way of life.' Morning on the tennis courts or yoga lawn, afternoon exploring the heritage gardens. For the adventurous, private white-water rafting or a bespoke tasting in their world-class wine cellar.", overnight: "Huka Lodge", highlights: ["Heritage gardens", "Wine cellar tasting", "Day at leisure"], freedomOfChoice: ["Private white-water rafting on the Waikato River", "Bespoke wine cellar tasting", "Tennis and yoga at leisure", "Huka Falls guided nature walk"], locationGroupId: "taupo" },
      { day: 8, title: "Over the Ranges to Cape Kidnappers", description: "Your Driver Guide takes you through the heart of Hawke's Bay — one of only 12 Great Wine Capitals of the World. Arrive at The Farm at Cape Kidnappers, where rugged clifftop architecture contrasts with rolling vineyards below. Multi-course degustation dinner to welcome you.", overnight: "The Farm at Cape Kidnappers", highlights: ["Hawke's Bay wine country", "Clifftop lodge", "Degustation dinner"], locationGroupId: "hawkes-bay" },
      { day: 9, title: "The Cape Kidnappers Experience", description: "Explore the 6,000-acre station via Can-Am, join a Kiwi discovery walk to see conservation in action, or play a round on the Tom Doak-designed course — frequently cited as a modern marvel of the golfing world.", overnight: "The Farm at Cape Kidnappers", highlights: ["6,000-acre station tour", "Tom Doak golf course", "Kiwi conservation walk"], freedomOfChoice: ["Tom Doak championship golf", "Can-Am station tour across 6,000 acres", "Kiwi conservation walk with resident ecologist", "Private Hawke's Bay wine trail"], locationGroupId: "hawkes-bay" },
      { day: 10, title: "To the Southern Alps", description: "Fly to Queenstown and transfer through the historic wine country of Bannockburn to the stunning Lindis Lodge — an architectural masterpiece that breathes with the landscape, blurring the lines between rugged high-country wilderness and world-class luxury.", overnight: "The Lindis", highlights: ["Bannockburn wine country", "The Lindis — architectural sanctuary"], locationGroupId: "ahuriri-valley" },
      { day: 11, title: "High Country Immersion", description: "The Lindis is your private sanctuary in the vast Ahuriri Valley. Choose from heli-hiking with the helicopter landing on your front lawn, horse trekking through pristine alpine valleys, or private art workshops inspired by the 360-degree mountain views.", overnight: "The Lindis", highlights: ["Heli-hiking from the lodge", "Horse trekking", "360° mountain views"], freedomOfChoice: ["Heli-hiking with a glacier landing", "Horse trekking through alpine valleys", "Private art workshop with mountain views", "Stargazing experience in the Mackenzie Dark Sky Reserve"], locationGroupId: "ahuriri-valley" },
      { day: 12, title: "To the Heart of Queenstown", description: "Transfer to Matakauri Lodge — an intimate lakeside retreat set against the dramatic backdrop of the Remarkables. Settle into your suite and explore Queenstown's vibrant dining scene before your grand finale tomorrow.", overnight: "Matakauri Lodge, Queenstown", highlights: ["Lake Wakatipu views", "Matakauri Lodge"], locationGroupId: "queenstown" },
      { day: 13, title: "The Ultimate Fiordland Heli-Odyssey", description: "Board your private helicopter for a definitive exploration of Milford Sound and the West Coast. Soar over hanging glaciers and thundering waterfalls, land on a remote beach for a gourmet picnic, and stand atop an ancient glacier.", overnight: "Matakauri Lodge, Queenstown", highlights: ["Private helicopter Milford Sound", "Remote beach picnic", "Ancient glacier landing"], locationGroupId: "queenstown" },
      { day: 14, title: "Queenstown at Leisure", description: "A day for personal discovery. Ascend the Skyline Gondola, explore all Queenstown has to offer, then glide across the lake aboard the historic TSS Earnslaw steamship to Walter Peak for an unforgettable farewell.", overnight: "Matakauri Lodge, Queenstown", highlights: ["TSS Earnslaw cruise", "Walter Peak", "Skyline Gondola"], freedomOfChoice: ["TSS Earnslaw steamship cruise to Walter Peak", "Skyline Gondola and luge", "Queenstown wine trail through Gibbston Valley", "Jet boat on the Shotover River", "Spa afternoon at Matakauri Lodge"], locationGroupId: "queenstown" },
      { day: 15, title: "Homeward Bound", description: "Your New Zealand odyssey concludes. A private transfer takes you to Queenstown Airport, carrying memories of a landscape — and a level of service — that stays with you forever.", highlights: ["Private airport transfer"] },
    ],
    locationGroups: [
      { id: "bay-of-islands", label: "Bay of Islands", dayStart: 1, dayEnd: 2, minDays: 1, maxDays: 4, accommodation: "The Lodge at Kauri Cliffs" },
      { id: "auckland", label: "Auckland", dayStart: 3, dayEnd: 4, minDays: 1, maxDays: 3, accommodation: "Park Hyatt Auckland" },
      { id: "taupo", label: "Taupo", dayStart: 5, dayEnd: 7, minDays: 2, maxDays: 5, accommodation: "Huka Lodge" },
      { id: "hawkes-bay", label: "Hawke's Bay", dayStart: 8, dayEnd: 9, minDays: 1, maxDays: 4, accommodation: "The Farm at Cape Kidnappers" },
      { id: "ahuriri-valley", label: "Ahuriri Valley", dayStart: 10, dayEnd: 11, minDays: 1, maxDays: 4, accommodation: "The Lindis" },
      { id: "queenstown", label: "Queenstown", dayStart: 12, dayEnd: 14, minDays: 2, maxDays: 5, accommodation: "Matakauri Lodge, Queenstown" },
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
    narrative: `Immerse yourself in the raw majesty of Aotearoa. We have meticulously handpicked New Zealand's most prestigious estates, dramatic alpine vistas, and hidden geothermal wonders to create an effortless, high-end expedition. From the jagged peaks of the South Island to the spiritual heart of the North, this is more than a tour — it is a bespoke immersion into the soul of the South Pacific.`,
    durationDays: 10,
    priceFromUsd: 0,
    regions: ["Queenstown", "Ahuriri Valley", "Rotorua", "Auckland"],
    experienceTags: [
      "Milford Sound heli-cruise",
      "Geothermal",
      "Glowworms",
      "Wine",
      "Glacier landing",
    ],
    idealFor: ["Couples", "Luxury seekers", "Culture enthusiasts"],
    seasons: ["Year-round"],
    highlights: [
      "Milford Sound heli-cruise with glacier landing",
      "The Lindis — architectural sanctuary in the Ahuriri Valley",
      "Solitaire Lodge — lakeside retreat on Lake Tarawera",
      "Wai-O-Tapu & Waimangu geothermal exploration",
      "Footwhistle Glowworm Cave — candlelit private tour",
      "Choice of bespoke excursions in Queenstown and Auckland",
    ],
    inclusions: [
      "9 nights ultra-luxury accommodation across 4 iconic properties",
      "Matakauri Lodge (all meals), The Lindis (all meals), Solitaire Lodge (all meals), Park Hyatt Auckland (breakfast)",
      "Milford Sound private heli-cruise with glacier landing",
      "Choice of bespoke Queenstown excursion (Wine Tour, Routeburn Hike, or Wilderness Safari)",
      "Privately guided Wai-O-Tapu & Waimangu geothermal tour",
      "Private Footwhistle Glowworm Cave exploration",
      "Choice of bespoke Auckland excursion (Waiheke, Wildlife, Cultural, or West Coast)",
      "All private airport transfers and inter-regional chauffeur services",
    ],
    itinerary: [
      { day: 1, title: "Arrival in the Adventure Capital", description: "Welcome to Queenstown. Your private specialist guide escorts you to Matakauri Lodge, an intimate lakeside retreat set against the dramatic backdrop of the Remarkables. Settle into your suite where floor-to-ceiling glass frames the shifting hues of Lake Wakatipu. We suggest a vintage from the lodge's curated cellar.", overnight: "Matakauri Lodge, Queenstown", highlights: ["Private airport transfer", "Matakauri Lodge", "Lake Wakatipu views"] },
      { day: 2, title: "Milford Sound — A Study in Scale", description: "Begin with a majestic aerial traverse of the Southern Alps, trading Queenstown's peaks for the mist-veiled rainforests and towering falls of Fiordland. After a private escort to your intimate cruise, navigate deep waters beneath sheer granite cliffs. The journey's crescendo? A remote helicopter landing on a prehistoric glacier.", overnight: "Matakauri Lodge, Queenstown", highlights: ["Private helicopter over Southern Alps", "Milford Sound cruise", "Prehistoric glacier landing"] },
      { day: 3, title: "Queenstown: Bespoke Discovery", description: "Personalise your day: Gourmet Viticulture (Bannockburn & Gibbston estates, underground wine cave, vineyard lunch), The Great Walk (privately guided Routeburn Track), or High-Octane & High-Altitude (Dart River jet-boat safari, dinner and stargazing at Bob's Peak).", overnight: "Matakauri Lodge, Queenstown", highlights: ["Choice of 3 signature experiences"] },
      { day: 4, title: "To the Southern Alps & The Lindis", description: "Travel deeper into the Southern Alps to The Lindis — an architectural masterpiece that breathes with the landscape, blurring the lines between rugged high-country wilderness and world-class luxury.", overnight: "The Lindis", highlights: ["The Lindis — architectural sanctuary", "Ahuriri Valley"] },
      { day: 5, title: "High Country Immersion", description: "The Lindis is your private sanctuary nestled within the vast Ahuriri Valley. Choose from heli-hiking with the helicopter landing on your front lawn, horse trekking through pristine alpine valleys, or private art workshops inspired by 360-degree mountain views.", overnight: "The Lindis", highlights: ["Heli-hiking from the lodge", "Horse trekking", "Art workshops"] },
      { day: 6, title: "Mackenzie Country to Rotorua", description: "Traverse the golden Mackenzie Country with curated lunch at the Dark Sky Project. Pause in charming Geraldine, sweep through Lord of the Rings landscapes, then fly from Christchurch to the geothermal heart of Rotorua. Arrive at Solitaire Lodge on Lake Tarawera — 180-degree panoramas and the silhouette of Mt Tarawera.", overnight: "Solitaire Lodge, Rotorua", highlights: ["Dark Sky Project lunch", "Christchurch to Rotorua flight", "Solitaire Lodge on Lake Tarawera"] },
      { day: 7, title: "Primal Earth: Wai-O-Tapu & Waimangu", description: "A day dedicated to Rotorua's volcanic grandeur. With an expert naturalist, witness the surreal hues of Wai-O-Tapu's thermal springs and the prehistoric beauty of the Waimangu Volcanic Valley. Traverse exotic forests and volcanic craters for an insider's perspective on the seismic forces that shaped New Zealand.", overnight: "Solitaire Lodge, Rotorua", highlights: ["Wai-O-Tapu thermal springs", "Waimangu Volcanic Valley", "Expert naturalist guide"] },
      { day: 8, title: "Subterranean Stars & Auckland", description: "Traverse emerald pastures to Waitomo for an intimate Footwhistle Cave exploration — candlelit path through ancient limestone, glowing titiwai, Moa bones, and the Cathedral cavern revealed by magnesium torch. Continue to Auckland and the Park Hyatt Auckland.", overnight: "Park Hyatt Auckland", highlights: ["Footwhistle Glowworm Cave", "Park Hyatt Auckland"] },
      { day: 9, title: "Auckland: Bespoke Urban Curations", description: "Tailor your final day: Waiheke Gourmet (oyster tastings, vineyard lunch), Nocturnal Wildlife Quest (twilight kiwi spotting), Indigenous Auckland (Māori history, private Haka), or The Wild West (rugged black-sand beaches, winery lunch).", overnight: "Park Hyatt Auckland", highlights: ["Choice of 4 private excursions"] },
      { day: 10, title: "A Journey to Carry With You", description: "As your odyssey draws to a close, you carry with you the lingering notes of world-class vintages and the quiet echoes of the wilderness. A private chauffeur escorts you to the airport.", highlights: ["Private airport transfer"] },
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
        title: "Scenic Flight to Aoraki",
        description:
          "Board a scenic flight across the Southern Alps, soaring over ice fields and towering peaks before landing at Aoraki / Mount Cook. The aerial perspective transforms the journey from coast to alpine grandeur into an unforgettable experience.",
        overnight: "The Hermitage, Aoraki / Mount Cook",
        highlights: ["Scenic flight across the Southern Alps", "Landing at Mt Cook"],
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
          "Scenic flight from Mt Cook to Te Anau, soaring over the Mackenzie Country and into the heart of Fiordland. Afternoon visit to the Te Anau Glowworm Caves — a magical underground world accessible only by boat.",
        overnight: "Cabot Lodge, Manapouri",
        highlights: ["Scenic flight Mt Cook to Te Anau", "Te Anau Glowworm Caves"],
      },
      {
        day: 10,
        title: "Milford Sound kayaking",
        description:
          "Drive the spectacular Milford Road. Full-day guided kayaking in Milford Sound — paddle beneath waterfalls, alongside dolphins, and under the gaze of Mitre Peak.",
        overnight: "Cabot Lodge, Manapouri",
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
    narrative: `Embark on a sophisticated New Zealand odyssey defined by private charters, alpine helicopters, and the country's most prestigious lodges. This curated journey invites you to settle into storied properties like Huka Lodge, The Farm at Cape Kidnappers, and Wharekauhau, concluding with a lakeside sanctuary at Matakauri Lodge in Queenstown.

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
      "Park Hyatt Auckland, Huka Lodge (all meals), Cape Kidnappers (B&D), Wharekauhau (B&D), Otahuna Lodge (5-course dinner), Matakauri Lodge (B&D)",
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
      { day: 1, title: "Arrive Auckland", description: "Welcome to New Zealand. Private transfer to the Park Hyatt Auckland, a refined waterfront sanctuary in the heart of the city's premier maritime precinct. Guaranteed early check-in, with time to explore Britomart boutiques or dine at the waterfront.", overnight: "Park Hyatt Auckland", highlights: ["Private airport meet & greet", "Park Hyatt Auckland"] },
      { day: 2, title: "Auckland: Your Choice of Four Tours", description: "Tailor your day with one of four privately guided excursions: Waiheke Island Gourmet (oysters, vineyards, lunch), Nocturnal Wildlife Quest (twilight kiwi spotting), Indigenous Auckland (Māori history, private Haka), or The Wild West (rugged coast, winery lunch).", overnight: "Park Hyatt Auckland", highlights: ["Choice of 4 private excursions"] },
      { day: 3, title: "Auckland to Taupo via Waitomo", description: "Travel through lush farmland to the King Country. Private candlelit experience of Footwhistle Cave — glowworms, ancient Moa bones, and a cathedral lit by magnesium torch. Continue to Lake Taupo and the acclaimed Huka Lodge.", overnight: "Huka Lodge", highlights: ["Footwhistle Glowworm Cave", "Huka Lodge"] },
      { day: 4, title: "Tongariro & Lake Taupo", description: "Fly south by helicopter into the Kaimanawa wilderness to search for wild horses. Land by the Rangitikei River, then continue to the World Heritage volcanoes — Ruapehu, Tongariro, and Ngauruhoe. Later, board your private boat on Lake Taupo.", overnight: "Huka Lodge", highlights: ["Helicopter to Tongariro", "Private Lake Taupo cruise", "Wild horse search"] },
      { day: 5, title: "Day at Leisure — Huka Lodge", description: "Stay in at Huka Lodge to enjoy a day of leisure. Relax in your luxurious suite with gourmet cuisine and a bottle of local wine.", overnight: "Huka Lodge", highlights: ["Day at leisure", "Gourmet lodge dining"] },
      { day: 6, title: "Huka Lodge to Cape Kidnappers", description: "Private tour to Hawke's Bay. Discover Art Deco Napier, meet a Māori elder, and take in scenic vistas. Arrive at The Farm at Cape Kidnappers — set atop 6,000 rolling acres with panoramic Pacific views. Pre-dinner drinks, hors d'oeuvres, and multi-course dinner included.", overnight: "The Farm at Cape Kidnappers", highlights: ["Art Deco Napier", "Cape Kidnappers lodge", "Degustation dinner"] },
      { day: 7, title: "Cape Kidnappers: Estate Discovery", description: "Explore the station via Can-Am, join a Kiwi Discovery Walk, visit the spectacular Gannet colony on the coastal cliffs, or enjoy a round of golf.", overnight: "The Farm at Cape Kidnappers", highlights: ["Can-Am station tour", "Gannet colony", "Golf"] },
      { day: 8, title: "Cape Kidnappers to Wharekauhau", description: "Scenic drive to Martinborough with a boutique winery lunch and tasting. Arrive at Wharekauhau Country Estate — a grand 5,500-acre working sheep station on the edge of Palliser Bay.", overnight: "Wharekauhau Country Estate", highlights: ["Martinborough wine lunch", "Wharekauhau — 5,500-acre estate"] },
      { day: 9, title: "Wharekauhau: Farm Heritage", description: "4-wheel drive tour of the estate. See sheep shearing demonstrations and sheep dogs in action — the activities that created New Zealand's farming heritage.", overnight: "Wharekauhau Country Estate", highlights: ["4WD farm tour", "Sheep shearing", "Working farm heritage"] },
      { day: 10, title: "Wharekauhau to Christchurch", description: "Private transfer to Wellington for a behind-the-scenes tour of Te Papa, the Museum of New Zealand. Explore the rugged coastline, then fly to Christchurch for a transfer to the historic Otahuna Lodge.", overnight: "Otahuna Lodge", highlights: ["Te Papa behind-the-scenes", "Otahuna Lodge"] },
      { day: 11, title: "Akaroa & Harbour Cruise", description: "Travel to the French-influenced village of Akaroa. Board a harbour cruise to spot Hector's Dolphins, NZ Fur Seals, and Little Blue Penguins. Gourmet picnic lunch in a scenic spot before exploring Akaroa.", overnight: "Otahuna Lodge", highlights: ["Hector's Dolphins", "Akaroa harbour cruise", "Gourmet picnic"] },
      { day: 12, title: "Otahuna to Queenstown", description: "Fly to Queenstown. Your private driver escorts you to Matakauri Lodge, an intimate lakeside retreat set against the dramatic backdrop of the Remarkables. Floor-to-ceiling windows frame Lake Wakatipu. Settle in and savour the evening.", overnight: "Matakauri Lodge, Queenstown", highlights: ["Matakauri Lodge", "Lake Wakatipu views"] },
      { day: 13, title: "Milford Sound Heli-Cruise-Heli", description: "Soar over the Southern Alps by private helicopter to Milford Sound for a boutique cruise. On the return flight, stand atop an ancient glacier for an exclusive high-country landing.", overnight: "Matakauri Lodge, Queenstown", highlights: ["Private helicopter", "Milford Sound cruise", "Glacier landing"] },
      { day: 14, title: "Queenstown: Your Choice of Excursion", description: "Personalise your final day: Bannockburn & Gibbston Private Gourmet Wine Tour (underground cave, vineyard lunch), Routeburn Track Guided Hike (UNESCO wilderness), or Wilderness Safari & Stargazing (jet-boating, Bob's Peak dinner, guided stargazing).", overnight: "Matakauri Lodge, Queenstown", highlights: ["Choice of 3 signature experiences"] },
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
    title: "The Hidden Trail of Luxury New Zealand",
    tagline:
      "Immerse yourself in the best culinary, scenic and immersive experiences New Zealand has to offer. From subtropical Bay of Islands to alpine Queenstown, via hidden geothermal wonders and the golden shores of Abel Tasman.",
    narrative: `On this luxury New Zealand tour, you immerse yourself in some of the best culinary, scenic and immersive experiences and accommodation within New Zealand. From the subtropical elegance of the Bay of Islands to the golden beaches of Abel Tasman and the dramatic alpine peaks of Queenstown, this journey reveals the breadth and depth of New Zealand's finest offerings.

Private sailing charters in the Bay of Islands and Abel Tasman, a helicopter summit of Mt Tarawera, and the Great Fiordland Heli-Odyssey with glacier landing — every day is crafted to exceed expectation. Stay at hand-picked properties from Eagles Nest to Huka Lodge, with bespoke urban experiences in Auckland tailored to your passions.

This is a journey for those who want to experience the very best of both islands, with the luxury of time and the expertise of local guides at every turn.`,
    durationDays: 15,
    priceFromUsd: 0,
    regions: ["Bay of Islands", "Auckland", "Taupo", "Nelson", "Queenstown"],
    experienceTags: ["Private sailing", "Helicopter", "Geothermal", "Wine", "Glacier landing", "Abel Tasman"],
    idealFor: ["Luxury seekers", "Couples", "Discerning travellers"],
    seasons: ["Year-round"],
    highlights: [
      "Private sailing charter in the Bay of Islands",
      "Eagles Nest — subtropical luxury retreat, Russell",
      "Huka Lodge — birthplace of New Zealand luxury hospitality",
      "Private helicopter to Mt Tarawera summit and geothermal valleys",
      "Private sailing charter on Lake Rotoiti with thermal hot pools",
      "Private sailing charter in Abel Tasman National Park",
      "The Great Fiordland Heli-Odyssey with glacier landing and gourmet picnic",
    ],
    inclusions: [
      "14 nights luxury accommodation across 5 iconic properties",
      "Eagles Nest, Russell — 3 nights (gourmet continental breakfast, pre-dinner drinks and canapés)",
      "Sofitel Viaduct Harbour, Auckland — 2 nights (breakfast)",
      "Huka Lodge, Taupo — 3 nights (breakfast, pre-dinner drinks with canapés and five-course dinner)",
      "The Waters Hotel, Nelson — 3 nights (breakfast and dinner)",
      "The Rees Hotel, Queenstown — 3 nights (breakfast and dinner)",
      "Private day sailing charter in Bay of Islands with gourmet lunch and beverages",
      "Auckland 'Tailored for You' excursion: choice of Waiheke Island Gourmet, Nocturnal Wildlife Quest, Indigenous Auckland, or The Wild West",
      "Private guided Footwhistle Glowworm Cave tour, Waitomo",
      "Fire & Water Odyssey: private helicopter to Mt Tarawera and Orakei Korako, private sailing charter on Lake Rotoiti",
      "Private charter cruise in Abel Tasman National Park (gourmet lunch, kayaks, snorkelling gear included)",
      "The Great Fiordland Heli-Odyssey: private helicopter to Milford Sound with remote beach landing and glacier landing with gourmet picnic",
      "All private airport transfers and inter-regional chauffeur services",
    ],
    itinerary: [
      { day: 1, title: "Bay of Islands — Arrival", description: "Welcome to New Zealand! A short transfer to the domestic airport before your quick flight into Kerikeri. Your Driver/Guide will transfer you to your luxury retreat in the Bay of Islands. Your home for the next three nights is a magnificent suite at Eagles Nest with ocean views and a spacious private balcony. Large windows open to the sea and subtropical landscapes. Relax in your villa this evening with the township of Russell close by for dining.", overnight: "Eagles Nest, Russell", highlights: ["Private airport transfer", "Eagles Nest luxury retreat", "Bay of Islands views"] },
      { day: 2, title: "Private Sailing Charter in Bay of Islands", description: "Experience the Bay of Islands like a local with a private sailing charter. Cruise between the islands on a spacious yacht purpose-built for day sailing. Help set and trim the sails, relax on the decks, watch for penguins and ocean birds, and enjoy a delicious BBQ lunch onboard. You might even spot dolphins swimming alongside the yacht.", overnight: "Eagles Nest, Russell", highlights: ["Private sailing charter", "BBQ lunch onboard", "Dolphin spotting"] },
      { day: 3, title: "Bay of Islands Discovery", description: "Today you can enjoy an amazing helicopter excursion, and your Driver/Guide will help you immerse in the deep local history and Māori culture whilst exploring the excellent interactive museum at the Waitangi Treaty Grounds.", overnight: "Eagles Nest, Russell", highlights: ["Helicopter excursion", "Waitangi Treaty Grounds", "Māori cultural immersion"] },
      { day: 4, title: "Bay of Islands to Auckland", description: "After a final morning soak in the coastal air, transfer to Kerikeri for your flight back to Auckland. Upon landing, a private driver will meet you for a short sights tour before you transfer into the city's premier maritime precinct. Check into the Sofitel Auckland Viaduct Harbour, a landmark of French 'Art de Vivre' overlooking the shimmering marina. Browse the boutiques of Commercial Bay and Britomart, or head to the water.", overnight: "Sofitel Auckland Viaduct Harbour", highlights: ["Kerikeri scenic flight", "Auckland sights tour", "Sofitel Viaduct Harbour"] },
      { day: 5, title: "Auckland: Bespoke Urban Experiences", description: "Tailor your day with one of four privately guided excursions: Waiheke Island Gourmet (oysters, vineyards, lunch), Nocturnal Wildlife Quest (twilight kiwi spotting), Indigenous Auckland (Māori history, private Haka), or The Wild West (rugged West Coast beaches, winery lunch).", overnight: "Sofitel Auckland Viaduct Harbour", highlights: ["Choice of 4 private excursions", "Waiheke Island or West Coast"] },
      { day: 6, title: "The Glowworm Labyrinth to Huka Lodge", description: "Your professional Driver/Guide will seamlessly guide you through the delights of today. Pass through the rolling green pastures of the Waikato to Waitomo. Descend into a silent, subterranean world of glowworm-lit caves before continuing to the legendary Huka Lodge — the birthplace of New Zealand luxury hospitality, nestled on the banks of the turquoise Waikato River.", overnight: "Huka Lodge", highlights: ["Footwhistle Glowworm Cave", "Huka Lodge — birthplace of NZ luxury"] },
      { day: 7, title: "Peaks, Springs & Private Sails", description: "A day of 'Fire and Water.' Private helicopter to the summit of Mt Tarawera, followed by an aerial tour of steaming geothermal valleys. Your flight concludes at the pier, where you board a private sailing charter on Lake Rotoiti. Soak in hidden lakeside thermal pools and fish for rainbow trout as your crew shares the legends of the local Iwi.", overnight: "Huka Lodge", highlights: ["Mt Tarawera helicopter summit", "Orakei Korako geothermal", "Private sailing on Lake Rotoiti"] },
      { day: 8, title: "Huka Lodge: Estate Serenity", description: "Enjoy the 'Huka way of life.' Spend your morning on the tennis courts or the yoga lawn, and your afternoon exploring the heritage gardens. For the adventurous, the lodge can arrange private white-water rafting or a bespoke tasting in their world-class wine cellar.", overnight: "Huka Lodge", highlights: ["Heritage gardens", "Wine cellar tasting", "Day at leisure"] },
      { day: 9, title: "Taupo to Nelson", description: "After your short transfer to the airport, fly to Nelson — the sheltered oasis at the top of the South Island. Upon arrival, make the short drive to your accommodation at The Waters Hotel, a special property located on the edge of Abel Tasman National Park adjacent to the Windhover estate.", overnight: "The Waters Hotel, Nelson", highlights: ["Flight to Nelson", "The Waters Hotel", "Abel Tasman gateway"] },
      { day: 10, title: "Private Sailing Charter in Abel Tasman", description: "Experience the sunny beaches of Abel Tasman National Park aboard a private charter. Explore golden sandy beaches, watch dolphins and New Zealand fur seals, and cruise past the famous Split Apple Rock. Pull into a sheltered bay for a delicious lunch. Swim, sea kayak, go ashore for a bush walk, or simply relax on the boat.", overnight: "The Waters Hotel, Nelson", highlights: ["Private sailing charter", "Abel Tasman beaches", "Dolphins and fur seals"] },
      { day: 11, title: "Nelson Day at Leisure", description: "Today is at leisure to enjoy the local sights. The Nelson region is known for being one of the sunniest spots in New Zealand, home to a thriving arts and crafts community where locals enjoy a relaxed, easy-going lifestyle. Explore boutique wineries, breweries, golden beaches, and sheltered mountain ranges.", overnight: "The Waters Hotel, Nelson", highlights: ["Nelson arts scene", "Boutique wineries", "Day at leisure"] },
      { day: 12, title: "Nelson to Queenstown", description: "Your Driver/Guide drops you at the airport for the flight to Queenstown, your final and most exciting adventure destination. Enjoy a scenic transfer into the bustling alpine town and ready yourself for breathtaking views of Lake Wakatipu and the Remarkables. Your home for the next three nights is The Rees Hotel, an elegant boutique hotel with an enviable lakeside location.", overnight: "The Rees Hotel, Queenstown", highlights: ["Flight to Queenstown", "Lake Wakatipu views", "The Rees Hotel"] },
      { day: 13, title: "The Great Fiordland Heli-Odyssey", description: "Explore the natural beauty of Queenstown, Fiordland, and the rugged West Coast from the luxurious vantage point of a helicopter. See dramatic mountain peaks, rushing waterfalls, crystal-clear lakes, and ancient glaciers. Visit a fur seal colony, enjoy a gourmet picnic at a remote mountaintop location, and land on an ancient glacier. The best way to experience the South Island's stunning scenery.", overnight: "The Rees Hotel, Queenstown", highlights: ["Private helicopter Milford Sound", "Remote gourmet picnic", "Ancient glacier landing", "Fur seal colony"] },
      { day: 14, title: "Queenstown Day at Leisure", description: "Your final day in New Zealand is yours to spend however you please. Enjoy a scenic stroll along the lakefront, discover the lively restaurants and bars in town, or simply relax and soak up the views from your hotel.", overnight: "The Rees Hotel, Queenstown", highlights: ["Queenstown at leisure", "Lakefront dining"] },
      { day: 15, title: "Depart Queenstown", description: "Your incredible New Zealand adventure comes to an end today as we transfer you to the airport to begin the journey home.", highlights: ["Private airport transfer"] },
    ],
    images: [
      { src: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80", alt: "Bay of Islands sailing" },
      { src: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80", alt: "Abel Tasman golden beaches" },
    ],
    heroImage: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1920&q=80",
    testimonial: {
      quote: "The Hidden Trail showed us a New Zealand we didn't know existed. The sailing in Abel Tasman and the helicopter over Milford Sound were life-changing.",
      author: "Richard & Anne Chambers",
      location: "Boston, MA",
    },
  },
  {
    slug: "the-southern-heart",
    title: "The Southern Heart",
    tagline:
      "The Heart of New Zealand is the South Island with its extreme scenery. From the wild blue sea of Kaikoura to heli-hiking at Franz Josef Glacier and big-sky stargazing at Mount Cook — a feast of experiences in a land forgotten by time.",
    narrative: `This New Zealand South Island tour holds sights you'll be in awe of, with so much diversity and beauty. Kaikoura with its wild and deep blue sea, the majestic Southern Alps contrasted by a Marlborough wine and food experience, heli-hiking at Franz Josef Glacier, big-sky stargazing at Mount Cook — all in amongst a feast of experiences and sights.

Get alongside the wildlife, enjoy world-class wine and food, and take in the ever-varied scenery of this land forgotten by time. You will cover the most amazing parts of the South Island and live a lifetime of scenery on this tour. A dedicated Driver/Guide accompanies you throughout, sharing local knowledge and ensuring every day unfolds seamlessly.`,
    durationDays: 14,
    priceFromUsd: 0,
    regions: ["Christchurch", "Kaikoura", "Marlborough", "Nelson", "West Coast", "Franz Josef", "Wanaka", "Queenstown", "Aoraki / Mount Cook"],
    experienceTags: ["Wildlife", "Wine", "Glacier", "Scenic driving", "Stargazing", "Coastal"],
    idealFor: ["First-time visitors", "Touring couples", "Nature lovers"],
    seasons: ["Year-round"],
    highlights: [
      "Kaikoura wildlife encounter — seals, dolphins, or whale watching",
      "Marlborough wine tasting and Sounds seafood cruise",
      "Abel Tasman National Park bush and beach cruise",
      "Punakaiki Pancake Rocks and blowholes",
      "Franz Josef Glacier heli-hike or guided walk",
      "Rippon Estate wine tasting on Lake Wanaka",
      "Choice of Queenstown excursion: Milford Sound, wine tour, farm excursion, or wilderness safari",
      "Big Sky Stargazing at Aoraki / Mount Cook",
    ],
    inclusions: [
      "13 nights accommodation across 9 hand-picked properties",
      "Hotel Montreal, Christchurch — 1 night (breakfast)",
      "Sudima Kaikoura — 1 night (breakfast)",
      "Chateau Marlborough, Blenheim — 2 nights (breakfast)",
      "The Waters, Nelson — 2 nights (continental breakfast and bottle of wine)",
      "Punakaiki Resort — 1 night (breakfast)",
      "Te Waonui Forest Retreat, Franz Josef — 2 nights (dinner first night, full breakfast daily)",
      "Edgewater Hotel, Wanaka — 1 night (breakfast)",
      "The Rees Hotel, Queenstown — 2 nights (breakfast)",
      "The Hermitage, Mount Cook — 1 night (breakfast)",
      "Dedicated Driver/Guide for the duration of the programme",
      "In Kaikoura: choice of Swimming with the Seals, Dolphin Encounter, or Whale Watching Cruise",
      "Full-day Marlborough Tour and Seafood Cruise",
      "Abel Tasman National Park bush and beach cruise",
      "In Queenstown: choice of Milford Sound coach/cruise, Boutique Wine Tour, Walter Peak farm excursion and Shotover Jet, or Wilderness Safari jet-boat and forest walk",
      "Evening Big Sky Stargazing at Aoraki / Mount Cook",
    ],
    itinerary: [
      { day: 1, title: "Arrive Christchurch", description: "Welcome to New Zealand! Upon arrival in Christchurch, your Driver/Guide will collect you and after a brief city sights tour drop you at your hotel. Christchurch is a beautiful city, rebuilt, compact and easy to explore — dissected by a beautiful river, full of nature and a friendly, vibrant atmosphere.", overnight: "Hotel Montreal, Christchurch", highlights: ["Driver/Guide welcome", "Christchurch city sights"] },
      { day: 2, title: "Christchurch to Kaikoura", description: "Your Driver/Guide takes you through the reconstructed coastal road to the beautiful coastal town of Kaikoura, where mountains tower behind the town and seem to blend into the sea. Later today, choose from three excursions: Swimming with the Seals, a Dolphin Encounter, or a Whale Watching Cruise.", overnight: "Sudima Kaikoura", highlights: ["Coastal road drive", "Choice of marine wildlife excursion"] },
      { day: 3, title: "Kaikoura to Blenheim", description: "Depart the marine playground of Kaikoura and take an amazing jaw-dropping coastal train north through contrasting landscapes to wine country. Continue on to Blenheim. Spend the afternoon relaxing and enjoying the on-site winery and the famous Harvest Restaurant. Blenheim sits in amongst some of the most spectacular wine country in New Zealand.", overnight: "Chateau Marlborough, Blenheim", highlights: ["Coastal train journey", "Harvest Restaurant", "Marlborough wine country"] },
      { day: 4, title: "Marlborough Tour & Cruise", description: "Marlborough is world famous for the wine region and the Marlborough Sounds. Enjoy both on the Marlborough Icons Tour — two fine wine experiences with lunch at leisure on the waterfront of the Sounds. In the afternoon, board a unique Seafood Cruise to learn about seafood farming, take in stunning scenery, and enjoy fresh local seafood with a glass of award-winning wine.", overnight: "Chateau Marlborough, Blenheim", highlights: ["Marlborough wine tasting", "Seafood Cruise", "Marlborough Sounds"] },
      { day: 5, title: "Blenheim to Nelson via Queen Charlotte Drive", description: "Your Driver/Guide takes you via the scenic Queen Charlotte Drive to Nelson. Following the coastline where a winding road fringed with native forest on one side and the Marlborough Sounds on the other offers one of New Zealand's most amazing coastal journeys. Stop in Havelock for local green-lipped mussels before transferring to your delightful Nelson accommodation.", overnight: "The Waters, Nelson", highlights: ["Queen Charlotte Drive", "Havelock mussels", "Nelson arrival"] },
      { day: 6, title: "Nelson — Abel Tasman National Park Cruise", description: "A cruise into the heart of Abel Tasman National Park awaits — a wilderness reserve widely known for its wildlife, scenery and walking tracks. Come ashore at idyllic Medlands Beach in Bark Bay and walk to the long golden-sand beach of Anchorage via Torrent Bay. The track weaves through sunny groves of mānuka and fern between breathtaking views of the granite coast and lush gullies of mature forest.", overnight: "The Waters, Nelson", highlights: ["Abel Tasman cruise", "Bark Bay to Anchorage walk", "Golden beaches"] },
      { day: 7, title: "Nelson to Punakaiki", description: "Depart Nelson and head south through Murchison, making your way to the West Coast. Option to break for the Murchison Skyline Walkway through mixed beech and podocarp forest. Enter the spectacular Buller Gorge — at Hawks Crag the road has been hacked out of solid rock. Arrive at Punakaiki for spectacular views of wild beaches and the Tasman Sea. Enjoy the unique Pancake Rocks and Blowholes.", overnight: "Punakaiki Resort", highlights: ["Buller Gorge", "Hawks Crag", "Pancake Rocks and Blowholes"] },
      { day: 8, title: "Punakaiki to Franz Josef Glacier", description: "Continue south down the West Coast, enjoying all the sights along the way. The West Coast is home to towering rainforests, mountains and glaciers, tranquil lakes and rushing rivers with a history dating back to the gold rush era of the 1860s. Arrive at Franz Josef township, with the unique glacier descending from the Southern Alps to just a few hundred metres above sea level.", overnight: "Te Waonui Forest Retreat, Franz Josef", highlights: ["West Coast scenic drive", "Gold rush heritage", "Franz Josef township"] },
      { day: 9, title: "Glacial and Rainforest Exploration", description: "Your Driver/Guide can assist with all your activities today in the Fox and Franz Josef glacier area — whether it's a guided walk up to the glacier, a heli-hike, or a flight to see both glaciers from above. After a busy day, bathe under a rainforest canopy and climb into the Glacier Hot Pools.", overnight: "Te Waonui Forest Retreat, Franz Josef", highlights: ["Glacier heli-hike or guided walk", "Fox and Franz Josef glaciers", "Glacier Hot Pools"] },
      { day: 10, title: "Franz Josef to Wanaka", description: "Depart the small Franz Josef village and continue through the remote and rugged West Coast landscape — untamed, with majestic mountain ranges, native rainforest, and wild rocky shores of the Tasman Sea. Journey over Haast Pass, the Southern Alps' southernmost pass. On the other side, enjoy the twin Lakes Hāwea and Wānaka providing a mirror image of the Alps towering behind them.", overnight: "Edgewater Hotel, Wanaka", highlights: ["Haast Pass crossing", "Lakes Hāwea and Wānaka", "Southern Alps scenery"] },
      { day: 11, title: "Wanaka to Queenstown", description: "This morning, relax and enjoy a wine-tasting experience at the lakeside Rippon Estate. Continue to explore the lakeside township of Wanaka with lunch at leisure, before travelling over the spectacular Crown Range to Queenstown. With the majestic Remarkables and Lake Wakatipu at your disposal, Queenstown earns its reputation as the adventure capital of New Zealand.", overnight: "The Rees Hotel, Queenstown", highlights: ["Rippon Estate wine tasting", "Crown Range drive", "Queenstown arrival"] },
      { day: 12, title: "Queenstown: Choice of Excursion", description: "Today you have the choice of one of four excursions: Full-Day Milford Sound Coach and Nature Cruise (with optional return flight upgrade), Half-Day Boutique Wine Tour through Central Otago wineries with platter lunch, Walter Peak High Country Farm Excursion via the TSS Earnslaw with Shotover Jet, or Half-Day Wilderness Safari with jet-boat and guided forest walk on the Dart River.", overnight: "The Rees Hotel, Queenstown", highlights: ["Choice of 4 excursions", "Milford Sound or wine tour", "TSS Earnslaw or Dart River safari"] },
      { day: 13, title: "Queenstown to Mount Cook", description: "Your Driver/Guide continues the adventure with the amazing drive through the Gibbston Valley, stopping at Kinross Winery for wine tasting, then onwards through Lindis Pass to alpine scenery at Aoraki / Mt Cook. This evening, enjoy one of New Zealand's most magnificent attractions: a Big Sky Stargazing experience unspoilt by light pollution and covered in a breathtaking blanket of stars.", overnight: "The Hermitage, Aoraki / Mount Cook", highlights: ["Gibbston Valley wine tasting", "Lindis Pass", "Big Sky Stargazing"] },
      { day: 14, title: "Mount Cook to Christchurch — Departure", description: "Today's journey takes you north through the Mackenzie Country, passing through Tekapo and the tiny Church of the Good Shepherd built of local stone and oak on the shores of Lake Tekapo. Follow the foothills of the Southern Alps into Canterbury Plains, stop in Geraldine for a café lunch, and continue to Christchurch Airport for your onward travels.", highlights: ["Church of the Good Shepherd", "Lake Tekapo", "Geraldine café lunch", "Christchurch Airport transfer"] },
    ],
    images: [
      { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", alt: "Queenstown lakeside" },
      { src: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80", alt: "Southern Alps" },
    ],
    heroImage: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1920&q=80",
    testimonial: {
      quote: "The Southern Heart gave us the South Island experience of a lifetime. From Kaikoura's wildlife to stargazing at Mount Cook — every day was a revelation.",
      author: "Lauren & Michael Torres",
      location: "Austin, TX",
    },
  },
];

export function getJourneyBySlug(slug: string): Journey | undefined {
  return JOURNEYS.find((j) => j.slug === slug);
}
