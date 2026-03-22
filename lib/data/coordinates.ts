/**
 * NZ location coordinates for journey route maps.
 * [longitude, latitude] format (Mapbox convention).
 */

export const NZ_COORDINATES: Record<string, [number, number]> = {
  // South Island
  "Queenstown": [168.6626, -45.0312],
  "Fiordland": [167.7180, -45.4161],
  "Te Anau": [167.7180, -45.4161],
  "Milford Sound": [167.8974, -44.6713],
  "Wanaka": [169.1320, -44.7032],
  "Aoraki / Mount Cook": [170.0962, -43.7340],
  "Aoraki": [170.0962, -43.7340],
  "Lake Tekapo": [170.4766, -44.0037],
  "Arrowtown": [168.8272, -44.9420],
  "Franz Josef": [170.1832, -43.3883],
  "West Coast": [170.1832, -43.3883],
  "Christchurch": [172.6362, -43.5321],
  "Dunedin": [170.5028, -45.8788],
  "Marlborough": [173.9610, -41.5134],
  "Blenheim": [173.9610, -41.5134],
  "Glenorchy": [168.3841, -44.8500],

  // North Island
  "Wellington": [174.7762, -41.2865],
  "Hawke's Bay": [176.8403, -39.4928],
  "Napier": [176.9120, -39.4902],
  "Auckland": [174.7633, -36.8485],
  "Rotorua": [176.2497, -38.1368],
  "Bay of Islands": [174.1190, -35.2282],
  "Wairarapa": [175.4576, -41.2440],
  "Martinborough": [175.4576, -41.2140],
};

export interface RoutePoint {
  name: string;
  coordinates: [number, number];
  day?: number;
}

/**
 * Get route points for a journey based on its itinerary.
 */
export function getRouteForJourney(
  slug: string
): RoutePoint[] {
  const routes: Record<string, RoutePoint[]> = {
    "south-island-odyssey": [
      { name: "Queenstown", coordinates: NZ_COORDINATES["Queenstown"], day: 1 },
      { name: "Glenorchy", coordinates: NZ_COORDINATES["Glenorchy"], day: 3 },
      { name: "Te Anau", coordinates: NZ_COORDINATES["Te Anau"], day: 4 },
      { name: "Milford Sound", coordinates: NZ_COORDINATES["Milford Sound"], day: 5 },
      { name: "Wanaka", coordinates: NZ_COORDINATES["Wanaka"], day: 6 },
      { name: "Aoraki / Mount Cook", coordinates: NZ_COORDINATES["Aoraki / Mount Cook"], day: 8 },
      { name: "Lake Tekapo", coordinates: NZ_COORDINATES["Lake Tekapo"], day: 10 },
      { name: "Arrowtown", coordinates: NZ_COORDINATES["Arrowtown"], day: 11 },
      { name: "Queenstown", coordinates: NZ_COORDINATES["Queenstown"], day: 12 },
    ],
    "wine-culinary-trail": [
      { name: "Marlborough", coordinates: NZ_COORDINATES["Marlborough"], day: 1 },
      { name: "Blenheim", coordinates: NZ_COORDINATES["Blenheim"], day: 3 },
      { name: "Wellington", coordinates: NZ_COORDINATES["Wellington"], day: 4 },
      { name: "Wairarapa", coordinates: NZ_COORDINATES["Wairarapa"], day: 6 },
      { name: "Napier", coordinates: NZ_COORDINATES["Napier"], day: 7 },
      { name: "Hawke's Bay", coordinates: NZ_COORDINATES["Hawke's Bay"], day: 8 },
    ],
    "wilderness-adventure": [
      { name: "Queenstown", coordinates: NZ_COORDINATES["Queenstown"], day: 1 },
      { name: "Franz Josef", coordinates: NZ_COORDINATES["Franz Josef"], day: 4 },
      { name: "Aoraki / Mount Cook", coordinates: NZ_COORDINATES["Aoraki / Mount Cook"], day: 7 },
      { name: "Te Anau", coordinates: NZ_COORDINATES["Te Anau"], day: 9 },
      { name: "Milford Sound", coordinates: NZ_COORDINATES["Milford Sound"], day: 10 },
      { name: "Queenstown", coordinates: NZ_COORDINATES["Queenstown"], day: 11 },
    ],
  };

  return routes[slug] ?? [];
}
