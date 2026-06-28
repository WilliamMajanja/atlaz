"use client";

import { useEffect, useRef, useCallback } from "react";
import { GeoPoint } from "@/types";
import { useMapStore } from "@/lib/store";
import { neighbourhoods, sampleListings, coastalZoneGeoJSON, floodRiskGeoJSON, developmentZoneGeoJSON, roadsGeoJSON } from "@/data/seed/zanzibar";

interface MapComponentProps {
  onPointSelect?: (point: GeoPoint) => void;
  height?: string;
}

interface LayerRefs {
  roads: ReturnType<typeof import("leaflet").polyline>[];
  coastalZones: ReturnType<typeof import("leaflet").polygon>[];
  floodRisk: ReturnType<typeof import("leaflet").polygon>[];
  developmentZones: ReturnType<typeof import("leaflet").polygon>[];
  listings: ReturnType<typeof import("leaflet").circleMarker>[];
}

export default function MapComponent({ onPointSelect, height = "100%" }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<ReturnType<typeof import("leaflet").map> | null>(null);
  const layersRef = useRef<LayerRefs>({
    roads: [],
    coastalZones: [],
    floodRisk: [],
    developmentZones: [],
    listings: [],
  });
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const { center, zoom, activeLayers, setSelectedPoint } = useMapStore();

  const clearLayers = useCallback(() => {
    const layers = layersRef.current;
    const L = leafletRef.current;
    if (!L) return;

    layers.roads.forEach((l) => l.remove());
    layers.coastalZones.forEach((l) => l.remove());
    layers.floodRisk.forEach((l) => l.remove());
    layers.developmentZones.forEach((l) => l.remove());
    layers.listings.forEach((l) => l.remove());

    layers.roads = [];
    layers.coastalZones = [];
    layers.floodRisk = [];
    layers.developmentZones = [];
    layers.listings = [];
  }, []);

  const addLayers = useCallback(() => {
    const map = mapInstanceRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    const layers = layersRef.current;

    // Roads layer
    if (activeLayers.includes("roads")) {
      roadsGeoJSON.features.forEach((feature) => {
        if (feature.geometry.type === "LineString") {
          const coords = feature.geometry.coordinates.map((c) => [c[1], c[0]] as [number, number]);
          const layer = L.polyline(coords, {
            color: "#6B7280",
            weight: 3,
            opacity: 0.7,
          }).addTo(map).bindPopup(`<b>${feature.properties.name}</b><br>${feature.properties.status}`);
          layers.roads.push(layer);
        }
      });
    }

    // Coastal/tourism zones
    if (activeLayers.includes("coastal-zones")) {
      coastalZoneGeoJSON.features.forEach((feature) => {
        if (feature.geometry.type === "Polygon") {
          const coords = feature.geometry.coordinates[0].map((c) => [c[1], c[0]] as [number, number]);
          const layer = L.polygon(coords, {
            color: "#3B82F6",
            fillColor: "#3B82F6",
            fillOpacity: 0.15,
            weight: 2,
          }).addTo(map).bindPopup(`<b>${feature.properties.name}</b><br>Zone: ${feature.properties.zone}`);
          layers.coastalZones.push(layer);
        }
      });
    }

    // Flood risk zones
    if (activeLayers.includes("flood-risk")) {
      floodRiskGeoJSON.features.forEach((feature) => {
        if (feature.geometry.type === "Polygon") {
          const coords = feature.geometry.coordinates[0].map((c) => [c[1], c[0]] as [number, number]);
          const layer = L.polygon(coords, {
            color: "#EF4444",
            fillColor: "#EF4444",
            fillOpacity: 0.2,
            weight: 2,
          }).addTo(map).bindPopup(`<b>${feature.properties.name}</b><br>Risk: ${feature.properties.riskLevel}`);
          layers.floodRisk.push(layer);
        }
      });
    }

    // Development zones
    if (activeLayers.includes("development-zones")) {
      developmentZoneGeoJSON.features.forEach((feature) => {
        if (feature.geometry.type === "Polygon") {
          const coords = feature.geometry.coordinates[0].map((c) => [c[1], c[0]] as [number, number]);
          const layer = L.polygon(coords, {
            color: "#8B5CF6",
            fillColor: "#8B5CF6",
            fillOpacity: 0.15,
            weight: 2,
          }).addTo(map).bindPopup(`<b>${feature.properties.name}</b><br>Type: ${feature.properties.type}`);
          layers.developmentZones.push(layer);
        }
      });
    }

    // Sample listings
    if (activeLayers.includes("listings")) {
      sampleListings.forEach((listing) => {
        const marker = L.circleMarker([listing.latitude, listing.longitude], {
          radius: 8,
          fillColor: "#F59E0B",
          color: "#D97706",
          weight: 2,
          fillOpacity: 0.8,
        }).addTo(map);

        marker.bindPopup(
          `<b>${listing.title}</b><br>${listing.description}<br><b>Price: $${listing.priceUsd?.toLocaleString() ?? "N/A"}</b><br>Area: ${listing.areaSqm} sqm`
        );
        layers.listings.push(marker);
      });
    }
  }, [activeLayers]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let cancelled = false;

    const initMap = async () => {
      if (!document.querySelector('link[href="/leaflet.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/leaflet.css";
        document.head.appendChild(link);
      }

      const L = await import("leaflet");
      if (cancelled) return;
      leafletRef.current = L;

      const map = L.map(mapRef.current!, {
        center: [center.latitude, center.longitude],
        zoom: zoom,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // Neighbourhood labels (always visible)
      neighbourhoods.forEach((n) => {
        const icon = L.divIcon({
          className: "neighbourhood-label",
          html: `<div style="background: rgba(0,0,0,0.7); color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; white-space: nowrap; font-weight: 500;">${n.name}</div>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });
        L.marker([n.latitude, n.longitude], { icon }).addTo(map);
      });

      // Click handler for pin drop
      map.on("click", (e: L.LeafletMouseEvent) => {
        const point: GeoPoint = { latitude: e.latlng.lat, longitude: e.latlng.lng };
        setSelectedPoint(point);
        onPointSelect?.(point);
      });

      mapInstanceRef.current = map;

      // Add initial layers
      addLayers();
    };

    initMap();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to layer changes
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return;
    clearLayers();
    addLayers();
  }, [activeLayers, clearLayers, addLayers]);

  return (
    <div
      ref={mapRef}
      style={{ height, width: "100%", minHeight: "400px" }}
      className="rounded-lg overflow-hidden bg-gray-200"
      role="application"
      aria-label="Interactive Zanzibar land intelligence map"
    />
  );
}
