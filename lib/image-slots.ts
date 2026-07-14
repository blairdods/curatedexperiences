export interface ManagedImage {
  src: string;
  alt: string;
}

export interface ImageSlotDefinition {
  key: string;
  label: string;
  group: string;
  mode: "single" | "rotation";
  description?: string;
  defaultRegion?: string;
  fallbackImages: ManagedImage[];
}

export type ImageSlotOverrides = Record<string, ManagedImage[]>;

const A = (name: string) => `/assets/images/${name}`;

export const IMAGE_SLOT_SETTING_KEY = "image_slots";

export const IMAGE_SLOT_DEFINITIONS: ImageSlotDefinition[] = [
  {
    key: "home.hero.luxury-us",
    label: "Homepage Hero — US Luxury / Default",
    group: "Homepage Hero Variants",
    mode: "rotation",
    description: "Default homepage hero variant. Rotates for most direct/default visitors.",
    fallbackImages: [
      {
        src: A("233206-aoraki-mt-cook-canterbury.jpg"),
        alt: "Aoraki / Mount Cook rising above the Southern Alps, New Zealand",
      },
      {
        src: A("233455-glenorchy-queenstown.jpg"),
        alt: "Glenorchy alpine valley and Lake Wakatipu, New Zealand",
      },
      {
        src: A("230332-milford-sound-fiordland.jpg"),
        alt: "Milford Sound with Mitre Peak reflected in still water",
      },
    ],
  },
  {
    key: "home.hero.adventure-us",
    label: "Homepage Hero — US Adventure",
    group: "Homepage Hero Variants",
    mode: "rotation",
    fallbackImages: [
      { src: A("233456-franz-josef-west-coast.jpg"), alt: "Franz Josef Glacier and West Coast alpine landscape" },
      { src: A("234734-shotover-river-queenstown.jpg"), alt: "Shotover River canyon near Queenstown" },
      { src: A("230327-cleddau-valley-fiordland.jpg"), alt: "Cleddau Valley wilderness in Fiordland" },
    ],
  },
  {
    key: "home.hero.culinary-us",
    label: "Homepage Hero — US Culinary / Wine",
    group: "Homepage Hero Variants",
    mode: "rotation",
    fallbackImages: [
      { src: A("233179-craggy-range-hawkes-bay.jpg"), alt: "Craggy Range winery in Hawke's Bay" },
      { src: A("234051-lake-dunstan-central-otago.jpg"), alt: "Lake Dunstan and Central Otago wine country" },
      { src: A("230807-hawkes-bay-hawkes-bay.jpg"), alt: "Hawke's Bay vineyard landscape" },
    ],
  },
  {
    key: "home.hero.nature-sg",
    label: "Homepage Hero — Singapore Nature",
    group: "Homepage Hero Variants",
    mode: "rotation",
    fallbackImages: [
      { src: A("233461-milford-sound-fiordland.jpg"), alt: "Milford Sound fiord landscape" },
      { src: A("233244-wanaka-lake-wanaka.jpg"), alt: "Lake Wanaka and Southern Alps" },
      { src: A("233207-aoraki-mt-cook-canterbury.jpg"), alt: "Aoraki / Mount Cook alpine scenery" },
    ],
  },
  {
    key: "home.hero.adventure-sg",
    label: "Homepage Hero — Singapore Adventure",
    group: "Homepage Hero Variants",
    mode: "rotation",
    fallbackImages: [
      { src: A("232289-roys-peak-track-lake-wanaka.jpg"), alt: "Roys Peak Track above Lake Wanaka" },
      { src: A("230147-tongariro-apline-crossing-ruapehu.jpg"), alt: "Tongariro Alpine Crossing volcanic landscape" },
      { src: A("235198-abel-tasman-national-park-nelson.jpg"), alt: "Abel Tasman National Park coast" },
    ],
  },
  {
    key: "home.hero.culinary-sg",
    label: "Homepage Hero — Singapore Culinary / Wine",
    group: "Homepage Hero Variants",
    mode: "rotation",
    fallbackImages: [
      { src: A("233179-craggy-range-hawkes-bay.jpg"), alt: "Craggy Range winery in Hawke's Bay" },
      { src: A("234613-cromwell-central-otago.jpg"), alt: "Cromwell and Central Otago wine country" },
      { src: A("233357-marlborough-sounds-marlborough.jpg"), alt: "Marlborough Sounds coastal landscape" },
    ],
  },
  {
    key: "home.hero.international",
    label: "Homepage Hero — International",
    group: "Homepage Hero Variants",
    mode: "rotation",
    fallbackImages: [
      { src: A("233206-aoraki-mt-cook-canterbury.jpg"), alt: "Aoraki / Mount Cook rising above the Southern Alps" },
      { src: A("229483-bay-of-islands-northland.jpg"), alt: "Bay of Islands coastline and turquoise water" },
      { src: A("233460-glenorchy-queenstown.jpg"), alt: "Glenorchy and Lake Wakatipu alpine scenery" },
    ],
  },

  { key: "home.difference.image", label: "Homepage — Curated Difference Image", group: "Homepage Sections", mode: "single", fallbackImages: [{ src: A("230332-milford-sound-fiordland.jpg"), alt: "Milford Sound, Fiordland" }] },
  { key: "home.journey.masterpiece", label: "Homepage — Masterpiece Card", group: "Homepage Sections", mode: "single", fallbackImages: [{ src: A("233455-glenorchy-queenstown.jpg"), alt: "Glenorchy, Queenstown" }] },
  { key: "home.journey.epicurean", label: "Homepage — Epicurean Card", group: "Homepage Sections", mode: "single", fallbackImages: [{ src: A("233179-craggy-range-hawkes-bay.jpg"), alt: "Craggy Range winery, Hawke's Bay" }] },
  { key: "home.journey.expedition", label: "Homepage — Expedition Card", group: "Homepage Sections", mode: "single", fallbackImages: [{ src: A("233456-franz-josef-west-coast.jpg"), alt: "Franz Josef Glacier, West Coast" }] },
  { key: "home.journey.discovery", label: "Homepage — Discovery Card", group: "Homepage Sections", mode: "single", fallbackImages: [{ src: A("232376-cape-kidnappers-hawkes-bay.jpg"), alt: "Cape Kidnappers, Hawke's Bay" }] },
  { key: "home.journey.hidden-trail", label: "Homepage — Hidden Trail Card", group: "Homepage Sections", mode: "single", fallbackImages: [{ src: A("231817-bay-of-islands-northland.jpg"), alt: "Bay of Islands, Northland" }] },
  { key: "home.journey.southern-heart", label: "Homepage — Southern Heart Card", group: "Homepage Sections", mode: "single", fallbackImages: [{ src: A("516641-kaikoura-canterbury.jpg"), alt: "Kaikoura, Canterbury" }] },
  { key: "home.destinations.feature", label: "Homepage — Destinations Feature", group: "Homepage Sections", mode: "single", fallbackImages: [{ src: A("233461-milford-sound-fiordland.jpg"), alt: "Milford Sound, Fiordland" }] },
  { key: "home.destinations.northland", label: "Homepage — Northland Destination Tile", group: "Homepage Sections", mode: "single", fallbackImages: [{ src: A("229483-bay-of-islands-northland.jpg"), alt: "Bay of Islands, Northland" }] },
  { key: "home.destinations.rotorua", label: "Homepage — Rotorua Destination Tile", group: "Homepage Sections", mode: "single", fallbackImages: [{ src: A("229251-rotorua-bay-of-plenty.jpg"), alt: "Rotorua geothermal landscape" }] },
  { key: "home.destinations.central-otago", label: "Homepage — Central Otago Destination Tile", group: "Homepage Sections", mode: "single", fallbackImages: [{ src: A("230043-lake-wakatipu-queenstown.jpg"), alt: "Lake Wakatipu, Queenstown" }] },
  { key: "home.privacy.image", label: "Homepage — Privacy Section Image", group: "Homepage Sections", mode: "single", fallbackImages: [{ src: A("233460-glenorchy-queenstown.jpg"), alt: "Glenorchy, Queenstown" }] },
  { key: "home.journal.when-to-visit", label: "Homepage — Journal Card 1 Fallback", group: "Homepage Sections", mode: "single", fallbackImages: [{ src: A("233207-aoraki-mt-cook-canterbury.jpg"), alt: "Aoraki / Mount Cook" }] },
  { key: "home.journal.milford", label: "Homepage — Journal Card 2 Fallback", group: "Homepage Sections", mode: "single", fallbackImages: [{ src: A("230334-milford-sound-fiordland.jpg"), alt: "Milford Sound, Fiordland" }] },
  { key: "home.journal.minaret", label: "Homepage — Journal Card 3 Fallback", group: "Homepage Sections", mode: "single", fallbackImages: [{ src: A("233448-minaret-station-wanaka.jpg"), alt: "Minaret Station, Wanaka" }] },

  { key: "page.journeys.hero", label: "Journeys Page Hero", group: "Page Heroes", mode: "single", fallbackImages: [{ src: A("233460-glenorchy-queenstown.jpg"), alt: "Lake Wakatipu and alpine ridgeline" }] },
  { key: "page.destinations.hero", label: "Destinations Page Hero", group: "Page Heroes", mode: "single", fallbackImages: [{ src: A("233461-milford-sound-fiordland.jpg"), alt: "Fiordland and the Southern Alps" }] },
  { key: "page.journal.hero", label: "Journal Page Hero", group: "Page Heroes", mode: "single", fallbackImages: [{ src: A("233207-aoraki-mt-cook-canterbury.jpg"), alt: "Aoraki / Mount Cook" }] },
  { key: "page.about.hero", label: "About Page Hero", group: "Page Heroes", mode: "single", fallbackImages: [{ src: A("233206-aoraki-mt-cook-canterbury.jpg"), alt: "New Zealand alpine landscape" }] },
  { key: "page.stories.hero", label: "Stories Page Hero", group: "Page Heroes", mode: "single", fallbackImages: [{ src: A("233455-glenorchy-queenstown.jpg"), alt: "Glenorchy, Queenstown" }] },
  { key: "page.stories.masterpiece", label: "Stories — Masterpiece Image", group: "Page Content Images", mode: "single", fallbackImages: [{ src: A("230332-milford-sound-fiordland.jpg"), alt: "Milford Sound, Fiordland" }] },
  { key: "page.stories.epicurean", label: "Stories — Epicurean Image", group: "Page Content Images", mode: "single", fallbackImages: [{ src: A("233179-craggy-range-hawkes-bay.jpg"), alt: "Craggy Range winery, Hawke's Bay" }] },
  { key: "page.stories.expedition", label: "Stories — Expedition Image", group: "Page Content Images", mode: "single", fallbackImages: [{ src: A("233456-franz-josef-west-coast.jpg"), alt: "Franz Josef Glacier, West Coast" }] },
];

