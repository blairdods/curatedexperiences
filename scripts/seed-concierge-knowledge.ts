/**
 * Seed/sync concierge-facing knowledge into the content table.
 *
 * This script:
 * - converts active accommodations into public-facing RAG records
 * - adds detailed curated NZ wine, hiking, culinary, and cultural guidance
 * - generates embeddings for all inserted records
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/seed-concierge-knowledge.ts
 */

import { createClient } from "@supabase/supabase-js";
import { embedRecords } from "@/lib/embeddings/client";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

interface Accommodation {
  id: string;
  name: string;
  tier: "platinum" | "gold" | "silver";
  region: string;
  location: string | null;
  property_type:
    | "lodge"
    | "hotel"
    | "boutique_hotel"
    | "camp"
    | "villa"
    | "retreat"
    | "other"
    | null;
  description: string | null;
  highlights: string[] | null;
  website_url: string | null;
  contracted: boolean | null;
  notes: string | null;
  active: boolean | null;
}

interface KnowledgeRecord {
  type: string;
  title: string;
  body: string;
  region_tags?: string[];
}

const SOURCE_ACCOMMODATION = "accommodation_sync";
const SOURCE_CURATED = "concierge_curated_knowledge";

const curatedKnowledge: KnowledgeRecord[] = [
  {
    type: "wine_knowledge",
    title: "Best New Zealand Wine Regions by Wine Style",
    body: `Concierge wine-region decision guide.

Marlborough is the flagship region and the first answer for Sauvignon Blanc. The core style is vivid, aromatic, high-acid and fruit-forward, with passionfruit, citrus, gooseberry and herbal notes. It is also increasingly useful for premium Pinot Noir, Chardonnay, methode traditionnelle and aromatic whites. Best paired with Marlborough Sounds seafood, Queen Charlotte Track days, and luxury lodge or boutique hotel stays around Blenheim or the Sounds.

Hawke's Bay is the best New Zealand answer for warm-climate reds and serious Chardonnay. Use it for Syrah, Cabernet/Merlot blends, Chardonnay, food-and-wine travellers, Art Deco Napier, Cape Kidnappers, Craggy Range, Mission Estate and Gimblett Gravels/Bridge Pa Triangle conversations. It feels generous, sunny and culinary rather than alpine.

Central Otago is the most powerful emotional wine sell for luxury travellers already visiting Queenstown or Wanaka. Lead with world-class Pinot Noir, then mention Pinot Gris, Riesling, Chardonnay and Gewurztraminer. Gibbston is closest to Queenstown; Bannockburn, Cromwell Basin, Bendigo and Wanaka/Rippon add depth. Pair with heli, alpine scenery, lodges, cycling and private cellar-door access.

Wairarapa/Martinborough is the boutique Pinot Noir answer near Wellington: small scale, village cellar doors, compact tasting routes, good for a quieter, insider-feeling wine day or overnight. North Canterbury/Waipara is strong for Pinot Noir, Riesling and Chardonnay with limestone and clay soils, useful between Christchurch and Kaikoura or Arthur's Pass. Waiheke Island is Auckland's premium island wine escape, especially for Bordeaux-style reds, Syrah, Chardonnay, lunch with views and art.

Source notes: New Zealand Winegrowers describes NZ's maritime, cool-climate wine regions and identifies Marlborough, Hawke's Bay, Central Otago, North Canterbury and Auckland as major regional stories. https://www.nzwine.com/en/regions/`,
    region_tags: [
      "Marlborough",
      "Hawke's Bay",
      "Central Otago",
      "Wairarapa",
      "Auckland",
      "North Canterbury",
      "Queenstown",
      "Wellington",
    ],
  },
  {
    type: "wine_knowledge",
    title: "Premium Wine Itinerary Pairings for Luxury Travellers",
    body: `Use these pairings when a traveller asks for wine and luxury accommodation.

North Island food-and-wine route: Auckland/Waiheke for island vineyards and harbour arrival; Hawke's Bay for Chardonnay, Syrah, Bordeaux blends, Cape Kidnappers, Craggy Range and Mission Estate; Wairarapa/Martinborough for boutique Pinot Noir and a quieter village feel near Wellington. This route suits travellers who want food, art, heritage, warm weather and less driving drama than a full South Island alpine itinerary.

South Island wine route: Marlborough for Sauvignon Blanc and seafood; North Canterbury/Waipara for Pinot Noir, Riesling and Chardonnay; Central Otago for Pinot Noir, Queenstown lodges, Gibbston cellar doors and alpine scenery. Add Nelson/Tasman for sunshine, craft producers and Abel Tasman access.

How to choose: Sauvignon Blanc and seafood: Marlborough. Pinot Noir and alpine drama: Central Otago. Chardonnay and Syrah: Hawke's Bay. Boutique Pinot near Wellington: Martinborough. Island-lunch luxury: Waiheke. Food-first city dining plus wine day trips: Auckland, Wellington, Christchurch, Queenstown.`,
    region_tags: [
      "Auckland",
      "Waiheke Island",
      "Hawke's Bay",
      "Wairarapa",
      "Marlborough",
      "North Canterbury",
      "Central Otago",
      "Nelson",
      "Queenstown",
    ],
  },
  {
    type: "hiking_knowledge",
    title: "Best New Zealand Multi-Day Hikes and Great Walks",
    body: `Concierge hiking guide for premium travellers.

Milford Track is the classic bucket-list walk in Fiordland: rainforest, alpine pass, waterfalls, and a strong sense of pilgrimage. Guided lodge-based options are best for luxury travellers because they avoid basic hut logistics and add guiding, meals and comfort.

Routeburn Track is often the most versatile Great Walk for a luxury itinerary because it links Queenstown/Glenorchy with Fiordland-style alpine scenery and can be experienced as a guided multi-day walk or as high-impact day sections such as Routeburn Flats or Key Summit.

Abel Tasman Coast Track is the best coastal Great Walk: golden beaches, native bush, water taxis, kayaking and lodge-style comfort. It suits families, active couples and travellers who want beauty without harsh alpine exposure.

Kepler Track is excellent for fit hikers based around Te Anau: beech forest, Lake Te Anau, alpine ridgelines and Fiordland views. Queen Charlotte Track is not a Great Walk but is one of the best lodge-supported coastal walks, with Marlborough Sounds views and wine pairing potential.

DOC describes Great Walks as premier tracks through diverse scenery, generally well-formed and accessible from major towns with transport and accommodation support. Bookings are open for stays to 30 June 2027. Source: https://www.doc.govt.nz/parks-and-recreation/things-to-do/walking-and-tramping/great-walks/`,
    region_tags: [
      "Fiordland",
      "Queenstown",
      "Glenorchy",
      "Nelson",
      "Abel Tasman",
      "Te Anau",
      "Marlborough",
    ],
  },
  {
    type: "hiking_knowledge",
    title: "Best New Zealand Day Hikes by Traveller Type",
    body: `Use this to recommend specific day hikes.

Tongariro Alpine Crossing: best volcanic day hike, North Island, full-day and weather-dependent. Strong for active travellers who want craters, lava fields and Emerald Lakes. It needs proper gear, transport and conditions management.

Hooker Valley Track: best accessible Aoraki/Mount Cook day walk. About 10km return and usually 3-4 hours, with swing bridges, Mueller Glacier views, Hooker Lake and Aoraki/Mount Cook. Strong for photographers and mixed-fitness travellers. Source: https://www.newzealand.com/us/feature/hooker-valley-track/

Rob Roy Glacier Track: best Wanaka glacier-valley day hike when open and conditions suit. Strong for alpine drama without a full expedition feel. Roy's Peak and Isthmus Peak: best big-view Wanaka hikes, but exposed, steep, popular and better for fit travellers.

Ben Lomond: best Queenstown summit-style challenge. Routeburn Key Summit: best high-impact Fiordland/Routeburn sample. Abel Tasman day walk plus kayak: best soft-adventure coastal day. Queen Charlotte Track day sections: best Marlborough Sounds walking with lodge/wine pairing. Kaikoura Peninsula Walkway: best wildlife/coastal low-effort option.`,
    region_tags: [
      "Tongariro",
      "Aoraki/Mount Cook",
      "Wanaka",
      "Queenstown",
      "Fiordland",
      "Abel Tasman",
      "Marlborough",
      "Kaikoura",
    ],
  },
  {
    type: "culinary_knowledge",
    title: "Best Culinary Experiences in New Zealand",
    body: `Concierge culinary guide.

Michelin is a current major hook: the MICHELIN Guide is coming to Aotearoa New Zealand in 2026, initially spotlighting Auckland, Wellington, Christchurch and Queenstown. Use this carefully as a dining-scene validation, not as a promise of starred restaurants until the selection is published. Source: https://www.newzealand.com/us/campaign/worth-a-special-journey/

Auckland: best gateway dining, Waiheke vineyard lunches, harbour seafood, modern Pacific and Asian-influenced restaurants. Wellington: compact culinary city, coffee, craft beer, serious restaurants, Te Papa and Wairarapa wine access. Christchurch: strongest for a South Island city reset, restored heritage dining, North Canterbury/Waipara wine and produce. Queenstown: strongest luxury dining base with Central Otago wine, lake-and-mountain setting, lodge dining and private chefs.

Regional food hooks: Marlborough green-lipped mussels and Sauvignon Blanc; Kaikoura crayfish and marine experiences; Bluff oysters in season, usually March-August; Hawke's Bay orchard produce, Chardonnay, Syrah and winery lunches; Central Otago stone fruit and Pinot Noir; Rotorua hangi and Māori kai; West Coast whitebait; Northland and Bay of Islands seafood.

Best guest-facing framing: do not sell New Zealand as formal or showy. Sell it as exceptional ingredients, wine-country access, lodge kitchens, producers, seafood, Māori manaakitanga and meals grounded in place.`,
    region_tags: [
      "Auckland",
      "Wellington",
      "Christchurch",
      "Queenstown",
      "Marlborough",
      "Kaikoura",
      "Hawke's Bay",
      "Central Otago",
      "Rotorua",
      "West Coast",
      "Northland",
    ],
  },
  {
    type: "culinary_knowledge",
    title: "Māori Kai and Place-Based Food Experiences",
    body: `Māori kai should be framed with respect and specificity, not as a generic performance.

Hāngī is food cooked in an earth oven and is most commonly introduced to visitors through Rotorua cultural experiences, but the deeper story is manaakitanga: hospitality, care and generosity. Use Rotorua for travellers who want geothermal landscapes and Māori culture in the same stay. Good language: "a thoughtful Māori cultural evening with hāngī and storytelling" or "a curator-led cultural experience where food is part of the welcome."

Modern Māori and Pacific-influenced cuisine is increasingly visible in city dining. For a luxury itinerary, pair Māori kai with Te Puia or Whakarewarewa in Rotorua, Waitangi in Northland, Te Papa in Wellington, or private cultural hosting where appropriate.

Avoid overpromising access to iwi, marae, or sacred spaces without a confirmed host. The best cultural food experiences are relationship-led and should be arranged respectfully.`,
    region_tags: ["Rotorua", "Northland", "Wellington", "Auckland"],
  },
  {
    type: "culture_knowledge",
    title: "Best Cultural Sites and Māori Heritage Experiences in New Zealand",
    body: `Concierge cultural-site guide.

Waitangi Treaty Grounds, Bay of Islands: the most important historic site for understanding modern New Zealand. In 1840, Te Tiriti o Waitangi / the Treaty of Waitangi was signed here. Best for travellers who want founding history, museums, guided interpretation, waka, Northland/Bay of Islands context and a more meaningful start or finish to a North Island route. Source: https://www.waitangi.org.nz/about/history

Te Papa Tongarewa, Wellington: New Zealand's national museum, with major collections across art, natural history, New Zealand histories, mātauranga Māori and Pacific cultures. Best for travellers who want thoughtful interpretation in a city setting. Source: https://www.tepapa.govt.nz/

Rotorua: best concentration of Māori cultural tourism and geothermal context. Te Puia, Whakarewarewa Living Māori Village, Mitai and Tamaki-style evening experiences can work, but choose based on guest fit. Position Rotorua as living culture plus geothermal landscapes, not just a show.

Auckland War Memorial Museum: strong for Māori and Pacific collections and a good gateway cultural stop. Northland adds Manea Footprints of Kupe and Hokianga stories. Canterbury and Otago add layered colonial, Ngāi Tahu and natural-history context when handled with appropriate local interpretation.`,
    region_tags: [
      "Northland",
      "Bay of Islands",
      "Wellington",
      "Rotorua",
      "Auckland",
      "Canterbury",
      "Otago",
    ],
  },
  {
    type: "culture_knowledge",
    title: "How to Recommend Cultural Experiences Respectfully",
    body: `Cultural recommendation rules for the concierge.

Lead with place and relationship. New Zealand cultural experiences are strongest when tied to whenua, whakapapa, manaakitanga and kaitiakitanga: land, genealogy, hospitality and guardianship. Do not describe Māori culture as entertainment, decoration or a quick add-on.

Good phrasing: "a hosted Māori cultural experience", "guided interpretation at Waitangi", "a thoughtful visit to Te Papa", "a geothermal and cultural stay in Rotorua", "private hosting where access is appropriate." Avoid promising marae access, iwi meetings, sacred sites, or private ceremonies unless confirmed by the team.

Best itinerary matches: Northland/Waitangi for founding history; Rotorua for Māori cultural tourism plus geothermal landscapes; Wellington/Te Papa for museum depth and bicultural context; Auckland Museum for gateway context; South Island experiences should acknowledge Ngāi Tahu whenua where relevant.`,
    region_tags: [
      "Northland",
      "Rotorua",
      "Wellington",
      "Auckland",
      "Canterbury",
      "Queenstown",
      "Fiordland",
    ],
  },
  {
    type: "hnw_na_planning_faq",
    title: "HNW North America NZ Planning FAQ — Seasons, Duration, Islands, Entry",
    body: `Use this for high-net-worth North American travellers asking early planning and logistics questions.

Best time to visit: explain seasonality positively and realistically. The main luxury travel season is beginning November through end April. This gives long days, warmer weather, better lodge rhythm, food-and-wine access and strong scenic touring. December-February is peak summer and busiest. March-April is often excellent: settled, more relaxed, harvest/wine energy and beautiful light. Do not recommend winter unless the traveller specifically wants skiing, winter sports, snow scenery or a quieter cold-season itinerary.

How long to spend: use 14 days as the baseline for a first serious New Zealand journey. TNZ/high-value travel context points to around 13 days as a meaningful HNW average stay, and two weeks is enough to combine North and South Island highlights without rushing every day. A return trip can focus more deeply on special regions. Early in the conversation, determine whether the main goal is scenery, culinary/wine, expedition, adventure, culture, wellness, golf, fishing or lodge time.

North Island vs South Island: South Island is the first answer for dramatic scenery: Southern Alps, fiords, glaciers, lakes, Queenstown/Wanaka, Aoraki/Mount Cook and Marlborough/Fiordland. First-timers with 14 days can still cover highlights of both islands: Auckland/Waiheke or Northland, Rotorua/Taupo/Hawke's Bay, then South Island scenery. If time is short and scenery is the priority, lean South Island.

Entry requirements: US and Canadian passport holders normally need an NZeTA before travelling if they are visa-waiver visitors, plus the IVL where applicable. Always direct travellers to Immigration New Zealand for current requirements and exemptions before booking. Official source: https://www.immigration.govt.nz/new-zealand-visas/visas/visa/nzeta

Booking lead time: recommend 6-9 months in advance for best lodge, guide, helicopter and holiday-period availability, especially December-February and marquee properties. Shorter-notice trips can still work with specialist operator help, but will need flexibility on dates, lodge mix and routing.

Tone: confident, calm and advisor-led. Avoid making logistics feel hard; frame the specialist role as turning distance and choice into a smooth, personal journey.`,
    region_tags: [
      "North America",
      "Auckland",
      "Queenstown",
      "Christchurch",
      "South Island",
      "North Island",
    ],
  },
  {
    type: "hnw_na_flights_transport_faq",
    title: "HNW North America NZ Flights, Airports and Internal Travel FAQ",
    body: `Use this for US/Canada travellers asking how to get to and around New Zealand. Routes change by season, so speak in current generalities and recommend checking exact dates.

Flight duration and direct service: West Coast North America to Auckland is usually about 12-14 hours nonstop; East Coast routes can be closer to 16-18+ hours depending on origin, routing and schedule. Air New Zealand markets nonstop North America services to Auckland from major US gateways including Los Angeles, San Francisco, Houston, Honolulu and New York/JFK, subject to schedule/season. United also operates US-New Zealand nonstop services on selected routes. Air Canada connects Vancouver-Auckland seasonally or by schedule, and Qantas/American options may connect via Australia or seasonal services. Always phrase as "subject to current airline schedules." Official airline sources include: https://www.airnewzealand.com/flights-to-new-zealand-from-usa and https://www.united.com/

Entry and exit airports: for US arrivals, Auckland is the strongest default international gateway. Christchurch can be useful for some routes/seasonal connections and South Island starts. Queenstown is more often reached domestically from Auckland/Christchurch/Wellington, or internationally from Australia. From Australia, Auckland, Christchurch and Queenstown all matter depending on origin city and season.

Between islands: for luxury itineraries, domestic flights are usually the cleanest way to preserve time between Auckland, Wellington, Christchurch, Queenstown, Nelson, Rotorua, Taupo, Napier and other regional centres. The Cook Strait ferry is scenic and valid when Wellington/Marlborough routing fits, but it consumes more time and is weather/logistics dependent. Helicopter/private air can connect selected lodges and scenic experiences, but must be built around weather and landing permissions.

Driving: New Zealand roads are beautiful but not North American highways. Distances can look short on a map but take longer due to two-lane roads, mountain passes, coastal roads, rural traffic, photo stops and weather. Use curated driving days carefully and avoid overloading guests. Private drivers/guides often create better value than self-drive for HNW travellers by improving pacing, interpretation, comfort and safety.

Money: currency is New Zealand dollars. Credit cards are widely accepted; Wise-style cards and bank cards are practical. Currency exchange is available at airports and main shopping centres, but luxury travellers usually rely on cards and modest cash for incidentals.`,
    region_tags: [
      "Auckland",
      "Christchurch",
      "Queenstown",
      "Wellington",
      "North America",
    ],
  },
  {
    type: "hnw_na_accommodation_faq",
    title: "HNW North America NZ Luxury Accommodation FAQ",
    body: `Use this for North American HNW accommodation questions where privacy, quality and fit matter most.

Best luxury lodges: do not answer as a fixed top-four list. Huka Lodge, Blanket Bay, Rosewood Kauri Cliffs, Rosewood Cape Kidnappers and Rosewood Matakauri are benchmark searches, but New Zealand has roughly 20+ higher-end lodges and retreats, each with its own personality. The right lodge depends on scenery, food and wine, fishing, golf, wilderness, wellness, privacy, culture, family needs and routing. Encourage a short expert conversation to match the guest properly.

Private villa vs luxury lodge: a lodge usually gives hosted service, dining, guiding access, atmosphere and curated hospitality. A private villa gives privacy, space and control; service and catering can vary from self-contained to fully staffed with private chef and concierge. Villas are excellent for families, milestone groups and privacy-led stays, while lodges suit guests who want service, hosted dining and a strong sense of place.

All-inclusive/private retreats: yes. Many lodges and private retreats can include full board, hosted dining, private chef, transfers, guides, activities or bespoke inclusions, but inclusions vary. Clarify food, beverages, premium wines, activities, transfers and helicopter access before presenting a cost.

Helicopter access: most high-end lodges can arrange helicopter arrival or scenic flying either on-site or nearby, subject to weather, landing permissions, daylight and operator availability. Avoid promising a specific landing until confirmed.

Food and wine at lodges: most luxury lodges have high-class culinary programmes, often built around local produce, wine matching and chef-led dining. The MICHELIN Guide arrival in New Zealand in 2026 validates the country's broader culinary momentum, but do not claim stars/keys for properties unless officially confirmed.

Remote/exclusive properties: remoteness can mean no-road access, private estate setting, geographic isolation, low room count or a setting that feels removed from towns. Minaret Station is the clearest no-road-access example. Other remote/exclusive options include high-country, island, coastal estate and wilderness lodges. Choose based on what the traveller means by remote.

Honeymoons/milestone birthdays: the right answer depends on the couple's interests: alpine romance, island privacy, vineyard dining, wilderness, spa/wellness, private villa, golf or helicopter experiences. Do not default to one lodge; offer to talk through fit.

Whole-property buyouts and eco-luxury: yes, many private villas, residences and smaller lodges can be rented privately. Eco-luxury exists in many forms: conservation estates, low-impact architecture, regenerative farms, wilderness lodges and community-connected suppliers. Match the form of sustainability to the guest's values.`,
    region_tags: [
      "North America",
      "Queenstown",
      "Northland",
      "Hawke's Bay",
      "Taupo",
      "Fiordland",
      "Wanaka",
    ],
  },
  {
    type: "accommodation_comparison_guide",
    title: "Accommodation Comparison Style Guide — Luxury NZ Properties",
    body: `Use this whenever comparing New Zealand lodges, hotels, villas, retreats or private estates.

Comparison structure: cover setting, access/distance, privacy, service style, best fit and one useful tradeoff for each property. Avoid flat lists. The visitor should understand how each stay feels, not just which one is "best."

Recommendation calibration:
- Do not say "our first recommendation" unless the traveller's exact needs clearly support that.
- Prefer calibrated phrasing: "one of the first we'd discuss", "a strong fit if...", "best suited to...", "sits in our platinum tier", "the right choice if..."
- A tier is an internal quality signal, not a ranking by itself. Say "sits in our platinum tier" rather than "our platinum-tier recommendation."
- Do not imply exclusivity, remoteness or service level from tier alone; ground the claim in the property description.

Precision rules:
- Say "lakefront" for properties on Lake Wakatipu or other lakes unless the source specifically says beach.
- Use "remote" carefully. Differentiate no-road access, private-estate feel, geographical isolation, low room count and simply being outside town.
- Do not call a property a destination lodge if it is better described as a city hotel, wine-country lodge, serviced apartment, villa or practical base.

Positive tradeoff language:
- Avoid dismissive phrasing like "pleasant property" or "not as good as."
- Use specific fit language: "strongest for wine-focused stays and cellar-door access, but not the same remote destination-lodge proposition as Blanket Bay or Matakauri."
- If a hotel is more practical than exceptional, say what it is good for: "reliable city logistics", "family space", "arrival night", "walkable dining", "event access" or "longer-stay independence."

Follow-up style: end comparisons with a fit question that helps qualify the traveller: town vs retreat, privacy vs hosted service, wine vs scenery, family space vs couple's lodge, active days vs slow lodge time.`,
    region_tags: [
      "New Zealand",
      "Queenstown",
      "Auckland",
      "Northland",
      "Hawke's Bay",
      "Taupo",
      "Rotorua",
      "Wellington",
    ],
  },
  {
    type: "hnw_na_experiences_faq",
    title: "HNW North America NZ Private Experiences FAQ",
    body: `Use this for luxury activity and experience questions.

Helicopter and scenic flights: the best scenic flying is around mountains, fiords, glaciers, braided rivers, volcanic landscapes, harbours, bays and islands. High-impact regions include Milford Sound/Fiordland, Aoraki/Mount Cook, West Coast glaciers, Queenstown/Wanaka, Taupo/Tongariro volcanic landscapes, Auckland/Hauraki Gulf and Bay of Islands. Glacier landings are absolutely possible in several regions, weather and operator conditions permitting.

Private fishing: yes. New Zealand has world-class trout fishing and strong private guide networks, especially around Taupo/Tongariro, Rotorua, Nelson/Murchison, Southland and high-country rivers. Fly-fishing is a major HNW draw; guide, lodge and season fit matter.

Wildlife: unique encounters include kiwi sanctuaries, Kaikoura whales, royal albatross, penguins, dolphins, fur seals, sea lions and rare native birds. Match wildlife to route: Kaikoura, Otago Peninsula, Stewart Island, Wellington/Zealandia, Rotorua sanctuaries, Northland islands and Marlborough/Bay of Islands marine life.

Hobbiton: for adults, Hobbiton can be genuinely world-class when framed well, especially for film fans, design/detail lovers and guests who appreciate polished production. Private, premium or after-hours options may be available depending on schedule; confirm before promising.

Māori culture: authentic experiences depend on region and relationship. Rotorua, Northland/Waitangi, Wellington/Te Papa, Auckland Museum and private hosted experiences can all work. Avoid "touristy vs authentic" language; instead ask what level of depth the traveller wants and recommend respectful, hosted, place-led experiences.

Wine: private tastings are possible in the right regions. Match varieties: Marlborough Sauvignon Blanc and seafood; Central Otago Pinot Noir; Hawke's Bay Chardonnay, Syrah and Bordeaux-style blends; Wairarapa/Martinborough boutique Pinot Noir; Waiheke Island Bordeaux-style reds, Syrah and Chardonnay; North Canterbury Pinot Noir, Riesling and Chardonnay.

Adventure vs relaxation: New Zealand is not only adrenaline. It can be adventure, culinary, wellness, relaxation, scenery, history, culture, wildlife, fishing, golf, sailing and lodge-based travel. HNW North Americans often respond well to lodge-based holidays with optional private experiences rather than constant activity.

Hiking: guides are not mandatory for every walk, but private guides improve safety, weather judgement, interpretation, pacing and access. Easier premium options include Abel Tasman sections, Queen Charlotte Track sections, Hooker Valley Track, Lake Matheson, Kaikoura Peninsula and selected lodge-based guided walks. Great Walk logistics should be planned early.

Golf: benchmark courses include Cape Kidnappers, Kauri Cliffs, Te Arai Links, Tara Iti, Kinloch, Wairakei Golf + Sanctuary, Jack's Point, Millbrook, The Hills and other links-style/coastal courses. Course access, tee times and routing need expert handling.

Sailing/superyacht, private jet, glowworms and stargazing: yes. Sailing and superyacht options are strongest around Auckland/Hauraki Gulf and Bay of Islands. Private jet or charter-air lodge routing is possible. Glowworms can be experienced privately or semi-privately depending on base. Stargazing is excellent in Aoraki Mackenzie International Dark Sky Reserve and other dark-sky sanctuaries/reserves.`,
    region_tags: [
      "Fiordland",
      "Queenstown",
      "Wanaka",
      "Aoraki/Mount Cook",
      "West Coast",
      "Rotorua",
      "Taupo",
      "Northland",
      "Auckland",
      "Kaikoura",
      "Marlborough",
      "Central Otago",
      "Hawke's Bay",
      "Wairarapa",
    ],
  },
  {
    type: "hnw_na_cost_value_faq",
    title: "HNW North America NZ Cost, Value and Inclusions FAQ",
    body: `Use this for HNW cost/value conversations.

Luxury trip cost: a serious luxury New Zealand journey can sit around NZD $15,000-$50,000+ per person depending on duration, lodge tier, private guiding, helicopters, private air, villa staffing, food/wine, season and exclusivity. Phrase ranges carefully and invite the team to tailor around the guest's priorities. Avoid quoting a fixed package price without details.

Is New Zealand expensive: compared with other luxury destinations, New Zealand can be strong value for privacy, scenery, safety, guiding, lodges and depth of experience. But there are opportunities and pitfalls: over-driving, wrong lodge fit, weak routing, unconfirmed inclusions, peak-season scarcity and weather-dependent activities can reduce perceived value. Expert planning protects ROI.

Private guide vs group tour: for HNW travellers, private guiding is usually worth it. It improves pacing, interpretation, safety, restaurant/activity timing, luggage logistics, flexibility and access. It is especially valuable for first-timers, families, solo women, older travellers, food/wine travellers, hikers and guests wary of left-hand driving.

Tipping: New Zealand does not have a mandatory tipping culture. Tipping is appreciated for exemplary service, private guides, drivers or special hosting, but it is not expected in the US sense. Keep the tone relaxed.

Lodge inclusions: vary by property. Many luxury lodges are full board or include breakfast/dinner, but premium beverages, cellar wines, spa, transfers, heli, guiding, fishing, golf, laundry and some activities may be extra. Always confirm inclusions and exclusions by property and date.`,
    region_tags: ["North America", "New Zealand"],
  },
  {
    type: "hnw_na_sustainability_values_faq",
    title: "HNW North America NZ Sustainability, Regeneration and Māori Benefit FAQ",
    body: `Use this for values-led HNW travellers.

Eco-friendly/sustainable tourism: sustainability is a major driver across New Zealand suppliers. Many premium operators emphasise conservation, predator control, native planting, low-impact architecture, local sourcing, waste reduction, community benefit and kaitiakitanga/guardianship. Be specific rather than generic: match the guest to conservation estates, eco-lodges, wildlife sanctuaries, regenerative farms or Māori-owned experiences.

Carbon footprint: long-haul flights are the largest footprint. On the ground, a carefully planned itinerary can reduce unnecessary driving, duplicated flights and inefficient routing. Choosing conservation-focused lodges, longer stays in fewer places, private guiding that avoids wasted mileage, and meaningful local suppliers can make the journey more responsible without making it feel austere.

Regenerative/conservation tours: many exist depending on location and focus: wildlife sanctuaries, predator-free islands, native forest restoration, farm conservation, marine conservation, Māori-led land/sea guardianship, eco-lodges and philanthropic/contribution experiences. Clarify whether the traveller wants light-touch learning, hands-on conservation, philanthropy, or a property with strong sustainability credentials.

Tourism and Māori communities: benefits can include Māori-owned tourism businesses, employment, cultural revitalisation, iwi/hapū enterprise, storytelling led by the right hosts, regional economic activity and wider tax/community benefits. Avoid treating Māori culture as a commodity. Recommend Māori experiences that are relationship-led, hosted respectfully, and appropriate to place.`,
    region_tags: ["North America", "Rotorua", "Northland", "Wellington", "Auckland"],
  },
  {
    type: "hnw_na_practical_safety_faq",
    title: "HNW North America NZ Safety, Packing, Insurance and Driving FAQ",
    body: `Use this for practical and safety questions, especially from solo women, couples and older luxury travellers.

Safety: New Zealand is generally very safe for solo travellers and couples, and this is an important reassurance point for North American HNW guests. Emphasise that Curated Experiences/PPG-style private planning adds another layer: vetted suppliers, sensible routing, private guides/drivers, local support, checked logistics, weather judgement and someone looking after the details. This matters especially for solo female travellers and guests who want peace of mind without feeling over-managed.

Travel insurance: strongly recommend comprehensive travel insurance, especially for medical coverage, trip disruption, weather disruption, adventure activities, evacuation and cancellation. New Zealand has good medical standards, but visitors should not rely on domestic public coverage.

Health/vaccinations: no special vaccinations are generally required for typical US/Canada travellers beyond routine health advice, but travellers should check their physician/CDC/Canadian travel health guidance for personal circumstances.

Packing: advise layers. Weather can change quickly, especially in alpine/coastal areas. Include light rain shell, warm layer, comfortable walking shoes, smart-casual lodge/dining wear, swimwear/spa layer, sunhat, sunglasses, strong sunscreen and UV protection. New Zealand UV can be intense even when temperatures feel mild.

Driving: US/Canada travellers can generally drive on a valid overseas licence in English for a limited period, but left-hand driving, narrow/twisty roads, rural conditions and deceptively long travel times matter. Recommend private driver/guide for comfort and time optimisation, especially on scenic routes. If self-driving, design conservative days and avoid night driving after long-haul arrival.

Customs: New Zealand has strict biosecurity on arrival. For returning to the US, travellers should check US Customs and Border Protection/USDA rules for food, wine, wood, plant, animal products and souvenirs. Avoid giving definitive US customs rulings; direct to official US customs sources.`,
    region_tags: ["North America", "New Zealand"],
  },
  {
    type: "hnw_na_conversion_insight",
    title: "HNW North America Concierge Conversion Insight",
    body: `Use this to shape how the concierge talks to HNW North American travellers.

Key insight: North American high-net-worth travellers over-index on lodge/resort-based holidays and often trust word of mouth and travel advisors more than anonymous online research. A major barrier is not rejection of New Zealand but lack of knowledge: many do not know enough about how to turn New Zealand into a polished luxury journey. Therefore content and advisor-style conversation are primary conversion levers.

High-relevance search themes: luxury lodges, helicopter experiences, bespoke itineraries, Māori culture, private fishing, cost/value and sustainability. Luxury lodges, helicopter experiences and bespoke itinerary design have the highest HNW relevance. Private fishing and Māori culture are medium-high. Sustainability is growing fast.

Concierge behaviour: be specific enough to build confidence, but do not pretend every nuanced luxury choice has a single answer. For lodges, fishing, helicopters, Māori experiences, golf, private jets, eco-luxury and milestone trips, the best answer is often: "Yes, and the right version depends on your interests, pace and route; I can help narrow it down." Invite a conversation with Tony/Liam when expert fit matters.

Tone rules: positive, realistic, calm, informed. Do not oversell winter unless winter sports are relevant. Do not present New Zealand as difficult or remote in a negative way; frame distance as part of the reward and specialist planning as the way to make it effortless.`,
    region_tags: ["North America", "United States", "Canada", "New Zealand"],
  },
];

