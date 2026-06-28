import { GeoFeature } from "../../types";

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export interface GeoJSONFeature {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: unknown;
  };
}

export function createPointFeature(
  id: string,
  lat: number,
  lng: number,
  properties: Record<string, unknown> = {}
): GeoFeature {
  return {
    id,
    type: "point",
    geometry: { latitude: lat, longitude: lng },
    properties,
  };
}

export function createGeoJSONFromFeatures(features: GeoFeature[]): GeoJSONFeatureCollection {
  return {
    type: "FeatureCollection",
    features: features.map((f) => ({
      type: "Feature" as const,
      properties: { ...f.properties, id: f.id },
      geometry: (() => {
        if ("latitude" in f.geometry) {
          return {
            type: "Point",
            coordinates: [f.geometry.longitude, f.geometry.latitude],
          };
        }
        return { type: "Unknown", coordinates: [] };
      })(),
    })),
  };
}

export function createMarkerFeature(
  id: string,
  lat: number,
  lng: number,
  label: string,
  properties: Record<string, unknown> = {}
): GeoFeature {
  return createPointFeature(id, lat, lng, {
    ...properties,
    label,
    marker: true,
  });
}
