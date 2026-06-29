import { DataSource, ListingRecord, InfrastructureRecord, GeoJSONLayers, LegalDocumentRecord } from "./types";
import { NeighbourhoodProfile } from "@/types";
import { legalDocuments as seedDocuments } from "@/data/seed/legal-documents";
import {
  neighbourhoods as seedNeighbourhoods,
  sampleListings as seedListings,
  infrastructureAssets as seedAssets,
  coastalZoneGeoJSON,
  floodRiskGeoJSON,
  developmentZoneGeoJSON,
  roadsGeoJSON,
} from "@/data/seed/zanzibar";

export class SeedDataSource implements DataSource {
  private neighbourhoods: NeighbourhoodProfile[] = seedNeighbourhoods;
  private listings: ListingRecord[] = seedListings.map((l) => ({
    id: l.id,
    title: l.title,
    description: l.description,
    latitude: l.latitude,
    longitude: l.longitude,
    priceUsd: l.priceUsd,
    areaSqm: l.areaSqm,
    pricePerSqm: l.pricePerSqm ?? 0,
    listingType: l.listingType,
    tags: l.tags,
  }));
  private assets: InfrastructureRecord[] = seedAssets.map((a) => ({
    id: a.id,
    name: a.name,
    assetType: a.assetType,
    latitude: a.latitude,
    longitude: a.longitude,
    status: a.status,
  }));
  private geojson: GeoJSONLayers = {
    coastalZones: coastalZoneGeoJSON as GeoJSON.FeatureCollection,
    floodRisk: floodRiskGeoJSON as GeoJSON.FeatureCollection,
    developmentZones: developmentZoneGeoJSON as GeoJSON.FeatureCollection,
    roads: roadsGeoJSON as GeoJSON.FeatureCollection,
  };
  private documents: LegalDocumentRecord[] = seedDocuments;

  getNeighbourhoods(): NeighbourhoodProfile[] {
    return this.neighbourhoods;
  }

  getListings(): ListingRecord[] {
    return this.listings;
  }

  getInfrastructureAssets(): InfrastructureRecord[] {
    return this.assets;
  }

  getGeoJSONLayers(): GeoJSONLayers {
    return this.geojson;
  }

  getLegalDocuments(): LegalDocumentRecord[] {
    return this.documents;
  }
}