function displayType(type: Accommodation["property_type"]): string {
  switch (type) {
    case "boutique_hotel":
      return "boutique hotel";
    case "lodge":
      return "lodge";
    case "hotel":
      return "hotel";
    case "camp":
      return "camp";
    case "villa":
      return "villa";
    case "retreat":
      return "retreat";
    default:
      return "property";
  }
}

function tierPositioning(tier: Accommodation["tier"]): string {
  if (tier === "platinum") {
    return "Top-tier luxury option for guests expecting the strongest setting, service, privacy and design.";
  }
  if (tier === "gold") {
    return "Premium option suitable for discerning travellers, often a strong balance of comfort, location and character.";
  }
  return "Good supporting option for value-sensitive premium itineraries, family logistics, shoulder nights or when the main lodge category is not required.";
}

function propertyUseCase(accommodation: Accommodation): string {
  const type = displayType(accommodation.property_type);
  const location = accommodation.location
    ? `${accommodation.location}, ${accommodation.region}`
    : accommodation.region;

  if (accommodation.property_type === "villa") {
    return `Use for privacy-led stays, families, small groups, exclusive-use requests or guests who prefer a self-contained ${type} in ${location}.`;
  }

  if (accommodation.property_type === "lodge") {
    return `Use for guests who want a more personal, place-led ${type} experience in ${location}, especially when the stay should feel quieter than a city hotel.`;
  }

  if (accommodation.property_type === "boutique_hotel") {
    return `Use for guests who want a characterful ${type} in ${location}, usually as a refined base between larger lodge stays.`;
  }

  if (accommodation.property_type === "retreat") {
    return `Use for guests who want space, independence or a softer retreat-style stay in ${location}.`;
  }

  return `Use as a practical ${type} base in ${location}, especially when location, room inventory or itinerary flow matter most.`;
}

