/**
 * Video asset registry.
 *
 * All videos are MP4 and served from /public/assets/videos/.
 * For Vercel production deployments, large files (>50 MB) should be
 * uploaded to Supabase Storage and `src` updated to the CDN URL:
 *   https://bwpbvdmdwjqguiliymnq.supabase.co/storage/v1/object/public/videos/[filename]
 *
 * Files over 50 MB:
 *   234422-queen-charlotte-track-marlborough-sounds.mp4  (88 MB)
 *   234448-abel-tasman-national-park-nelson-tasman.mp4   (66 MB)
 *   232888-wai-o-tapu-rotorua-aerials.mp4                (46 MB)
 */

export interface VideoAsset {
  id: string;
  filename: string;
  title: string;
  location: string;
  region: string;
  placements: string[];
  src: string;
  poster?: string;
}

const V = (filename: string) =>
  `https://bwpbvdmdwjqguiliymnq.supabase.co/storage/v1/object/public/videos/${filename}`;

export const VIDEOS: VideoAsset[] = [
  {
    id: "punakaiki-west-coast",
    filename: "232650-punakaiki-pancake-rocks-west-coast.mp4",
    title: "Punakaiki Pancake Rocks",
    location: "Punakaiki, West Coast",
    region: "West Coast",
    placements: ["destinations/west-coast", "journeys/the-southern-heart"],
    src: V("232650-punakaiki-pancake-rocks-west-coast.mp4"),
  },
  {
    id: "west-coast-road",
    filename: "232654-west-coast-road-west-coast.mp4",
    title: "West Coast Highway Drive",
    location: "West Coast, South Island",
    region: "West Coast",
    placements: ["destinations/west-coast"],
    src: V("232654-west-coast-road-west-coast.mp4"),
  },
  {
    id: "te-puia-geysers",
    filename: "232661-te-puia-geysers-rotorua.mp4",
    title: "Te Puia Geysers",
    location: "Te Puia, Rotorua",
    region: "Bay of Plenty",
    placements: ["destinations/rotorua", "journeys/the-epicurean"],
    src: V("232661-te-puia-geysers-rotorua.mp4"),
  },
  {
    id: "christchurch-helicopters",
    filename: "232665-christchurch-helicopters-christchurch.mp4",
    title: "Christchurch Helicopter Flights",
    location: "Christchurch, Canterbury",
    region: "Canterbury",
    placements: ["destinations/christchurch-canterbury"],
    src: V("232665-christchurch-helicopters-christchurch.mp4"),
  },
  {
    id: "wai-o-tapu-aerials",
    filename: "232888-wai-o-tapu-rotorua-aerials.mp4",
    title: "Wai-O-Tapu Aerial",
    location: "Wai-O-Tapu, Rotorua",
    region: "Bay of Plenty",
    placements: ["destinations/rotorua", "journeys/the-epicurean", "journeys/the-masterpiece"],
    src: V("232888-wai-o-tapu-rotorua-aerials.mp4"),
  },
  {
    id: "kauri-cliffs-golf",
    filename: "233565-kauri-cliffs-golf-course-northland.mp4",
    title: "Kauri Cliffs Golf Course",
    location: "Kauri Cliffs, Northland",
    region: "Northland",
    placements: ["destinations/northland", "journeys/the-masterpiece", "journeys/the-hidden-trail"],
    src: V("233565-kauri-cliffs-golf-course-northland.mp4"),
  },
  {
    id: "lake-tekapo",
    filename: "233566-lake-tekapo-canterbury.mp4",
    title: "Lake Tekapō",
    location: "Lake Tekapō, Canterbury",
    region: "Canterbury",
    placements: ["destinations/mackenzie-tekapo", "journeys/the-southern-heart"],
    src: V("233566-lake-tekapo-canterbury.mp4"),
  },
  {
    id: "bay-of-islands-parasailing",
    filename: "233579-parasailing-bay-of-islands-northland.mp4",
    title: "Bay of Islands Parasailing",
    location: "Bay of Islands, Northland",
    region: "Northland",
    placements: ["destinations/northland", "journeys/the-hidden-trail"],
    src: V("233579-parasailing-bay-of-islands-northland.mp4"),
  },
  {
    id: "shotover-canyon-queenstown",
    filename: "233591-shotover-canyon-swing-aerials-queenstown-otago.mp4",
    title: "Shotover Canyon Aerial",
    location: "Shotover River, Queenstown",
    region: "Otago",
    placements: ["destinations/queenstown", "journeys/the-expedition"],
    src: V("233591-shotover-canyon-swing-aerials-queenstown-otago.mp4"),
  },
  {
    id: "te-whare-ra-vineyard",
    filename: "233593-te-whare-ra-vineyard-marlborough.mp4",
    title: "Te Whare Rā Vineyard",
    location: "Marlborough wine country",
    region: "Marlborough",
    placements: ["destinations/marlborough", "journeys/the-epicurean"],
    src: V("233593-te-whare-ra-vineyard-marlborough.mp4"),
  },
  {
    id: "te-papa-wellington",
    filename: "233595-te-papa-te-marae-wellington.mp4",
    title: "Te Papa Marae, Wellington",
    location: "Te Papa, Wellington",
    region: "Wellington",
    placements: ["destinations/wellington"],
    src: V("233595-te-papa-te-marae-wellington.mp4"),
  },
  {
    id: "coffee-roastery-raglan",
    filename: "234384-coffee-roastery-raglan.mp4",
    title: "Coffee Roastery, Raglan",
    location: "Raglan, Waikato",
    region: "Waikato",
    placements: ["home", "journeys/the-epicurean", "destinations/waikato"],
    src: V("234384-coffee-roastery-raglan.mp4"),
  },
  {
    id: "dolphins-kaikoura",
    filename: "234389-dolphins-kaikoura.mp4",
    title: "Dolphins at Kaikōura",
    location: "Kaikōura, Canterbury",
    region: "Canterbury",
    placements: ["destinations/kaikoura", "journeys/the-southern-heart"],
    src: V("234389-dolphins-kaikoura.mp4"),
  },
  {
    id: "milford-sound-fiordland",
    filename: "234395-milford-sound-fiordland.mp4",
    title: "Milford Sound, Fiordland",
    location: "Milford Sound (Piopiotahi), Fiordland",
    region: "Fiordland",
    placements: ["home", "destinations/fiordland", "journeys/the-masterpiece", "journeys/the-expedition"],
    src: V("234395-milford-sound-fiordland.mp4"),
  },
  {
    id: "queen-charlotte-track",
    filename: "234422-queen-charlotte-track-marlborough-sounds.mp4",
    title: "Queen Charlotte Track",
    location: "Queen Charlotte Track, Marlborough Sounds",
    region: "Marlborough",
    placements: ["destinations/marlborough", "journeys/the-hidden-trail"],
    src: V("234422-queen-charlotte-track-marlborough-sounds.mp4"),
  },
  {
    id: "abel-tasman",
    filename: "234448-abel-tasman-national-park-nelson-tasman.mp4",
    title: "Abel Tasman National Park",
    location: "Abel Tasman, Nelson-Tasman",
    region: "Nelson-Tasman",
    placements: ["destinations/tasman-nelson", "journeys/the-hidden-trail"],
    src: V("234448-abel-tasman-national-park-nelson-tasman.mp4"),
  },
  {
    id: "luxury-accommodation",
    filename: "234500-luxury-accommodation-15.mp4",
    title: "Luxury Lodge Interior",
    location: "New Zealand luxury accommodation",
    region: "General",
    placements: ["home", "about"],
    src: V("234500-luxury-accommodation-15.mp4"),
  },
  {
    id: "franz-josef-glacier",
    filename: "235524-franz-josef-glacier-west-coast.mp4",
    title: "Franz Josef Glacier",
    location: "Franz Josef Glacier, West Coast",
    region: "West Coast",
    placements: ["destinations/west-coast", "journeys/the-expedition", "journeys/the-southern-heart"],
    src: V("235524-franz-josef-glacier-west-coast.mp4"),
  },
];

export function getVideoById(id: string): VideoAsset | undefined {
  return VIDEOS.find((v) => v.id === id);
}

export function getVideosByPlacement(placement: string): VideoAsset[] {
  return VIDEOS.filter((v) => v.placements.includes(placement));
}
