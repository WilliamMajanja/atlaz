/**
 * Data Ingestion Service Stubs - ZanAtlas
 *
 * Comprehensive stubs for all Zanzibar open data sources.
 * Each service implements the DataConnector interface.
 * TODO comments detail exact API endpoints and integration approaches.
 *
 * Categories:
 *   1. Official Government Statistics (ZANSIS, TISP, ZNADA)
 *   2. Geospatial & Environmental (ZanSDI, Marine/Coastal, OSM/Overture, Satellite)
 *   3. Public Procurement (eProZ)
 *   4. Legacy stubs (COLA, Property, Flood Models)
 */

import { DataSourceMetadata } from "../../types/opendata";

// ─── Base Interface ───────────────────────────────────────────────────────────

export interface DataIngestionResult {
  success: boolean;
  recordsIngested: number;
  errors: string[];
  duration?: number;
}

export interface DataConnector {
  name: string;
  description: string;
  metadata: DataSourceMetadata;
  connect(): Promise<boolean>;
  fetch(): Promise<DataIngestionResult>;
  healthCheck(): Promise<boolean>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. OFFICIAL GOVERNMENT STATISTICS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── ZANSIS (Zanzibar Statistical Information System) ─────────────────────────
// Provider: Office of the Chief Government Statistician (OCGS) Zanzibar
// Platform: https://zansis.ocgs.go.tz
// API: Open API with documented endpoints for statistical categories
// Data: CPI, tourism arrivals, agricultural yield, climate, demographics
// Granularity: Island (Unguja/Pemba), Region, District, Shehia
// Format: JSON via REST API, CSV bulk download
export class ZansisConnector implements DataConnector {
  name = "ZANSIS";
  description = "Zanzibar Statistical Information System — centralised statistical database from OCGS";
  metadata: DataSourceMetadata = {
    id: "zansis",
    name: "Zanzibar Statistical Information System",
    shortName: "ZANSIS",
    category: "government_statistics",
    status: "stub",
    description: "Centralised open statistical database managed by OCGS Zanzibar. Tracks monthly/quarterly indicators for macroeconomic trends, CPI, agricultural yield, tourism numbers, and climate/meteorology metrics. Broken down by island, region, district, and Shehia level.",
    provider: "Office of the Chief Government Statistician (OCGS) Zanzibar",
    providerUrl: "https://zansis.ocgs.go.tz",
    apiType: "open_api",
    baseUrl: "https://zansis.ocgs.go.tz/api/v1",
    documentationUrl: "https://zansis.ocgs.go.tz/developer-guide",
    license: "Open Government Licence — Zanzibar",
    updateFrequency: "monthly",
    spatialResolution: "Shehia level",
    temporalCoverage: "2010-present",
    dataFormats: ["json", "csv", "xlsx"],
    coverageIslands: ["unguja", "pemba"],
    notes: "Includes Open API infrastructure with developer guide. Tracks: CPI by district, tourism arrival statistics, agricultural production by crop and district, rainfall and temperature data, population estimates. Key for demand modelling and economic trend analysis.",
  };

  async connect(): Promise<boolean> {
    // TODO: Authenticate with ZANSIS Open API
    // Endpoint: GET /api/v1/indicators
    // Auth: API key (register at developer portal)
    return false;
  }

  async fetch(): Promise<DataIngestionResult> {
    // TODO: Fetch indicators by category
    // GET /api/v1/indicators/tourism?island=unguja&period=2024-Q1
    // GET /api/v1/indicators/cpi?district=stone_town
    // GET /api/v1/indicators/agriculture?crop=clove&district=pemba_north
    return { success: false, recordsIngested: 0, errors: ["Not implemented"] };
  }

