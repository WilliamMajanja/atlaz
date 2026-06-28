/**
 * Zanzibar Open Data Types - ZanAtlas
 *
 * Comprehensive type definitions for all Zanzibar open data categories:
 * - Official Government Statistics (ZANSIS, TISP, ZNADA)
 * - Geospatial & Environmental (ZanSDI, Marine/Coastal, OSM, Satellite)
 * - Public Procurement (eProZ)
 */

// ─── Data Source Registry ─────────────────────────────────────────────────────

export type DataSourceCategory =
  | "government_statistics"
  | "geospatial"
  | "environmental"
  | "marine_coastal"
  | "satellite_remote_sensing"
  | "public_procurement"
  | "open_street_map"
  | "land_registry"
  | "property_listings"
  | "flood_models";

export type DataSourceStatus =
  | "active"        // Currently accessible and ingesting
  | "stub"          // Interface defined, not yet connected
  | "deprecated"    // Superseded by another source
  | "restricted"    // Requires authentication or approval
  | "intermittent"; // Occasionally available

export interface DataSourceMetadata {
  id: string;
  name: string;
  shortName: string;
  category: DataSourceCategory;
  status: DataSourceStatus;
  description: string;
  provider: string;
  providerUrl: string;
  apiType: "rest" | "ogc_wms" | "ogc_wfs" | "ogc_wcs" | "graphql" | "bulk_download" | "geonode" | "power_bi" | "open_api" | "none";
  baseUrl?: string;
  documentationUrl?: string;
  license: string;
  updateFrequency: "realtime" | "daily" | "weekly" | "monthly" | "quarterly" | "annual" | "adhoc" | "static";
  spatialResolution?: string;
  temporalCoverage?: string;
  dataFormats: string[];
  coverageIslands: ("unguja" | "pemba")[];
  notes: string;
}

// ─── Government Statistics ────────────────────────────────────────────────────

export interface ZansisIndicator {
  id: string;
  name: string;
  category: "macroeconomic" | "cpi" | "agriculture" | "tourism" | "climate" | "demographics" | "health" | "education";
  value: number;
  unit: string;
  period: string; // e.g. "2024-Q1", "2024-03"
  island: "unguja" | "pemba" | "both";
  region?: string;
  district?: string;
  shehia?: string;
  source: "zansis";
  lastUpdated: string;
}

export interface TispDashboard {
  id: string;
  name: string;
  description: string;
  category: "census_2022" | "poverty_mapping" | "health_indicators" | "education" | "economic";
  platform: "power_bi";
  embedUrl?: string;
  lastUpdated: string;
}

export interface ZnadaMetadata {
  id: string;
  title: string;
  description: string;
  surveyName?: string;
  collectionPeriod: string;
  sampleSize?: number;
  geographicCoverage: string;
  keywords: string[];
  dataFormats: string[];
  accessLevel: "open" | "registered" | "restricted";
}

// ─── Geospatial & Environmental ───────────────────────────────────────────────

export interface ZansdiLayer {
  id: string;
  name: string;
  layerType: "vector" | "raster" | "wms" | "wfs";
  topic: "admin_boundaries" | "land_use" | "elevation" | "roads" | "buildings" | "utilities" | "cadastral" | "environmental" | "marine";
  format: "geojson" | "shapefile" | "geotiff" | "wms";
  geonodeUrl?: string;
  lastUpdated: string;
  spatialResolution?: string;
  notes: string;
}

export interface MarineCoastalDataset {
  id: string;
  name: string;
  type: "coral_reef" | "seagrass" | "mangrove" | "bathymetry" | "shoreline" | "sst" | "chlorophyll" | "wave_energy";
  provider: string;
  spatialResolution: string;
  temporalCoverage: string;
  format: string;
  notes: string;
}

export interface OsmExtract {
  id: string;
  name: string;
  layerType: "roads" | "buildings" | "waterways" | "landuse" | "pois" | "boundaries" | "all";
  extractDate: string;
  featureCount: number;
  downloadUrl?: string;
  notes: string;
}

export interface SatelliteCoverage {
  id: string;
  satellite: "sentinel_2" | "landsat_8" | "landsat_9" | "modis" | "viirs";
  product: string;
  resolution: string;
  revisitDays: number;
  cloudFilter: boolean;
  layers: string[];
  accessUrl: string;
  notes: string;
}

// ─── Public Procurement ───────────────────────────────────────────────────────

export interface EprozTender {
  id: string;
  title: string;
  description: string;
  procuringEntity: string;
  category: "works" | "goods" | "services" | "consulting";
  estimatedValueUsd?: number;
  publishDate: string;
  closingDate: string;
  status: "open" | "closed" | "awarded" | "cancelled";
  awardWinner?: string;
  awardAmountUsd?: number;
}

// ─── Unified Data Catalog ─────────────────────────────────────────────────────

export interface DataCatalogEntry {
  source: DataSourceMetadata;
  recordCount?: number;
  lastIngestion?: string;
  quality: {
    completeness: number; // 0-100
    accuracy: number;     // 0-100
    timeliness: number;   // 0-100
    overall: number;      // 0-100
  };
  tags: string[];
}
