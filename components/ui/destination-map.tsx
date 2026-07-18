"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

export interface DestinationMapItem {
  slug: string;
  name: string;
  region: string;
  tagline: string;
}

type Island = "North Island" | "South Island";

const DESTINATION_COORDINATES: Record<string, [number, number]> = {
  auckland: [174.76, -36.85],
  northland: [173.73, -35.22],
  waikato: [175.28, -37.78],
  coromandel: [175.68, -36.83],
  "bay-of-plenty": [176.23, -37.69],
  rotorua: [176.25, -38.14],
  "central-plateau": [175.62, -39.19],
  taranaki: [174.06, -39.3],
  manawatu: [175.38, -40.36],
  "hawkes-bay": [176.84, -39.49],
  "gisborne-east-cape": [177.92, -38.66],
  wellington: [174.78, -41.29],
  wairarapa: [175.63, -41.1],
  "tasman-nelson": [173.1, -41.12],
  marlborough: [173.78, -41.51],
  kaikoura: [173.68, -42.4],
  "hanmer-springs": [172.83, -42.52],
  "west-coast": [170.05, -43.46],
  "aoraki-mount-cook": [170.14, -43.6],
  "mackenzie-basin": [170.48, -44.0],
  waitaki: [170.72, -44.9],
  wanaka: [169.14, -44.7],
  queenstown: [168.66, -45.03],
  "central-otago": [169.35, -45.1],
  otago: [170.5, -45.88],
  clutha: [169.7, -46.1],
  fiordland: [167.72, -45.42],
  southland: [168.35, -46.4],
  rakiura: [168.1, -47.02],
};

function isIsland(value: string): value is Island {
  return value === "North Island" || value === "South Island";
}

