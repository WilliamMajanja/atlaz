"use client";

import {
  zanzibarDataSources,
  sampleZansisIndicators,
  sampleTispDashboards,
  sampleZnadaSurveys,
  sampleZansdiLayers,
  sampleMarineDatasets,
  sampleOsmExtracts,
  sampleSatelliteCoverage,
} from "@/data/seed/opendata";
import { getDataSource } from "@/lib/data-source";

const ds = getDataSource();
const neighbourhoods = ds.getNeighbourhoods();
const sampleListings = ds.getListings();
const infrastructureAssets = ds.getInfrastructureAssets();

const categoryLabels: Record<string, string> = {
  government_statistics: "Official Government Statistics",
  geospatial: "Geospatial Data Infrastructure",
  marine_coastal: "Marine & Coastal Data",
  open_street_map: "OpenStreetMap & Overture Maps",
  satellite_remote_sensing: "Satellite & Remote Sensing",
  public_procurement: "Public Procurement",
  land_registry: "Land Registry",
  flood_models: "Flood Risk Models",
};

const statusColors: Record<string, string> = {
  active: "bg-green-900/50 text-green-300 border-green-700",
  stub: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
  restricted: "bg-red-900/50 text-red-300 border-red-700",
  deprecated: "bg-gray-800 text-gray-400 border-gray-600",
  intermittent: "bg-orange-900/50 text-orange-300 border-orange-700",
};

const categoryOrder = [
  "government_statistics",
  "geospatial",
  "marine_coastal",
  "open_street_map",
  "satellite_remote_sensing",
  "public_procurement",
  "land_registry",
  "flood_models",
];

