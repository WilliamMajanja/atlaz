/**
 * Zanzibar Open Data Catalog — Seed Data
 *
 * Comprehensive metadata for all known Zanzibar open data sources.
 * Used by the admin dashboard and data quality scoring.
 */

import { DataSourceMetadata, DataCatalogEntry, ZansisIndicator, TispDashboard, ZnadaMetadata, ZansdiLayer, MarineCoastalDataset, OsmExtract, SatelliteCoverage } from "../../types/opendata";

// ─── Master Data Source Registry ──────────────────────────────────────────────

export const zanzibarDataSources: DataSourceMetadata[] = [
  // ── Government Statistics ───────────────────────────────────────────────────
  {
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
    notes: "Includes Open API infrastructure with developer guide. Key indicators: CPI by district, tourism arrivals by nationality, clove production, rainfall anomalies, population estimates. Essential for economic demand modelling.",
  },
  {
    id: "tisp",
    name: "Tanzania Integrated Statistical Portal",
    shortName: "TISP",
    category: "government_statistics",
    status: "stub",
    description: "Interactive Power BI dashboards co-maintained by OCGS and NBS. Covers 2022 Population and Housing Census, multidimensional poverty mapping, healthcare indicators, and education data.",
    provider: "OCGS + National Bureau of Statistics (NBS) Tanzania",
    providerUrl: "https://tisp.nbs.go.tz",
    apiType: "power_bi",
    license: "Open Government Licence — Tanzania",
    updateFrequency: "quarterly",
    dataFormats: ["power_bi_embed", "csv_export"],
    coverageIslands: ["unguja", "pemba"],
    notes: "Power BI platform — requires manual CSV export or Power BI API. Key: 2022 Census profiles, poverty headcount by district, school enrollment, health facility density.",
  },
  {
    id: "znada",
    name: "Zanzibar National Data Archive",
    shortName: "ZNADA",
    category: "government_statistics",
    status: "stub",
    description: "Open access to survey metadata, national sampling frameworks, and microdata catalogs for academic and technical analysis.",
    provider: "OCGS Zanzibar",
    providerUrl: "https://znada.ocgs.go.tz",
    apiType: "bulk_download",
    license: "Open Government Licence — Zanzibar (microdata may require registration)",
    updateFrequency: "adhoc",
    dataFormats: ["csv", "stata", "spss", "pdf"],
    coverageIslands: ["unguja", "pemba"],
    notes: "Catalog includes DHS, MICS, agricultural census, household budget surveys, labour force surveys. Metadata is fully open; microdata requires institutional registration.",
  },

  // ── Geospatial & Environmental ──────────────────────────────────────────────
  {
    id: "zansdi",
    name: "Zanzibar Spatial Data Infrastructure",
    shortName: "ZanSDI",
    category: "geospatial",
    status: "stub",
    description: "Consolidated geospatial layers on GeoNode/GeoServer/PostGIS. President's Office for Finance and Planning, supported by World Bank BIG-Z programme.",
    provider: "President's Office — Finance and Planning, Zanzibar",
    providerUrl: "https://zansdi.gov.zt",
    apiType: "geonode",
    baseUrl: "https://zansdi.gov.zt/geoserver",
    license: "Open Government Licence — Zanzibar",
    updateFrequency: "quarterly",
    spatialResolution: "1:5000 to 1:50000",
    dataFormats: ["geojson", "shapefile", "geotiff", "wms", "wfs"],
    coverageIslands: ["unguja", "pemba"],
    notes: "Key layers: admin boundaries (region/district/shehia), land use/land cover, DEM, road network, building footprints, utilities, cadastral parcels (partial). GeoNode API for direct WFS queries.",
  },
  {
    id: "marine_coastal",
    name: "Marine & Coastal Spatial Portals",
    shortName: "MarineCoastal",
    category: "marine_coastal",
    status: "stub",
    description: "Nearshore marine environment datasets from ZAN-SDI project with Finnish Environment Institute (SYKE). Coral reefs, seagrass, mangroves, bathymetry.",
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
    notes: "Critical for EIA and coastal development risk. Coral reef and mangrove data mandatory for environmental compliance. Seagrass maps for marine protected area boundaries.",
  },
  {
    id: "osm",
    name: "OpenStreetMap & Overture Maps",
    shortName: "OSM",
    category: "open_street_map",
    status: "stub",
    description: "Complete vector layers: road network, building footprints, waterways, landuse, POIs. Very active OSM community in Zanzibar.",
    provider: "OpenStreetMap Contributors + Overture Maps Foundation",
    providerUrl: "https://www.openstreetmap.org",
    apiType: "rest",
    baseUrl: "https://overpass-api.de/api",
    license: "ODbL",
    updateFrequency: "daily",
    spatialResolution: "1m-10m",
    dataFormats: ["osm", "geojson", "shapefile", "pbf"],
    coverageIslands: ["unguja", "pemba"],
    notes: "Zanzibar has exceptionally active OSM community. Stone Town building footprints nearly complete. Geofabrik bulk extracts available. Overture Maps adds AI-verified buildings and roads.",
  },
  {
    id: "satellite",
    name: "Global Environmental Remote Sensing",
    shortName: "Satellite",
    category: "satellite_remote_sensing",
    status: "stub",
    description: "Sentinel-2 (10m), Landsat 8/9 (30m), MODIS (250m). Land cover, SST, NDVI, shoreline change monitoring.",
    provider: "ESA + NASA + Copernicus",
    providerUrl: "https://scihub.copernicus.eu",
    apiType: "rest",
    baseUrl: "https://scihub.copernicus.eu/api/v1",
    license: "Open Access (Copernicus) / Public Domain (NASA)",
    updateFrequency: "daily",
    spatialResolution: "10m (S2) / 30m (Landsat) / 250m (MODIS)",
    temporalCoverage: "2015-present (S2), 1984-present (Landsat)",
    dataFormats: ["geotiff", "jpeg2000", "netcdf"],
    coverageIslands: ["unguja", "pemba"],
    notes: "Sentinel-2 best for 10m resolution with 5-day revisit. Cloud masking required. Key indices: NDVI, NDWI, NDBI, SST. Google Earth Engine for pre-processed composites.",
  },
  {
    id: "openaerialmap",
    name: "OpenAerialMap",
    shortName: "OAM",
    category: "satellite_remote_sensing",
    status: "stub",
    description: "Crowdsourced aerial imagery metadata from drone surveys and aerial campaigns.",
    provider: "OpenAerialMap / Humanitarian OSM Team",
    providerUrl: "https://openaerialmap.org",
    apiType: "rest",
    baseUrl: "https://api.openaerialmap.org/v1",
    license: "Open (individual licenses vary)",
    updateFrequency: "adhoc",
    dataFormats: ["geotiff", "jpeg", "png"],
    coverageIslands: ["unguja", "pemba"],
    notes: "May contain high-resolution drone imagery from humanitarian/development projects. Check for coverage before relying on this source.",
  },

  // ── Public Procurement ──────────────────────────────────────────────────────
  {
    id: "eproz",
    name: "Zanzibar Electronic Public Procurement Web",
    shortName: "eProZ",
    category: "public_procurement",
    status: "stub",
    description: "Tender notices, award disclosures, vendor data from ZPPRA. Undergoing legal/operational reforms.",
    provider: "Zanzibar Public Procurement and Disposal of Public Assets Authority (ZPPRA)",
    providerUrl: "https://eproz.go.zt",
    apiType: "none",
    license: "Open Government Licence — Zanzibar",
    updateFrequency: "daily",
    dataFormats: ["html", "pdf", "csv"],
    coverageIslands: ["unguja", "pemba"],
    notes: "Infrastructure tenders reveal government development priorities. Road/construction contracts signal planned improvements. May require web scraping — proper API expected under procurement reform.",
  },

  // ── Land Registry (restricted) ──────────────────────────────────────────────
  {
    id: "cola",
    name: "Commissioner of Lands Authority",
    shortName: "COLA",
    category: "land_registry",
    status: "restricted",
    description: "Land registry: titles, ownership records, encumbrances, cadastral information.",
    provider: "Commissioner of Lands Authority, Zanzibar",
    providerUrl: "",
    apiType: "none",
    license: "Restricted — government internal",
    updateFrequency: "adhoc",
    dataFormats: ["pdf", "paper"],
    coverageIslands: ["unguja", "pemba"],
    notes: "Largely paper-based. Digital conversion underway. Access requires formal government channels. Critical for legal due diligence.",
  },
  {
    id: "flood_models",
    name: "Flood Risk Models",
    shortName: "FloodModels",
    category: "flood_models",
    status: "stub",
    description: "UNOSAT, Dartmouth Flood Observatory, and local flood risk models for Zanzibar.",
    provider: "UNOSAT + Dartmouth Flood Observatory + Local models",
    providerUrl: "https://unosat.cern.ch",
    apiType: "bulk_download",
    license: "Open Access",
    updateFrequency: "adhoc",
    spatialResolution: "30m-250m",
    dataFormats: ["geotiff", "shapefile", "netcdf"],
    coverageIslands: ["unguja", "pemba"],
    notes: "UNOSAT activation maps during flood events. Dartmouth global flood extent. Local models needed for storm surge and SLR scenarios.",
  },
];