export function DestinationMap({
  destinations,
  compact = false,
}: {
  destinations: DestinationMapItem[];
  compact?: boolean;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markerElements = useRef(new Map<string, HTMLAnchorElement>());
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [selectedIsland, setSelectedIsland] =
    useState<Island>("North Island");
  const [mapLoaded, setMapLoaded] = useState(false);

  const byIsland = useMemo(() => {
    const groups: Record<Island, DestinationMapItem[]> = {
      "North Island": [],
      "South Island": [],
    };

    destinations.forEach((destination) => {
      if (isIsland(destination.region)) {
        groups[destination.region].push(destination);
      }
    });

    return groups;
  }, [destinations]);

  const activeDestination =
    destinations.find((destination) => destination.slug === activeSlug) ??
    null;

  useEffect(() => {
    if (!mapContainer.current) return;
    const renderedMarkerElements = markerElements.current;

    const instance = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "new-zealand": {
            type: "geojson",
            data: "/data/new-zealand.geojson",
          },
        },
        layers: [
          {
            id: "background",
            type: "background",
            paint: {
              "background-color": "#0A1420",
            },
          },
          {
            id: "new-zealand-land",
            type: "fill",
            source: "new-zealand",
            paint: {
              "fill-color": "#D8D1C5",
              "fill-opacity": 0.96,
            },
          },
          {
            id: "new-zealand-coastline",
            type: "line",
            source: "new-zealand",
            paint: {
              "line-color": "#EDEAE2",
              "line-opacity": 0.9,
              "line-width": 1.4,
            },
          },
        ],
      },
      center: [172.25, -41.05],
      zoom: compact ? 3.8 : 4,
      minZoom: 3.4,
      maxZoom: 8,
      maxBounds: [
        [163.5, -50],
        [181, -32.5],
      ],
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      scrollZoom: false,
    });

    map.current = instance;

    instance.on("load", () => {
      setMapLoaded(true);
      instance.fitBounds(
        [
          [166.25, -47.5],
          [178.6, -34.25],
        ],
        {
          padding: compact
            ? { top: 42, right: 46, bottom: 96, left: 42 }
            : { top: 56, right: 64, bottom: 112, left: 56 },
          duration: 0,
        }
      );
    });

    destinations.forEach((destination) => {
      const coordinates = DESTINATION_COORDINATES[destination.slug];
      if (!coordinates) return;

      const markerRoot = document.createElement("div");
      const markerLink = document.createElement("a");
      const markerDot = document.createElement("span");
      const markerLabel = document.createElement("span");

      markerRoot.className = "destination-map-marker-root";
      markerLink.className = "destination-map-marker";
      markerLink.href = `/destinations/${destination.slug}`;
      markerLink.setAttribute(
        "aria-label",
        `Explore ${destination.name}, ${destination.region}`
      );
      markerLink.dataset.active = "false";
      markerDot.className = "destination-map-marker-dot";
      markerLabel.className = "destination-map-marker-label";
      markerLabel.textContent = destination.name;

      markerLink.append(markerDot, markerLabel);
      markerRoot.append(markerLink);

      markerLink.addEventListener("mouseenter", () => {
        setActiveSlug(destination.slug);
      });
      markerLink.addEventListener("focus", () => {
        setActiveSlug(destination.slug);
      });

      renderedMarkerElements.set(destination.slug, markerLink);

      new maplibregl.Marker({
        element: markerRoot,
        anchor: "center",
      })
        .setLngLat(coordinates)
        .addTo(instance);
    });

    return () => {
      renderedMarkerElements.clear();
      instance.remove();
      map.current = null;
    };
  }, [compact, destinations]);

  useEffect(() => {
    markerElements.current.forEach((element, slug) => {
      element.dataset.active = String(slug === activeSlug);
    });
  }, [activeSlug]);

  function islandList(island: Island, mobile = false) {
    return (
      <div className={mobile ? "" : "min-w-0"}>
        {!mobile && (
          <div className="mb-4 flex items-end justify-between gap-4 border-b border-cream/15 pb-3">
            <h3 className="font-serif text-[24px] font-medium text-cream">
              {island}
            </h3>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-cream/35">
              {byIsland[island].length} regions
            </span>
          </div>
        )}

        <ul className="grid gap-x-5 sm:grid-cols-2 lg:grid-cols-1">
          {byIsland[island].map((destination) => {
            const active = destination.slug === activeSlug;

            return (
              <li key={destination.slug}>
                <Link
                  href={`/destinations/${destination.slug}`}
                  onMouseEnter={() => setActiveSlug(destination.slug)}
                  onFocus={() => setActiveSlug(destination.slug)}
                  aria-current={active ? "location" : undefined}
                  className={`group flex min-h-9 items-center justify-between gap-4 border-b py-2 text-[11px] leading-5 transition-colors ${
                    active
                      ? "border-gold/55 text-gold"
                      : "border-cream/8 text-cream/62 hover:border-cream/25 hover:text-cream"
                  }`}
                >
                  <span>{destination.name}</span>
                  <span
                    aria-hidden="true"
                    className={`text-[15px] transition-transform ${
                      active ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
                    }`}
                  >
                    +
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-navy/10 bg-navy text-cream shadow-[0_26px_70px_rgba(10,20,32,0.12)]">
      <div className="grid lg:grid-cols-[minmax(360px,0.88fr)_minmax(480px,1.12fr)]">
        <div
          className={`order-2 border-t border-cream/10 lg:order-1 lg:border-r lg:border-t-0 ${
            compact ? "p-6 sm:p-8" : "p-7 sm:p-10"
          }`}
        >
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-gold">
            Explore by region
          </p>
          <p className="mt-4 max-w-[440px] text-[12px] leading-6 text-cream/45">
            Choose a place to discover its landscapes, lodges, and private
            experiences.
          </p>

          <div
            className={`mt-8 hidden gap-8 lg:grid ${
              compact ? "xl:grid-cols-2" : "xl:grid-cols-2 xl:gap-10"
            }`}
          >
            {islandList("North Island")}
            {islandList("South Island")}
          </div>

          <div className="mt-7 lg:hidden">
            <div
              className="grid grid-cols-2 border border-cream/15"
              role="tablist"
              aria-label="Choose an island"
            >
              {(["North Island", "South Island"] as Island[]).map((island) => (
                <button
                  key={island}
                  type="button"
                  role="tab"
                  aria-selected={selectedIsland === island}
                  onClick={() => setSelectedIsland(island)}
                  className={`min-h-11 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                    selectedIsland === island
                      ? "bg-gold text-navy"
                      : "text-cream/55 hover:text-cream"
                  }`}
                >
                  {island}
                </button>
              ))}
            </div>
            <div
              role="tabpanel"
              aria-label={`${selectedIsland} destinations`}
              className="mt-5"
            >
              {islandList(selectedIsland, true)}
            </div>
          </div>
        </div>

        <div
          className={`relative order-1 overflow-hidden bg-navy-dark lg:order-2 ${
            compact
              ? "min-h-[500px] sm:min-h-[590px] lg:min-h-[680px]"
              : "min-h-[520px] sm:min-h-[640px] lg:min-h-[760px]"
          }`}
          role="region"
          aria-label="Interactive map of New Zealand destinations"
        >
          <div className="absolute inset-0">
            <div ref={mapContainer} className="h-full w-full" />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,28,46,0.04),rgba(15,28,46,0.2))]"
          />

          {!mapLoaded && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy-dark">
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-cream/35">
                Drawing the map
              </p>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-7">
            <div className="max-w-[390px] border border-cream/15 bg-navy/90 px-5 py-4 shadow-2xl backdrop-blur-md">
              {activeDestination ? (
                <>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-gold">
                    {activeDestination.region}
                  </p>
                  <h3 className="mt-2 font-serif text-[25px] font-medium leading-tight text-cream">
                    {activeDestination.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-cream/50">
                    {activeDestination.tagline}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-gold">
                    Aotearoa New Zealand
                  </p>
                  <p className="mt-2 font-serif text-[22px] leading-tight text-cream">
                    Select a point or region to begin exploring.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