export default function AdminPage() {
  const groupedSources = categoryOrder
    .map((cat) => ({
      category: cat,
      label: categoryLabels[cat] ?? cat,
      sources: zanzibarDataSources.filter((s) => s.category === cat),
    }))
    .filter((g) => g.sources.length > 0);

  return (
    <div className="h-full overflow-y-auto">
      <header className="border-b border-gray-800 px-6 py-4">
        <h1 className="text-lg font-semibold text-white">Data Admin</h1>
        <p className="text-xs text-gray-400">
          Zanzibar open data sources, loaded seed datasets, and ingestion hooks
        </p>
      </header>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* ── Seed Data Summary ──────────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Loaded Seed Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded p-4">
              <p className="text-xs text-gray-400">Neighbourhoods</p>
              <p className="text-2xl font-bold text-white">{neighbourhoods.length}</p>
              <ul className="mt-2 space-y-1">
                {neighbourhoods.map((n) => (
                  <li key={n.id} className="text-xs text-gray-400">{n.name}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <p className="text-xs text-gray-400">Sample Listings</p>
              <p className="text-2xl font-bold text-white">{sampleListings.length}</p>
              <ul className="mt-2 space-y-1">
                {sampleListings.map((l) => (
                  <li key={l.id} className="text-xs text-gray-400">{l.title}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-800 rounded p-4">
              <p className="text-xs text-gray-400">Infrastructure Assets</p>
              <p className="text-2xl font-bold text-white">{infrastructureAssets.length}</p>
              <ul className="mt-2 space-y-1">
                {infrastructureAssets.map((a) => (
                  <li key={a.id} className="text-xs text-gray-400">{a.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── ZANSIS Indicators ─────────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-white mb-1">ZANSIS Statistical Indicators</h2>
          <p className="text-xs text-gray-500 mb-4">Sample indicators from Zanzibar Statistical Information System (OCGS)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {sampleZansisIndicators.map((ind) => (
              <div key={ind.id} className="bg-gray-800 rounded p-3">
                <p className="text-xs text-gray-400">{ind.name}</p>
                <p className="text-lg font-bold text-white">
                  {ind.value.toLocaleString()} <span className="text-xs text-gray-400">{ind.unit}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {ind.period} · {ind.island === "both" ? "Unguja + Pemba" : ind.island}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TISP Dashboards ───────────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-white mb-1">TISP Dashboards</h2>
          <p className="text-xs text-gray-500 mb-4">Tanzania Integrated Statistical Portal (Power BI)</p>
          <div className="space-y-2">
            {sampleTispDashboards.map((d) => (
              <div key={d.id} className="bg-gray-800 rounded px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.description}</p>
                </div>
                <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded border border-blue-700 whitespace-nowrap">
                  {d.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── ZNADA Surveys ─────────────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-white mb-1">ZNADA Survey Catalog</h2>
          <p className="text-xs text-gray-500 mb-4">Zanzibar National Data Archive — microdata metadata</p>
          <div className="space-y-2">
            {sampleZnadaSurveys.map((s) => (
              <div key={s.id} className="bg-gray-800 rounded px-4 py-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-white">{s.title}</p>
                    <p className="text-xs text-gray-500">{s.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded border ${
                    s.accessLevel === "open"
                      ? "bg-green-900/50 text-green-300 border-green-700"
                      : "bg-yellow-900/50 text-yellow-300 border-yellow-700"
                  }`}>
                    {s.accessLevel}
                  </span>
                </div>
                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                  <span>Sample: {s.sampleSize?.toLocaleString()} units</span>
                  <span>Period: {s.collectionPeriod}</span>
                  <span>Formats: {s.dataFormats.join(", ")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ZanSDI Layers ─────────────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-white mb-1">ZanSDI Geospatial Layers</h2>
          <p className="text-xs text-gray-500 mb-4">Zanzibar Spatial Data Infrastructure (GeoNode/GeoServer/PostGIS)</p>
          <div className="space-y-2">
            {sampleZansdiLayers.map((layer) => (
              <div key={layer.id} className="bg-gray-800 rounded px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{layer.name}</p>
                  <p className="text-xs text-gray-500">{layer.notes}</p>
                  {layer.spatialResolution && (
                    <p className="text-xs text-gray-600 mt-1">Resolution: {layer.spatialResolution}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                    {layer.topic}
                  </span>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                    {layer.format}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Marine & Coastal ──────────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-white mb-1">Marine & Coastal Datasets</h2>
          <p className="text-xs text-gray-500 mb-4">Finnish Environment Institute (SYKE) + Zanzibar Marine Authority</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sampleMarineDatasets.map((ds) => (
              <div key={ds.id} className="bg-gray-800 rounded p-3">
                <div className="flex items-start justify-between">
                  <p className="text-sm text-white">{ds.name}</p>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">{ds.type}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{ds.notes}</p>
                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                  <span>Resolution: {ds.spatialResolution}</span>
                  <span>Period: {ds.temporalCoverage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── OSM Extracts ──────────────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-white mb-1">OpenStreetMap Extracts</h2>
          <p className="text-xs text-gray-500 mb-4">OSM + Overture Maps vector data for Zanzibar</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sampleOsmExtracts.map((ext) => (
              <div key={ext.id} className="bg-gray-800 rounded p-3">
                <p className="text-sm text-white">{ext.name}</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">{ext.featureCount.toLocaleString()}</p>
                <p className="text-xs text-gray-400">features</p>
                <p className="text-xs text-gray-500 mt-1">{ext.notes}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Satellite Coverage ────────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-white mb-1">Satellite & Remote Sensing</h2>
          <p className="text-xs text-gray-500 mb-4">ESA Sentinel-2, NASA Landsat, MODIS global open data</p>
          <div className="space-y-3">
            {sampleSatelliteCoverage.map((sat) => (
              <div key={sat.id} className="bg-gray-800 rounded p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-white font-medium">{sat.satellite.replace("_", " ").toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{sat.product}</p>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <p>Resolution: {sat.resolution}</p>
                    <p>Revisit: {sat.revisitDays} days</p>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {sat.layers.map((layer) => (
                    <span key={layer} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                      {layer}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Data Source Catalog ───────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Data Source Catalog</h2>
          <div className="space-y-4">
            {groupedSources.map((group) => (
              <div key={group.category}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {group.label}
                </h3>
                <div className="space-y-2">
                  {group.sources.map((source) => (
                    <div
                      key={source.id}
                      className="bg-gray-800 rounded px-4 py-3 flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-white font-medium">{source.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded border ${statusColors[source.status]}`}>
                            {source.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{source.description}</p>
                        <div className="flex gap-3 mt-1 text-xs text-gray-600">
                          <span>Provider: {source.provider}</span>
                          <span>Update: {source.updateFrequency}</span>
                          <span>Formats: {source.dataFormats.join(", ")}</span>
                        </div>
                      </div>
                      <div className="ml-4 text-right shrink-0">
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                          {source.apiType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── GeoJSON Layers ────────────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Built-in GeoJSON Layers</h2>
          <div className="space-y-2">
            {[
              { name: "Roads", features: 2, type: "LineString" },
              { name: "Coastal/Tourism Zones", features: 3, type: "Polygon" },
              { name: "Flood Risk Zones", features: 2, type: "Polygon" },
              { name: "Development Zones", features: 2, type: "Polygon" },
            ].map((layer) => (
              <div key={layer.name} className="flex items-center justify-between bg-gray-800 rounded px-4 py-2">
                <div>
                  <p className="text-sm text-white">{layer.name}</p>
                  <p className="text-xs text-gray-500">{layer.type}</p>
                </div>
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                  {layer.features} features
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Database Status ───────────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Database</h2>
          <div className="bg-gray-800 rounded p-4">
            <p className="text-xs text-gray-400">Prisma Schema</p>
            <p className="text-sm text-white mt-1">
              11 models defined (User, SavedSite, GeoLayer, GeoFeature, Analysis, Report, Listing,
              DevelopmentZone, InfrastructureAsset, GrowthScenario, SimulationRun)
            </p>
            <p className="text-xs text-gray-500 mt-2">
              PostGIS-ready schema with JSON fields for GeoJSON and scoring outputs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