// ─── Sample ZANSIS Indicators (seed data) ─────────────────────────────────────

export const sampleZansisIndicators: ZansisIndicator[] = [
  { id: "zansis-tourism-arrivals-2024", name: "Tourist Arrivals", category: "tourism", value: 537000, unit: "persons", period: "2024-annual", island: "both", source: "zansis", lastUpdated: "2025-01-15" },
  { id: "zansis-cpi-stonetown-2024q4", name: "Consumer Price Index", category: "cpi", value: 112.3, unit: "index_2015=100", period: "2024-Q4", island: "unguja", district: "Mjini Magharibi", source: "zansis", lastUpdated: "2025-01-10" },
  { id: "zansis-clove-production-2024", name: "Clove Production", category: "agriculture", value: 4200, unit: "tonnes", period: "2024-annual", island: "pemba", source: "zansis", lastUpdated: "2025-02-01" },
  { id: "zansis-rainfall-stonetown-2024", name: "Annual Rainfall", category: "climate", value: 1420, unit: "mm", period: "2024-annual", island: "unguja", district: "Mjini Magharibi", source: "zansis", lastUpdated: "2025-01-20" },
  { id: "zansis-population-unguja", name: "Population Estimate", category: "demographics", value: 897000, unit: "persons", period: "2024-estimate", island: "unguja", source: "zansis", lastUpdated: "2024-12-01" },
  { id: "zansis-population-pemba", name: "Population Estimate", category: "demographics", value: 407000, unit: "persons", period: "2024-estimate", island: "pemba", source: "zansis", lastUpdated: "2024-12-01" },
  { id: "zansis-gdp-growth", name: "GDP Growth Rate", category: "macroeconomic", value: 6.2, unit: "percent", period: "2024-annual", island: "both", source: "zansis", lastUpdated: "2025-03-01" },
  { id: "zansis-hotel-occupancy", name: "Hotel Occupancy Rate", category: "tourism", value: 68, unit: "percent", period: "2024-Q4", island: "unguja", source: "zansis", lastUpdated: "2025-01-15" },
];

