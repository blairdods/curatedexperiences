"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import type { RoutePoint } from "@/lib/data/coordinates";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

interface RouteMarker {
  names: string[];
  coordinates: [number, number];
  visits: Array<{ dayStart: number; dayEnd: number }>;
  isEndpoint: boolean;
}

function formatVisit(dayStart: number, dayEnd: number) {
  return dayStart === dayEnd ? String(dayStart) : `${dayStart}\u2013${dayEnd}`;
}

export function formatDayLabel(
  visits: Array<{ dayStart: number; dayEnd: number }>
) {
  if (visits.length === 0) return "";

  const ranges = visits.map(({ dayStart, dayEnd }) =>
    formatVisit(dayStart, dayEnd)
  );
  const isSingleDay = visits.length === 1 && visits[0].dayStart === visits[0].dayEnd;

  return `${isSingleDay ? "Day" : "Days"} ${ranges.join(", ")}`;
}

export function groupRouteMarkers(route: RoutePoint[]): RouteMarker[] {
  const markers = new Map<string, RouteMarker>();

  route.forEach((point, index) => {
    const key = point.coordinates.join(",");
    const existing = markers.get(key);
    const visit = point.dayStart === undefined
      ? undefined
      : {
          dayStart: point.dayStart,
          dayEnd: point.dayEnd ?? point.dayStart,
        };

    if (existing) {
      if (!existing.names.includes(point.name)) existing.names.push(point.name);
      if (visit) existing.visits.push(visit);
      existing.isEndpoint ||= index === route.length - 1;
      return;
    }

    markers.set(key, {
      names: [point.name],
      coordinates: point.coordinates,
      visits: visit ? [visit] : [],
      isEndpoint: index === 0 || index === route.length - 1,
    });
  });

  return Array.from(markers.values());
}

export function JourneyMap({ route }: { route: RoutePoint[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !mapboxgl.accessToken || route.length === 0)
      return;

    // Calculate bounds to fit all points
    const bounds = new mapboxgl.LngLatBounds();
    route.forEach((p) => bounds.extend(p.coordinates));

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      bounds,
      fitBoundsOptions: { padding: 60 },
      interactive: true,
      attributionControl: false,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right"
    );

    map.current.on("load", () => {
      if (!map.current) return;
      setLoaded(true);

      // Add route line
      const coordinates = route.map((p) => p.coordinates);
      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates,
          },
        },
      });

      map.current.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#1F3864",
          "line-width": 3,
          "line-opacity": 0.6,
          "line-dasharray": [2, 2],
        },
      });

      // A location can be visited more than once. Render one marker containing
      // every visit so a later stop cannot obscure the earlier day range.
      groupRouteMarkers(route).forEach((point) => {
        if (!map.current) return;

        const dayLabel = formatDayLabel(point.visits);

        const el = document.createElement("div");
        el.className = "journey-map-marker";
        el.style.cssText = `
          min-width: 30px; height: 30px; padding: 0 9px; border-radius: 999px;
          background: ${point.isEndpoint ? "#1F3864" : "#ffffff"};
          border: 2.5px solid #1F3864;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600;
          font-family: Inter, sans-serif; white-space: nowrap;
          color: ${point.isEndpoint ? "#ffffff" : "#1F3864"};
          box-shadow: 0 2px 8px rgba(31,56,100,0.2);
          cursor: pointer;
        `;
        el.textContent = dayLabel;
        el.setAttribute(
          "aria-label",
          `${point.names.join(" and ")}${dayLabel ? `, ${dayLabel}` : ""}`
        );

        const popupContent = document.createElement("div");
        popupContent.style.cssText = "font-family: Inter, sans-serif; padding: 4px 0;";

        const popupName = document.createElement("p");
        popupName.style.cssText = "font-size: 13px; font-weight: 600; color: #1F3864; margin: 0;";
        popupName.textContent = point.names.join(" / ");
        popupContent.appendChild(popupName);

        if (dayLabel) {
          const popupDays = document.createElement("p");
          popupDays.style.cssText = "font-size: 11px; color: #9a8574; margin: 2px 0 0;";
          popupDays.textContent = dayLabel;
          popupContent.appendChild(popupDays);
        }

        const popup = new mapboxgl.Popup({
          offset: 20,
          closeButton: false,
          className: "journey-map-popup",
        }).setDOMContent(popupContent);

        new mapboxgl.Marker({ element: el })
          .setLngLat(point.coordinates)
          .setPopup(popup)
          .addTo(map.current!);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [route]);

  if (!mapboxgl.accessToken || route.length === 0) return null;

  return (
    <div className="relative rounded-xl overflow-hidden border border-warm-200">
      <div
        ref={mapContainer}
        className="w-full h-[400px] sm:h-[500px]"
      />
      {!loaded && (
        <div className="absolute inset-0 bg-warm-100 flex items-center justify-center">
          <p className="text-sm text-foreground-muted">Loading map...</p>
        </div>
      )}
      {/* Route legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3 text-xs text-foreground-muted">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-navy" />
            <span>Start / End</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-white border-2 border-navy" />
            <span>Stop</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 border-t-2 border-dashed border-navy/60" />
            <span>Route</span>
          </div>
        </div>
      </div>
    </div>
  );
}
