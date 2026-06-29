const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";

const ZANZIBAR_BBOX = "-6.5,39.0,-5.5,39.7";

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
  nodes?: number[];
  geometry?: { lat: number; lon: number }[];
}

interface OverpassResult {
  elements: OverpassElement[];
}

async function queryOverpass(query: string): Promise<OverpassResult> {
  const resp = await fetch(OVERPASS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!resp.ok) {
    throw new Error(`Overpass API error: ${resp.status} ${resp.statusText}`);
  }
  return resp.json();
}

function coordToGeoJSON(geom: { lat: number; lon: number }[]): GeoJSON.LineString | GeoJSON.Polygon {
  const coords = geom.map((p) => [p.lon, p.lat] as [number, number]);
  const isRing = coords.length >= 3 && coords[0][0] === coords[coords.length - 1][0] && coords[0][1] === coords[coords.length - 1][1];
  if (isRing) return { type: "Polygon", coordinates: [coords] };
  return { type: "LineString", coordinates: coords };
}

function nodeToPoint(el: OverpassElement): GeoJSON.Point {
  return { type: "Point", coordinates: [el.lon!, el.lat!] };
}

export interface IngestionResult {
  layerName: string;
  recordsIngested: number;
  errors: string[];
}

export interface IngestionOutput {
  result: IngestionResult;
  features: GeoJSON.Feature[];
}

export async function ingestRoads(): Promise<IngestionOutput> {
  const errors: string[] = [];
  const query = `[out:json];(way["highway"](${ZANZIBAR_BBOX}););out geom;`;

  try {
    const data = await queryOverpass(query);
    const features: GeoJSON.Feature[] = [];

    for (const el of data.elements) {
      if (el.type !== "way" || !el.geometry) continue;
      try {
        const geometry = coordToGeoJSON(el.geometry);
        features.push({
          type: "Feature",
          properties: {
            name: el.tags?.name ?? null,
            highway: el.tags?.highway ?? null,
            surface: el.tags?.surface ?? null,
            osm_id: el.id,
          },
          geometry,
        });
      } catch {
        errors.push(`Failed to process road ${el.id}`);
      }
    }

    return {
      result: { layerName: "roads", recordsIngested: features.length, errors },
      features,
    };
  } catch (err) {
    return {
      result: { layerName: "roads", recordsIngested: 0, errors: [(err as Error).message] },
      features: [],
    };
  }
}

export async function ingestBuildings(): Promise<IngestionOutput> {
  const errors: string[] = [];
  const query = `[out:json];(way["building"](${ZANZIBAR_BBOX}););out geom;`;

  try {
    const data = await queryOverpass(query);
    const features: GeoJSON.Feature[] = [];

    for (const el of data.elements) {
      if (el.type !== "way" || !el.geometry) continue;
      try {
        const coords = el.geometry.map((p) => [p.lon, p.lat] as [number, number]);
        const geometry: GeoJSON.Polygon = { type: "Polygon", coordinates: [coords] };
        features.push({
          type: "Feature",
          properties: {
            name: el.tags?.name ?? null,
            building: el.tags?.building ?? null,
            amenity: el.tags?.amenity ?? null,
            osm_id: el.id,
          },
          geometry,
        });
      } catch {
        errors.push(`Failed to process building ${el.id}`);
      }
    }

    return {
      result: { layerName: "buildings", recordsIngested: features.length, errors },
      features,
    };
  } catch (err) {
    return {
      result: { layerName: "buildings", recordsIngested: 0, errors: [(err as Error).message] },
      features: [],
    };
  }
}

export async function ingestPointsOfInterest(): Promise<IngestionOutput> {
  const errors: string[] = [];
  const tags = ["amenity", "shop", "tourism", "leisure", "craft", "office"];
  const tagFilters = tags.map((t) => `node["${t}"](${ZANZIBAR_BBOX});`).join("");
  const query = `[out:json];(${tagFilters});out;`;

  try {
    const data = await queryOverpass(query);
    const features: GeoJSON.Feature[] = [];

    for (const el of data.elements) {
      if (el.type !== "node" || !el.lat || !el.lon) continue;
      const matchedTag = tags.find((t) => el.tags?.[t]);
      features.push({
        type: "Feature",
        properties: {
          name: el.tags?.name ?? null,
          category: matchedTag ?? null,
          value: matchedTag ? el.tags?.[matchedTag] : null,
          osm_id: el.id,
        },
        geometry: nodeToPoint(el),
      });
    }

    return {
      result: { layerName: "points_of_interest", recordsIngested: features.length, errors },
      features,
    };
  } catch (err) {
    return {
      result: { layerName: "points_of_interest", recordsIngested: 0, errors: [(err as Error).message] },
      features: [],
    };
  }
}