function sanitizeNotes(notes: string | null): string | null {
  if (!notes) return null;

  const fragments = notes
    .split("|")
    .map((fragment) => fragment.trim())
    .filter(Boolean)
    .filter((fragment) => {
      const lower = fragment.toLowerCase();
      return ![
        "contract status:",
        "original tier:",
        "original type:",
        "site inspection",
        "site visit",
        "rate",
        "rates",
        "commission",
        "contract",
        "agreement",
        "contact",
        "tel",
        "mob",
        "email",
        "@",
        "phone",
        "gm@",
        "outreach",
        "not contacted",
        "requested",
        "engaged",
        "secured",
        "tbc",
      ].some((needle) => lower.includes(needle));
    })
    .map((fragment) =>
      fragment
        .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "")
        .replace(/\+?\d[\d\s().-]{7,}\d/g, "")
        .replace(/\s{2,}/g, " ")
        .trim()
    )
    .filter(Boolean);

  return fragments.length ? fragments.join(" ") : null;
}

function originalTier(notes: string | null): string | null {
  if (!notes) return null;
  const match = notes.match(/(?:^|\|)\s*Original tier:\s*([^|]+)/i);
  return match?.[1]?.trim() || null;
}

function directoryCategory(accommodation: Accommodation): string | null {
  const tier = originalTier(accommodation.notes);
  if (!tier) return null;
  return tier.toLowerCase() === accommodation.tier ? null : tier;
}

