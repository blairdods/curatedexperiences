/**
 * Seed NZ research knowledge base into the content table.
 * Chunks the TNZ travel knowledge base into semantically meaningful records
 * for the concierge RAG retrieval system.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seed-nz-research.ts
 *
 * After running, embeddings are auto-generated for all new records.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

interface KnowledgeChunk {
  type: string;
  title: string;
  body: string;
  region_tags?: string[];
}

const chunks: KnowledgeChunk[] = [
  // ─── NZ Overview & Positioning ───────────────────────────────────────────

  {
    type: "destination_knowledge",
    title: "New Zealand Tourism Overview & Brand Positioning",
    body: `New Zealand (Aotearoa) is positioned as an iconic year-round destination combining breathtaking landscapes, deep cultural connections, and world-class food and wine. Tourism New Zealand's master brand campaign "100% Pure New Zealand" positions NZ as where clients can reconnect, recharge, and feel 100% themselves.

NZ tourism is a powerhouse: NZ$46.6 billion total tourism expenditure in year ended March 2025 (highest ever), NZ$18.1 billion international spend (106% of pre-COVID levels), 3.2 million overseas visitor arrivals. Tourism is NZ's second largest export earner, contributing 4.6% of GDP and employing 1 in 9 New Zealanders.

Four core brand pillars: Wild Interior (geothermal, alpine, fjords), Māori Culture (manaakitanga, kaitiakitanga — authentic, not decorative), Food & Wine (MICHELIN Guide 2026), and Conservation. The 2026 MICHELIN Guide is a major new hook for food-and-wine pitches. Qualmark is NZ's official quality assurance mark for tourism operators.

Key practical facts: English-speaking, NZD currency, no tipping culture, drives on the left, 230V Type I power. Many travellers need an NZeTA (electronic travel authority) — check entry requirements per nationality.`,
    region_tags: [],
  },

  {
    type: "destination_knowledge",
    title: "New Zealand Islands — North vs South Island Overview",
    body: `Both islands offer distinct experiences and premium itineraries typically combine both.

NORTH ISLAND: Culture, geothermal, beaches, food & wine, cities.
- Auckland: urban gateway, Waiheke Island wine/art, Hauraki Gulf, west coast beaches
- Rotorua: geothermal parks (Wai-O-Tapu, Whakarewarewa), Māori cultural experiences, mountain biking capital
- Bay of Islands / Northland: sailing, history, Cape Reinga, Manea Footprints of Kupe (Māori heritage)
- Wellington: Te Papa Museum, vibrant café/restaurant scene, Wairarapa wine day-trip
- Hawke's Bay: food & wine, art deco architecture, cycle trails
- Taupō / Tongariro: Great Lake, Tongariro Alpine Crossing (UNESCO), Wairakei geothermal

SOUTH ISLAND: Mountains, lakes, Great Walks, fjords, ski, wildlife.
- Queenstown: adventure capital, Lake Wakatipu, Gibbston Valley wines, TSS Earnslaw
- Milford Sound / Fiordland: UNESCO World Heritage fjords, cruises, the Milford Track
- Aoraki / Mount Cook: NZ's highest peak, Hooker Valley Track, Tasman Glacier
- Lake Tekapo: Mackenzie Basin, stargazing (International Dark Sky Reserve), lupins
- Marlborough: world-famous Sauvignon Blanc, Sounds, Queen Charlotte Track
- Central Otago: Pinot Noir, Otago Rail Trail, orchard landscapes
- West Coast: Franz Josef & Fox Glaciers, Hokitika, Pancake Rocks
- Dunedin & Otago Peninsula: Royal Albatross, yellow-eyed penguins, heritage Victorian architecture`,
    region_tags: [
      "Auckland",
      "Rotorua",
      "Bay of Islands",
      "Wellington",
      "Hawke's Bay",
      "Queenstown",
      "Fiordland",
      "Marlborough",
      "Central Otago",
      "West Coast",
    ],
  },

  {
    type: "destination_knowledge",
    title: "New Zealand Māori Culture & Heritage Experiences",
    body: `Māori culture is a core selling pillar for New Zealand — not an add-on but fundamental to the destination's identity. Tourism New Zealand frames NZ as "the powerful connection between people, place and culture." Brand values: manaakitanga (hospitality, generosity) and kaitiakitanga (guardianship of the land).

Key Māori cultural experiences:
- Rotorua: the heartland of Māori tourism. Te Puia (geothermal + Māori Arts & Crafts Institute), Tamaki Māori Village (hangi feast & performance), Mitai Māori Village
- Bay of Islands / Northland: Waitangi Treaty Grounds (where NZ was founded 1840), Manea Footprints of Kupe (immersive Māori heritage experience, Hokianga)
- Te Papa Tongarewa (Wellington): national museum with outstanding Māori taonga (treasures) collection
- Tūhoe / Te Urewera: deep cultural connection to the land, guided experiences in remote interior
- Whakarewarewa village (Rotorua): living Māori village, geothermal pools still in daily community use

Traditional experiences to highlight: hāngī (earth oven feast), kapa haka (song & dance performance), waka (canoe) journeys, pounamu (greenstone/jade) carving, tā moko (traditional tattooing). Use te reo Māori place names naturally in conversation (Aotearoa, Taupō, Wānaka, Ōtautahi/Christchurch).`,
    region_tags: ["Rotorua", "Bay of Islands", "Wellington"],
  },

  {
    type: "destination_knowledge",
    title: "New Zealand Food & Wine Tourism — MICHELIN Guide 2026",
    body: `New Zealand earned its place in the MICHELIN Guide for 2026 — a major validation for the food-and-wine sell. Tourism New Zealand's "Worth a Special Journey" campaign positions NZ cuisine as a world-class destination in its own right.

Top food & wine regions:
- Marlborough: world's leading Sauvignon Blanc. Cellar door trail, Marlborough Sounds seafood (green-lipped mussels, oysters), food & wine festival
- Hawke's Bay: NZ's oldest wine region. Chardonnay, Syrah, craft beer, artisan food. Art Deco architecture, East Coast beaches
- Central Otago: world's southernmost Pinot Noir. Cellar doors in Gibbston Valley, Bannockburn, Cromwell
- Waiheke Island: boutique wineries 35 minutes from Auckland by ferry. Luxury olive oil + art scene
- Wairarapa: Martinborough Pinot Noir, premium lamb, Wellington's weekend getaway
- Nelson / Tasman: NZ's sunshine capital, craft beer, artisan food, cider, seafood

Iconic food experiences: Bluff oysters (March–August, world's best), whitebait fritters (West Coast), crayfish/lobster (Kaikōura), hangi feast (Māori earth oven), kumara (sweet potato), hokey pokey ice cream. The oyster trail and cheese trail connect cellar doors, artisan producers and coastal towns.

Wellington: named a top café city globally. Vibrant restaurant scene, Cuba Street food culture, craft cocktail bars. Te Papa museum café + surrounds.`,
    region_tags: [
      "Marlborough",
      "Hawke's Bay",
      "Central Otago",
      "Waiheke Island",
      "Wairarapa",
      "Nelson",
      "Wellington",
    ],
  },

  {
    type: "destination_knowledge",
    title: "New Zealand Great Walks & Hiking — World-Class Trails",
    body: `New Zealand's Great Walks are the country's premium multi-day hiking experiences — internationally renowned and in high demand. There are 11 Great Walks across both islands.

THE GREAT WALKS (selected highlights for luxury travellers):
- Milford Track (4 days, Fiordland): "The Finest Walk in the World." 53km through fjord country. Guided option (Ultimate Hikes) with comfortable lodges — the premium choice
- Routeburn Track (3 days, Fiordland/Mt Aspiring): alpine panoramas, gourmet lodge experience via Ultimate Hikes
- Tongariro Alpine Crossing (1 day): NZ's most iconic day hike. Volcanic craters, Emerald Lakes — North Island essential
- Abel Tasman Coast Track (3–5 days): golden sand beaches, turquoise sea, water taxi access. Most accessible Great Walk
- Heaphy Track (4–6 days, Kahurangi NP): remote, diverse landscapes, can be cycled too
- Kepler Track (4 days, Te Anau/Fiordland): lake views, alpine ridge, beech forest
- Hump Ridge Track (3 days, Southland): newest Great Walk, dramatic coastal scenery

GUIDED GREAT WALKS: For premium clients, guided walks (Ultimate Hikes for Milford/Routeburn) include comfortable lodges, gourmet meals, expert guiding — a world away from the independent hut experience.

Day hikes for non-trekkers: Hooker Valley Track (Aoraki/Mt Cook), Rob Roy Glacier (Wānaka), Roys Peak (Wānaka), Queen Charlotte Track sections, Tongariro Northern Circuit.`,
    region_tags: ["Fiordland", "Nelson", "Wānaka", "Queenstown", "Tongariro"],
  },

  {
    type: "destination_knowledge",
    title: "New Zealand Wildlife & Conservation Experiences",
    body: `New Zealand's unique wildlife evolved in isolation for 80 million years, producing some of the world's rarest species. Conservation and wildlife encounters are a major draw, especially for UK, German, and American travellers.

ICONIC WILDLIFE ENCOUNTERS:
- Kiwi: NZ's national bird, nocturnal and critically endangered. Best encounters: Zealandia (Wellington), Rainbow Springs (Rotorua), Trounson Kauri Park (Northland), Stewart Island (one of few places to see in the wild)
- Royal Albatross: only mainland albatross colony in the world at Taiaroa Head, Otago Peninsula (Dunedin). Guided tours year-round
- Yellow-eyed penguin (Hoiho): one of world's rarest penguins. Otago Peninsula, Catlins, Stewart Island
- Little Blue / Fairy Penguin: daily parade at Oamaru (Victorian Precinct), Pohatu Marine Reserve
- Fur seals & sea lions: Kaikōura (whale watching capital), Otago Peninsula, Nugget Point
- Humpback & Sperm Whales: Kaikōura — year-round whale watching, helicopter + boat options
- Dolphins: Bottlenose & Dusky dolphins in Marlborough Sounds, Bay of Islands, Kaikōura

CONSERVATION SANCTUARIES:
- Zealandia (Wellington): world's first fully fenced urban ecosanctuary — kiwi, tuatara, wētā, saddleback
- Tiritiri Matangi (Auckland): open sanctuary island, stunning birdlife accessible by ferry
- Te Anau Bird Sanctuary: takahē (thought extinct for 50 years), whio/blue duck

WHALE WATCHING: Kaikōura on the South Island is internationally famous — sperm whales can be seen year-round. Helicopter + boat combo tours are a premium experience.`,
    region_tags: [
      "Dunedin",
      "Kaikōura",
      "Wellington",
      "Auckland",
      "Marlborough",
    ],
  },

  {
    type: "destination_knowledge",
    title: "New Zealand Adventure & Active Experiences",
    body: `Queenstown is the self-proclaimed "Adventure Capital of the World" but adventure activities span the whole country.

QUEENSTOWN & SURROUNDS:
- Bungy jumping: AJ Hackett — invented here in 1988. Kawarau Bridge (original), The Ledge (in town), Nevis (134m, NZ's highest)
- Skydiving: Nzone Skydive — iconic backdrop of The Remarkables
- Jet boating: Shotover Jet (world famous, through rocky canyons)
- White-water rafting: Shotover River (Grade V)
- Heli-skiing: accessing Remarkable & Harris Mountains back-country
- Mountain biking: Queenstown Bike Park (Skyline), Gibbston Valley trails

NORTH ISLAND ADVENTURE:
- Taupo Bungy (over Waikato River), skydiving over Lake Taupo
- White Island (Whakaari) volcano tours — note: active volcano, check status
- Surfing: Raglan (world-class left-hand break), Piha (wild west coast)
- Waitomo Caves: black water rafting, glowworm caves — magical underground experience

NATIONWIDE:
- Skiing: South Island (Treble Cone, Cardrona, Coronet Peak, The Remarkables, Mt Hutt — near Christchurch). North Island (Whakapapa, Tūroa on Mt Ruapehu). Season: July–September
- Scenic flights: helicopter over Milford Sound, Fox/Franz Josef glaciers, Aoraki/Mt Cook (glacier landing)
- Hot air ballooning: Canterbury Plains, Queenstown
- Kayaking: Abel Tasman, Marlborough Sounds, Fiordland
- Cycling: Alps 2 Ocean (Aoraki to Oamaru), Otago Rail Trail, Great Taste Trail (Nelson), Remutaka Cycle Trail`,
    region_tags: [
      "Queenstown",
      "Taupo",
      "Waitomo",
      "Abel Tasman",
      "Marlborough",
    ],
  },

  {
    type: "destination_knowledge",
    title: "New Zealand Luxury Lodges & Premium Accommodation",
    body: `New Zealand has a world-class collection of luxury lodges — intimate, owner-operated properties offering exceptional food, guiding, and access to private wilderness. These are the anchor experiences for VHNWI/UHNWI travellers.

ROSEWOOD HOTELS (confirmed lodge contracts):
- Kauri Cliffs (Northland): clifftop golf lodge, helicopter access, private beach, swimming with stingrays, Māori cultural connections
- Cape Kidnappers (Hawke's Bay): dramatic headland lodge, world's largest mainland gannet colony, vineyard dining, world-ranked golf course
- Matakauri Lodge (Queenstown): lake-edge luxury on Lake Wakatipu, mountain views, private jetty, world-class cuisine

OTHER BENCHMARK LUXURY PROPERTIES:
- Huka Lodge (Taupō): NZ's original luxury lodge, Waikato River setting, fishing, helicopter, royal warrant
- Farm at Cape Kidnappers / The Farm (Hawke's Bay): unique hilltop farm experience
- Blanket Bay (Glenorchy/Queenstown): remote mountain lodge on Lake Wakatipu with heli-access
- Whare Kea Lodge (Wānaka): intimate lakeside lodge, private heli-hiking
- Otahuna Lodge (Canterbury): historic homestead, farm-to-table dining, heritage NZ experience
- Eagles Nest (Bay of Islands): five ultra-luxury private villas, infinity pools, sailing

LODGE POSITIONING: NZ luxury lodges typically offer 8–14 rooms, owner-operator ethos, exceptional local food and wine, private guiding to wilderness. Price range: NZ$2,000–NZ$5,000+ per night per couple. The experience is the destination — not just a bed.`,
    region_tags: [
      "Northland",
      "Hawke's Bay",
      "Queenstown",
      "Taupo",
      "Wānaka",
      "Bay of Islands",
    ],
  },

  // ─── Market Insights ────────────────────────────────────────────────────

  {
    type: "market_insight",
    title: "USA Visitor Profile — New Zealand Travel (2025)",
    body: `USA is NZ's second largest international market and the primary target for Curated Experiences.

HEADLINE STATS (Year Ending May 2025):
- 382,000 American visitors; 67% holiday share (highest holiday share of top-5 markets)
- Holiday spend: NZ$1.8 billion / NZ$6,360 per person average
- Average length of stay: 10 days
- 51% off-peak arrivals (March–November) — real shoulder-season opportunity
- Active Considerers: ~73 million Americans; 43% rank NZ as their top destination

WHAT AMERICANS WANT:
- Hiking, natural attractions, visiting national parks (top motivations)
- Beaches and coasts, NZ cuisine, historical/heritage sites
- "Bucket-list" mindset — NZ is the once-in-a-lifetime long-haul trip

ITINERARY APPROACH:
- Build around national parks: Tongariro, Aoraki/Mount Cook, Fiordland, Abel Tasman, Westland Tai Poutini
- Great Walks — guided options (Milford Track, Routeburn) are ideal for premium clients
- Both islands across ~10 days is the classic US sell
- Shoulder seasons (autumn March–May, spring September–November) offer better availability and less competition
- Budget anchor: NZ$6,360 per person supports premium lodges and guided experiences

TARGET CLIENT PROFILE: Age 40–60, household income $500K+, first or repeat NZ visit, often combining NZ with Australia. Values authenticity, exclusive access, local expertise.`,
    region_tags: [],
  },

  {
    type: "market_insight",
    title: "UK Visitor Profile — New Zealand Travel (2025)",
    body: `UK visitors are NZ's highest-yielding long-haul Western market alongside Germans.

HEADLINE STATS (Year Ending May 2025):
- 188,000 UK visitors; 43% holiday share
- ~50% off-peak arrivals (March–November)
- Average length of stay: 15 days (holiday) — long-haul, long dwell
- Average trip spend: NZ$5,789 (rising to NZ$7,284 for holiday visitors)
- 55% of UK visitors travelled to four or more NZ regions — strong multi-region demand
- Active Considerers: 16 million UK; 50% rank NZ as #1 destination

WHAT UK VISITORS WANT:
- Beautiful landscapes (primary driver)
- Learning and exploring, feeling relaxed and refreshed
- Local cuisine, beaches and coasts, national parks/native forests

ITINERARY APPROACH:
- Build 2–3 week itineraries across 4+ regions and both islands — data confirms 55% already do this
- UK travellers want immersive experiences over checklist sights
- Holiday spend of NZ$7,284 supports premium lodges, guided Great Walks, food-and-wine add-ons
- Pitch shoulder seasons with storytelling around autumn foliage, spring wildflowers
- Sustainability credentials matter — Qualmark/eco-certified operators are a selling point`,
    region_tags: [],
  },

  {
    type: "market_insight",
    title: "Germany Visitor Profile — New Zealand Travel (2025)",
    body: `German visitors stay longest and spend the most of any NZ source market — the textbook premium traveller.

HEADLINE STATS (Year Ending May 2025):
- 73,000 German visitors; 74% holiday share (highest holiday share of any market)
- Average length of stay: 16 days (holiday) — longest of any market
- 50% off-peak arrivals
- Average spend: NZ$8,102 per trip, NZ$8,648 for holiday visitors — highest yield of any market
- 62% visited four or more NZ regions — top regional dispersal of any market

WHAT GERMAN VISITORS WANT:
- Walks, hikes and tramps — outdoor adventure is primary motivation
- Natural attractions: mountains, lakes, forests, beaches
- Cultural/geothermal experiences (Rotorua, Taupō)
- Sustainability matters — Qualmark/eco-certified operators are a strong selling point

ITINERARY APPROACH:
- "Long, slow, deep" NZ traveller — 16 days, 4+ regions, premium spend
- Combine Great Walks (Routeburn, Milford, Heaphy, Tongariro) with Māori/geothermal cultural experiences
- Self-drive/campervan freedom is highly appealing to German travellers
- Eco and sustainability credentials are genuinely important purchase factors
- Autumn/spring shoulder seasons work well given the 50/50 seasonality split`,
    region_tags: [],
  },

  {
    type: "market_insight",
    title: "Australia, China, Japan & India Visitor Profiles — New Zealand (2025)",
    body: `Profiles for NZ's four other major source markets.

AUSTRALIA (Lead market):
- 1.4 million visitors (44% of all international arrivals); 588,000 holidaymakers
- Holiday spend: NZ$3,854 per person; 9-day average stay
- 69% travel off-peak (March–November)
- Active Considerers: 7.4M Australians; 40% rank NZ #1
- Interests: local towns, lakes/rivers/waterfalls, local cuisine, beaches, heritage sites
- Pitch: short-flight easy overseas, off-peak (already heavily skewed), 9-day single-island highlights

CHINA:
- 250,000 visitors; 68% holiday; 9-day stay; NZ$5,809 avg spend
- 68% off-peak — heavy shoulder skew; 68M Active Considerers (68% rank NZ #1 — highest preference share)
- Interests: natural attractions, walks/hikes, local cuisine, scenic boat cruises, wine/beer, beaches
- Pitch: Milford Sound cruises, hero scenery, food-and-wine add-ons (Marlborough, Hawke's Bay)

JAPAN:
- 72,000 visitors; 59% holiday; 8-day stay; NZ$3,455 avg holiday spend
- 64% off-peak; 37% visit both islands despite short stay
- Interests: beautiful landscapes, getting in touch with nature, relaxation, pampering
- Pitch: tight 4–7 day single-island itineraries, hero landscapes (Mt Cook, Milford, Rotorua), wellness/spa layer

INDIA:
- 81,000 visitors; 30% holiday (VFR/business heavy); 11-day stay; NZ$5,402 avg holiday spend
- 71% off-peak — highest off-peak skew of any market; 27M ACs (63% rank NZ #1)
- Interests: natural attractions, walks/hikes, geothermal parks, beautiful landscapes
- Pitch: geothermal/cultural (Rotorua) + Aoraki/Tekapo + Milford; note vegetarian dietary needs`,
    region_tags: [],
  },

  // ─── Seasonality & Planning ──────────────────────────────────────────────

  {
    type: "destination_knowledge",
    title: "New Zealand Seasons & Best Time to Visit",
    body: `New Zealand is positioned as a year-round destination. Each season offers distinct experiences.

SUMMER (December–February): NZ's peak season. Long days (17+ hours), warmest weather, beaches, Great Walks in full swing. School holidays = busiest and priciest. Best for: beaches (Northland, Coromandel, Abel Tasman), outdoor festivals, Great Walks without rain gear. Tip: book well ahead.

AUTUMN (March–May): Often the best season. Settled, sunny weather, fewer crowds. Hawke's Bay and Marlborough wine harvests (March–April) — a world-class food/wine experience. Central Otago turns golden (April–May). Great Walks still excellent. Off-peak = better value and operator availability.

WINTER (June–August): South Island ski season. Coronet Peak, The Remarkables, Cardrona, Treble Cone, Mt Hutt all open. North Island: fewer visitors, moody dramatic landscapes, best time for Taupo and Rotorua thermal experiences. Milford Sound/Fiordland is spectacular in winter — waterfall-heavy after rain.

SPRING (September–November): Wildflowers, lambs, fewer tourists. Queenstown cherry blossom (September). TranzAlpine train through blooming Canterbury Plains. Whale watching returns to full activity at Kaikōura.

BY REGION:
- Northland/Bay of Islands: best Nov–April (warmest)
- Auckland: year-round
- Rotorua/Taupo: year-round (thermal activity best in winter)
- Queenstown: year-round (summer adventure, winter ski)
- Fiordland/Milford: Oct–April for Great Walks; dramatic waterfall displays year-round
- Marlborough/Hawke's Bay: March–April for harvest; summer for cellar doors`,
    region_tags: [],
  },

  {
    type: "destination_knowledge",
    title: "New Zealand Itinerary Planning — Classic Routes & Durations",
    body: `Classic NZ itinerary frameworks used by luxury travel specialists.

7–10 DAYS (single island focus, US market):
- North Island Highlights: Auckland → Rotorua (geothermal + Māori) → Taupo/Tongariro → Hawke's Bay (wine) → Wellington. Can add Waitomo Caves. Good for first-time visitors.
- South Island Classic: Christchurch → Aoraki/Mt Cook → Queenstown → Milford Sound → back to Queenstown. 8–9 days. Iconic.
- Queenstown + Fiordland Deep Dive: 7 days purely in Queenstown/surrounds + Milford/Doubtful Sound. Adventure + wilderness focus.

14–16 DAYS (both islands, UK/German market):
- Grand NZ Tour: Auckland → Bay of Islands → Rotorua → Taupo → Wellington → Marlborough → Kaikōura → Christchurch → Aoraki → Queenstown → Milford Sound. 15–16 days.
- Culture & Cuisine (both islands): Auckland → Waiheke → Hawke's Bay → Wellington → Marlborough → Queenstown → Central Otago wineries → Dunedin wildlife. 14 days.

LUXURY LODGE CIRCUIT (any duration):
String together lodges: Kauri Cliffs (Northland) → Cape Kidnappers (Hawke's Bay) → Huka Lodge (Taupo) → Matakauri (Queenstown). Each lodge as base for 2–3 nights with day excursions.

TRANSPORT OPTIONS:
- Fly between main centres (Air NZ domestic is excellent; Jetstar for budget)
- Self-drive for freedom — roads are good, distances manageable
- Scenic rail: TranzAlpine (Christchurch→Greymouth), Overlander (Auckland→Wellington) — iconic experiences
- Scenic helicopter: key for Milford Sound, glacier landings, remote lodge access`,
    region_tags: [],
  },

  {
    type: "destination_knowledge",
    title: "New Zealand Geothermal Experiences — Rotorua, Taupō & Volcanic Plateau",
    body: `The Volcanic Plateau of the North Island is one of NZ's most dramatic landscapes — a UNESCO World Heritage setting with boiling mud pools, geysers, steaming lakes, and ancient Māori culture.

ROTORUA — GEOTHERMAL HEARTLAND:
- Te Puia: geothermal park with the famous Pōhutu Geyser + NZ Māori Arts & Crafts Institute (greenstone carving, weaving). UNESCO World Heritage area.
- Wai-O-Tapu Thermal Wonderland: surreal coloured pools (Champagne Pool, Artist's Palette), Lady Knox Geyser. 45 min from Rotorua.
- Waimangu Volcanic Valley: world's youngest geothermal system, walk through volcanic landscape with steaming crater lakes.
- Hells Gate: natural mud spa — therapeutic mud pools, sulphur spa experience.
- Polynesian Spa: built around natural mineral hot pools overlooking Lake Rotorua. Premium spa treatments.

TAUPŌ:
- Lake Taupō: formed by a supervolcano eruption 1,800 years ago — still geothermally active. Great Trout fishing destination.
- Wairakei Geothermal Park & Craters of the Moon: free-entry steaming landscape.
- Huka Falls: NZ's most-visited natural attraction — dramatic turquoise waterfall.
- Huka Lodge: NZ's original luxury lodge on the Waikato River.

TONGARIRO (2 hrs south of Taupō):
- Tongariro Alpine Crossing: NZ's most iconic day hike through active volcanic craters, Emerald Lakes, Red Crater. 19.4km. Also the Mordor of The Lord of the Rings.
- Three Māori sacred volcanoes: Tongariro, Ngāuruhoe (Mt Doom), Ruapehu. UNESCO dual World Heritage (natural + cultural).`,
    region_tags: ["Rotorua", "Taupo", "Tongariro"],
  },

  {
    type: "destination_knowledge",
    title: "Fiordland & Milford Sound — NZ's Most Iconic Wilderness",
    body: `Fiordland National Park is New Zealand's largest national park and a UNESCO World Heritage Site. Milford Sound (Piopiotahi) is the most-visited and iconic destination in Fiordland.

MILFORD SOUND:
- One of the wettest places on Earth — rain enhances the experience with hundreds of temporary waterfalls cascading off sheer 1,200m cliff faces
- Mitre Peak: NZ's most photographed mountain, rising 1,692m straight from the sea
- Boat cruises: 2-hour scenic cruises, overnight cruises (sleeping in the fiord — world-class), kayaking
- Access: 5-hour drive from Queenstown through spectacular Homer Tunnel and Eglinton Valley. Scenic flight option available.
- Milford Track (The Finest Walk in the World): 53km, 4 days, guided lodge option via Ultimate Hikes

DOUBTFUL SOUND (less visited, more remote):
- Deeper and three times longer than Milford. Accessed via Lake Manapouri power station and bus over Wilmot Pass.
- Overnight cruises on the sound — exceptional for luxury travellers wanting fewer crowds
- Best wildlife: Bottlenose dolphins, Fiordland crested penguins, fur seals

QUEENSTOWN AS BASE:
- Milford Sound is 4-5 hours drive from Queenstown or 45 minutes by scenic flight
- Day trip or overnight cruise options
- Combine with Glenorchy/Paradise valley (Lord of the Rings filming), Routeburn Track, Dart River jet boat`,
    region_tags: ["Fiordland", "Queenstown", "Milford Sound"],
  },
];

async function embedBatch(ids: string[]) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/embed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({ ids, table: "content" }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Edge Function error ${res.status}: ${err}`);
  }

  return res.json();
}

async function main() {
  console.log("🌿 Seeding NZ research knowledge base\n");
  console.log(`  ${chunks.length} chunks to insert\n`);

  // Check for existing knowledge chunks to avoid duplicates
  const { data: existing } = await supabase
    .from("content")
    .select("title")
    .in("type", ["destination_knowledge", "market_insight"]);

  const existingTitles = new Set((existing || []).map((r) => r.title));
  const newChunks = chunks.filter((c) => !existingTitles.has(c.title));
  const skipped = chunks.length - newChunks.length;

  if (skipped > 0) {
    console.log(`  Skipping ${skipped} already-existing chunks\n`);
  }

  if (newChunks.length === 0) {
    console.log("✅ All chunks already present. Nothing to insert.");
    return;
  }

  // Insert new chunks
  const records = newChunks.map((c) => ({
    type: c.type,
    title: c.title,
    body: c.body,
    region_tags: c.region_tags ?? [],
    status: "active",
    approved_by: "system",
  }));

  const { data: inserted, error } = await supabase
    .from("content")
    .insert(records)
    .select("id, title");

  if (error) {
    console.error("Insert error:", error.message);
    process.exit(1);
  }

  console.log(`  ✓ Inserted ${inserted?.length} chunks\n`);
  for (const r of inserted || []) {
    console.log(`    - ${r.title}`);
  }

  // Generate embeddings for inserted records
  const ids = (inserted || []).map((r) => r.id);

  if (ids.length === 0) {
    console.log("\n✅ Done (no embeddings needed).");
    return;
  }

  console.log(`\n🔢 Generating embeddings for ${ids.length} chunks...\n`);

  // Process in batches of 5 (Edge Function has rate limits)
  const batchSize = 5;
  let totalEmbedded = 0;
  let totalFailed = 0;

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(ids.length / batchSize);

    process.stdout.write(`  Batch ${batchNum}/${totalBatches}... `);

    try {
      const result = await embedBatch(batch);
      totalEmbedded += result.embedded;
      totalFailed += result.failed;
      console.log(`✓ ${result.embedded} embedded, ${result.failed} failed`);
    } catch (err) {
      console.log(`✗ ${(err as Error).message}`);
      totalFailed += batch.length;
    }

    // Small delay between batches to be polite to the edge function
    if (i + batchSize < ids.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(
    `\n✅ Done. Embedded: ${totalEmbedded}, Failed: ${totalFailed}\n`
  );

  if (totalFailed > 0) {
    console.log(
      "⚠️  Some embeddings failed. Run scripts/reembed-content.ts to retry.\n"
    );
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
