import { db } from "@/lib/db";
import { ingestRoads, ingestBuildings, ingestPointsOfInterest, IngestionOutput } from "./sources/overpass";

export interface PipelineResult {
  sources: { layerName: string; recordsIngested: number; errors: string[] }[];
  totalIngested: number;
  totalErrors: number;
  duration: number;
}

async function persistLayer(name: string, features: GeoJSON.Feature[]): Promise<void> {
  if (features.length === 0) return;

  const layerType = name === "points_of_interest" ? "point" : name === "roads" ? "line" : "polygon";

  const layer = await db.geoLayer.upsert({
    where: { name },
    update: { layerType, source: "openstreetmap", visible: true },
    create: {
      name,
      description: "Ingested from OpenStreetMap Overpass API",
      layerType,
      source: "openstreetmap",
      visible: true,
    },
  });

  await db.geoFeature.deleteMany({ where: { layerId: layer.id } });

  const batchSize = 100;
  for (let i = 0; i < features.length; i += batchSize) {
    const batch = features.slice(i, i + batchSize);
    await db.geoFeature.createMany({
      data: batch.map((f) => ({
        name: ((f.properties as Record<string, unknown>)?.name as string) ?? null,
        featureType: f.geometry.type,
        properties: f.properties,
        geometry: f.geometry,
        layerId: layer.id,
      })) as any,
    });
  }
}

export async function runIngestionPipeline(): Promise<PipelineResult> {
  const start = Date.now();

  const outputs: IngestionOutput[] = await Promise.all([
    ingestRoads(),
    ingestBuildings(),
    ingestPointsOfInterest(),
  ]);

  let totalIngested = 0;
  let totalErrors = 0;

  for (const { result, features } of outputs) {
    totalIngested += result.recordsIngested;
    totalErrors += result.errors.length;
    await persistLayer(result.layerName, features);
  }

  return {
    sources: outputs.map((o) => o.result),
    totalIngested,
    totalErrors,
    duration: Date.now() - start,
  };
}

export async function getIngestionStatus(): Promise<{
  layers: { name: string; featureCount: number }[];
}> {
  const layers = await db.geoLayer.findMany({
    include: { _count: { select: { features: true } } },
  });

  return {
    layers: layers.map((l) => ({ name: l.name, featureCount: l._count.features })),
  };
}