// ─── Sample TISP Dashboards ───────────────────────────────────────────────────

export const sampleTispDashboards: TispDashboard[] = [
  { id: "tisp-census-2022", name: "2022 Population & Housing Census", description: "District-level census profiles for Zanzibar including population density, household size, literacy, and employment.", category: "census_2022", platform: "power_bi", lastUpdated: "2023-06-01" },
  { id: "tisp-poverty", name: "Multidimensional Poverty Index", description: "Poverty headcount and deprivation scores by district and shehia. Covers health, education, and living standards.", category: "poverty_mapping", platform: "power_bi", lastUpdated: "2024-02-01" },
  { id: "tisp-health", name: "Health Indicators Dashboard", description: "Malaria intervention coverage, maternal health metrics, facility delivery rates by district.", category: "health_indicators", platform: "power_bi", lastUpdated: "2024-06-01" },
  { id: "tisp-education", name: "Education Statistics", description: "School enrollment, completion rates, and teacher-pupil ratios by district and gender.", category: "education", platform: "power_bi", lastUpdated: "2024-03-01" },
];

// ─── Sample ZNADA Metadata ────────────────────────────────────────────────────

export const sampleZnadaSurveys: ZnadaMetadata[] = [
  { id: "znada-hbs-2022", title: "Household Budget Survey 2022", description: "National household expenditure patterns, income distribution, and consumption by category.", surveyName: "Household Budget Survey", collectionPeriod: "2022-01 to 2022-12", sampleSize: 12000, geographicCoverage: "All districts of Unguja and Pemba", keywords: ["expenditure", "income", "consumption", "poverty"], dataFormats: ["csv", "stata", "pdf"], accessLevel: "registered" },
  { id: "znada-lfs-2023", title: "Labour Force Survey 2023", description: "Employment, unemployment, underemployment, and informal sector participation rates.", surveyName: "Labour Force Survey", collectionPeriod: "2023-06 to 2023-09", sampleSize: 8500, geographicCoverage: "All districts", keywords: ["employment", "unemployment", "labour", "informal"], dataFormats: ["csv", "stata", "pdf"], accessLevel: "registered" },
  { id: "znada-agricultural-census-2019", title: "Agricultural Census 2019", description: "Farm holdings, crop production, livestock, and agricultural inputs by district.", surveyName: "Agricultural Census", collectionPeriod: "2019-06 to 2019-12", sampleSize: 45000, geographicCoverage: "All districts", keywords: ["agriculture", "crops", "livestock", "farming"], dataFormats: ["csv", "stata", "pdf"], accessLevel: "open" },
];

