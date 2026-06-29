"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { GeoPoint } from "@/types";
import { useMapStore } from "@/lib/store";
import { calculateCompositeIntelligence } from "@/modules/intelligence";
import { getDataSource } from "@/lib/data-source";

const ds = getDataSource();
const neighbourhoods = ds.getNeighbourhoods();
const sampleListings = ds.getListings();
const { coastalZones, floodRisk, developmentZones, roads } = ds.getGeoJSONLayers();

const ZONE_RADIUS = 800;

const CLUSTER_COLORS = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"];
const REGIME_COLORS: Record<string, string> = {
  bull: "#22c55e",
  bear: "#ef4444",
  neutral: "#f59e0b",
  volatile: "#a855f7",
};
const ENTROPY_COLORS = ["#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444"];

function entropyColor(val: number): string {
  const idx = Math.min(Math.floor(val * ENTROPY_COLORS.length), ENTROPY_COLORS.length - 1);
  return ENTROPY_COLORS[Math.max(0, idx)];
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

function loadGoogleMapsApi(): Promise<typeof google.maps> {
  return new Promise((resolve, reject) => {
    if (typeof google !== "undefined" && google.maps) {
      resolve(google.maps);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>('script[src*="maps.googleapis.com"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(google.maps));
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps API")));
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(google.maps));
    script.addEventListener("error", () => reject(new Error("Failed to load Google Maps API")));
    document.head.appendChild(script);
  });
}

interface GoogleEarthMapProps {
  onPointSelect?: (point: GeoPoint) => void;
  height?: string;
}

export default function GoogleEarthMap({ onPointSelect, height = "100%" }: GoogleEarthMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const loadedRef = useRef(false);

  const markersRef = useRef<google.maps.Marker[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);
  const polygonsRef = useRef<google.maps.Polygon[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);

  const selectedMarkerRef = useRef<google.maps.Marker | null>(null);
  const neighbourhoodLabelsRef = useRef<google.maps.Marker[]>([]);

  const { center, zoom, activeLayers, setSelectedPoint } = useMapStore();

  const intelData = useMemo(() => {
    if (["intel-entropy", "intel-volatility", "intel-clusters", "intel-momentum"].some((l) => activeLayers.includes(l))) {
      return calculateCompositeIntelligence();
    }
    return null;
  }, [activeLayers]);

  const clearOverlays = useCallback(() => {
    markersRef.current.forEach((m) => m.setMap(null));
    circlesRef.current.forEach((c) => c.setMap(null));
    polygonsRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current.forEach((l) => l.setMap(null));
    infoWindowsRef.current.forEach((w) => w.close());
    markersRef.current = [];
    circlesRef.current = [];
    polygonsRef.current = [];
    polylinesRef.current = [];
    infoWindowsRef.current = [];
  }, []);

  const addInfoWindow = useCallback((map: google.maps.Map, position: google.maps.LatLngLiteral, content: string) => {
    const info = new google.maps.InfoWindow({ content, position });
    infoWindowsRef.current.push(info);
    return info;
  }, []);

  const addOverlays = useCallback((map: google.maps.Map) => {
    clearOverlays();
    const gm = google.maps;

    if (activeLayers.includes("roads")) {
      roads.features.forEach((feature) => {
        if (feature.geometry.type === "LineString") {
          const path = feature.geometry.coordinates.map((c) => ({ lat: c[1], lng: c[0] }));
          const line = new gm.Polyline({
            path,
            strokeColor: "#6B7280",
            strokeWeight: 3,
            strokeOpacity: 0.7,
            map,
          });
          polylinesRef.current.push(line);
          line.addListener("click", () => {
            const info = addInfoWindow(map, path[Math.floor(path.length / 2)],
              `<div class="text-sm"><b>${feature.properties?.name ?? "Road"}</b><br>${feature.properties?.status ?? "Active"}</div>`);
            info.open(map);
          });
        }
      });
    }

    if (activeLayers.includes("coastal-zones")) {
      coastalZones.features.forEach((feature) => {
        if (feature.geometry.type === "Polygon") {
          const paths = feature.geometry.coordinates.map((ring) => ring.map((c) => ({ lat: c[1], lng: c[0] })));
          const poly = new gm.Polygon({
            paths,
            strokeColor: "#3B82F6",
            strokeWeight: 2,
            fillColor: "#3B82F6",
            fillOpacity: 0.15,
            map,
          });
          polygonsRef.current.push(poly);
          poly.addListener("click", () => {
            const info = addInfoWindow(map, paths[0][Math.floor(paths[0].length / 2)],
              `<div class="text-sm"><b>${feature.properties?.name ?? "Coastal Zone"}</b><br>Zone: ${feature.properties?.zone ?? "Unknown"}</div>`);
            info.open(map);
          });
        }
      });
    }

    if (activeLayers.includes("flood-risk")) {
      floodRisk.features.forEach((feature) => {
        if (feature.geometry.type === "Polygon") {
          const paths = feature.geometry.coordinates.map((ring) => ring.map((c) => ({ lat: c[1], lng: c[0] })));
          const poly = new gm.Polygon({
            paths,
            strokeColor: "#EF4444",
            strokeWeight: 2,
            fillColor: "#EF4444",
            fillOpacity: 0.2,
            map,
          });
          polygonsRef.current.push(poly);
          poly.addListener("click", () => {
            const info = addInfoWindow(map, paths[0][Math.floor(paths[0].length / 2)],
              `<div class="text-sm"><b>${feature.properties?.name ?? "Flood Risk"}</b><br>Risk: ${feature.properties?.riskLevel ?? "Unknown"}</div>`);
            info.open(map);
          });
        }
      });
    }

    if (activeLayers.includes("development-zones")) {
      developmentZones.features.forEach((feature) => {
        if (feature.geometry.type === "Polygon") {
          const paths = feature.geometry.coordinates.map((ring) => ring.map((c) => ({ lat: c[1], lng: c[0] })));
          const poly = new gm.Polygon({
            paths,
            strokeColor: "#8B5CF6",
            strokeWeight: 2,
            fillColor: "#8B5CF6",
            fillOpacity: 0.15,
            map,
          });
          polygonsRef.current.push(poly);
          poly.addListener("click", () => {
            const info = addInfoWindow(map, paths[0][Math.floor(paths[0].length / 2)],
              `<div class="text-sm"><b>${feature.properties?.name ?? "Development Zone"}</b><br>Type: ${feature.properties?.type ?? "Unknown"}</div>`);
            info.open(map);
          });
        }
      });
    }

    if (activeLayers.includes("listings")) {
      sampleListings.forEach((listing) => {
        const marker = new gm.Marker({
          position: { lat: listing.latitude, lng: listing.longitude },
          map,
          icon: {
            path: gm.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#F59E0B",
            fillOpacity: 1,
            strokeColor: "#D97706",
            strokeWeight: 2,
          },
          title: listing.title,
        });
        markersRef.current.push(marker);
        marker.addListener("click", () => {
          const info = addInfoWindow(map, { lat: listing.latitude, lng: listing.longitude },
            `<div class="text-sm"><b>${listing.title}</b><br>${listing.description}<br>$${listing.priceUsd.toLocaleString()} · ${listing.areaSqm}m²</div>`);
          info.open(map);
        });
      });
    }

    if (activeLayers.includes("intel-entropy") && intelData) {
      intelData.entropy.zoneEntropies.forEach((ze) => {
        const nb = neighbourhoods.find((n) => n.name === ze.zone);
        const pos = nb ? { lat: nb.latitude, lng: nb.longitude } : null;
        if (!pos) return;
        const color = entropyColor(ze.compositeEntropy);
        const circle = new gm.Circle({
          center: pos,
          radius: ZONE_RADIUS,
          fillColor: color,
          fillOpacity: 0.3,
          strokeColor: color,
          strokeWeight: 2,
          map,
        });
        circlesRef.current.push(circle);
        circle.addListener("click", () => {
          const info = addInfoWindow(map, pos,
            `<div class="text-sm"><b>${ze.zone}</b><br>Price Entropy: ${ze.priceEntropy.toFixed(3)}<br>Spatial Entropy: ${ze.spatialEntropy.toFixed(3)}<br>Signal Entropy: ${ze.signalEntropy.toFixed(3)}</div>`);
          info.open(map);
        });
      });
    }

    if (activeLayers.includes("intel-volatility") && intelData) {
      intelData.volatility.zoneVolatilities.forEach((zv) => {
        const nb = neighbourhoods.find((n) => n.name === zv.zone);
        const pos = nb ? { lat: nb.latitude, lng: nb.longitude } : null;
        if (!pos) return;
        const color = REGIME_COLORS[zv.regime ?? "neutral"] ?? "#f59e0b";
        const circle = new gm.Circle({
          center: pos,
          radius: ZONE_RADIUS,
          fillColor: color,
          fillOpacity: 0.3,
          strokeColor: color,
          strokeWeight: 2,
          map,
        });
        circlesRef.current.push(circle);
        circle.addListener("click", () => {
          const info = addInfoWindow(map, pos,
            `<div class="text-sm"><b>${zv.zone}</b><br>Regime: ${zv.regime}<br>Price Vol: ${zv.priceVolatility.toFixed(3)}<br>Composite Vol: ${zv.compositeVolatility.toFixed(3)}</div>`);
          info.open(map);
        });
      });
    }

    if (activeLayers.includes("intel-clusters") && intelData) {
      intelData.clustering.clusters.forEach((cluster, ci) => {
        const color = CLUSTER_COLORS[ci % CLUSTER_COLORS.length];
        cluster.zones.forEach((zoneName) => {
          const nb = neighbourhoods.find((n) => n.name === zoneName);
          const pos = nb ? { lat: nb.latitude, lng: nb.longitude } : null;
          if (!pos) return;
          const circle = new gm.Circle({
            center: pos,
            radius: ZONE_RADIUS * 1.2,
            fillColor: color,
            fillOpacity: 0.25,
            strokeColor: color,
            strokeWeight: 2,
            map,
          });
          circlesRef.current.push(circle);
          circle.addListener("click", () => {
            const info = addInfoWindow(map, pos,
              `<div class="text-sm"><b>${zoneName}</b><br>Cluster: ${cluster.label}<br>Score: ${cluster.averageScore.toFixed(1)}</div>`);
            info.open(map);
          });
        });
      });
    }

    if (activeLayers.includes("intel-momentum") && intelData) {
      intelData.momentum.zoneMomenta.forEach((zm) => {
        const nb = neighbourhoods.find((n) => n.name === zm.zone);
        const pos = nb ? { lat: nb.latitude, lng: nb.longitude } : null;
        if (!pos) return;
        const emoji = zm.momentumLabel === "accelerating" ? "▲▲" : zm.momentumLabel === "decelerating" ? "▼▼" : "◆";
        const color = zm.momentumLabel === "accelerating" ? "#22c55e" : zm.momentumLabel === "decelerating" ? "#ef4444" : "#6B7280";
        const marker = new gm.Marker({
          position: pos,
          map,
          icon: {
            path: gm.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: color,
            fillOpacity: 0.8,
            strokeColor: color,
            strokeWeight: 2,
          },
          label: { text: emoji, color: "#fff", fontSize: "14px" },
          title: zm.zone,
        });
        markersRef.current.push(marker);
        marker.addListener("click", () => {
          const info = addInfoWindow(map, pos,
            `<div class="text-sm"><b>${zm.zone}</b><br>Momentum: ${zm.momentumLabel}<br>Score: ${zm.momentumScore.toFixed(3)}<br>Acceleration: ${zm.acceleration.toFixed(3)}</div>`);
          info.open(map);
        });
      });
    }
  }, [activeLayers, intelData, clearOverlays, addInfoWindow]);

  useEffect(() => {
    if (!API_KEY) return;
    if (loadedRef.current && mapRef.current) {
      addOverlays(mapRef.current);
      return;
    }
    if (loadedRef.current) return;

    loadGoogleMapsApi()
      .then((gm) => {
        loadedRef.current = true;
        if (!containerRef.current) return;

        const map = new gm.Map(containerRef.current, {
          center: { lat: center.latitude, lng: center.longitude },
          zoom: zoom,
          minZoom: 8,
          maxZoom: 20,
          mapTypeId: "hybrid",
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: gm.MapTypeControlStyle.HORIZONTAL_BAR,
            position: gm.ControlPosition.TOP_RIGHT,
          },
          zoomControl: true,
          zoomControlOptions: {
            position: gm.ControlPosition.RIGHT_TOP,
          },
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          ],
        });

        mapRef.current = map;

        neighbourhoods.forEach((n) => {
          const label = new gm.Marker({
            position: { lat: n.latitude, lng: n.longitude },
            map,
            icon: {
              path: gm.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: "#22d3ee",
              fillOpacity: 1,
              strokeColor: "#06b6d4",
              strokeWeight: 2,
            },
            title: n.name,
          });
          neighbourhoodLabelsRef.current.push(label);

          const info = new gm.InfoWindow({
            content: `<div class="text-sm font-medium">${n.name}</div>`,
          });
          label.addListener("click", () => info.open(map, label));
        });

        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          const point: GeoPoint = {
            latitude: e.latLng.lat(),
            longitude: e.latLng.lng(),
          };
          setSelectedPoint(point);
          onPointSelect?.(point);
        });

        addOverlays(map);
      })
      .catch(() => {
        console.warn("Google Maps API failed to load — check NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
      });

    return () => {
      if (mapRef.current) {
        google.maps.event?.clearInstanceListeners?.(mapRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    addOverlays(mapRef.current);
  }, [activeLayers, addOverlays]);

  useEffect(() => {
    if (!mapRef.current) return;
    const { selectedPoint } = useMapStore.getState();
    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.setMap(null);
      selectedMarkerRef.current = null;
    }
    if (selectedPoint) {
      const gm = google.maps;
      const marker = new gm.Marker({
        position: { lat: selectedPoint.latitude, lng: selectedPoint.longitude },
        map: mapRef.current,
        icon: {
          path: gm.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#06b6d4",
          fillOpacity: 0.9,
          strokeColor: "#0891b2",
          strokeWeight: 3,
        },
        title: "Selected Point",
      });
      selectedMarkerRef.current = marker;
    }
  }, []);

  useEffect(() => {
    const unsub = useMapStore.subscribe((state, prev) => {
      if (state.selectedPoint !== prev.selectedPoint) {
        if (selectedMarkerRef.current) {
          selectedMarkerRef.current.setMap(null);
          selectedMarkerRef.current = null;
        }
        if (state.selectedPoint && mapRef.current) {
          const gm = google.maps;
          const marker = new gm.Marker({
            position: { lat: state.selectedPoint.latitude, lng: state.selectedPoint.longitude },
            map: mapRef.current,
            icon: {
              path: gm.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#06b6d4",
              fillOpacity: 0.9,
              strokeColor: "#0891b2",
              strokeWeight: 3,
            },
            title: "Selected Point",
          });
          selectedMarkerRef.current = marker;
        }
      }
    });
    return unsub;
  }, []);

  if (!API_KEY) {
    return (
      <div className="flex items-center justify-center h-full rounded-lg" style={{ background: "#0f1525" }}>
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <span className="text-3xl">🛰️</span>
          <div className="text-slate-400 text-sm font-medium">Google Earth</div>
          <p className="text-slate-600 text-xs max-w-xs">
            Set <code className="px-1.5 py-0.5 rounded bg-gray-800 text-cyan-400">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
            in your environment to enable satellite imagery, 3D terrain, and Earth view.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height, minHeight: "400px" }}
      className="rounded-lg overflow-hidden"
      role="application"
      aria-label="Google Earth Map"
    />
  );
}
