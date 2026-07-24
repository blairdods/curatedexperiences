/**
 * Video asset registry — placements defined by CE_Visual_Asset_Library.xlsx.
 *
 * Each journey has up to 3 video concepts (V1, V2, V3) per the XLSX.
 * `placements` drives getVideosByPlacement() used in journey pages and the homepage.
 *
 * All videos served from Supabase Storage.
 */

export interface VideoAsset {
  id: string;
  filename: string;
  title: string;
  location: string;
  region: string;
  concept: string;       // XLSX concept description
  placements: string[];  // page slugs this video appears on
  src: string;
  poster?: string;
}

const V = (filename: string) =>
  `https://bwpbvdmdwjqguiliymnq.supabase.co/storage/v1/object/public/videos/${filename}`;

export const VIDEOS: VideoAsset[] = [
  // ── HOMEPAGE ──────────────────────────────────────────────────────────────
  {
    id: "milford-sound-fiordland",
    filename: "234395-milford-sound-fiordland.mp4",
    title: "Milford Sound",
    location: "Milford Sound (Piopiotahi), Fiordland",
    region: "Fiordland",
    concept: "Cinematic NZ aerial montage",
    placements: ["home", "journeys/the-masterpiece", "journeys/the-discovery", "destinations/fiordland"],
    src: V("234395-milford-sound-fiordland.mp4"),
  },
  {
    id: "christchurch-helicopters",
    filename: "232665-christchurch-helicopters-christchurch.mp4",
    title: "Helicopter & Private Aviation",
    location: "Canterbury, South Island",
    region: "Canterbury",
    concept: "Helicopter / private aviation hero",
    placements: ["home"],
    src: V("232665-christchurch-helicopters-christchurch.mp4"),
    poster: "/assets/images/video-posters/christchurch-helicopters-poster.jpg",
  },
  {
    id: "luxury-accommodation",
    filename: "234500-luxury-accommodation-15.mp4",
    title: "Lodge Arrival",
    location: "New Zealand luxury lodge",
    region: "General",
    concept: "Lodge / arrival sequence",
    placements: ["home", "about"],
    src: V("234500-luxury-accommodation-15.mp4"),
  },

  // ── THE MASTERPIECE ───────────────────────────────────────────────────────
  {
    id: "kauri-cliffs-golf",
    filename: "233565-kauri-cliffs-golf-course-northland.mp4",
    title: "Kauri Cliffs",
    location: "Kauri Cliffs, Northland",
    region: "Northland",
    concept: "Lodge arrival sequence — Kauri Cliffs gates to suite",
    placements: ["journeys/the-masterpiece", "destinations/northland"],
    src: V("233565-kauri-cliffs-golf-course-northland.mp4"),
  },
  {
    id: "wai-o-tapu-aerials",
    filename: "232888-wai-o-tapu-rotorua-aerials.mp4",
    title: "Wai-O-Tapu Geothermal",
    location: "Wai-O-Tapu, Rotorua",
    region: "Bay of Plenty",
    concept: "Geothermal valley + private sail on Lake Rotoiti",
    placements: ["journeys/the-masterpiece", "journeys/the-hidden-trail", "destinations/rotorua"],
    src: V("232888-wai-o-tapu-rotorua-aerials.mp4"),
  },

  // ── THE EPICUREAN ─────────────────────────────────────────────────────────
  {
    id: "te-whare-ra-vineyard",
    filename: "233593-te-whare-ra-vineyard-marlborough.mp4",
    title: "Te Whare Rā Vineyard",
    location: "Marlborough wine country",
    region: "Marlborough",
    concept: "Vineyard golden hour aerial",
    placements: ["journeys/the-epicurean", "journeys/the-southern-heart", "destinations/marlborough"],
    src: V("233593-te-whare-ra-vineyard-marlborough.mp4"),
  },
  {
    id: "coffee-roastery-raglan",
    filename: "234384-coffee-roastery-raglan.mp4",
    title: "Raglan Coffee Roastery",
    location: "Raglan, Waikato",
    region: "Waikato",
    concept: "Maker's hands — pouring, decanting, food prep",
    placements: ["journeys/the-epicurean", "destinations/waikato"],
    src: V("234384-coffee-roastery-raglan.mp4"),
  },
  {
    id: "te-puia-geysers",
    filename: "232661-te-puia-geysers-rotorua.mp4",
    title: "Te Puia Geysers",
    location: "Te Puia, Rotorua",
    region: "Bay of Plenty",
    concept: "Geothermal landscape — Wai-O-Tapu / Waimangu steam pools",
    placements: ["journeys/the-epicurean", "destinations/rotorua"],
    src: V("232661-te-puia-geysers-rotorua.mp4"),
  },

  // ── THE EXPEDITION ────────────────────────────────────────────────────────
  {
    id: "franz-josef-glacier",
    filename: "235524-franz-josef-glacier-west-coast.mp4",
    title: "Franz Josef Glacier",
    location: "Franz Josef Glacier, West Coast",
    region: "West Coast",
    concept: "Heli-hike on glacier — landing + walk-out",
    placements: ["journeys/the-expedition", "journeys/the-southern-heart", "destinations/west-coast"],
    src: V("235524-franz-josef-glacier-west-coast.mp4"),
  },
  {
    id: "shotover-canyon-queenstown",
    filename: "233591-shotover-canyon-swing-aerials-queenstown-otago.mp4",
    title: "Shotover Canyon",
    location: "Shotover River, Queenstown",
    region: "Otago",
    concept: "Shotover canyon jet boat",
    placements: ["journeys/the-expedition", "destinations/queenstown"],
    src: V("233591-shotover-canyon-swing-aerials-queenstown-otago.mp4"),
  },

  // ── THE DISCOVERY ─────────────────────────────────────────────────────────
  {
    id: "te-papa-wellington",
    filename: "233595-te-papa-te-marae-wellington.mp4",
    title: "Te Papa Marae",
    location: "Te Papa, Wellington",
    region: "Wellington",
    concept: "Te Papa / Auckland cultural moments",
    placements: ["journeys/the-discovery", "destinations/wellington"],
    src: V("233595-te-papa-te-marae-wellington.mp4"),
  },

  // ── THE HIDDEN TRAIL ──────────────────────────────────────────────────────
  {
    id: "bay-of-islands-parasailing",
    filename: "233579-parasailing-bay-of-islands-northland.mp4",
    title: "Bay of Islands",
    location: "Bay of Islands, Northland",
    region: "Northland",
    concept: "Bay of Islands sailing — yacht under sail at golden hour",
    placements: ["journeys/the-hidden-trail", "destinations/northland"],
    src: V("233579-parasailing-bay-of-islands-northland.mp4"),
  },
  {
    id: "abel-tasman",
    filename: "234448-abel-tasman-national-park-nelson-tasman.mp4",
    title: "Abel Tasman",
    location: "Abel Tasman National Park",
    region: "Nelson-Tasman",
    concept: "Abel Tasman aerial — track over turquoise water + kayakers",
    placements: ["journeys/the-hidden-trail", "destinations/tasman-nelson"],
    src: V("234448-abel-tasman-national-park-nelson-tasman.mp4"),
  },
  {
    id: "queen-charlotte-track",
    filename: "234422-queen-charlotte-track-marlborough-sounds.mp4",
    title: "Queen Charlotte Track",
    location: "Queen Charlotte Track, Marlborough Sounds",
    region: "Marlborough",
    concept: "Mt Tarawera summit + Orakei Korako geothermal",
    placements: ["journeys/the-hidden-trail", "destinations/marlborough"],
    src: V("234422-queen-charlotte-track-marlborough-sounds.mp4"),
  },

  // ── THE SOUTHERN HEART ────────────────────────────────────────────────────
  {
    id: "dolphins-kaikoura",
    filename: "234389-dolphins-kaikoura.mp4",
    title: "Kaikōura Dolphins",
    location: "Kaikōura, Canterbury",
    region: "Canterbury",
    concept: "Kaikoura wildlife — whale tail at sunrise / dolphin pod",
    placements: ["journeys/the-southern-heart", "destinations/kaikoura"],
    src: V("234389-dolphins-kaikoura.mp4"),
  },
  {
    id: "lake-tekapo",
    filename: "233566-lake-tekapo-canterbury.mp4",
    title: "Lake Tekapō",
    location: "Lake Tekapō, Mackenzie Basin",
    region: "Canterbury",
    concept: "Marlborough vineyard sunrise + Sounds seafood cruise",
    placements: ["journeys/the-southern-heart", "destinations/mackenzie-basin"],
    src: V("233566-lake-tekapo-canterbury.mp4"),
  },
  {
    id: "punakaiki-west-coast",
    filename: "232650-punakaiki-pancake-rocks-west-coast.mp4",
    title: "Punakaiki Pancake Rocks",
    location: "Punakaiki, West Coast",
    region: "West Coast",
    concept: "Punakaiki Pancake Rocks + blowhole in motion",
    placements: ["journeys/the-southern-heart", "destinations/west-coast"],
    src: V("232650-punakaiki-pancake-rocks-west-coast.mp4"),
  },

  // ── DESTINATION-ONLY ──────────────────────────────────────────────────────
  {
    id: "west-coast-road",
    filename: "232654-west-coast-road-west-coast.mp4",
    title: "West Coast Highway",
    location: "West Coast, South Island",
    region: "West Coast",
    concept: "West Coast scenic drive",
    placements: ["destinations/west-coast"],
    src: V("232654-west-coast-road-west-coast.mp4"),
  },
];

export function getVideoById(id: string): VideoAsset | undefined {
  return VIDEOS.find((v) => v.id === id);
}

export function getVideosByPlacement(placement: string): VideoAsset[] {
  return VIDEOS.filter((v) => v.placements.includes(placement));
}