// ─── Sample ZanSDI Layers ─────────────────────────────────────────────────────

export const sampleZansdiLayers: ZansdiLayer[] = [
  { id: "zansdi-admin-boundaries", name: "Administrative Boundaries", layerType: "vector", topic: "admin_boundaries", format: "geojson", lastUpdated: "2024-01-01", notes: "Region, district, and shehia boundaries. Authoritative source for administrative divisions." },
  { id: "zansdi-land-use", name: "Land Use / Land Cover", layerType: "vector", topic: "land_use", format: "shapefile", lastUpdated: "2023-06-01", spatialResolution: "25m", notes: "Land cover classification: built-up, agriculture, forest, mangrove, water, bare land." },
  { id: "zansdi-dem", name: "Digital Elevation Model", layerType: "raster", topic: "elevation", format: "geotiff", lastUpdated: "2022-01-01", spatialResolution: "12.5m (ALOS PALSAR)", notes: "Terrain elevation data critical for flood risk and slope analysis." },
  { id: "zansdi-roads", name: "Road Network", layerType: "vector", topic: "roads", format: "geojson", lastUpdated: "2024-06-01", notes: "Classified road network: primary, secondary, tertiary, tracks. Sourced from OSM with local verification." },
  { id: "zansdi-buildings", name: "Building Footprints", layerType: "vector", topic: "buildings", format: "geojson", lastUpdated: "2024-03-01", notes: "Building outlines derived from satellite imagery and OSM. Near-complete for urban areas." },
  { id: "zansdi-cadastral", name: "Cadastral Parcels (Partial)", layerType: "vector", topic: "cadastral", format: "shapefile", lastUpdated: "2023-01-01", notes: "Parcel boundaries where available. Limited coverage — primarily Stone Town and planned developments." },
  { id: "zansdi-utilities", name: "Utility Infrastructure", layerType: "vector", topic: "utilities", format: "geojson", lastUpdated: "2024-01-01", notes: "Water supply lines, electricity grid, sewage networks. Coverage varies by area." },
];

