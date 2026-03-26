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
  "Taupo": [176.0702, -38.6857],
  "Ahuriri Valley": [169.8500, -44.3000],
  "Kerikeri": [174.0083, -35.2267],
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
    "the-masterpiece": [
      { name: "Bay of Islands", coordinates: NZ_COORDINATES["Bay of Islands"], day: 1 },
      { name: "Auckland", coordinates: NZ_COORDINATES["Auckland"], day: 3 },
      { name: "Taupo", coordinates: NZ_COORDINATES["Taupo"], day: 5 },
      { name: "Hawke's Bay", coordinates: NZ_COORDINATES["Hawke's Bay"], day: 8 },
      { name: "Ahuriri Valley", coordinates: NZ_COORDINATES["Ahuriri Valley"], day: 10 },
      { name: "Queenstown", coordinates: NZ_COORDINATES["Queenstown"], day: 12 },
    ],
    "the-epicurean": [
      { name: "Queenstown", coordinates: NZ_COORDINATES["Queenstown"], day: 1 },
      { name: "Ahuriri Valley", coordinates: NZ_COORDINATES["Ahuriri Valley"], day: 4 },
      { name: "Christchurch", coordinates: NZ_COORDINATES["Christchurch"], day: 6 },
      { name: "Rotorua", coordinates: NZ_COORDINATES["Rotorua"], day: 6 },
      { name: "Auckland", coordinates: NZ_COORDINATES["Auckland"], day: 8 },
    ],
    "the-expedition": [
      { name: "Queenstown", coordinates: NZ_COORDINATES["Queenstown"], day: 1 },
      { name: "Franz Josef", coordinates: NZ_COORDINATES["Franz Josef"], day: 4 },
      { name: "Aoraki / Mount Cook", coordinates: NZ_COORDINATES["Aoraki / Mount Cook"], day: 7 },
      { name: "Te Anau", coordinates: NZ_COORDINATES["Te Anau"], day: 9 },
      { name: "Milford Sound", coordinates: NZ_COORDINATES["Milford Sound"], day: 10 },
      { name: "Queenstown", coordinates: NZ_COORDINATES["Queenstown"], day: 11 },
    ],
    "the-discovery": [
      { name: "Auckland", coordinates: NZ_COORDINATES["Auckland"], day: 1 },
      { name: "Taupo", coordinates: NZ_COORDINATES["Taupo"], day: 3 },
      { name: "Hawke's Bay", coordinates: NZ_COORDINATES["Hawke's Bay"], day: 6 },
      { name: "Wairarapa", coordinates: NZ_COORDINATES["Wairarapa"], day: 8 },
      { name: "Christchurch", coordinates: NZ_COORDINATES["Christchurch"], day: 10 },
      { name: "Queenstown", coordinates: NZ_COORDINATES["Queenstown"], day: 12 },
    ],
    "the-hidden-trail": [
      { name: "Queenstown", coordinates: NZ_COORDINATES["Queenstown"], day: 1 },
      { name: "Fiordland", coordinates: NZ_COORDINATES["Fiordland"], day: 1 },
      { name: "West Coast", coordinates: NZ_COORDINATES["West Coast"], day: 4 },
      { name: "Queenstown", coordinates: NZ_COORDINATES["Queenstown"], day: 9 },
    ],
    "the-southern-heart": [
      { name: "Queenstown", coordinates: NZ_COORDINATES["Queenstown"], day: 1 },
      { name: "Wanaka", coordinates: NZ_COORDINATES["Wanaka"], day: 3 },
      { name: "Aoraki / Mount Cook", coordinates: NZ_COORDINATES["Aoraki / Mount Cook"], day: 5 },
      { name: "Queenstown", coordinates: NZ_COORDINATES["Queenstown"], day: 7 },
    ],
  };

  return routes[slug] ?? [];
}
