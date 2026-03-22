"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import type { RoutePoint } from "@/lib/data/coordinates";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

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

      // Add markers for each stop
      route.forEach((point, i) => {
        if (!map.current) return;

        const el = document.createElement("div");
        el.className = "journey-map-marker";
        el.style.cssText = `
          width: 28px; height: 28px; border-radius: 50%;
          background: ${i === 0 || i === route.length - 1 ? "#1F3864" : "#ffffff"};
          border: 2.5px solid #1F3864;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600;
          color: ${i === 0 || i === route.length - 1 ? "#ffffff" : "#1F3864"};
          box-shadow: 0 2px 8px rgba(31,56,100,0.2);
          cursor: pointer;
        `;
        el.textContent = point.day ? String(point.day) : "";

        const popup = new mapboxgl.Popup({
          offset: 20,
          closeButton: false,
          className: "journey-map-popup",
        }).setHTML(
          `<div style="font-family: Inter, sans-serif; padding: 4px 0;">
            <p style="font-size: 13px; font-weight: 600; color: #1F3864; margin: 0;">${point.name}</p>
            ${point.day ? `<p style="font-size: 11px; color: #9a8574; margin: 2px 0 0;">Day ${point.day}</p>` : ""}
          </div>`
        );

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