// ─── Sample Marine & Coastal Datasets ─────────────────────────────────────────

export const sampleMarineDatasets: MarineCoastalDataset[] = [
  { id: "marine-coral-reef", name: "Coral Reef Distribution", type: "coral_reef", provider: "SYKE + Zanzibar Marine Authority", spatialResolution: "10m", temporalCoverage: "2008-2015 surveys", format: "shapefile", notes: "Mapped coral reef extent and condition. Critical for EIA nearshore developments." },
  { id: "marine-seagrass", name: "Seagrass Meadow Distribution", type: "seagrass", provider: "SYKE", spatialResolution: "25m", temporalCoverage: "2010-2014 surveys", format: "shapefile", notes: "Seagrass bed locations and extent. Relevant for marine protected area compliance." },
  { id: "marine-mangrove", name: "Mangrove Forest Boundaries", type: "mangrove", provider: "SYKE + Zanzibar Forestry Department", spatialResolution: "10m", temporalCoverage: "2009-2016 surveys", format: "shapefile", notes: "Mangrove extent mapped across both islands. Protected under environmental regulations." },
  { id: "marine-bathymetry", name: "Nearshore Bathymetry", type: "bathymetry", provider: "Zanzibar Port Authority + SYKE", spatialResolution: "5m", temporalCoverage: "2012 survey", format: "geotiff", notes: "Depth profiles for harbour and coastal areas. Essential for marine construction." },
  { id: "marine-shoreline", name: "Shoreline Change Analysis", type: "shoreline", provider: "SYKE + University of Dar es Salaam", spatialResolution: "30m", temporalCoverage: "1990-2020 multi-temporal", format: "shapefile", notes: "Erosion and accretion rates along coast. Critical for coastal zone management." },
  { id: "marine-sst", name: "Sea Surface Temperature", type: "sst", provider: "NOAA Coral Reef Watch", spatialResolution: "5km", temporalCoverage: "2002-present", format: "netcdf", notes: "SST anomalies and thermal stress indicators. Relevant for coral bleaching risk." },
];

// ─── Sample OSM Extracts ──────────────────────────────────────────────────────

export const sampleOsmExtracts: OsmExtract[] = [
  { id: "osm-roads-zanzibar", name: "Zanzibar Road Network", layerType: "roads", extractDate: "2025-01-01", featureCount: 28500, notes: "Complete classified road network. Primary/secondary/tertiary/tracks. Excellent coverage." },
  { id: "osm-buildings-zanzibar", name: "Zanzibar Building Footprints", layerType: "buildings", extractDate: "2025-01-01", featureCount: 185000, notes: "Building outlines. Near-complete for Stone Town, good for coastal settlements, partial for rural areas." },
  { id: "osm-waterways-zanzibar", name: "Zanzibar Waterways", layerType: "waterways", extractDate: "2025-01-01", featureCount: 4200, notes: "Rivers, streams, canals, and tidal channels. Useful for drainage and flood analysis." },
  { id: "osm-pois-zanzibar", name: "Zanzibar Points of Interest", layerType: "pois", extractDate: "2025-01-01", featureCount: 12000, notes: "Hotels, restaurants, attractions, shops, services. Key for tourism proximity analysis." },
  { id: "osm-landuse-zanzibar", name: "Zanzibar Land Use", layerType: "landuse", extractDate: "2025-01-01", featureCount: 8500, notes: "Landuse polygons: residential, commercial, agricultural, forest, conservation." },
];

// ─── Sample Satellite Coverage ────────────────────────────────────────────────