function accommodationTitle(accommodation: Accommodation): string {
  return [
    `Accommodation: ${accommodation.name}`,
    accommodation.region,
    accommodation.location,
    directoryCategory(accommodation),
  ]
    .filter(Boolean)
    .join(" — ");
}

function accommodationBody(accommodation: Accommodation): string {
  const category = directoryCategory(accommodation);
  const lines = [
    `Concierge accommodation profile for ${accommodation.name}.`,
    `Name: ${accommodation.name}.`,
    `Region: ${accommodation.region}.`,
    accommodation.location ? `Location: ${accommodation.location}.` : null,
    `Accommodation tier: ${accommodation.tier}.`,
    category ? `Supplier directory category: ${category}.` : null,
    `Property type: ${displayType(accommodation.property_type)}.`,
    `Positioning: ${tierPositioning(accommodation.tier)}`,
    `Best use: ${propertyUseCase(accommodation)}`,
    accommodation.contracted
      ? "Curated Experiences has this property marked as a secured partner; it can be mentioned with more confidence as a property we work with."
      : null,
    accommodation.description
      ? `Description: ${accommodation.description.trim()}`
      : null,
    accommodation.highlights?.length
      ? `Highlights: ${accommodation.highlights.join("; ")}.`
      : null,
    sanitizeNotes(accommodation.notes)
      ? `Known guest-facing notes: ${sanitizeNotes(accommodation.notes)}`
      : null,
    accommodation.website_url ? `Property website: ${accommodation.website_url}` : null,
    "Concierge rule: recommend this only when it fits the traveller's region, budget signal, privacy needs and travel style. Do not reveal supplier contacts, wholesale rates, commission, or internal contracting notes.",
  ];

  return lines.filter(Boolean).join("\n");
}

