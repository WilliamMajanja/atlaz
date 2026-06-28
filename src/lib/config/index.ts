export const config = {
  app: {
    name: "Atlaz",
    subtitle: "Land Intelligence & Business Operations",
    description: "Best-in-class land intelligence and business operations platform for frontier real estate markets",
    method: "The Atlaz Method — Discover · Match · Analyze · Act",
  },
  map: {
    defaultCenter: { latitude: -6.1659, longitude: 39.2026 } as const,
    defaultZoom: 11,
    minZoom: 8,
    maxZoom: 18,
    tileUrl: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    satelliteTileUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },
  scoring: {
    weights: {
      roadAccess: 0.15,
      tourismDemand: 0.20,
      floodSafety: 0.20,
      infrastructure: 0.15,
      marketLiquidity: 0.10,
      developmentMomentum: 0.15,
      legalConfidence: 0.05,
    },
  },
  disclaimer: "This platform provides decision-support intelligence only. It does not verify land title, ownership, zoning approval, encumbrances, or legal rights. All land purchases require independent verification with qualified Zanzibar lawyers, surveyors, and relevant government authorities.",
  layers: [
    { id: "roads", name: "Roads", defaultVisible: true },
    { id: "buildings", name: "Buildings", defaultVisible: false },
    { id: "coastal-zones", name: "Coastal/Tourism Zones", defaultVisible: true },
    { id: "flood-risk", name: "Flood Risk", defaultVisible: false },
    { id: "development-zones", name: "Development Opportunities", defaultVisible: true },
    { id: "listings", name: "Sample Land Listings", defaultVisible: true },
  ],
} as const;