export const sampleSatelliteCoverage: SatelliteCoverage[] = [
  {
    id: "sentinel-2-zanzibar",
    satellite: "sentinel_2",
    product: "S2MSI2A (Level-2A Atmospheric Corrected)",
    resolution: "10m (VNIR), 20m (SWIR), 60m (atmos)",
    revisitDays: 5,
    cloudFilter: true,
    layers: ["RGB Composites", "NDVI", "NDWI", "NDBI", "True Color", "False Color", "Urban Index"],
    accessUrl: "https://scihub.copernicus.eu",
    notes: "Best resolution available for free. 5-day revisit enables change detection. Cloud cover significant — use cloud-masked composites.",
  },
  {
    id: "landsat-8-9-zanzibar",
    satellite: "landsat_8",
    product: "Level-2 Surface Reflectance",
    resolution: "30m (multispectral), 15m (panchromatic)",
    revisitDays: 16,
    cloudFilter: true,
    layers: ["Surface Reflectance", "NDVI", "Land Cover", "Thermal Band"],
    accessUrl: "https://earthexplorer.usgs.gov",
    notes: "Long time series from 1984 (Landsat 5). Good for historical land cover change analysis. 30m resolution adequate for district-level analysis.",
  },
  {
    id: "modis-zanzibar",
    satellite: "modis",
    product: "MOD13Q1 (NDVI/EVI), MOD11A2 (LST)",
    resolution: "250m (NDVI), 1km (LST)",
    revisitDays: 16,
    cloudFilter: true,
    layers: ["NDVI", "EVI", "Land Surface Temperature", "Snow Cover"],
    accessUrl: "https://lpdaac.usgs.gov",
    notes: "Daily to 16-day composites. Excellent for vegetation monitoring and thermal analysis at coarse resolution. Long time series from 2000.",
  },
];

// ─── Unified Catalog ──────────────────────────────────────────────────────────

export const dataCatalog: DataCatalogEntry[] = [
  { source: zanzibarDataSources.find((s) => s.id === "zansis")!, recordCount: 850, quality: { completeness: 0, accuracy: 0, timeliness: 0, overall: 0 }, tags: ["economic", "cpi", "tourism", "agriculture", "climate"] },
  { source: zanzibarDataSources.find((s) => s.id === "tisp")!, recordCount: 4, quality: { completeness: 0, accuracy: 0, timeliness: 0, overall: 0 }, tags: ["census", "poverty", "health", "education"] },
  { source: zanzibarDataSources.find((s) => s.id === "znada")!, recordCount: 35, quality: { completeness: 0, accuracy: 0, timeliness: 0, overall: 0 }, tags: ["surveys", "microdata", "sampling"] },
  { source: zanzibarDataSources.find((s) => s.id === "zansdi")!, recordCount: 7, quality: { completeness: 0, accuracy: 0, timeliness: 0, overall: 0 }, tags: ["admin", "landuse", "elevation", "roads", "buildings", "cadastral"] },
  { source: zanzibarDataSources.find((s) => s.id === "marine_coastal")!, recordCount: 6, quality: { completeness: 0, accuracy: 0, timeliness: 0, overall: 0 }, tags: ["coral", "seagrass", "mangrove", "bathymetry", "shoreline"] },
  { source: zanzibarDataSources.find((s) => s.id === "osm")!, recordCount: 238200, quality: { completeness: 0, accuracy: 0, timeliness: 0, overall: 0 }, tags: ["roads", "buildings", "waterways", "pois", "landuse"] },
  { source: zanzibarDataSources.find((s) => s.id === "satellite")!, recordCount: 3, quality: { completeness: 0, accuracy: 0, timeliness: 0, overall: 0 }, tags: ["sentinel", "landsat", "modis", "ndvi", "landcover"] },
  { source: zanzibarDataSources.find((s) => s.id === "eproz")!, recordCount: 0, quality: { completeness: 0, accuracy: 0, timeliness: 0, overall: 0 }, tags: ["procurement", "tenders", "infrastructure"] },
  { source: zanzibarDataSources.find((s) => s.id === "cola")!, recordCount: 0, quality: { completeness: 0, accuracy: 0, timeliness: 0, overall: 0 }, tags: ["land", "title", "ownership", "cadastral"] },
  { source: zanzibarDataSources.find((s) => s.id === "flood_models")!, recordCount: 0, quality: { completeness: 0, accuracy: 0, timeliness: 0, overall: 0 }, tags: ["flood", "risk", "storm-surge", "sea-level"] },
];
