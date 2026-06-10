/**
 * Apply curated fallback profiles for accommodation providers whose public
 * websites block scraping or expose too little crawlable text.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/apply-accommodation-fallbacks.ts
 */

import fs from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const REPORT_PATH = path.resolve("docs/accommodation-fallback-report.json");

interface FallbackProfile {
  slug: string;
  website_url?: string;
  description: string;
  highlights: string[];
  source_urls: string[];
}

const profiles: FallbackProfile[] = [
  {
    slug: "hilton-auckland",
    website_url: "https://www.hilton.com/en/hotels/aklhihi-hilton-auckland/",
    description:
      "Hilton Auckland is a waterfront city hotel on Princes Wharf, useful for guests who want a polished Auckland arrival or departure stay with harbour atmosphere. The hotel is strongest as a central base for the Viaduct, Commercial Bay, ferry access and downtown dining. Its FISH restaurant focuses on seafood and Waitemata Harbour views, making it a good fit for travellers who want a convenient city hotel with a distinctly maritime Auckland setting.",
    highlights: [
      "Waterfront position on Princes Wharf",
      "Harbour-view seafood dining at FISH",
      "Easy Viaduct and ferry access",
      "Good polished Auckland arrival stay",
      "Best for: city stopovers and harbour dining",
    ],
    source_urls: [
      "https://www.hilton.com/en/hotels/aklhihi-hilton-auckland/",
      "https://www.hilton.com/en/hotels/aklhihi-hilton-auckland/dining/",
    ],
  },
  {
    slug: "jw-marriott-auckland",
    website_url: "https://www.marriott.com/en-us/hotels/akljw-jw-marriott-auckland/overview/",
    description:
      "JW Marriott Auckland is a central luxury hotel at 22-26 Albert Street, positioned for guests who want international-brand comfort close to Commercial Bay, Britomart, the Viaduct and downtown dining. It suits travellers who prefer a larger full-service city hotel rather than a boutique lodge. Use it for Auckland gateway nights, business-minded travellers, and guests who want a familiar luxury brand with easy access to the waterfront and central city.",
    highlights: [
      "Central Albert Street location",
      "International luxury brand standard",
      "Close to waterfront and Britomart",
      "Good gateway or business stay",
      "Best for: polished city convenience",
    ],
    source_urls: [
      "https://www.marriott.com/en-us/hotels/akljw-jw-marriott-auckland/overview/",
      "https://www.marriott.com/en-us/hotels/akljw-jw-marriott-auckland/rooms/",
    ],
  },
  {
    slug: "oaks-auckland-hotel",
    website_url: "https://www.oakshotels.com/en/oaks-auckland-hotel",
    description:
      "Oaks Auckland Hotel is a practical 4-star Auckland CBD option near Spark Arena, Queens Wharf, Britomart, Commercial Bay and the waterfront. It is best used when itinerary logistics, event access or apartment-style convenience matter more than lodge-level character. The property offers studios and apartments, an on-site restaurant, 24-hour reception and a central base for walking to city dining, shopping and transport.",
    highlights: [
      "Near Spark Arena and Queens Wharf",
      "Studios and apartment-style rooms",
      "Central CBD walking base",
      "On-site DASH restaurant",
      "Best for: practical city logistics",
    ],
    source_urls: ["https://www.oakshotels.com/en/oaks-auckland-hotel"],
  },
  {
    slug: "park-hyatt-auckland",
    website_url: "https://www.hyatt.com/park-hyatt/en-US/aklph-park-hyatt-auckland",
    description:
      "Park Hyatt Auckland is a sophisticated waterfront hotel on the edge of Wynyard Quarter, overlooking the Lighter Basin and Waitemata Harbour. It is one of Auckland's strongest contemporary luxury city stays, with generous rooms and suites, four restaurants and bars, event spaces, a day spa, a 25-metre infinity pool and a fitness centre. Use it for high-end Auckland stopovers where design, harbour views and dining access matter.",
    highlights: [
      "Waterfront Wynyard Quarter setting",
      "Views to Waitemata Harbour",
      "Day spa and 25-metre infinity pool",
      "Four restaurants and bars",
      "Best for: contemporary Auckland luxury",
    ],
    source_urls: [
      "https://www.hyatt.com/park-hyatt/en-US/aklph-park-hyatt-auckland",
      "https://www.hyatt.com/park-hyatt/en-US/aklph-park-hyatt-auckland/rooms",
    ],
  },
  {
    slug: "sofitel-auckland-viaduct-harbour",
    website_url: "https://sofitel.accor.com/en/hotels/8577.html",
    description:
      "Sofitel Auckland Viaduct Harbour is a French-influenced luxury hotel beside Auckland's Viaduct Harbour, useful for travellers who want a refined marina-side city stay. It offers polished rooms, spa and wellness facilities, harbour-facing hospitality and dining venues including French Press and Sabrage. Use it for Auckland nights where waterfront atmosphere, walkability to the Viaduct and a more European hotel style are preferred.",
    highlights: [
      "Viaduct Harbour marina setting",
      "French-influenced luxury hotel style",
      "Spa and wellness facilities",
      "Walkable waterfront dining access",
      "Best for: refined Auckland stopovers",
    ],
    source_urls: [
      "https://sofitel.accor.com/en/hotels/8577.html",
      "https://www.sofitel-auckland-viaduct.com",
    ],
  },
  {
    slug: "swiss-bel-suites-auckland",
    website_url: "https://www.swiss-belhotel.com/hotels/swiss-belsuites-victoria-park",
    description:
      "Swiss-Belsuites Victoria Park Auckland is an apartment-style city option beside Victoria Park, with large suites, balconies or terraces and easy access to the Viaduct Harbour, Sky Tower, restaurants and city services. It is best for travellers who want more space than a standard hotel room, especially families, longer stays, or guests who value kitchens, laundry-style independence and a central Auckland base.",
    highlights: [
      "Apartment-style suites near Victoria Park",
      "Balconies or terraces in many suites",
      "Walkable to Viaduct Harbour",
      "Good for families and longer stays",
      "Best for: spacious city independence",
    ],
    source_urls: ["https://www.swiss-belhotel.com/hotels/swiss-belsuites-victoria-park"],
  },
  {
    slug: "lindis-lodge",
    website_url: "https://www.thelindisgroup.com/thelindislodge",
    description:
      "The Lindis Lodge is a remote, architecturally distinctive luxury lodge in the Ahuriri Valley, designed to sit almost invisibly within the South Island high-country landscape. It combines suites and pods, refined cuisine, high-country hospitality and immersive land-based experiences. Use it for guests seeking privacy, architecture, solitude, fly-fishing, stargazing and a wilderness-luxury stay between Queenstown/Wanaka and Aoraki/Mount Cook.",
    highlights: [
      "Remote Ahuriri Valley setting",
      "Architectural high-country lodge",
      "Luxury suites and pods",
      "Strong wilderness and solitude appeal",
      "Best for: remote design-led luxury",
    ],
    source_urls: [
      "https://www.thelindisgroup.com/thelindislodge",
      "https://www.thelindisgroup.com/",
    ],
  },
  {
    slug: "mt-cook-lodge-motels-aoraki",
    website_url: "https://www.hermitage.co.nz/stay/mt-cook-lodge/",
    description:
      "Mt Cook Lodge & Motels is a relaxed accommodation base in lower Aoraki/Mount Cook Village, around 800 metres from The Hermitage. It offers lodge rooms and motel-style units, with on-site Chamois Bar & Grill and access to dining options at The Hermitage on some packages. Use it when travellers need a practical Aoraki/Mount Cook base for hiking, stargazing and glacier scenery rather than a luxury lodge experience.",
    highlights: [
      "Lower Aoraki/Mount Cook Village location",
      "Lodge rooms and motel units",
      "On-site Chamois Bar & Grill",
      "Good practical national park base",
      "Best for: Aoraki hiking logistics",
    ],
    source_urls: [
      "https://www.hermitage.co.nz/stay/mt-cook-lodge/",
      "https://www.newzealand.com/in/plan/business/mt-cook-lodge-and-motels/",
    ],
  },
  {
    slug: "sudima-kaik-ura",
    website_url: "https://www.sudimahotels.com/en/hotels/kaikoura/",
    description:
      "Sudima Kaikoura is a contemporary shoreline hotel with mountain and sea views, positioned a short walk from Kaikoura township, retail, restaurants and activity booking centres. It is one of the strongest modern hotel options in Kaikoura and works well for whale watching, marine wildlife, crayfish/seafood stops and coastal touring between Marlborough, Christchurch and the West Coast.",
    highlights: [
      "Shoreline Kaikoura location",
      "Mountain and sea views",
      "Short walk to township",
      "Modern hotel facilities",
      "Best for: wildlife and coastal touring",
    ],
    source_urls: ["https://www.sudimahotels.com/en/hotels/kaikoura/"],
  },
  {
    slug: "distinction-dunedin-hotel",
    website_url: "https://www.distinctionhotelsdunedin.co.nz/",
    description:
      "Distinction Dunedin Hotel is an elegant city hotel in Dunedin's former Chief Post Office, located in the Warehouse Precinct. It offers studio rooms and suites, restaurant and bar facilities, private dining in converted former vaults, conference space and an on-site gym. Use it for travellers who want a comfortable central Dunedin base with heritage character and easy access to the Octagon, railway station and city architecture.",
    highlights: [
      "Former Chief Post Office building",
      "Central Warehouse Precinct location",
      "Studios and elegant suites",
      "Vaults private dining rooms",
      "Best for: heritage city stays",
    ],
    source_urls: [
      "https://www.distinctionhotelsdunedin.co.nz/",
      "https://www.dunedinnz.com/visit/all-accommodation/distinction-dunedin-hotel",
    ],
  },
  {
    slug: "fable-dunedin",
    website_url: "https://www.fablehotelsandresorts.com/hotels/fable-dunedin",
    description:
      "Fable Dunedin is a 5-star boutique hotel in the reborn Wains Hotel, a historic Princes Street property with roots dating to the 1860s. It combines Southern heritage with modern luxury, offering 50 rooms, two suites and The Press Club dining. Use it for guests who want a more characterful Dunedin stay close to the city's Victorian and Edwardian architecture, museums and central dining.",
    highlights: [
      "Historic Wains Hotel setting",
      "Five-star boutique city hotel",
      "The Press Club dining",
      "Central Princes Street location",
      "Best for: boutique Dunedin character",
    ],
    source_urls: ["https://www.fablehotelsandresorts.com/hotels/fable-dunedin"],
  },
  {
    slug: "scenic-hotel-southern-cross-dunedin",
    website_url: "https://www.scenichotelgroup.co.nz/dunedin/scenic-hotel-southern-cross/",
    description:
      "Scenic Hotel Southern Cross is a historic heritage hotel in central Dunedin, dating back to 1883 and now blending period character with modern hotel comfort. It offers a broad range of rooms and suites, on-site dining, fitness facilities and conference spaces. Use it for guests needing a reliable city base close to the Octagon, railway station, theatres, shops and Dunedin's Victorian and Edwardian streetscape.",
    highlights: [
      "Historic 1883 heritage building",
      "Central High Street location",
      "Rooms, suites and on-site dining",
      "Close to Octagon and railway station",
      "Best for: reliable city touring base",
    ],
    source_urls: [
      "https://www.scenichotelgroup.co.nz/dunedin/scenic-hotel-southern-cross/",
      "https://www.newzealand.com/us/plan/business/scenic-hotel-southern-cross/",
    ],
  },
  {
    slug: "craggy-range-accommodation",
    website_url: "https://craggyrange.com/pages/accommodation",
    description:
      "Craggy Range Accommodation places guests in Hawke's Bay wine country beneath Te Mata Peak, with vineyard cottages and luxury river lodges connected to one of the region's benchmark winery and dining experiences. It is a strong fit for food-and-wine travellers, couples and small groups who want to stay among the vines, enjoy private terraces or river outlooks, and build a Hawke's Bay itinerary around wine, produce and landscape.",
    highlights: [
      "Vineyard cottages and river lodges",
      "Beneath Te Mata Peak",
      "Tukituki River and vineyard setting",
      "Strong Hawke's Bay wine pairing",
      "Best for: food-and-wine travellers",
    ],
    source_urls: [
      "https://craggyrange.com/pages/accommodation",
      "https://www.hawkesbaynz.com/visit/us/craggy-range-vineyard-accommodation",
    ],
  },
  {
    slug: "swiss-bel-suites-napier",
    website_url: "https://www.swiss-belhotel.com/hotels/swiss-belhotel-napier",
    description:
      "Swiss-Belhotel Napier is a city hotel in Napier South, close to Marine Parade, Napier Beach, MTG Hawke's Bay, the Art Deco Trust and central restaurants. It works as a practical Hawke's Bay base for travellers who want easy access to Napier's Art Deco streets, waterfront walks, wineries and regional touring without committing to a lodge or vineyard stay.",
    highlights: [
      "Napier South city location",
      "Near Marine Parade and beach",
      "Close to Art Deco attractions",
      "Practical Hawke's Bay base",
      "Best for: Napier city access",
    ],
    source_urls: [
      "https://www.swiss-belhotel.com/hotels/swiss-belhotel-napier",
      "https://www.hotels.com/ho1102343488/swiss-belboutique-napier-napier-new-zealand/",
    ],
  },
  {
    slug: "hilton-lake-taupo",
    website_url: "https://www.hilton.com/en/hotels/akllthi-hilton-lake-taupo/",
    description:
      "Hilton Lake Taupo combines a heritage wing with contemporary accommodation and lake-region resort facilities. It is useful for travellers who want an established full-service hotel near Taupo rather than a remote lodge. Bistro Lago provides lake-view dining built around local produce, while the hotel also offers event spaces, a heated outdoor pool and fitness facilities. Use it for Taupo stopovers, geothermal touring and central North Island routing.",
    highlights: [
      "Heritage wing and modern rooms",
      "Lake Taupo dining at Bistro Lago",
      "Heated outdoor pool",
      "Good full-service Taupo base",
      "Best for: central North Island routing",
    ],
    source_urls: [
      "https://www.hilton.com/en/hotels/akllthi-hilton-lake-taupo/",
      "https://www.hilton.com/en/hotels/akllthi-hilton-lake-taupo/dining/",
    ],
  },
  {
    slug: "millennium-hotel-taupo",
    website_url: "https://www.millenniumhotels.com/en/taupo/millennium-hotel-and-resort-manuels-taupo/",
    description:
      "Millennium Hotel and Resort Manuels Taupo is a lakefront Taupo hotel with boutique rooms and suites, a heated swimming pool, private grotto plunge pool, sauna, gym, event venues and dining at Edgewater Restaurant. Use it for travellers who want direct Lake Taupo outlooks, easy town access and a softer resort-style base for geothermal touring, lake activities and central North Island travel.",
    highlights: [
      "Lake Taupo waterfront position",
      "Boutique rooms and suites",
      "Heated pool and grotto plunge pool",
      "Edgewater Restaurant lake views",
      "Best for: relaxed Taupo resort stays",
    ],
    source_urls: [
      "https://www.millenniumhotels.com/en/taupo/millennium-hotel-and-resort-manuels-taupo/",
    ],
  },
  {
    slug: "wairakei-resort-taupo",
    website_url: "https://www.wairakei.co.nz/",
    description:
      "Wairakei Resort Taupo is set in Wairakei Thermal Valley, minutes from Taupo, with broad leisure facilities including geothermally heated swimming pools, outdoor hot tubs, spa, tennis, squash, fitness facilities and a 9-hole golf course. It is best used for travellers wanting a relaxed resort base near geothermal attractions and Huka Falls, especially families or groups who value facilities over boutique-lodge intimacy.",
    highlights: [
      "Wairakei Thermal Valley setting",
      "Geothermally heated pools",
      "Spa, tennis, squash and fitness",
      "Nine-hole golf course",
      "Best for: relaxed resort facilities",
    ],
    source_urls: [
      "https://www.wairakei.co.nz/",
      "https://www.lovetaupo.com/en/operators/wairakei-resort-taupo/",
    ],
  },
  {
    slug: "copthorne-hotel-waitangi",
    website_url:
      "https://www.millenniumhotels.com/en/bay-of-islands/copthorne-hotel-and-resort-bay-of-islands/",
    description:
      "Copthorne Hotel and Resort Bay of Islands is a waterfront resort in Waitangi near Paihia, set within subtropical gardens on the Waitangi National Trust Reserve. It is a practical Bay of Islands base with strong location value: close to the Waitangi Treaty Grounds, waterfront walks, Paihia access, pool, restaurant and resort facilities. Use it for families, groups and guests prioritising location over boutique exclusivity.",
    highlights: [
      "Waterfront Waitangi resort setting",
      "Near Waitangi Treaty Grounds",
      "Subtropical garden grounds",
      "Pool and resort facilities",
      "Best for: Bay of Islands logistics",
    ],
    source_urls: [
      "https://www.millenniumhotels.com/en/bay-of-islands/copthorne-hotel-and-resort-bay-of-islands/",
      "https://www.newzealand.com/in/plan/business/copthorne-hotel-and-resort-bay-of-islands/",
    ],
  },
  {
    slug: "the-boathouse-at-the-landing",
    website_url: "https://thelandingnz.com/stay/the-boathouse/",
    description:
      "The Boathouse at The Landing is an intimate waterfront residence on Wairoa Bay in the Bay of Islands, designed for simple, relaxed luxury at the water's edge. It is suited to couples, small families or guests adding a beachside pavilion-style stay to a wider Landing residence booking. The setting is strongest for slow coastal days, swimming, boating, outdoor dining and private-estate seclusion.",
    highlights: [
      "Water's-edge Wairoa Bay setting",
      "Private residence at The Landing",
      "Relaxed beachside luxury feel",
      "Good for couples or small families",
      "Best for: private coastal downtime",
    ],
    source_urls: [
      "https://thelandingnz.com/stay/the-boathouse/",
      "https://www.luxuryvillasnz.com/the-boathouse-the-landing",
    ],
  },
  {
    slug: "the-landing-bay-of-islands",
    website_url: "https://thelandingnz.com/",
    description:
      "The Landing is a private Bay of Islands retreat with four luxury residences set across a coastal estate with vineyard, beaches and bespoke service. It is one of the strongest Northland options for privacy-led luxury, multi-generational groups, special occasions and travellers who want chef-led in-residence dining, wine, coastal landscapes and a deep sense of place on the Purerua Peninsula.",
    highlights: [
      "Four private luxury residences",
      "Bay of Islands coastal estate",
      "On-site vineyard and beaches",
      "Bespoke private service",
      "Best for: private group luxury",
    ],
    source_urls: [
      "https://thelandingnz.com/",
      "https://www.newzealand.com/us/plan/business/the-landing-residences/",
    ],
  },
  {
    slug: "coronet-ridge-resort",
    website_url: "https://www.coronetridge.co.nz/",
    description:
      "Coronet Ridge Resort is a five-star alpine retreat at Arthurs Point, positioned above the Shotover River between Queenstown and Arrowtown. It offers modern rooms and suites, Elevation Bar & Restaurant, spa treatments and a setting designed around mountain views, relaxation and easy access to Queenstown activities. Use it for travellers who want a newer resort-style base outside the busiest Queenstown CBD zone.",
    highlights: [
      "Arthurs Point alpine setting",
      "Above the Shotover River",
      "Rooms, suites, restaurant and spa",
      "Between Queenstown and Arrowtown",
      "Best for: resort-style alpine stays",
    ],
    source_urls: [
      "https://www.coronetridge.co.nz/",
      "https://www.queenstownnz.co.nz/listing/coronet-ridge-resort/1656/",
    ],
  },
  {
    slug: "swiss-bel-suites-pounamu",
    website_url:
      "https://www.swiss-belhotel.com/hotels/swiss-belsuites-pounamu-queenstown",
    description:
      "Swiss-Belsuites Pounamu Queenstown offers apartment-style accommodation within walking distance of the town centre, with lake-view suites and standard rooms suited to travellers who want space and self-contained comfort. It is useful for families, ski trips and longer Queenstown stays, with WiFi, Chromecast, secure basement parking, ski and golf storage and easy access to the lakefront and outdoor activities.",
    highlights: [
      "Apartment-style Queenstown accommodation",
      "Lake-view suites available",
      "Walkable to town centre",
      "Ski and golf storage",
      "Best for: families and longer stays",
    ],
    source_urls: [
      "https://www.swiss-belhotel.com/hotels/swiss-belsuites-pounamu-queenstown",
    ],
  },
  {
    slug: "moose-lodge",
    website_url: "https://www.newzealand.com/us/plan/business/moose-lodge-estate-1/",
    description:
      "Moose Lodge Estate is a historic lakeside estate on Lake Rotoiti, east of Rotorua, with lodge accommodation positioned high above the bay and surrounding bush. It is best treated as a distinctive private-estate or celebration venue rather than a standard hotel. Use it selectively for travellers seeking lake views, heritage atmosphere, privacy, events or a Rotorua stay that feels removed from the main geothermal tourism corridor.",
    highlights: [
      "Historic Lake Rotoiti estate",
      "Panoramic bay and bush views",
      "Private lodge and event character",
      "East of Rotorua",
      "Best for: private lakeside occasions",
    ],
    source_urls: [
      "https://www.newzealand.com/us/plan/business/moose-lodge-estate-1/",
      "https://book-directonline.com/properties/moosedirect/about",
    ],
  },
  {
    slug: "novotel-rotorua-lakeside",
    website_url: "https://all.accor.com/hotel/1874/index.en.shtml",
    description:
      "Novotel Rotorua Lakeside is a 4.5-star hotel on the shores of Lake Rotorua, in the heart of Rotorua township and close to Eat Streat, the lakefront and local activity access. It offers Atlas Restaurant, fitness facilities and geothermal mineral pools. Use it as a practical Rotorua base for families, geothermal touring and travellers who want central convenience rather than a secluded lodge.",
    highlights: [
      "Lake Rotorua shoreline location",
      "Central township and Eat Streat access",
      "Geothermal mineral pools",
      "Atlas Restaurant on site",
      "Best for: practical Rotorua touring",
    ],
    source_urls: ["https://all.accor.com/hotel/1874/index.en.shtml"],
  },
  {
    slug: "clements-hotel-hamilton",
    website_url: "https://clements.co.nz/",
    description:
      "The Clements Hotel is a heritage-listed boutique hotel in Cambridge, Waikato, positioned as a refined provincial stay with historic character and modern comfort. It is useful for guests routing through the Waikato, Hobbiton, Cambridge horse country or Waitomo, especially when they prefer a smaller character property over a standard Hamilton city hotel. Verify current room and dining details when recommending.",
    highlights: [
      "Heritage-listed Cambridge hotel",
      "Historic provincial character",
      "Boutique Waikato accommodation",
      "Useful for Hobbiton/Waitomo routing",
      "Best for: characterful Waikato stays",
    ],
    source_urls: [
      "https://clements.co.nz/",
      "https://www.newzealand.com/us/plan/business/the-clements-hotel/",
    ],
  },
  {
    slug: "novotel-hamilton-tainui",
    website_url: "https://all.accor.com/hotel/2159/index.en.shtml",
    description:
      "Novotel Hamilton Tainui is a 4.5-star hotel on the banks of the Waikato River in central Hamilton. It is a practical full-service base for Waikato touring, with easy access to central attractions, dining, shopping and river walks. Use it for guests needing a reliable Hamilton overnight between Auckland, Hobbiton, Waitomo, Rotorua or Taupo rather than a destination lodge experience.",
    highlights: [
      "Waikato River central location",
      "Hamilton CBD walking access",
      "Reliable full-service hotel base",
      "Good North Island routing stop",
      "Best for: practical Waikato overnights",
    ],
    source_urls: [
      "https://all.accor.com/hotel/2159/index.en.shtml",
      "https://www.newzealand.com/us/plan/business/novotel-tainui-hamilton/",
    ],
  },
  {
    slug: "pullman-hamilton",
    description:
      "Pullman Hamilton appears to be a future premium hotel project rather than an established operating property. Public reports describe a planned 191-room hotel in Hamilton's tallest building at 42-48 Ward Street, associated with a major retrofit and a 2026 opening timeframe. Do not recommend this as confirmed accommodation without checking opening status, contracting and live inventory first.",
    highlights: [
      "Future-facing Hamilton hotel project",
      "Planned premium Pullman brand",
      "Reported 191-room city property",
      "Opening/status must be verified",
      "Best for: future consideration only",
    ],
    source_urls: [
      "https://www.hospitalitynet.org/announcement/41011196/premium-pullman-hotel-announced-for-hamilton",
      "https://www.hotelnewsresource.com/article131972.html",
    ],
  },
  {
    slug: "boulcott-suites",
    website_url: "https://villagegroup.nz/stay/boulcott-suites/",
    description:
      "Boulcott Suites is a central Wellington serviced apartment hotel offering studios, single-level suites and fully equipped two- and four-bedroom townhouses. It is best for families, longer stays, multi-room needs or travellers who want kitchen, laundry and apartment-style independence in the CBD. Use it when space and practicality matter more than full-service hotel amenities.",
    highlights: [
      "Central Wellington serviced apartments",
      "Studios, suites and townhouses",
      "Kitchen and laundry-style independence",
      "Good for families and longer stays",
      "Best for: space in the CBD",
    ],
    source_urls: [
      "https://villagegroup.nz/stay/boulcott-suites/",
      "https://www.newzealand.com/us/plan/business/boulcott-suites-/",
    ],
  },
  {
    slug: "double-tree-by-hilton",
    website_url: "https://www.hilton.com/en/hotels/wlgntdi-doubletree-wellington/",
    description:
      "DoubleTree by Hilton Wellington is a central CBD hotel on Lambton Quay, set in Wellington's historic T&G building near the Cable Car, waterfront, shopping and government precinct. It works well for guests who want a polished city hotel with heritage architecture and easy walking access to Te Papa, the waterfront and central dining. Use it for practical Wellington nights with a stronger sense of place than a generic chain stay.",
    highlights: [
      "Historic T&G building setting",
      "Lambton Quay CBD location",
      "Near Cable Car and waterfront",
      "Good Wellington city base",
      "Best for: heritage city convenience",
    ],
    source_urls: [
      "https://www.hilton.com/en/hotels/wlgntdi-doubletree-wellington/",
      "https://www.hilton.com/en/hotels/wlgntdi-doubletree-wellington/hotel-location/",
    ],
  },
  {
    slug: "intercontinental-wellington",
    website_url: "https://www.ihg.com/intercontinental/hotels/us/en/wellington/wlggs/hoteldetail",
    description:
      "InterContinental Wellington is a five-star city hotel near the waterfront, arts, shopping and culinary districts. It is one of Wellington's strongest full-service luxury hotel options, with contemporary rooms and suites, GPO dining, Two Grey, and Club InterContinental for guests wanting an elevated lounge experience. Use it for polished Wellington stays, especially when Te Papa, waterfront dining and central access matter.",
    highlights: [
      "Five-star central Wellington hotel",
      "Near waterfront and arts precinct",
      "GPO, Two Grey and Club lounge",
      "Contemporary rooms and suites",
      "Best for: polished capital-city luxury",
    ],
    source_urls: [
      "https://www.ihg.com/intercontinental/hotels/us/en/wellington/wlggs/hoteldetail",
      "https://wellington.intercontinental.com/",
    ],
  },
  {
    slug: "rydges-wellington",
    website_url: "https://www.rydges.com/accommodation/new-zealand/wellington/",
    description:
      "Rydges Wellington is a large central hotel on Featherston Street with harbour and city outlooks, close to Lambton Quay, Parliament, Wellington Station and the waterfront. It offers a leisure centre with indoor lap pool, fitness studio, sauna and spa, plus dining and broad room inventory. Use it for practical Wellington city stays, families, groups or guests needing reliable access to the transport and business district.",
    highlights: [
      "Central Featherston Street location",
      "Harbour and city outlooks",
      "Indoor pool, sauna and gym",
      "Near Parliament and station",
      "Best for: reliable Wellington logistics",
    ],
    source_urls: [
      "https://www.rydges.com/accommodation/new-zealand/wellington/",
      "https://www.rydges.com/accommodation/new-zealand/wellington/hotel-rooms/",
    ],
  },
  {
    slug: "sofitel-wellington",
    website_url: "https://sofitel.accor.com/en/hotels/9051.html",
    description:
      "Sofitel Wellington is a five-star French-influenced hotel in Wellington's parliamentary precinct, near Lambton Quay, the Botanic Garden and central government district. Its rooms and suites offer city or garden outlooks, and the property is useful for travellers who want a refined, quieter capital-city hotel close to politics, gardens, shopping and waterfront access without being directly on the waterfront.",
    highlights: [
      "Parliamentary precinct location",
      "Near Botanic Garden and Lambton Quay",
      "French-influenced five-star style",
      "City and garden outlooks",
      "Best for: refined Wellington stays",
    ],
    source_urls: [
      "https://sofitel.accor.com/en/hotels/9051.html",
      "https://www.sofitel-wellington.co.nz",
    ],
  },
];

async function main() {
  const report = [];

  for (const profile of profiles) {
    const { data, error } = await supabase
      .from("accommodations")
      .update({
        description: profile.description,
        highlights: profile.highlights,
        ...(profile.website_url ? { website_url: profile.website_url } : {}),
      })
      .eq("slug", profile.slug)
      .select("id,name,region,slug")
      .single();

    if (error) {
      report.push({ slug: profile.slug, status: "failed", error: error.message });
      console.log(`failed ${profile.slug}: ${error.message}`);
    } else {
      report.push({
        ...data,
        status: "updated",
        source_urls: profile.source_urls,
      });
      console.log(`updated ${data.name}`);
    }
  }

  await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });
  await fs.writeFile(
    REPORT_PATH,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        updated: report.filter((entry) => entry.status === "updated").length,
        failed: report.filter((entry) => entry.status === "failed").length,
        entries: report,
      },
      null,
      2
    )
  );

  console.log(`\nReport written to ${REPORT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
