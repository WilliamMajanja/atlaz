import { NeighbourhoodProfile } from "@/types";

export interface ListingRecord {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  priceUsd: number;
  areaSqm: number;
  pricePerSqm: number;
  listingType: string;
  tags: string[];
}

export interface InfrastructureRecord {
  id: string;
  name: string;
  assetType: string;
  latitude: number;
  longitude: number;
  status: string;
}

export interface LegalDocumentRecord {
  id: string;
  title: string;
  description: string | null;
  category: string;
  jurisdiction: string;
  pdfUrl: string;
  fileSize: number | null;
  pages: number | null;
  language: string;
  referenceNumber: string | null;
  enactedDate: string | null;
  lastAmended: string | null;
  tags: string[];
}

export interface GeoJSONLayers {
  coastalZones: GeoJSON.FeatureCollection;
  floodRisk: GeoJSON.FeatureCollection;
  developmentZones: GeoJSON.FeatureCollection;
  roads: GeoJSON.FeatureCollection;
}

export interface DataSource {
  getNeighbourhoods(): NeighbourhoodProfile[];
  getListings(): ListingRecord[];
  getInfrastructureAssets(): InfrastructureRecord[];
  getGeoJSONLayers(): GeoJSONLayers;
  getLegalDocuments(): LegalDocumentRecord[];
}