export function parseImageSlotOverrides(value: string | null | undefined): ImageSlotOverrides {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object") return {};

    const record = parsed as Record<string, unknown>;
    const overrides: ImageSlotOverrides = {};

    for (const [key, images] of Object.entries(record)) {
      if (!Array.isArray(images)) continue;
      const validImages = images
        .map((image) => {
          if (!image || typeof image !== "object") return null;
          const item = image as Partial<ManagedImage>;
          if (!item.src || typeof item.src !== "string") return null;
          return {
            src: item.src,
            alt: typeof item.alt === "string" ? item.alt : "",
          };
        })
        .filter(Boolean) as ManagedImage[];

      if (validImages.length) overrides[key] = validImages;
    }

    return overrides;
  } catch {
    return {};
  }
}

export function serialiseImageSlotOverrides(overrides: ImageSlotOverrides): string {
  const cleaned = Object.fromEntries(
    Object.entries(overrides)
      .map(([key, images]) => [
        key,
        images.filter((image) => image.src.trim()).map((image) => ({
          src: image.src.trim(),
          alt: image.alt.trim(),
        })),
      ])
      .filter(([, images]) => images.length > 0)
  );

  return JSON.stringify(cleaned, null, 2);
}

export function getSlotImages(
  overrides: ImageSlotOverrides,
  key: string
): ManagedImage[] {
  const definition = IMAGE_SLOT_DEFINITIONS.find((slot) => slot.key === key);
  const images = overrides[key]?.filter((image) => image.src.trim());
  return images?.length ? images : definition?.fallbackImages ?? [];
}

export function getSlotImage(
  overrides: ImageSlotOverrides,
  key: string
): ManagedImage {
  return (
    getSlotImages(overrides, key)[0] ?? {
      src: "",
      alt: "",
    }
  );
}

export function homepageHeroSlotKey(heroVariant: string | null | undefined): string {
  switch (heroVariant) {
    case "adventure-us":
      return "home.hero.adventure-us";
    case "culinary-us":
      return "home.hero.culinary-us";
    case "nature-sg":
      return "home.hero.nature-sg";
    case "adventure-sg":
      return "home.hero.adventure-sg";
    case "culinary-sg":
      return "home.hero.culinary-sg";
    case "international":
      return "home.hero.international";
    case "luxury-us":
    default:
      return "home.hero.luxury-us";
  }
}

export function groupedImageSlotDefinitions() {
  return IMAGE_SLOT_DEFINITIONS.reduce<Record<string, ImageSlotDefinition[]>>(
    (groups, slot) => {
      groups[slot.group] = [...(groups[slot.group] ?? []), slot];
      return groups;
    },
    {}
  );
}
