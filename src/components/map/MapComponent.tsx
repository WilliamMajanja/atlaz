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
  intelEntropy: ReturnType<typeof import("leaflet").circle>[];
  intelVolatility: ReturnType<typeof import("leaflet").circle>[];
  intelClusters: ReturnType<typeof import("leaflet").circle>[];
  intelMomentum: ReturnType<typeof import("leaflet").marker>[];
}

const ZONE_RADIUS = 800;
const CLUSTER_COLORS = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#f43f5e", "#6366f1"];
const REGIME_COLORS: Record<string, string> = {
  bull: "#10b981",
  stable: "#3b82f6",
  transition: "#f59e0b",
  correction: "#f97316",
  bear: "#ef4444",
};
const ENTROPY_COLORS = ["#10b981", "#84cc16", "#facc15", "#f97316", "#ef4444"];

function entropyColor(value: number): string {
  if (value <= 0.2) return ENTROPY_COLORS[0];
  if (value <= 0.4) return ENTROPY_COLORS[1];
  if (value <= 0.6) return ENTROPY_COLORS[2];
  if (value <= 0.8) return ENTROPY_COLORS[3];
  return ENTROPY_COLORS[4];
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
    intelEntropy: [],
    intelVolatility: [],
    intelClusters: [],
    intelMomentum: [],
  });
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const selectedMarkerRef = useRef<ReturnType<typeof import("leaflet").marker> | null>(null);
  const satelliteLayerRef = useRef<ReturnType<typeof import("leaflet").tileLayer> | null>(null);
  const osmLayerRef = useRef<ReturnType<typeof import("leaflet").tileLayer> | null>(null);
  const { center, zoom, activeLayers, setSelectedPoint, selectedPoint } = useMapStore();

  const intelData = useMemo(() => {
    const hasIntelLayers = activeLayers.some((l) => l.startsWith("intel-"));
    return hasIntelLayers ? calculateCompositeIntelligence() : null;
  }, [activeLayers]);

  const clearLayers = useCallback(() => {
    const layers = layersRef.current;
    if (!leafletRef.current) return;

    const removeAll = <T,>(arr: T[]) => {
      (arr as unknown as Array<{ remove: () => void }>).forEach((l) => l.remove());
      arr.length = 0;
    };

    removeAll(layers.roads);
    removeAll(layers.coastalZones);
    removeAll(layers.floodRisk);
    removeAll(layers.developmentZones);
    removeAll(layers.listings);
    removeAll(layers.intelEntropy);
    removeAll(layers.intelVolatility);
    removeAll(layers.intelClusters);
    removeAll(layers.intelMomentum);
  }, []);

  const addLayers = useCallback(() => {
    const map = mapInstanceRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    const layers = layersRef.current;

    if (activeLayers.includes("roads")) {
      roads.features.forEach((feature) => {
        if (feature.geometry.type === "LineString") {
          const coords = feature.geometry.coordinates.map((c) => [c[1], c[0]] as [number, number]);
          const layer = L.polyline(coords, {
            color: "#6B7280", weight: 3, opacity: 0.7,
          }).addTo(map).bindPopup(`<b>${feature.properties?.name ?? "Road"}</b><br>${feature.properties?.status ?? "Active"}`);
          layers.roads.push(layer);
        }
      });
    }

    if (activeLayers.includes("coastal-zones")) {
      coastalZones.features.forEach((feature) => {
        if (feature.geometry.type === "Polygon") {
          const coords = feature.geometry.coordinates[0].map((c) => [c[1], c[0]] as [number, number]);
          const layer = L.polygon(coords, {
            color: "#3B82F6", fillColor: "#3B82F6", fillOpacity: 0.15, weight: 2,
          }).addTo(map).bindPopup(`<b>${feature.properties?.name ?? "Coastal Zone"}</b><br>Zone: ${feature.properties?.zone ?? "Unknown"}`);
          layers.coastalZones.push(layer);
        }
      });
    }

    if (activeLayers.includes("flood-risk")) {
      floodRisk.features.forEach((feature) => {
        if (feature.geometry.type === "Polygon") {
          const coords = feature.geometry.coordinates[0].map((c) => [c[1], c[0]] as [number, number]);
          const layer = L.polygon(coords, {
            color: "#EF4444", fillColor: "#EF4444", fillOpacity: 0.2, weight: 2,
          }).addTo(map).bindPopup(`<b>${feature.properties?.name ?? "Flood Risk"}</b><br>Risk: ${feature.properties?.riskLevel ?? "Unknown"}`);
          layers.floodRisk.push(layer);
        }
      });
    }

    if (activeLayers.includes("development-zones")) {
      developmentZones.features.forEach((feature) => {
        if (feature.geometry.type === "Polygon") {
          const coords = feature.geometry.coordinates[0].map((c) => [c[1], c[0]] as [number, number]);
          const layer = L.polygon(coords, {
            color: "#8B5CF6", fillColor: "#8B5CF6", fillOpacity: 0.15, weight: 2,
          }).addTo(map).bindPopup(`<b>${feature.properties?.name ?? "Development Zone"}</b><br>Type: ${feature.properties?.type ?? "Unknown"}`);
          layers.developmentZones.push(layer);
        }
      });
    }

    if (activeLayers.includes("listings")) {
      sampleListings.forEach((listing) => {
        const marker = L.circleMarker([listing.latitude, listing.longitude], {
          radius: 8, fillColor: "#F59E0B", color: "#D97706", weight: 2, fillOpacity: 0.8,
        }).addTo(map);
        marker.bindPopup(
          `<b>${listing.title}</b><br>${listing.description}<br><b>Price: $${listing.priceUsd?.toLocaleString() ?? "N/A"}</b><br>Area: ${listing.areaSqm} sqm`
        );
        layers.listings.push(marker);
      });
    }

    if (!intelData) return;

    const zoneRadiusMeters = ZONE_RADIUS;
    const popupContent = (zoneName: string) => {
      const n = neighbourhoods.find((z) => z.name === zoneName);
      if (!n) return "";
      return `<b>${zoneName}</b><br>Tourism: ${n.tourismScore}/100<br>Infra: ${n.infrastructureScore}/100<br>Momentum: ${n.developmentMomentum}/100<br>Price: $${n.pricePerSqmMin}-$${n.pricePerSqmMax}/sqm`;
    };

    if (activeLayers.includes("intel-entropy") && intelData.entropy) {
      intelData.entropy.zoneEntropies.forEach((ze) => {
        const zone = neighbourhoods.find((n) => n.name === ze.zone);
        if (!zone) return;
        const color = entropyColor(ze.compositeEntropy);
        const circle = L.circle([zone.latitude, zone.longitude], {
          radius: zoneRadiusMeters,
          color,
          fillColor: color,
          fillOpacity: 0.3,
          weight: 2,
          opacity: 0.7,
        }).addTo(map);
        circle.bindPopup(
          `${popupContent(ze.zone)}<br><b>Entropy:</b> ${ze.compositeLabel} (${ze.compositeEntropy})<br>Price: ${ze.priceEntropyLabel}<br>Spatial: ${ze.spatialEntropyLabel}<br>Signal: ${ze.signalEntropyLabel}`
        );
        layers.intelEntropy.push(circle);
      });
    }

    if (activeLayers.includes("intel-volatility") && intelData.volatility) {
      intelData.volatility.zoneVolatilities.forEach((zv) => {
        const zone = neighbourhoods.find((n) => n.name === zv.zone);
        if (!zone) return;
        const color = REGIME_COLORS[zv.regime] ?? "#64748b";
        const circle = L.circle([zone.latitude, zone.longitude], {
          radius: zoneRadiusMeters,
          color,
          fillColor: color,
          fillOpacity: 0.25,
          weight: 2,
          opacity: 0.6,
        }).addTo(map);
        circle.bindPopup(
          `${popupContent(zv.zone)}<br><b>Regime:</b> ${zv.regime}<br><b>Volatility:</b> ${zv.compositeLabel} (${zv.compositeVolatility})<br>Price Vol: ${zv.priceVolatilityLabel}<br>Momentum Vol: ${zv.momentumVolatility}`
        );
        layers.intelVolatility.push(circle);
      });
    }

    if (activeLayers.includes("intel-clusters") && intelData.clustering) {
      intelData.clustering.clusters.forEach((cluster) => {
        const color = CLUSTER_COLORS[parseInt(cluster.id.replace("cluster_", "")) % CLUSTER_COLORS.length];
        cluster.zones.forEach((zoneName) => {
          const zone = neighbourhoods.find((n) => n.name === zoneName);
          if (!zone) return;
          const circle = L.circle([zone.latitude, zone.longitude], {
            radius: zoneRadiusMeters,
            color,
            fillColor: color,
            fillOpacity: 0.35,
            weight: 2,
            opacity: 0.7,
          }).addTo(map);
          const isOutlier = intelData.clustering.outliers.includes(zoneName);
          circle.bindPopup(
            `${popupContent(zoneName)}<br><b>Cluster:</b> ${cluster.label} (${cluster.id})<br><b>Avg Score:</b> ${cluster.averageScore}${isOutlier ? "<br><span style='color:#f43f5e'>⚠ Outlier</span>" : ""}`
          );
          layers.intelClusters.push(circle);
        });
      });
    }

    if (activeLayers.includes("intel-momentum") && intelData.momentum) {
      intelData.momentum.zoneMomenta.forEach((zm) => {
        const zone = neighbourhoods.find((n) => n.name === zm.zone);
        if (!zone) return;
        const arrowSymbol = zm.momentumLabel === "accelerating" ? "▲▲" :
          zm.momentumLabel === "strong" ? "▲" :
          zm.momentumLabel === "stable" ? "◆" :
          zm.momentumLabel === "decelerating" ? "▼" : "▼▼";
        const arrowColor = zm.momentumLabel === "accelerating" || zm.momentumLabel === "strong" ? "#10b981" :
          zm.momentumLabel === "stable" ? "#3b82f6" : "#f43f5e";
        const icon = L.divIcon({
          className: "momentum-marker",
          html: `<div style="font-size:18px;color:${arrowColor};text-shadow:0 0 12px ${arrowColor}66;text-align:center;font-weight:bold">${arrowSymbol}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });
        const marker = L.marker([zone.latitude, zone.longitude], { icon }).addTo(map);
        marker.bindPopup(
          `${popupContent(zm.zone)}<br><b>Momentum:</b> ${zm.momentumLabel} (${zm.momentumScore})<br><b>Acceleration:</b> ${zm.acceleration}<br><b>Trend Strength:</b> ${zm.trendStrength}`
        );
        layers.intelMomentum.push(marker);
      });
    }
  }, [activeLayers, intelData]);

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
        zoom,
        zoomControl: true,
      });

      const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);
      osmLayerRef.current = osmLayer;

      const satLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: '&copy; Esri, Maxar, Earthstar Geographics',
          maxZoom: 20,
        }
      );
      satelliteLayerRef.current = satLayer;

      if (activeLayers.includes("satellite")) {
        map.removeLayer(osmLayer);
        satLayer.addTo(map);
      }

      neighbourhoods.forEach((n) => {
        const icon = L.divIcon({
          className: "neighbourhood-label",
          html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;margin:-6px 0 0 -6px"><div style="width:8px;height:8px;background:#06b6d4;border:2px solid #fff;border-radius:50%;box-shadow:0 0 8px rgba(6,182,212,0.6)"></div><div style="background:rgba(0,0,0,0.85);color:#fff;padding:2px 6px;border-radius:4px;font-size:11px;white-space:nowrap;font-weight:500">${n.name}</div></div>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });
        L.marker([n.latitude, n.longitude], { icon }).addTo(map).bindPopup(`<b>${n.name}</b><br>${n.description}`);
      });

      map.on("click", (e: L.LeafletMouseEvent) => {
        const point: GeoPoint = { latitude: e.latlng.lat, longitude: e.latlng.lng };
        setSelectedPoint(point);
        onPointSelect?.(point);
      });

      mapInstanceRef.current = map;
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

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !osmLayerRef.current || !satelliteLayerRef.current) return;

    if (activeLayers.includes("satellite")) {
      if (map.hasLayer(osmLayerRef.current)) map.removeLayer(osmLayerRef.current);
      if (!map.hasLayer(satelliteLayerRef.current)) satelliteLayerRef.current.addTo(map);
    } else {
      if (map.hasLayer(satelliteLayerRef.current)) map.removeLayer(satelliteLayerRef.current);
      if (!map.hasLayer(osmLayerRef.current)) osmLayerRef.current.addTo(map);
    }
  }, [activeLayers]);

  useEffect(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return;
    clearLayers();
    addLayers();
  }, [activeLayers, clearLayers, addLayers]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.remove();
      selectedMarkerRef.current = null;
    }

    if (selectedPoint) {
      const icon = L.divIcon({
        className: "selected-point-marker",
        html: `<div style="width:22px;height:22px;background:linear-gradient(135deg,#06b6d4,#3b82f6);border:3px solid #fff;border-radius:50%;box-shadow:0 0 24px rgba(6,182,212,0.6),0 0 60px rgba(6,182,212,0.2)"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      selectedMarkerRef.current = L.marker([selectedPoint.latitude, selectedPoint.longitude], { icon }).addTo(map);
    }
  }, [selectedPoint]);

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