  async healthCheck(): Promise<boolean> {
    // TODO: GET /api/v1/health
    return false;
  }
}

// ─── TISP (Tanzania Integrated Statistical Portal) ───────────────────────────
// Provider: OCGS + National Bureau of Statistics (NBS)
// Platform: Power BI dashboards
// Data: 2022 Census, poverty mapping, health, education, economic indicators
// Access: Web portal, embeddable Power BI reports
// Note: Interactive visualisations, not raw API — requires scraping or manual export
export class TispConnector implements DataConnector {
  name = "TISP";
  description = "Tanzania Integrated Statistical Portal — shared dashboards on Power BI";
  metadata: DataSourceMetadata = {
    id: "tisp",
    name: "Tanzania Integrated Statistical Portal",
    shortName: "TISP",
    category: "government_statistics",
    status: "stub",
    description: "Interactive Power BI dashboards co-maintained by OCGS and NBS. Covers 2022 Population and Housing Census, multidimensional poverty mapping, healthcare indicators (malaria, maternal health), and education data for Zanzibar.",
    provider: "OCGS + National Bureau of Statistics (NBS) Tanzania",
    providerUrl: "https://tisp.nbs.go.tz",
    apiType: "power_bi",
    documentationUrl: "https://tisp.nbs.go.tz/documentation",
    license: "Open Government Licence — Tanzania",
    updateFrequency: "quarterly",
    dataFormats: ["power_bi_embed", "csv_export"],
    coverageIslands: ["unguja", "pemba"],
    notes: "Power BI platform — data extraction requires either Power BI API access or manual CSV export. Key datasets: 2022 Census profiles, Multidimensional Poverty Index, health facility indicators, school enrollment data.",
  };

  async connect(): Promise<boolean> {
    // TODO: Access Power BI embed tokens or scrape dashboard data
    // Power BI REST API: GET /reports/{reportId}/generateToken
    return false;
  }

  async fetch(): Promise<DataIngestionResult> {
    // TODO: Export dashboard data via Power BI API or manual CSV
    // Focus: Census 2022 district-level profiles, poverty headcount ratios
    return { success: false, recordsIngested: 0, errors: ["Not implemented"] };
  }

  async healthCheck(): Promise<boolean> {
    return false;
  }
}

// ─── ZNADA (Zanzibar National Data Archive) ──────────────────────────────────
// Provider: OCGS Zanzibar
// Platform: Data catalog and microdata repository
// Data: Survey metadata, sampling frameworks, microdata for academic analysis
// Access: Open catalog, restricted microdata (registration required)
export class ZnadaConnector implements DataConnector {
  name = "ZNADA";
  description = "Zanzibar National Data Archive — survey metadata and microdata catalog";
  metadata: DataSourceMetadata = {
    id: "znada",
    name: "Zanzibar National Data Archive",
    shortName: "ZNADA",
    category: "government_statistics",
    status: "stub",
    description: "Open access to survey metadata, national sampling frameworks, and microdata catalogs for academic and technical analysis. Includes DHS, MICS, and national socioeconomic surveys.",
    provider: "OCGS Zanzibar",
    providerUrl: "https://znada.ocgs.go.tz",
    apiType: "bulk_download",
    documentationUrl: "https://znada.ocgs.go.tz/guides",
    license: "Open Government Licence — Zanzibar (microdata may require registration)",
    updateFrequency: "adhoc",
    dataFormats: ["csv", "stata", "spss", "pdf"],
    coverageIslands: ["unguja", "pemba"],
    notes: "Catalog includes: DHS surveys, MICS surveys, agricultural census, household budget surveys, labour force surveys. Microdata access may require institutional registration. Metadata is fully open.",
  };

  async connect(): Promise<boolean> {
    // TODO: Access ZNADA catalog API or scrape metadata
    return false;
  }

  async fetch(): Promise<DataIngestionResult> {
    // TODO: Download survey metadata and catalog entries
    // Focus: Household Budget Survey, Labour Force Survey, Agricultural Census
    return { success: false, recordsIngested: 0, errors: ["Not implemented"] };
  }

