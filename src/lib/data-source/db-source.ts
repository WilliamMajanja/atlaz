import { DataSource, ListingRecord, InfrastructureRecord, GeoJSONLayers, LegalDocumentRecord } from "./types";
import { NeighbourhoodProfile } from "@/types";
import { db } from "@/lib/db";

export class DatabaseDataSource implements DataSource {
  private cachedNeighbourhoods: NeighbourhoodProfile[] | null = null;
  private cachedListings: ListingRecord[] | null = null;
  private cachedAssets: InfrastructureRecord[] | null = null;
  private cachedGeoJSON: GeoJSONLayers | null = null;
  private cachedDocuments: LegalDocumentRecord[] | null = null;

  getNeighbourhoods(): NeighbourhoodProfile[] {
    if (this.cachedNeighbourhoods) return this.cachedNeighbourhoods;
    throw new Error("DatabaseDataSource requires async initialization. Call await source.load() first.");
  }

  getListings(): ListingRecord[] {
    if (this.cachedListings) return this.cachedListings;
    throw new Error("DatabaseDataSource requires async initialization. Call await source.load() first.");
  }

  getInfrastructureAssets(): InfrastructureRecord[] {
    if (this.cachedAssets) return this.cachedAssets;
    throw new Error("DatabaseDataSource requires async initialization. Call await source.load() first.");
  }

  getGeoJSONLayers(): GeoJSONLayers {
    if (this.cachedGeoJSON) return this.cachedGeoJSON;
    throw new Error("DatabaseDataSource requires async initialization. Call await source.load() first.");
  }

  getLegalDocuments(): LegalDocumentRecord[] {
    if (this.cachedDocuments) return this.cachedDocuments;
    throw new Error("DatabaseDataSource requires async initialization. Call await source.load() first.");
  }

  async load(): Promise<void> {
    const [dbZones, dbListings, dbAssets, dbLayers] = await Promise.all([
      db.developmentZone.findMany(),
      db.listing.findMany(),
      db.infrastructureAsset.findMany(),
      db.geoLayer.findMany({ include: { features: true } }),
    ]);

    this.cachedNeighbourhoods = dbZones.map((z) => ({
      id: z.id,
      name: z.name,
      description: z.description ?? "",
      latitude: 0,
      longitude: 0,
      tourismScore: z.tourismScore,
      infrastructureScore: z.infrastructureScore,
      floodSensitivity: z.floodSensitivity,
      developmentMomentum: z.developmentMomentum,
      pricePerSqmMin: z.pricePerSqmMin ?? 0,
      pricePerSqmMax: z.pricePerSqmMax ?? 0,
      strategicNote: z.strategicNote ?? "",
    }));

    this.cachedListings = dbListings.map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description ?? "",
      latitude: l.latitude,
      longitude: l.longitude,
      priceUsd: l.priceUsd ?? 0,
      areaSqm: l.areaSqm ?? 0,
      pricePerSqm: l.pricePerSqm ?? 0,
      listingType: l.listingType,
      tags: l.tags ? JSON.parse(l.tags) : [],
    }));

    this.cachedAssets = dbAssets.map((a) => ({
      id: a.id,
      name: a.name,
      assetType: a.assetType,
      latitude: a.latitude,
      longitude: a.longitude,
      status: a.status,
    }));

    const layerMap: Record<string, GeoJSON.Feature[]> = {};
    for (const layer of dbLayers) {
      const features: GeoJSON.Feature[] = layer.features.map((f) => ({
        type: "Feature",
        properties: (f.properties ?? {}) as Record<string, unknown>,
        geometry: f.geometry as unknown as GeoJSON.Geometry,
      }));
      layerMap[layer.name] = features;
    }

    const emptyFC: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: [] };
    this.cachedGeoJSON = {
      coastalZones: { type: "FeatureCollection", features: layerMap["coastal-zones"] ?? [] },
      floodRisk: { type: "FeatureCollection", features: layerMap["flood-risk"] ?? [] },
      developmentZones: { type: "FeatureCollection", features: layerMap["development-zones"] ?? [] },
      roads: { type: "FeatureCollection", features: layerMap["roads"] ?? [] },
    };

    const dbDocs = await db.legalDocument.findMany();
    this.cachedDocuments = dbDocs.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      category: d.category,
      jurisdiction: d.jurisdiction,
      pdfUrl: d.pdfUrl,
      fileSize: d.fileSize,
      pages: d.pages,
      language: d.language,
      referenceNumber: d.referenceNumber,
      enactedDate: d.enactedDate?.toISOString() ?? null,
      lastAmended: d.lastAmended?.toISOString() ?? null,
      tags: d.tags ? JSON.parse(d.tags) : [],
    }));
  }
}
