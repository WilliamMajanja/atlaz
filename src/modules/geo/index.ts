import { GeoPoint, GeoAnalysisInput, GeoAnalysisResult, GeoFeature } from "../../types";

/**
 * Geo Module - ZanAtlas
 * 
 * Responsible for geo-spatial analysis, distance calculations,
 * and feature lookups. Uses simple approximations for MVP,
 * designed to be replaced with turf.js or PostGIS later.
 */

const EARTH_RADIUS_M = 6371000;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function haversineDistance(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLng = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

  return EARTH_RADIUS_M * c;
}

export function calculateBoundingBox(
  center: GeoPoint,
  radiusMeters: number
): { minLat: number; maxLat: number; minLng: number; maxLng: number } {
  const latDelta = (radiusMeters / EARTH_RADIUS_M) * (180 / Math.PI);
  const lngDelta =
    (radiusMeters / (EARTH_RADIUS_M * Math.cos(toRadians(center.latitude)))) *
    (180 / Math.PI);

  return {
    minLat: center.latitude - latDelta,
    maxLat: center.latitude + latDelta,
    minLng: center.longitude - lngDelta,
    maxLng: center.longitude + lngDelta,
  };
}

export function pointInBoundingBox(
  point: GeoPoint,
  bbox: { minLat: number; maxLat: number; minLng: number; maxLng: number }
): boolean {
  return (
    point.latitude >= bbox.minLat &&
    point.latitude <= bbox.maxLat &&
    point.longitude >= bbox.minLng &&
    point.longitude <= bbox.maxLng
  );
}

export function findNearestFeature(
  point: GeoPoint,
  features: GeoFeature[]
): { feature: GeoFeature; distance: number } | null {
  let nearest: { feature: GeoFeature; distance: number } | null = null;

  for (const feature of features) {
    const featurePoint = extractCentrePoint(feature);
    if (!featurePoint) continue;

    const distance = haversineDistance(point, featurePoint);
    if (!nearest || distance < nearest.distance) {
      nearest = { feature, distance };
    }
  }

  return nearest;
}

export function countFeaturesWithinRadius(
  point: GeoPoint,
  features: GeoFeature[],
  radiusMeters: number
): number {
  return features.filter((f) => {
    const fp = extractCentrePoint(f);
    if (!fp) return false;
    return haversineDistance(point, fp) <= radiusMeters;
  }).length;
}

export function filterFeaturesInBoundingBox(
  features: GeoFeature[],
  bbox: { minLat: number; maxLat: number; minLng: number; maxLng: number }
): GeoFeature[] {
  return features.filter((f) => {
    const fp = extractCentrePoint(f);
    if (!fp) return false;
    return pointInBoundingBox(fp, bbox);
  });
}

function extractCentrePoint(feature: GeoFeature): GeoPoint | null {
  const geom = feature.geometry;
  if ("latitude" in geom && "longitude" in geom) {
    return geom as GeoPoint;
  }
  return null;
}

export function calculateAreaSqm(polygon: GeoPoint[]): number {
  if (polygon.length < 3) return 0;

  // Simplified area calculation using Shoelace formula with Mercator projection
  let area = 0;
  const n = polygon.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const lat1 = toRadians(polygon[i].latitude);
    const lat2 = toRadians(polygon[j].latitude);
    const dLng = toRadians(polygon[j].longitude - polygon[i].longitude);
    area += dLng * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  area = Math.abs((area * EARTH_RADIUS_M * EARTH_RADIUS_M) / 2);
  return area;
}

export function runGeoAnalysis(input: GeoAnalysisInput): GeoAnalysisResult {
  const center: GeoPoint = { latitude: input.latitude, longitude: input.longitude };
  const radius = input.radiusMeters ?? 2000;
  const bbox = calculateBoundingBox(center, radius);

  return {
    nearbyFeatures: [],
    nearestRoadDistance: 0,
    nearestCoastlineDistance: 0,
    nearbyBuildingCount: 0,
    boundingBox: bbox,
  };
}
