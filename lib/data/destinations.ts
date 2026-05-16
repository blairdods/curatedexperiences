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
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HV0CC6PK49VV41FSCHRRFQD3/534674-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HV0CC6PK49VV41FSCHRRFQD3/534674-preview.webp", alt: "Milford Sound (Piopiotahi), Fiordland – towering peaks reflected in mirror-calm water" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HV0CC6N9SMHQ53DR4X6HWEQ4/534672-preview.webp", alt: "Milford Sound, Fiordland – waterfalls cascading from granite walls" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4MBQGEF50QV4DD85XQHN/250917-preview.webp", alt: "Waiau River, Fiordland – gateway waterway to Milford Sound" },
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
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4YD4KGVZY0KTGNW5HES1/251816-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4YD4KGVZY0KTGNW5HES1/251816-preview.webp", alt: "Queenstown Hill, Otago – aerial view over Queenstown and Lake Wakatipu" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4F75SMMD94D4RV38YDDK/250473-preview.webp", alt: "Glenorchy, Queenstown – horse trekking through snowcapped mountain scenery" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4D1ZRPNFE40Z2DF02CVM/250287-preview.webp", alt: "Kawarau River, Queenstown – turquoise river canyon through Otago landscape" },
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
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4NXGH76SB3YVKZPH6NFT/251048-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4NXGH76SB3YVKZPH6NFT/251048-preview.webp", alt: "Queen Charlotte Track, Marlborough Sounds – coastal bush above the Sounds" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4064Y9SFP1W622F6B74G/thumbnails/249250-1280.webp", alt: "Marlborough Sounds aerial – drowned river valleys and inlets from above" },
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
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4APVXH88HZRVGXJD59CM/250070-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4APVXH88HZRVGXJD59CM/250070-preview.webp", alt: "Aoraki / Mount Cook, Canterbury – the Caroline Face seen from Ball Ridge" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H3WQNA914H2Q9MHRECGVJ/248976-preview.webp", alt: "Lake Pukaki, Canterbury – turquoise glacier-fed lake with Aoraki on the horizon" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H5336JJ6WS878GY60JPY9/252217-preview.webp", alt: "Lake Pukaki, Canterbury – expansive alpine lake in the Mackenzie Basin" },
    ],
  },

  // ── NORTH ISLAND ──────────────────────────────────────────────────────────

  {
    slug: "northland",
    name: "Northland",
    region: "North Island",
    tagline: "Ancient kauri forests, the Bay of Islands, and the birthplace of modern New Zealand.",
    description: `Northland is where New Zealand begins — in history, in landscape, and in spirit. The Bay of Islands is the country's most storied coastline: 144 islands scattered across a sheltered harbour where dolphins leap in the wake of sailing yachts and the light turns the water to hammered copper at dusk. The Waitangi Treaty Grounds, where the founding document of modern New Zealand was signed in 1840, is one of the most significant cultural sites in the Pacific.

Further west, the Hokianga Harbour offers something rarer still — a place largely untouched by mass tourism, where vast sand dunes roll down to a harbour framed by ancient kauri trees. The Waipoua Forest is home to Tāne Mahuta, the largest living kauri tree on earth, and a guided night walk here, torch-lit and led by a Māori kaitiaki (guardian), is among the most humbling experiences in the country.

For guests arriving or departing via The Lodge at Kauri Cliffs — set on 6,000 acres of coastal estate above the Pacific — Northland delivers a beginning to any New Zealand journey that is impossible to follow without effort.`,
    highlights: [
      "Bay of Islands sailing and island hopping",
      "Waitangi Treaty Grounds guided cultural experience",
      "Tāne Mahuta night walk in Waipoua Forest",
      "Hokianga Harbour sand dunes and harbour cruise",
      "Kauri Cliffs — championship golf on a clifftop estate",
      "Russell: New Zealand's first European settlement",
    ],
    bestFor: ["Culture & history", "Nature lovers", "Couples"],
    bestSeasons: "November–April for warmth and sailing; autumn for quiet beauty",
    relatedJourneySlugs: ["the-masterpiece", "the-hidden-trail"],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4XBGNN3W6DQ98GNK6E0K/251732-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4XBGNN3W6DQ98GNK6E0K/251732-preview.webp", alt: "Tāne Mahuta, Waipoua Forest, Northland – ancient kauri tree, Lord of the Forest" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4QEC2Z20T7ZPA2PMAVRC/251177-preview.webp", alt: "Urupukapuka Island, Bay of Islands – island bush walk in the Bay of Islands" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H3W5WYBZYXMZ0ANY7Z0EA/thumbnails/248930-1280.webp", alt: "Bay of Islands, Northland – aerial view of the 144 islands" },
    ],
  },

  {
    slug: "waikato",
    name: "Waikato",
    region: "North Island",
    tagline: "Glowworm caves, the mighty Waikato River, and the legendary Huka Lodge.",
    description: `The Waikato is New Zealand's heartland — rolling green farmland cut through by the country's longest river, with a subterranean world beneath that has no equal. The Waitomo Glowworm Caves have been drawing visitors since 1887, but an intimate private experience — candlelit passages through ancient limestone, Moa bones underfoot, a cavern ceiling alive with thousands of titiwai — is something altogether different from the tourist circuit.

Further south, where the Waikato River narrows into a turquoise torrent, sits Huka Lodge — the property that created the template for New Zealand luxury hospitality. Thirteen suites on the riverbank, a kitchen that has fed royalty and presidents, and a stillness that descends as soon as you arrive. For most guests, Huka Lodge is the moment a New Zealand journey shifts from a holiday into something more lasting.`,
    highlights: [
      "Footwhistle Glowworm Cave — private candlelit experience",
      "Huka Lodge — New Zealand's most celebrated lodge",
      "Huka Falls jet boat",
      "Lake Taupo private fishing charter",
      "Waitomo black-water rafting",
      "Hobbiton movie set (private after-hours)",
    ],
    bestFor: ["Nature lovers", "Couples", "Luxury seekers"],
    bestSeasons: "Year-round; summer for cave visits and lake cruising",
    relatedJourneySlugs: ["the-masterpiece", "the-epicurean", "the-discovery", "the-hidden-trail"],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4FT0NBHFKJX1JRJBTMY0/250528-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4FT0NBHFKJX1JRJBTMY0/250528-preview.webp", alt: "Hobbiton Movie Set, Waikato – rolling green hills and hobbit holes of the Shire" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H3W32XJ6JP6A4R2WRDYTZ/248924-preview.webp", alt: "Waitomo Glowworm Caves, Waikato – bioluminescent glow of thousands of titiwai" },
    ],
  },

  {
    slug: "coromandel",
    name: "Coromandel Peninsula",
    region: "North Island",
    tagline: "Secluded beaches, cathedral kauri forest, and a coast made for slow living.",
    description: `The Coromandel Peninsula juts into the Pacific an hour east of Auckland and feels a world removed from it. This is a place of cathedral forest and empty beaches — where the pohutukawa trees overhang coves of white sand, and the only sound is the tide. Cathedral Cove, accessible only on foot or by water, is one of the most photographed places in New Zealand, and still worth every photograph.

Hot Water Beach is the Coromandel's other great peculiarity: geothermal springs push through the sand at low tide, and you dig your own thermal pool steps from the ocean. But beyond the landmarks, the Coromandel rewards those who slow down. Artists' studios, craft breweries, boutique olive groves, and kayaking through the Hauraki Gulf — this is New Zealand without agenda.`,
    highlights: [
      "Cathedral Cove — private boat or kayak access",
      "Hot Water Beach thermal springs",
      "Whitianga — sailing and island hopping",
      "Thames to Coromandel Town coastal drive",
      "Kauri tree walks in Coromandel Forest Park",
    ],
    bestFor: ["Nature lovers", "Couples", "Photographers"],
    bestSeasons: "December–March for beaches; shoulder seasons for solitude",
    relatedJourneySlugs: [],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4FX1H78MC3GMN94PSYV5/250539-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4FX1H78MC3GMN94PSYV5/250539-preview.webp", alt: "Hot Water Beach, Coromandel – digging thermal pools steps from the Pacific" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HW9C39F28F93SXK7JB476WE4/569010-preview.webp", alt: "Glass Bottom Boat, Whitianga, Coromandel – near Cathedral Cove" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4FXGSNRJWV3D335XFWZJ/250541-preview.webp", alt: "Kūaotunu, Coromandel Peninsula – coastal township on the east coast" },
    ],
  },

  {
    slug: "bay-of-plenty",
    name: "Bay of Plenty",
    region: "North Island",
    tagline: "White Island's volcanic fire, Mt Maunganui's surf, and the warmest water in New Zealand.",
    description: `The Bay of Plenty lives up to its name in every season. The bay stretches from the Coromandel to Ōpōtiki in a vast arc of sheltered coastline, with Mt Maunganui — the country's most loved beach town — at its heart. The water here is warm enough to swim comfortably through summer, and the surf is consistent enough to justify the boards stacked against every second house.

But the Bay of Plenty's most extraordinary feature lies offshore: Whakaari / White Island, an active marine volcano that rises from the sea 50 kilometres from Whakatāne. A helicopter flight over the caldera — crater lakes of electric yellow sulphur, steam vents, the raw geological violence of it — is one of New Zealand's most visceral experiences. The region's kiwifruit orchards and Māori cultural heritage (Te Arawa and Ngāti Awa) add further layers to a destination that repays genuine curiosity.`,
    highlights: [
      "Whakaari / White Island helicopter overflight",
      "Mt Maunganui beach and summit walk",
      "Private dolphin-watching cruise, Whakatāne",
      "Kiwifruit orchard and food producer tours",
      "Te Puia o Whakaari — Māori cultural experience",
    ],
    bestFor: ["Nature lovers", "Active travellers", "Families"],
    bestSeasons: "November–April for swimming and coastal activities",
    relatedJourneySlugs: [],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4S97ARENA2RS9QYYSA9W/thumbnails/251343-1280.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4S97ARENA2RS9QYYSA9W/thumbnails/251343-1280.webp", alt: "Mount Maunganui, Bay of Plenty – white sand surf beach at the base of the Mount" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H531W7G9KEY8GP74W2AW2/252213-preview.webp", alt: "Kokako Retreat, Rotorua – glamping couple in autumn forest, Bay of Plenty" },
    ],
  },

  {
    slug: "rotorua",
    name: "Rotorua",
    region: "North Island",
    tagline: "Geothermal wonder, the living heart of Māori culture, and forest trails that smell of the earth.",
    description: `Rotorua announces itself before you see it — the distinctive sulphur tang in the air tells you you've arrived somewhere unlike anywhere else. This is one of the most geothermally active places on earth: mud pools bubble at roadsides, geysers erupt on schedule, and the ground beneath your feet is warm to the touch. Whakarewarewa Thermal Valley and Te Puia are the centrepieces, but Rotorua's real depth is cultural.

This is the heartland of the Ngāti Whakaue and other Te Arawa iwi, and genuine Māori experiences here — not the stage-managed kind, but living culture, whānau-led, grounded in real history — are among the most meaningful any visitor to New Zealand can have. A private hāngi dinner, a kapa haka performance in an authentic meeting house, a conversation with a kaumātua (elder) about the Māori relationship with the land: these moments stay. The surrounding Redwood Forest provides an unexpected counterpoint — cycling or walking through stands of California coastal redwood, transplanted here a century ago and now towering above the ferns.`,
    highlights: [
      "Te Puia geothermal park and Māori arts institute",
      "Private hāngi dinner and kapa haka performance",
      "Wai-O-Tapu Thermal Wonderland — Champagne Pool",
      "Whakarewarewa — living Māori village",
      "Redwood Forest cycling and treetop walk",
      "Hell's Gate geothermal mud spa",
    ],
    bestFor: ["Culture & history", "Nature lovers", "Couples"],
    bestSeasons: "Year-round — geothermal wonders don't sleep",
    relatedJourneySlugs: ["the-epicurean"],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H49E31B5Z9JFFVDHT172D/249959-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H49E31B5Z9JFFVDHT172D/249959-preview.webp", alt: "Waimangu Volcanic Valley, Rotorua – world's youngest geothermal system" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4PBTSMXVCYEQVFXT9BZD/251088-preview.webp", alt: "Tikitere (Hell's Gate), Rotorua – geothermal hot springs and mud pools" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H462TCBR38GGHWW5SRV45/249688-preview.webp", alt: "Lake Rotoiti, Rotorua – tranquil lake reflecting geothermal surroundings" },
    ],
  },

  {
    slug: "central-plateau",
    name: "Central Plateau",
    region: "North Island",
    tagline: "Three volcanoes, the world's oldest national park, and landscapes borrowed from another world.",
    description: `The Central Plateau sits at the geographic heart of the North Island — a high, wild plateau dominated by three active volcanoes: Ruapehu, Tongariro, and Ngauruhoe. Together they form Tongariro National Park, New Zealand's first national park and one of only a handful of places in the world to hold dual UNESCO status for both natural and cultural significance. To Māori, these mountains are ancestors, not scenery.

The Tongariro Alpine Crossing is routinely ranked among the world's great day walks — a 19-kilometre traverse across ancient lava flows, past the emerald Emerald Lakes and the striking Red Crater, with views that stretch on clear days to the coast. Private guided crossings, helicopter access to high points otherwise unreachable, and winter ski seasons at Mount Ruapehu add further dimensions. This is a place where the earth feels alive in the most literal sense.`,
    highlights: [
      "Tongariro Alpine Crossing — privately guided",
      "Helicopter landing on the volcanic plateau",
      "Ski and snowboard season at Whakapapa and Tūroa",
      "Wild horse search in the Kaimanawa ranges",
      "Château Tongariro — historic alpine lodge",
      "Lake Taupō private boat charter",
    ],
    bestFor: ["Active travellers", "Nature lovers", "Photographers"],
    bestSeasons: "October–April for the Crossing; June–October for skiing",
    relatedJourneySlugs: ["the-discovery"],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H30FWRD4P1DCKW3VH78WX/246637-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H30FWRD4P1DCKW3VH78WX/246637-preview.webp", alt: "Tongariro Alpine Crossing, Tongariro National Park – volcanic plateau traverse" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H37KZFTHC5EH1QQF9JV5G/247205-preview.webp", alt: "Lake Rotoaira, Tongariro National Park, Ruapehu" },
    ],
  },

  {
    slug: "taranaki",
    name: "Taranaki",
    region: "North Island",
    tagline: "A perfect cone volcano, dramatic surf coast, and one of New Zealand's most surprising garden cultures.",
    description: `Mount Taranaki rises from the Taranaki coast with an almost implausible symmetry — a near-perfect volcanic cone, snow-capped for much of the year, ringed by an ancient forest that clings to its flanks like a cloak. The mountain is sacred to Taranaki Māori and dominates every view from the city of New Plymouth, which sits on the coast below.

New Plymouth itself surprises. The Govett-Brewster Art Gallery is among the finest contemporary art institutions in Australasia. Pukekura Park is extraordinary — a garden of subtropical plants and illuminated lily ponds. And Len Lye, the kinetic sculptor whose works spin and shimmer at the Len Lye Centre, was born here. The surf coast from Oakura to Ōākura is world-class; the ring road around the mountain is one of New Zealand's great drives. Taranaki rewards those who stray from the well-trodden path.`,
    highlights: [
      "Mount Taranaki summit hike or helicopter scenic flight",
      "Pouakai Infinity Pool — the famous reflected mountain shot",
      "Len Lye Centre and Govett-Brewster Art Gallery",
      "Puke Ariki — Taranaki's museum and heritage park",
      "Surf Highway 45 — world-class breaks",
      "Taranaki gardens — New Plymouth in bloom",
    ],
    bestFor: ["Nature lovers", "Culture & history", "Active travellers"],
    bestSeasons: "October–March for summit access; year-round for coast",
    relatedJourneySlugs: [],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4QX723VEPMH5W8H1QTP1/251214-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4QX723VEPMH5W8H1QTP1/251214-preview.webp", alt: "Taranaki Maunga (Mount Taranaki) – near-perfect volcanic cone above the coast" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HV0CC85ZKJ48EHH81AKHY32J/thumbnails/534830-1280.webp", alt: "Maunga Taranaki, Taranaki – snowcapped summit rising from native bush" },
    ],
  },

  {
    slug: "manawatu",
    name: "Manawatū-Whanganui",
    region: "North Island",
    tagline: "Rugged gorges, the arts city of Palmerston North, and Te Apiti wind country.",
    description: `Manawatū-Whanganui is the North Island's least-visited region by international travellers — and for exactly that reason, it offers something increasingly rare: genuine, unperformed New Zealand. Palmerston North is a university city with an excellent food and arts scene and the Te Manawa museum, which houses one of the country's finest collections of Māori taonga (treasures).

The Manawatū Gorge was one of the most dramatic road corridors in the country before the road was permanently closed by slips — now it's accessible only on foot or mountain bike, which makes it more beautiful. The Rangitīkei River is outstanding for white-water rafting. And the Whanganui River — one of New Zealand's Great Walks — has legal personhood, recognised in 2017 as an ancestor by the Māori people who have lived on its banks for centuries. A jet boat journey up the river to the Bridge to Nowhere is among the country's most unusual and affecting experiences.`,
    highlights: [
      "Whanganui River — jet boat to the Bridge to Nowhere",
      "Whanganui River Road — one of New Zealand's great scenic drives",
      "Te Manawa Museum — Māori taonga collection",
      "Rangitīkei River white-water rafting",
      "Manawatū Gorge — hiking and mountain biking",
    ],
    bestFor: ["Active travellers", "Culture & history", "Nature lovers"],
    bestSeasons: "October–April for river journeys and outdoor activities",
    relatedJourneySlugs: [],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H2W207QMNVYWZF87QX5Z8/246272-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H2W207QMNVYWZF87QX5Z8/246272-preview.webp", alt: "Whanganui River, Manawatu-Whanganui – New Zealand's legally recognised river ancestor" },
    ],
  },

  {
    slug: "hawkes-bay",
    name: "Hawke's Bay",
    region: "North Island",
    tagline: "New Zealand's wine and food capital, Art Deco Napier, and clifftop lodges above the Pacific.",
    description: `Hawke's Bay is where New Zealand's wine and food culture is at its most confident. The bay enjoys more sunshine hours than almost anywhere in the country, and that light — warm, clear, drawn out — is what gives the region its particular quality. The Heretaunga Plains produce world-class merlot, syrah, and chardonnay from estates like Craggy Range, Church Road, and Black Barn. Private cellar door experiences here are as refined as anything in Napa or Margaret River.

Napier is the Art Deco capital of the world — rebuilt almost entirely in the style after a 1931 earthquake, the city's streetscapes have an extraordinary coherence. But the region's most singular experience is The Farm at Cape Kidnappers. Set on 6,000 rolling acres above Pacific cliffs that host the world's largest mainland gannet colony, it is one of the great lodges not just of New Zealand but of the Southern Hemisphere. Dinner on the terrace as the gannets wheel overhead and the sun drops into Hawke Bay is the kind of moment that recalibrates everything.`,
    highlights: [
      "The Farm at Cape Kidnappers — cliff-edge lodge dining",
      "Gannet colony at Cape Kidnappers",
      "Craggy Range, Black Barn and Clearview private wine tastings",
      "Art Deco Napier walking tour",
      "Te Mata Peak — panoramic valley views",
      "Havelock North — artisan food and produce market",
    ],
    bestFor: ["Wine lovers", "Food enthusiasts", "Couples"],
    bestSeasons: "February–May for harvest; December–March for the best weather",
    relatedJourneySlugs: ["the-masterpiece", "the-discovery"],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HV0CC762VQJJE1FNBS4ENQ16/534719-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HV0CC762VQJJE1FNBS4ENQ16/534719-preview.webp", alt: "Haumoana, Hawke's Bay – cycling through wine country landscape" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4B9N4W0KG3GWXMTZN5EC/250125-preview.webp", alt: "Craggy Range winery, Hawke's Bay – world-class cellar door dining" },
    ],
  },

  {
    slug: "gisborne-east-cape",
    name: "Gisborne & East Cape",
    region: "North Island",
    tagline: "The first city in the world to greet the sunrise, and a coast that time has barely touched.",
    description: `Gisborne is the first city on earth to see the sun each day — a fact that carries genuine weight in a region where Māori culture, the Pacific, and an unhurried pace of life define everything. The East Cape stretches north from the city in a long, barely-touched arc of coastline: pohutukawa-lined beaches, a lighthouse at the cape itself, and communities where te reo Māori is the first language and hospitality the natural mode.

Gisborne's wine scene is modest in scale and extraordinary in quality. Chardonnay grown here — from Millton Vineyard and a handful of others — is among New Zealand's finest, biodynamically produced and barely known outside the region. Tairāwhiti Māori cultural experiences, led by local iwi, offer a depth and authenticity that the more tourist-worn centres of Rotorua can rarely match. For travellers who want to arrive somewhere real, the East Cape is among New Zealand's greatest rewards.`,
    highlights: [
      "East Cape Lighthouse — first sunrise on earth",
      "Millton Vineyard — biodynamic chardonnay cellar door",
      "Te Poho-o-Rāwiri — one of NZ's largest meeting houses",
      "East Cape coastal drive — pohutukawa in bloom (December)",
      "Tolaga Bay Wharf — New Zealand's longest",
      "Tairāwhiti Museum — Māori and colonial history",
    ],
    bestFor: ["Culture & history", "Wine lovers", "Nature lovers"],
    bestSeasons: "November–April; December for pohutukawa in bloom",
    relatedJourneySlugs: [],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4QSK58J8HC9YCHAZNDDJ/251202-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4QSK58J8HC9YCHAZNDDJ/251202-preview.webp", alt: "Mount Hikurangi, Gisborne – first peak in New Zealand to greet the sunrise" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4S3PJF9Z2BQKPAMFXB0R/251327-preview.webp", alt: "Mount Hikurangi, Tairāwhiti – sacred summit of the Ngāti Porou people" },
    ],
  },

  {
    slug: "wellington",
    name: "Wellington",
    region: "North Island",
    tagline: "New Zealand's creative capital — compact, wind-scoured, and surprisingly extraordinary.",
    description: `Wellington is, by every measure that matters, one of the world's great small cities. Compact enough to walk across in an afternoon, consequential enough to spend a week in and still feel you've missed things. The city sits on the southern tip of the North Island where the wind comes off Cook Strait and the harbour frames everything — hills behind, water in front, a cable car threading up through the suburb of Kelburn to the Botanic Gardens.

Te Papa Tongarewa, the national museum of New Zealand, is world-class in the truest sense — a building that takes the country's dual Māori and Pākehā heritage seriously and presents it beautifully. Wellington's restaurant scene punches well above its weight: Logan Brown, Shepherd, The Larder, and a dozen others have made this city a genuine food destination. The Weta Workshop — the creative studio behind The Lord of the Rings, Avatar, and Planet of the Apes — offers private behind-the-scenes experiences that are unlike anything else in the world.`,
    highlights: [
      "Te Papa Tongarewa — private behind-the-scenes museum access",
      "Weta Workshop — private creative studio tour",
      "Wellington waterfront dining and craft beer scene",
      "Cable car and Botanic Gardens",
      "Mount Victoria lookout — harbour panorama",
      "Wellington Museum — the city's history in an 1892 bond store",
    ],
    bestFor: ["Culture & history", "Food enthusiasts", "Couples"],
    bestSeasons: "Year-round; summer for the harbour; autumn for dining",
    relatedJourneySlugs: ["the-discovery"],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4M313NREETC2XAQBCHA2/250893-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4M313NREETC2XAQBCHA2/250893-preview.webp", alt: "Te Papa Tongarewa museum, Wellington waterfront" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4SBXQX9HD1A2SJCK7JP7/thumbnails/251351-1280.webp", alt: "Hannah's Laneway, Wellington – vibrant inner-city dining and culture precinct" },
    ],
  },

  {
    slug: "wairarapa",
    name: "Wairarapa & Martinborough",
    region: "North Island",
    tagline: "Pinot country, working sheep stations, and wild coast at the edge of the Tararuas.",
    description: `The Wairarapa is Wellington's backyard — an hour through a mountain tunnel — and feels like another world. The Tararua and Rimutaka ranges hold the wind and rain on the western side, leaving the Wairarapa in a sunnier, drier pocket that has proved perfect for pinot noir. Martinborough is the epicentre: a small town built on a grid pattern in the 1880s, now ringed by some of New Zealand's finest wine estates — Ata Rangi, Palliser, Craggy Range Martinborough, and a dozen others within walking distance of the town square.

But the Wairarapa's character extends well beyond its cellars. Wharekauhau Country Estate, perched above Palliser Bay on a 5,500-acre working sheep station, is one of New Zealand's most complete lodge experiences — farm heritage, coastal drama, and exceptional hospitality in a property that has been welcoming guests for generations. Cape Palliser, at the region's southern tip, has New Zealand's largest fur seal colony and a lighthouse reachable by 258 steps, with the Kaikoura Ranges across the strait on clear days.`,
    highlights: [
      "Martinborough wine village — private cellar door tour",
      "Wharekauhau Country Estate — 5,500-acre sheep station",
      "Cape Palliser fur seal colony",
      "Pūkaha Mount Bruce — national wildlife centre",
      "Masterton and the Wairarapa Arts scene",
      "Greytown — heritage main street and boutique dining",
    ],
    bestFor: ["Wine lovers", "Couples", "Nature lovers"],
    bestSeasons: "February–May for harvest; October–April for coastal walks",
    relatedJourneySlugs: ["the-discovery"],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4M5AJC32QKTE7WDEKRE5/250899-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4M5AJC32QKTE7WDEKRE5/250899-preview.webp", alt: "Martinborough, Wairarapa – wine village surrounded by world-class pinot noir estates" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4MWKFXNJZB3QRR7JAARE/250963-preview.webp", alt: "Pūkaha Mount Bruce National Wildlife Centre, Wairarapa" },
    ],
  },

  // ── SOUTH ISLAND ──────────────────────────────────────────────────────────

  {
    slug: "tasman-nelson",
    name: "Tasman & Nelson",
    region: "South Island",
    tagline: "Sunlit coastline, world-class artisan culture, and the gateway to Abel Tasman.",
    description: `Nelson and Tasman sit at the top of the South Island in a sheltered bay that catches more sun than almost anywhere in New Zealand. The light here is extraordinary — warm, even, the kind that makes everything look slightly more beautiful than it has any right to. It has drawn artists for generations: Nelson has more artists per capita than any other city in New Zealand, and the region's galleries, glassblowers, potters, and jewellers are the genuine article.

Abel Tasman National Park — accessible by water taxi, kayak, or helicopter from Nelson — is New Zealand's most-walked national park for good reason. The coastal track winds through native bush above golden sand beaches and translucent turquoise bays, accessible only on foot or by sea. The Waters Hotel, on the edge of the park, provides the kind of lodge base that makes the experience feel curated rather than expeditionary. The Tasman wine region produces excellent sauvignon blanc and pinot gris from vineyards tucked into river valleys below the Richmond Ranges.`,
    highlights: [
      "Abel Tasman coastal walk — private water taxi access",
      "Sea kayaking in Abel Tasman National Park",
      "Nelson arts and crafts studios — private guided tour",
      "Tasman wine region cellar doors",
      "The Waters Hotel — gateway lodge to Abel Tasman",
      "Waimea Estuary wildlife — spoonbills, herons, migratory waders",
    ],
    bestFor: ["Nature lovers", "Couples", "Culture & history"],
    bestSeasons: "October–April — one of New Zealand's sunniest regions",
    relatedJourneySlugs: ["the-hidden-trail", "the-southern-heart"],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4K0PQMTP193TDYHFAAJA/250798-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4K0PQMTP193TDYHFAAJA/250798-preview.webp", alt: "Kaiteriteri Beach, Nelson – golden sand gateway to Abel Tasman National Park" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H529Y83MMTVNQG9TSRZ25/thumbnails/252152-1280.webp", alt: "Abel Tasman National Park – golden beaches and turquoise bays from above" },
    ],
  },

  {
    slug: "kaikoura",
    name: "Kaikoura",
    region: "South Island",
    tagline: "Sperm whales, fur seals, and mountains that meet the sea.",
    description: `Kaikoura is one of the only places on earth where a mountain range and a deep ocean trench converge so close to shore — the Kaikoura Peninsula juts into the Pacific with the Seaward Kaikōura Range rising directly behind it, snow-capped for most of the year. This geography creates upwellings of nutrient-rich water that support an extraordinary concentration of marine life: sperm whales that can be reliably seen year-round, dusky dolphins in their thousands, New Zealand fur seals sprawled on coastal rocks minutes from the town centre.

A whale-watching flight by light aircraft or helicopter is one of the great wildlife encounters on earth — spotting a 20-metre sperm whale from above, breathing at the surface before sounding, tail rising out of the water as it dives. Swimming with the seals, dolphin-watching cruises, and the recently rebuilt coastal walkway (the 2016 earthquake reshaped the landscape and created new reef flats) add further dimensions. Kaikoura's crayfish — locally caught, locally cooked, sold from roadside shacks — is among New Zealand's simplest and finest eating.`,
    highlights: [
      "Whale watch flight or cruise",
      "Swimming with fur seals",
      "Dusky dolphin encounters",
      "Kaikōura Peninsula Walkway",
      "Fresh crayfish from roadside stalls",
      "Seaward Kaikōura Range — alpine scenery from the coast",
    ],
    bestFor: ["Nature lovers", "Photographers", "Wildlife enthusiasts"],
    bestSeasons: "Year-round — whales are present in all seasons",
    relatedJourneySlugs: ["the-southern-heart"],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HV0CC8J6V2PK7G0WQ28YS4GZ/534871-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HV0CC8J6V2PK7G0WQ28YS4GZ/534871-preview.webp", alt: "Whale Watch Kaikōura – cruise in the deep waters off Kaikōura" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4P0DVAKV55JJ1N5W32WT/251056-preview.webp", alt: "Kaikōura coastline – coastal town backed by the Kaikōura Ranges with marine wildlife" },
    ],
  },

  {
    slug: "west-coast",
    name: "West Coast",
    region: "South Island",
    tagline: "Glaciers, ancient rainforest, and a wild coastline that refuses to be tamed.",
    description: `The West Coast is New Zealand at its most elemental. The Southern Alps press against the Tasman Sea along a narrow coastal strip that receives more rainfall than anywhere in the country — and that rain has created something extraordinary: a temperate rainforest of tree ferns, rimu, kahikatea, and flax that stretches from the mountains to the beach. Franz Josef and Fox glaciers descend from the névé of the Southern Alps to within 300 metres of sea level, a descent so dramatic it seems physically impossible.

A heli-hike on Franz Josef Glacier is one of the definitive New Zealand experiences: touch down on the ancient ice, walk through seracs and blue crevasses with a guide, and return to the coast for dinner in a town that sits at the edge of the wilderness. The Pancake Rocks at Punakaiki — limestone formations sculpted by wave and time into extraordinary columns — and the nesting colony of Westland Petrels (found nowhere else on earth) complete a West Coast experience that stays with you long after you've left.`,
    highlights: [
      "Franz Josef Glacier heli-hike",
      "Fox Glacier helicopter landing",
      "Pancake Rocks and blowholes at Punakaiki",
      "Hokitika — greenstone (pounamu) carving",
      "Lake Matheson — mirror reflection of Aoraki",
      "Westland Tai Poutini National Park wilderness walks",
    ],
    bestFor: ["Nature lovers", "Active travellers", "Photographers"],
    bestSeasons: "October–April; glacier access year-round by helicopter",
    relatedJourneySlugs: ["the-expedition", "the-southern-heart"],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H44EYA9J10MDS9W6SR9N9/thumbnails/249578-1280.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H44EYA9J10MDS9W6SR9N9/thumbnails/249578-1280.webp", alt: "Franz Josef Glacier (Kā Roimata o Hine Hukatere), West Coast – vast ice field from above" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H44DM1CA8S67MQ3WYPNC8/thumbnails/249574-1280.webp", alt: "Punakaiki Pancake Rocks, West Coast – dramatic limestone stacks and blowholes" },
    ],
  },

  {
    slug: "hanmer-springs",
    name: "Hanmer Springs",
    region: "South Island",
    tagline: "Alpine thermal springs, forest walks, and a refined retreat in the Hurunui foothills.",
    description: `Hanmer Springs is one of those places that seems almost too convenient to be true — a thermal resort town in a mountain valley, two hours north of Christchurch, surrounded by pine and beech forest with the Hanmer Range rising above. The thermal pools have been drawing visitors since the 1880s, when the New Zealand government opened the reserve, and they remain the centrepiece: geothermally heated pools at different temperatures, private family pools, and a sulphur pool that leaches the tension from a long travel day within minutes.

The surrounding forest is threaded with walking and mountain bike tracks, and the Hanmer Springs Thermal Pools and Spa has evolved into a genuinely accomplished wellness facility. For those travelling between Christchurch and the Marlborough or Nelson regions, Hanmer offers a natural overnight stop that upgrades the journey from a transit to an experience.`,
    highlights: [
      "Hanmer Springs Thermal Pools — private pool bookings",
      "Hanmer Forest Park — mountain biking and forest walks",
      "Thrillseekers Canyon — jet boat and bungy",
      "Hurunui wine trail — small-scale cellar doors",
      "Conical Hill — panoramic views over the valley",
    ],
    bestFor: ["Wellness seekers", "Couples", "Active travellers"],
    bestSeasons: "Year-round — pools best in winter; walks best in summer",
    relatedJourneySlugs: [],
    heroImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80", alt: "Hanmer Springs alpine village" },
    ],
  },

  {
    slug: "mackenzie-basin",
    name: "Mackenzie Basin",
    region: "South Island",
    tagline: "Glacial lakes of impossible colour, the dark sky reserve, and high country without limits.",
    description: `The Mackenzie Basin is a vast tussock plateau encircled by the Southern Alps — a landscape of such scale and emptiness that it resets the senses. Lake Tekapo and Lake Pukaki are the defining images: glacial water tinted aquamarine by rock flour ground by ancient ice, so vivid they look digitally altered until you're standing at the water's edge. The Church of the Good Shepherd, photographed against the lake at dusk, is one of the most reproduced images in New Zealand.

But it's the night sky that elevates the Mackenzie from beautiful to extraordinary. The Aoraki Mackenzie International Dark Sky Reserve is the largest in the Southern Hemisphere — 4,300 square kilometres of legally protected darkness, where light pollution regulations are among the strictest in the world. The University of Canterbury's Mount John Observatory offers guided stargazing experiences; on a clear night, without any artificial aid, the Milky Way is so dense and vivid that guests who have never seen it before are routinely moved to silence.`,
    highlights: [
      "Lake Tekapo stargazing at Mount John Observatory",
      "Lake Pukaki — Aoraki / Mount Cook backdrop",
      "Tasman Glacier boat tour and ice explorer",
      "Mackenzie high-country farm visit",
      "Church of the Good Shepherd at sunrise",
      "Helicopter landing on the névé",
    ],
    bestFor: ["Stargazers", "Photographers", "Nature lovers"],
    bestSeasons: "October–April for hiking; June–August for clearest skies",
    relatedJourneySlugs: ["the-expedition", "the-southern-heart"],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H47YKZNKJ6YZ76F7A7JXK/249824-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H47YKZNKJ6YZ76F7A7JXK/249824-preview.webp", alt: "Lake Takapō, Canterbury – turquoise glacial lake in the Mackenzie Basin" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H534PJBDBRKSC6HDQ6ERR/252220-preview.webp", alt: "Lake Pukaki, Canterbury – alpine lake with Aoraki / Mount Cook beyond" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H52X9WH602FS1QDBVCGTF/252201-preview.webp", alt: "Lake Tekapo/Takapō, Canterbury – star-gazing country in the world's largest dark sky reserve" },
    ],
  },

  {
    slug: "wanaka",
    name: "Wānaka & Surrounds",
    region: "South Island",
    tagline: "Lake Wānaka's still water, the Matukituki Valley, and Queenstown's quieter, more beautiful cousin.",
    description: `Wānaka sits at the southern end of Lake Wānaka — a lake so long and clear that the mountains on the far shore seem to be floating. The town is smaller and quieter than Queenstown, with a character that is more genuinely outdoors-oriented: people come here to climb, ski, walk, and simply be in the landscape. That 'That Wānaka Tree' — a lone willow growing from the lake's edge — is one of the most photographed trees on earth, and in person it earns every photograph.

The Matukituki Valley extends west from Wānaka toward Mount Aspiring National Park, a UNESCO World Heritage wilderness of glaciers, braided rivers, and peaks that rise above 3,000 metres. Access by helicopter, or on foot via Rob Roy Glacier, is transformative. In winter, Treble Cone and Cardrona ski fields draw those who want quality terrain without Queenstown's crowds. The Wānaka region's food and dining scene has matured considerably in recent years — Ritual, Francesca's, and a growing number of cellar doors in the Tarras and Luggate wine areas make it a genuine gastronomic destination in its own right.`,
    highlights: [
      "Matukituki Valley and Rob Roy Glacier hike",
      "Mount Aspiring National Park — heli access",
      "Treble Cone and Cardrona — South Island's best skiing",
      "Lake Wānaka sailing and paddleboarding",
      "Puzzling World — the best family diversion in the South Island",
      "Tarras and Luggate wine trail",
    ],
    bestFor: ["Active travellers", "Couples", "Nature lovers"],
    bestSeasons: "December–March for summer; June–September for skiing",
    relatedJourneySlugs: ["the-southern-heart"],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H3YJDB7XB6Q6JFHCR3F3G/249130-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H3YJDB7XB6Q6JFHCR3F3G/249130-preview.webp", alt: "Roys Peak Track, Lake Wānaka – iconic ridgeline hike above the lake" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H471ZS2S5VY248SH4E3WA/249751-preview.webp", alt: "Wānaka and Lake Wānaka – still water reflections below the Southern Alps" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H52T6SV38EKB3KVVRZ4H3/252192-preview.webp", alt: "Lake Wānaka, Otago – crystal-clear lake stretching toward Mount Aspiring National Park" },
    ],
  },

  {
    slug: "central-otago",
    name: "Central Otago",
    region: "South Island",
    tagline: "World-class pinot noir, gold rush history, and landscapes of raw schist beauty.",
    description: `Central Otago is New Zealand's most dramatic wine country — and possibly its most beautiful. The landscape is semi-arid, ancient schist rock broken into tors and bluffs above river valleys where the temperature swings are extreme enough to produce pinot noir of extraordinary concentration and character. Cromwell, Clyde, and Alexandra are the centres: old stone buildings from the gold rush era, fruit orchards, and cellar doors that produce wine taken seriously in Burgundy and beyond.

The Otago Central Rail Trail — a four-day cycle through gorges, viaducts, and historic tunnels — is the benchmark against which all other New Zealand cycle trails are measured. Private guided versions, with luggage transferred and accommodation at boutique lodges each night, make it accessible to those who want the landscape without the logistics. The Lindis Pass and Ahuriri Valley provide access to high-country wilderness of scale that even New Zealanders rarely see — the Lindis Lodge (The Lindis) is one of the country's most architecturally distinguished properties, set in the valley and designed to breathe with its surroundings.`,
    highlights: [
      "Cromwell and Bannockburn — private pinot noir tastings",
      "Otago Central Rail Trail — private guided cycling",
      "The Lindis — architectural lodge in the Ahuriri Valley",
      "Clyde and Alexandra — gold rush heritage towns",
      "Gibbston Valley underground wine cave",
      "Roxburgh Gorge Trail — cycling and river scenery",
    ],
    bestFor: ["Wine lovers", "Active travellers", "Couples"],
    bestSeasons: "February–April for harvest and autumn colour; December–March for cycling",
    relatedJourneySlugs: ["the-masterpiece", "the-epicurean"],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4Q3X3YXH9Q5AVBPA9NHY/251152-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4Q3X3YXH9Q5AVBPA9NHY/251152-preview.webp", alt: "Central Otago – ancient schist tors and semi-arid wine country landscape" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4M8A7Y41R4T26XMZ583S/250906-preview.webp", alt: "Chard Farm vineyard, Queenstown-Lakes – Central Otago pinot noir country" },
    ],
  },

  {
    slug: "otago",
    name: "Otago & Dunedin",
    region: "South Island",
    tagline: "Scotland in the Pacific — a university city of Victorian grandeur, wildlife, and single malt ambition.",
    description: `Dunedin is the most Scottish of New Zealand's cities — settled by Free Church Presbyterians in 1848, built in Oamaru stone and Scots baronial style, and possessed of a certain northern melancholy and dry humour that suits the climate. The railway station is a masterpiece of Flemish Renaissance architecture. The campus of Otago University, the country's oldest, gives the city a youthful energy that its heritage buildings otherwise belie.

The Otago Peninsula is where nature takes over: a narrow finger of land extending into the Pacific Harbour, home to the world's only mainland albatross colony (Royal albatross nest here, just twenty minutes from the city centre), yellow-eyed penguins, little blue penguins, and the rare Hooker's sea lion. Wildlife encounters here are managed carefully and are all the more extraordinary for it. Further afield, the Catlins Coast to the south — waterfalls, petrified forests, fossilised dolphins in the limestone — rewards those who follow the road to its end.`,
    highlights: [
      "Royal Albatross Centre — Taiaroa Head",
      "Yellow-eyed penguin conservation reserve",
      "Dunedin Railway Station and historic precinct",
      "Otago Peninsula wildlife drive",
      "New Zealand Whisky Collection at Oamaru",
      "Baldwin Street — the world's steepest street",
    ],
    bestFor: ["Nature lovers", "Culture & history", "Photographers"],
    bestSeasons: "September–March for wildlife; year-round for the city",
    relatedJourneySlugs: [],
    heroImage: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4ESR6S5PMW660NTTVNAK/250438-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4ESR6S5PMW660NTTVNAK/250438-preview.webp", alt: "Dunedin, Otago – Victorian heritage city with Scottish character" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4FNJYK6RNTPQ1F59W5CD/250515-preview.webp", alt: "Little blue penguin colony, Dunedin – one of the world's smallest penguins" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4NKR2S91XGYAX5DAY4B9/251022-preview.webp", alt: "Larnach Castle, Dunedin – New Zealand's only castle on the Otago Peninsula" },
    ],
  },

  {
    slug: "waitaki",
    name: "Waitaki Valley",
    region: "South Island",
    tagline: "Limestone landscapes, wild salmon rivers, and New Zealand's most unexpected wine country.",
    description: `The Waitaki Valley runs from the Southern Alps to the sea in a series of hydro lakes — Ōhau, Benmore, Ōsaka — and limestone terraces unlike anything else in New Zealand. The town of Ōamaru at the valley's mouth is a Victorian port city of extraordinary ambition, its public buildings raised in the local cream-white limestone and preserved in a state of improbable elegance. The steampunk movement found its natural home here.

Inland, the Waitaki wine region is the newest and perhaps most intriguing in New Zealand: high elevation, limestone soils, and a continental climate that is producing pinot noir and riesling that critics are taking very seriously. The limestone landscape continues north to the Māerewhenua — Maori Rock Art, painted in red ochre on limestone outcrops, is some of the most accessible ancient rock art in the southern hemisphere. The Waitaki River itself is among New Zealand's greatest salmon and trout rivers — private guided fishing here is an experience reserved for those who know to ask.`,
    highlights: [
      "Ōamaru Victorian precinct and steampunk quarter",
      "Little Blue Penguin colony — nightly return walk",
      "Waitaki wine region — pinot noir and riesling tastings",
      "Māerewhenua Māori rock art",
      "Waitaki River — private salmon and trout fishing",
      "Elephant Rocks limestone formations",
    ],
    bestFor: ["Culture & history", "Wine lovers", "Nature lovers"],
    bestSeasons: "October–April for wine region and outdoor activities",
    relatedJourneySlugs: [],
    heroImage: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80", alt: "Waitaki Valley limestone landscape" },
    ],
  },

  {
    slug: "clutha",
    name: "Clutha Region",
    region: "South Island",
    tagline: "New Zealand's mightiest river, gold country, and the Catlins' ancient forest coast.",
    description: `The Clutha District is defined by New Zealand's most powerful river — the Clutha / Mata-Au, which carries more water to the sea than any other river in the country, draining the lakes of the Mackenzie and Central Otago through a series of gorges and plains to the Pacific coast. The river valley is gold country: the rushes of the 1860s left a legacy of dredge remnants, historic settlements, and a pioneer spirit that the region hasn't entirely lost.

The Catlins, on the district's southeastern coast, is the reward for those who follow the road south from Balclutha. This is one of New Zealand's most biodiverse coastal areas: Nugget Point Lighthouse above a sea stack archipelago, Cathedral Caves accessible only at low tide, fossilised dolphins in the Curio Bay limestone, and the world's rarest sea lion, the Hooker's sea lion, hauling out on beaches where they seem genuinely surprised to see you.`,
    highlights: [
      "Nugget Point Lighthouse and sea stacks",
      "Cathedral Caves — tide-dependent access",
      "Curio Bay — fossilised Jurassic forest",
      "Hooker's sea lion encounters on the beach",
      "Clutha River gold-panning heritage trail",
      "Owaka Museum — Catlins pioneering history",
    ],
    bestFor: ["Nature lovers", "Photographers", "Culture & history"],
    bestSeasons: "October–April for Catlins coast; year-round for river valley",
    relatedJourneySlugs: [],
    heroImage: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1920&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80", alt: "Catlins coastline, Clutha" },
    ],
  },

  {
    slug: "southland",
    name: "Southland & the Catlins",
    region: "South Island",
    tagline: "The bottom of the world — wild rivers, the Southern Ocean, and the road less travelled.",
    description: `Southland is New Zealand's southernmost region, and it feels it. The light is different down here — horizontal, white, brilliant on clear days and theatrical on the frequent stormy ones. Invercargill is the most southerly city in the Commonwealth, and from here the roads lead either to Fiordland's western edge or to the empty pastoral heartland of the Southland Plains. The Catlins — technically shared with Clutha — is Southland's most dramatic coastline: a wild, forested stretch where waterfalls fall directly to the beach and yellow-eyed penguins nest within walking distance of the car park.

Bluff, at the very tip of the South Island, is the home of the Bluff oyster — harvested from the cold Foveaux Strait each year between March and August, and considered by many the finest oyster in the world. The Bluff Oyster & Food Festival in May is a genuine New Zealand institution. Rakiura / Stewart Island is visible from Bluff on clear days, a short ferry crossing to a place that is 85% national park, where kiwi walk on open beaches at dusk and the Aurora Australis lights the winter sky.`,
    highlights: [
      "Bluff oysters — Foveaux Strait harvest experience",
      "Catlins Coast — waterfalls, penguins, sea lions",
      "Milford Road extension to the western fiords",
      "Invercargill — E.H. Stead Heritage Museum",
      "Lake Manapouri — gateway to Doubtful Sound",
      "Aurora Australis — southern lights viewing",
    ],
    bestFor: ["Nature lovers", "Food enthusiasts", "Photographers"],
    bestSeasons: "October–March for wildlife; March–August for oysters",
    relatedJourneySlugs: [],
    heroImage: "https://cdn-syd.brandkit.com/accounts/505/files/01HSRT9QGPRDWP8XYHVDAYJ09W/469476-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/505/files/01HSRT9QGPRDWP8XYHVDAYJ09W/469476-preview.webp", alt: "Dock Bay, Te Anau – lakeside gateway to Fiordland and Doubtful Sound" },
      { src: "https://cdn-syd.brandkit.com/accounts/201/files/01HF8H4ANDSPWQNR9X9M94Z5PW/250066-preview.webp", alt: "Bluff, Southland – New Zealand's southernmost port and home of the Bluff oyster" },
    ],
  },

  {
    slug: "rakiura",
    name: "Rakiura / Stewart Island",
    region: "South Island",
    tagline: "New Zealand's third island — 85% national park, wild kiwi on open beaches, and the Southern Ocean.",
    description: `Rakiura / Stewart Island sits at 47 degrees south, twenty minutes by light aircraft from Invercargill, and feels genuinely removed from the world. Eighty-five per cent of the island is Rakiura National Park — ancient podocarp forest of rimu, tōtara, and rātā, threaded with walking tracks that lead to deserted beaches and remote bays. Halfmoon Bay, the island's only real settlement, has a population of around 400 people, most of whom are involved in fishing.

The reason most visitors come is the kiwi. Rakiura has one of the highest wild kiwi densities in New Zealand — and uniquely, Mason Bay on the island's west coast is a place where kiwi feed openly on the beach at dusk, visible without a guide, in the fading light. Seeing a wild kiwi — the national bird, nocturnal, shy, and in serious decline on the mainland — in this setting is a wildlife experience with very few equivalents anywhere in the world.`,
    highlights: [
      "Mason Bay — wild kiwi on open beach at dusk",
      "Rakiura Track — three-day Great Walk",
      "Ulva Island — open bird sanctuary with kākāpō history",
      "Fishing in Paterson Inlet — blue cod, pāua",
      "Aurora Australis from the southern shore",
      "Half Moon Bay village — craft beer and fresh seafood",
    ],
    bestFor: ["Wildlife enthusiasts", "Nature lovers", "Active travellers"],
    bestSeasons: "October–March for walks; year-round for kiwi and wildlife",
    relatedJourneySlugs: [],
    heroImage: "https://cdn-syd.brandkit.com/accounts/505/files/01HSRTBDXGGDDTCYKZ5EJ6A4AX/475292-preview.webp",
    images: [
      { src: "https://cdn-syd.brandkit.com/accounts/505/files/01HSRTBDXGGDDTCYKZ5EJ6A4AX/475292-preview.webp", alt: "Maori Beach, Rakiura Track, Stewart Island – serene beach with native podocarp forest" },
      { src: "https://cdn-syd.brandkit.com/accounts/505/files/01HSRTB13NTF9K22Z2SP27GBSJ/473857-preview.webp", alt: "Mt Anglem (Hananui), Stewart Island – panoramic view from Rakiura's highest point at 980m" },
      { src: "https://cdn-syd.brandkit.com/accounts/505/files/01HSRT83XRWF8G36MRKX3HKFZY/464443-preview.webp", alt: "Halfmoon Bay, Rakiura – the island's only village, calm waters and fishing boats" },
    ],
  },
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}