async function replaceCuratedKnowledge(): Promise<string[]> {
  const { error: deleteError } = await supabase
    .from("content")
    .delete()
    .eq("source_type", SOURCE_CURATED);

  if (deleteError) throw deleteError;

  const { data, error } = await supabase
    .from("content")
    .insert(
      curatedKnowledge.map((record) => ({
        ...record,
        source_type: SOURCE_CURATED,
        status: "active",
        approved_by: "system",
      }))
    )
    .select("id");

  if (error) throw error;
  return (data ?? []).map((record) => record.id);
}

async function replaceAccommodationKnowledge(): Promise<string[]> {
  const { error: deleteError } = await supabase
    .from("content")
    .delete()
    .eq("source_type", SOURCE_ACCOMMODATION);

  if (deleteError) throw deleteError;

  const { data: accommodations, error: accommodationError } = await supabase
    .from("accommodations")
    .select(
      "id,name,tier,region,location,property_type,description,highlights,website_url,contracted,notes,active"
    )
    .eq("active", true)
    .order("region", { ascending: true })
    .order("name", { ascending: true });

  if (accommodationError) throw accommodationError;

  const records = ((accommodations ?? []) as Accommodation[]).map(
    (accommodation) => ({
      type: "accommodation",
      title: accommodationTitle(accommodation),
      body: accommodationBody(accommodation),
      source_type: SOURCE_ACCOMMODATION,
      source_id: accommodation.id,
      region_tags: [accommodation.region, accommodation.location]
        .filter(Boolean)
        .map(String),
      status: "active",
      approved_by: "system",
    })
  );

  if (records.length === 0) return [];

  const { data, error } = await supabase.from("content").insert(records).select("id");
  if (error) throw error;

  return (data ?? []).map((record) => record.id);
}