  async healthCheck(): Promise<boolean> {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. GEOSPATIAL & ENVIRONMENTAL
// ═══════════════════════════════════════════════════════════════════════════════

// ─── ZanSDI (Zanzibar Spatial Data Infrastructure) ────────────────────────────
// Provider: President's Office for Finance and Planning (World Bank BIG-Z support)
// Platform: GeoNode instance with GeoServer + PostGIS backend
// Data: Administrative boundaries, land use, elevation, roads, buildings, utilities, cadastral
// Access: GeoNode API (OGC WMS/WFS/WCS), direct GeoJSON export
// Note: Open-source infrastructure — high quality vector layers
export class ZanSdiConnector implements DataConnector {
  name = "ZanSDI";
  description = "Zanzibar Spatial Data Infrastructure — GeoNode hub for inter-agency GIS layers";
  metadata: DataSourceMetadata = {
    id: "zansdi",
    name: "Zanzibar Spatial Data Infrastructure",
    shortName: "ZanSDI",
    category: "geospatial",
    status: "stub",
    description: "Consolidated geospatial layers built on GeoNode/GeoServer/PostGIS under the President's Office for Finance and Planning. Supported by World Bank BIG-Z programme. Central hub for inter-agency geographic information sharing.",
    provider: "President's Office — Finance and Planning, Zanzibar",
    providerUrl: "https://zansdi.gov.zt",
    apiType: "geonode",
    baseUrl: "https://zansdi.gov.zt/geoserver",
    documentationUrl: "https://zansdi.gov.zt/api-docs",
    license: "Open Government Licence — Zanzibar",
    updateFrequency: "quarterly",
    spatialResolution: "1:5000 to 1:50000",
    dataFormats: ["geojson", "shapefile", "geotiff", "wms", "wfs"],
    coverageIslands: ["unguja", "pemba"],
    notes: "Key layers: administrative boundaries (region/district/shehia), land use/land cover, digital elevation model (DEM), road network, building footprints, utility infrastructure, cadastral parcels (partial). GeoNode API allows direct GeoJSON/WFS queries.",
  };

  async connect(): Promise<boolean> {
    // TODO: Connect to GeoNode instance
    // GeoNode REST API: GET /api/v2/layers/?workspace=zanzibar
    // GeoServer WFS: GET /geoserver/zanzibar/wfs?service=wfs&request=GetCapabilities
    return false;
  }

  async fetch(): Promise<DataIngestionResult> {
    // TODO: Fetch layers via GeoNode API
    // WFS endpoint for vector layers: /geoserver/zanzibar/wfs
    // WCS endpoint for raster layers: /geoserver/zanzibar/wcs
    // Focus: admin boundaries, land use, DEM, roads, buildings
    return { success: false, recordsIngested: 0, errors: ["Not implemented"] };
  }

  async healthCheck(): Promise<boolean> {
    // TODO: GET /geoserver/wms?service=wms&request=GetCapabilities
    return false;
  }
}

// ─── Marine & Coastal Spatial Data ────────────────────────────────────────────
// Provider: Finnish Environment Institute (SYKE) + local partners (ZAN-SDI project)
// Data: Coral reef maps, seagrass distribution, mangrove boundaries, bathymetry
// Access: GeoNode endpoints, direct download
// Note: Historical partnership data, some layers may be dated but still reference-grade
export class MarineCoastalConnector implements DataConnector {
  name = "MarineCoastal";
  description = "Marine and coastal spatial data — coral reefs, seagrass, mangroves, bathymetry";
  metadata: DataSourceMetadata = {
    id: "marine_coastal",
    name: "Marine & Coastal Spatial Portals",
    shortName: "MarineCoastal",
    category: "marine_coastal",
    status: "stub",
    description: "Nearshore marine environment datasets from ZAN-SDI project partnerships with Finnish Environment Institute (SYKE). Includes coral reef layouts, seagrass distribution, mangrove forest boundaries, bathymetric profiles, and shoreline change analysis.",
    provider: "Finnish Environment Institute (SYKE) + Zanzibar Marine Authority",
    providerUrl: "https://syke.fi",
    apiType: "ogc_wfs",
    baseUrl: "https://zansdi.gov.zt/geoserver/marine",
    license: "Open Access (research partnership)",
    updateFrequency: "adhoc",
    spatialResolution: "10m-100m",
    temporalCoverage: "2005-present (episodic surveys)",
    dataFormats: ["geojson", "shapefile", "geotiff"],
    coverageIslands: ["unguja", "pemba"],
    notes: "Critical for coastal development risk assessment. Coral reef and mangrove data essential for environmental impact assessments. Seagrass distribution relevant for marine protected area compliance. Some datasets from 2005-2015 surveys but remain best available reference.",
  };

  async connect(): Promise<boolean> {
    // TODO: Connect to marine GeoServer workspace
    // WFS: GET /geoserver/marine/wfs?service=wfs&request=GetCapabilities
    return false;
  }

  async fetch(): Promise<DataIngestionResult> {
    // TODO: Fetch marine layers
    // Focus: coral_reef, seagrass, mangrove, bathymetry
    return { success: false, recordsIngested: 0, errors: ["Not implemented"] };
  }

  async healthCheck(): Promise<boolean> {
    return false;
  }
}

// ─── OpenStreetMap & Overture Maps ────────────────────────────────────────────
// Provider: OpenStreetMap contributors + Overture Maps Foundation
// Data: Complete road network, building footprints, waterways, POIs
// Access: OSM API, bulk extracts (Geofabrik), Overpass API, Overture API
// Note: Zanzibar has very active OSM community — high data quality
export class OpenStreetMapIngestionService implements DataConnector {
  name = "OpenStreetMap";
  description = "OSM buildings, roads, waterways, and POIs for Zanzibar";
  metadata: DataSourceMetadata = {
    id: "osm",
    name: "OpenStreetMap & Overture Maps",
    shortName: "OSM",
    category: "open_street_map",
    status: "stub",
    description: "Complete vector layers for Zanzibar from OpenStreetMap: road network (primary/secondary/tertiary), building footprints, waterways, landuse, and local points of interest. Overture Maps provides additional AI-verified building and road data.",
    provider: "OpenStreetMap Contributors + Overture Maps Foundation",
    providerUrl: "https://www.openstreetmap.org",
    apiType: "rest",
    baseUrl: "https://overpass-api.de/api",
    documentationUrl: "https://wiki.openstreetmap.org/wiki/Overpass_API",
    license: "ODbL (Open Database Licence)",
    updateFrequency: "daily",
    spatialResolution: "1m-10m",
    dataFormats: ["osm", "geojson", "shapefile", "pbf"],
    coverageIslands: ["unguja", "pemba"],
    notes: "Zanzibar has exceptionally active OSM community. Building footprints nearly complete for Stone Town. Road network comprehensively mapped. Overpass API for real-time queries. Geofabrik extracts for bulk download. Overture Maps provides complementary AI-verified building footprints and road centerlines.",
  };

  async connect(): Promise<boolean> {
    // TODO: Connect to Overpass API
    // Overpass endpoint: https://overpass-api.de/api/interpreter
    // Query format: [out:json];area["name"="Zanzibar"]->.searchArea;(...)
    return false;
  }

  async fetch(): Promise<DataIngestionResult> {
    // TODO: Fetch OSM data via Overpass API
    // Buildings: area["name"="Zanzibar"];way["building"](area);
    // Roads: area["name"="Zanzibar"];way["highway"](area);
    // POIs: area["name"="Zanzibar"];node["tourism"](area);
    // Also: Geofabrik bulk extract for full dataset
    return { success: false, recordsIngested: 0, errors: ["Not implemented"] };
  }

  async healthCheck(): Promise<boolean> {
    // TODO: GET https://overpass-api.de/api/status
    return false;
  }
}

// ─── Satellite & Remote Sensing ───────────────────────────────────────────────
// Providers: ESA Sentinel-2, NASA Landsat/MODIS, Copernicus
// Data: Multispectral imagery, land cover, SST, NDVI, shoreline change
// Access: Copernicus Open Access Hub, NASA Earthdata, Google Earth Engine
// Note: Standard global open platforms — zero cost for Zanzibar coverage
export class SatelliteImageryConnector implements DataConnector {
  name = "SatelliteImagery";
  description = "Sentinel-2, Landsat, MODIS — land cover, SST, NDVI, shoreline monitoring";
  metadata: DataSourceMetadata = {
    id: "satellite",
    name: "Global Environmental Remote Sensing",
    shortName: "Satellite",
    category: "satellite_remote_sensing",
    status: "stub",
    description: "Standard global open platforms providing cloud-filtered multispectral data for Zanzibar. ESA Sentinel-2 (10m, 5-day revisit), NASA Landsat 8/9 (30m, 16-day), MODIS (250m-1km, daily). Used locally to track land cover change, sea surface temperature anomalies, shoreline erosion, vegetation health (NDVI), and urban expansion.",
    provider: "European Space Agency (ESA) + NASA + Copernicus",
    providerUrl: "https://scihub.copernicus.eu",
    apiType: "rest",
    baseUrl: "https://scihub.copernicus.eu/api/v1",
    documentationUrl: "https://sentinels.copernicus.eu/web/sentinel/user-guides",
    license: "Open Access (Copernicus), Public Domain (NASA)",
    updateFrequency: "daily",
    spatialResolution: "10m (S2) / 30m (Landsat) / 250m (MODIS)",
    temporalCoverage: "2015-present (Sentinel-2), 1984-present (Landsat)",
    dataFormats: ["geotiff", "jpeg2000", "netcdf"],
    coverageIslands: ["unguja", "pemba"],
    notes: "Sentinel-2 provides best resolution (10m) with 5-day revisit. Cloud cover is significant — requires cloud masking. Key indices: NDVI (vegetation), NDWI (water), NDBI (built-up), SST (sea surface temperature). Google Earth Engine provides pre-processed composites. Essential for land cover change detection and coastal erosion monitoring.",
  };

  async connect(): Promise<boolean> {
    // TODO: Connect to Copernicus Open Access Hub
    // API: GET https://scihub.copernicus.eu/api/v1/search?q=area:Zanzibar&productType=S2MSI2A
    // Also: NASA Earthdata for Landsat/MODIS
    return false;
  }

  async fetch(): Promise<DataIngestionResult> {
    // TODO: Fetch satellite scenes
    // Sentinel-2: L2A (atmospherically corrected) preferred
    // Focus: cloud-free composites, NDVI layers, shoreline change
    // Use Google Earth Engine for pre-processed time series
    return { success: false, recordsIngested: 0, errors: ["Not implemented"] };
  }

  async healthCheck(): Promise<boolean> {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. PUBLIC PROCUREMENT
// ═══════════════════════════════════════════════════════════════════════════════

// ─── eProZ (Zanzibar Electronic Public Procurement) ──────────────────────────
// Provider: Zanzibar Public Procurement and Disposal of Public Assets Authority (ZPPRA)
// Platform: e-procurement web portal
// Data: Tender notices, award disclosures, vendor registrations
// Access: Web portal (may require scraping), potential API under reform
// Note: Undergoing legal/operational reforms — data quality may be inconsistent
export class EprozConnector implements DataConnector {
  name = "eProZ";
  description = "Zanzibar Electronic Public Procurement — tender notices and award data";
  metadata: DataSourceMetadata = {
    id: "eproz",
    name: "Zanzibar Electronic Public Procurement Web",
    shortName: "eProZ",
    category: "public_procurement",
    status: "stub",
    description: "Public procurement platform governed by ZPPRA. Publishes open procurement notices, award disclosures, and institutional vendor data. Undergoing active legal and operational reforms to increase public financial transparency.",
    provider: "Zanzibar Public Procurement and Disposal of Public Assets Authority (ZPPRA)",
    providerUrl: "https://eproz.go.zt",
    apiType: "none",
    documentationUrl: "https://eproz.go.zt/help",
    license: "Open Government Licence — Zanzibar",
    updateFrequency: "daily",
    dataFormats: ["html", "pdf", "csv"],
    coverageIslands: ["unguja", "pemba"],
    notes: "Value for land intelligence: infrastructure project tenders reveal government development priorities, road/construction contracts signal planned improvements, utility procurement indicates service expansion. Data extraction may require web scraping. Legal reforms underway — may get proper API in future.",
  };

  async connect(): Promise<boolean> {
    // TODO: Connect to eProZ portal
    // May require web scraping: https://eproz.go.zt/tenders
    // Monitor for API availability under procurement reform
    return false;
  }

  async fetch(): Promise<DataIngestionResult> {
    // TODO: Scrape or query tender notices
    // Focus: infrastructure tenders (roads, water, electricity), construction permits
    // Parse: tender title, procuring entity, estimated value, status, award winner
    return { success: false, recordsIngested: 0, errors: ["Not implemented"] };
  }

  async healthCheck(): Promise<boolean> {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. LEGACY / EXISTING STUBS (preserved from original scaffold)
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Commissioner of Lands Authority ──────────────────────────────────────────
export class COLADataConnector implements DataConnector {
  name = "COLA";
  description = "Commissioner of Lands Authority — land registry and title data";
  metadata: DataSourceMetadata = {
    id: "cola",
    name: "Commissioner of Lands Authority",
    shortName: "COLA",
    category: "land_registry",
    status: "restricted",
    description: "Zanzibar land registry data including titles, ownership records, encumbrances, and cadastral information.",
    provider: "Commissioner of Lands Authority, Zanzibar",
    providerUrl: "",
    apiType: "none",
    license: "Restricted — government internal",
    updateFrequency: "adhoc",
    dataFormats: ["pdf", "paper"],
    coverageIslands: ["unguja", "pemba"],
    notes: "Land registry is largely paper-based. Digital conversion underway. Critical for title verification and legal due diligence. Access requires formal government channels.",
  };

  async connect(): Promise<boolean> {
    return false;
  }

  async fetch(): Promise<DataIngestionResult> {
    return { success: false, recordsIngested: 0, errors: ["Not implemented"] };
  }

  async healthCheck(): Promise<boolean> {
    return false;
  }
}

// ─── Property Listings ────────────────────────────────────────────────────────
export class PropertyListingsIngestionService implements DataConnector {
  name = "PropertyListings";
  description = "Property listings from Zanzibar real estate portals";
  metadata: DataSourceMetadata = {
    id: "listings",
    name: "Property Listings Aggregator",
    shortName: "Listings",
    category: "property_listings",
    status: "stub",
    description: "Aggregated property listings from Zanzibar real estate portals including land plots, commercial properties, and residential listings.",
    provider: "Various Zanzibar real estate portals",
    providerUrl: "",
    apiType: "rest",
    license: "Varies by portal",
    updateFrequency: "daily",
    dataFormats: ["json", "html"],
    coverageIslands: ["unguja", "pemba"],
    notes: "Scrape from: PrivateProperty Tanzania, Zoola, Jumia House, local agent websites. Key fields: price, area, location, property type, listing status.",
  };

  async connect(): Promise<boolean> {
    return false;
  }

  async fetch(): Promise<DataIngestionResult> {
    return { success: false, recordsIngested: 0, errors: ["Not implemented"] };
  }

  async healthCheck(): Promise<boolean> {
    return false;
  }
}

// ─── Flood Models ─────────────────────────────────────────────────────────────
export class FloodModelConnector implements DataConnector {
  name = "FloodModel";
  description = "Flood risk model data from UNOSAT, Dartmouth, and local models";
  metadata: DataSourceMetadata = {
    id: "flood_models",
    name: "Flood Risk Models",
    shortName: "FloodModels",
    category: "flood_models",
    status: "stub",
    description: "Flood risk modelling data from UNOSAT, Dartmouth Flood Observatory, and locally developed flood models for Zanzibar coastal areas.",
    provider: "UNOSAT + Dartmouth Flood Observatory + Local models",
    providerUrl: "https://unosat.cern.ch",
    apiType: "bulk_download",
    license: "Open Access",
    updateFrequency: "adhoc",
    spatialResolution: "30m-250m",
    dataFormats: ["geotiff", "shapefile", "netcdf"],
    coverageIslands: ["unguja", "pemba"],
    notes: "UNOSAT provides activation maps during flood events. Dartmouth has global flood extent data. Local models needed for storm surge and sea-level rise scenarios. Critical for development risk assessment.",
  };

  async connect(): Promise<boolean> {
    return false;
  }

  async fetch(): Promise<DataIngestionResult> {
    return { success: false, recordsIngested: 0, errors: ["Not implemented"] };
  }

  async healthCheck(): Promise<boolean> {
    return false;
  }
}

// ─── OpenAerialMap (preserved) ────────────────────────────────────────────────
export class OpenAerialMapIngestionService implements DataConnector {
  name = "OpenAerialMap";
  description = "Aerial and satellite imagery metadata from OpenAerialMap";
  metadata: DataSourceMetadata = {
    id: "openaerialmap",
    name: "OpenAerialMap",
    shortName: "OAM",
    category: "satellite_remote_sensing",
    status: "stub",
    description: "Crowdsourced aerial imagery repository. Metadata and access links for drone-captured and aerial survey imagery over Zanzibar.",
    provider: "OpenAerialMap / Humanitarian OpenStreetMap Team",
    providerUrl: "https://openaerialmap.org",
    apiType: "rest",
    baseUrl: "https://api.openaerialmap.org/v1",
    license: "Open (individual licenses vary)",
    updateFrequency: "adhoc",
    dataFormats: ["geotiff", "jpeg", "png"],
    coverageIslands: ["unguja", "pemba"],
    notes: "May contain high-resolution drone imagery from humanitarian or development projects. Useful for building-level analysis in areas with coverage.",
  };

  async connect(): Promise<boolean> {
    return false;
  }

  async fetch(): Promise<DataIngestionResult> {
    return { success: false, recordsIngested: 0, errors: ["Not implemented"] };
  }

  async healthCheck(): Promise<boolean> {
    return false;
  }
}

// ─── Master Registry ──────────────────────────────────────────────────────────

export const allConnectors: DataConnector[] = [
  new ZansisConnector(),
  new TispConnector(),
  new ZnadaConnector(),
  new ZanSdiConnector(),
  new MarineCoastalConnector(),
  new OpenStreetMapIngestionService(),
  new SatelliteImageryConnector(),
  new EprozConnector(),
  new COLADataConnector(),
  new PropertyListingsIngestionService(),
  new FloodModelConnector(),
  new OpenAerialMapIngestionService(),
];

export function getConnectorByName(name: string): DataConnector | undefined {
  return allConnectors.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
}

export function getConnectorsByCategory(category: DataSourceMetadata["category"]): DataConnector[] {
  return allConnectors.filter((c) => c.metadata.category === category);
}