async function embedInserted(ids: string[]) {
  let embedded = 0;
  let failed = 0;

  for (let i = 0; i < ids.length; i += 5) {
    const batch = ids.slice(i, i + 5);
    try {
      const result = await embedRecords(batch, "content");
      embedded += result.embedded;
      failed += result.failed;
    } catch {
      console.warn(
        `Batch ${Math.floor(i / 5) + 1} failed; retrying records individually.`
      );

      for (const id of batch) {
        try {
          const result = await embedRecords([id], "content");
          embedded += result.embedded;
          failed += result.failed;
        } catch (recordError) {
          failed += 1;
          console.warn(
            `Embedding failed for content ${id}: ${
              recordError instanceof Error
                ? recordError.message
                : String(recordError)
            }`
          );
        }
      }
    }

    console.log(
      `Embedded ${Math.min(i + batch.length, ids.length)}/${ids.length} records`
    );
  }

  return { embedded, failed };
}

async function main() {
  console.log("Syncing concierge knowledge...\n");

  const curatedIds = await replaceCuratedKnowledge();
  console.log(`Curated knowledge records: ${curatedIds.length}`);

  const accommodationIds = await replaceAccommodationKnowledge();
  console.log(`Accommodation knowledge records: ${accommodationIds.length}`);

  const allIds = [...curatedIds, ...accommodationIds];
  if (allIds.length === 0) {
    console.log("No records inserted.");
    return;
  }

  console.log(`\nGenerating embeddings for ${allIds.length} records...\n`);
  const result = await embedInserted(allIds);

  console.log(
    `\nDone. Inserted: ${allIds.length}, embedded: ${result.embedded}, failed: ${result.failed}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
