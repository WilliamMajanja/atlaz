import { GeoPoint, RiskScore, RiskBand } from "../../types";

/**
 * Risk Module - ZanAtlas
 * 
 * Generates risk scores based on geo-spatial inputs.
 * Uses deterministic rules for MVP; can be replaced with
 * ML models or real flood/climate data later.
 */

interface RiskInputs {
  point: GeoPoint;
  floodZoneOverlap: number;     // 0-1, how much the point overlaps flood zones
  coastalDistance: number;      // meters to nearest coastline
  nearbyBuildingCount: number;  // buildings within 500m
  drainageDistance?: number;    // meters to nearest drainage (placeholder)
  elevation?: number;           // meters above sea level (placeholder)
}

function calculateFloodRisk(overlap: number, coastalDistance: number): number {
  const floodBase = overlap * 60;
  const coastalFlood = coastalDistance < 200 ? 30 : coastalDistance < 500 ? 15 : 0;
  return Math.min(100, floodBase + coastalFlood);
}

function calculateCoastalExposure(coastalDistance: number): number {
  if (coastalDistance < 100) return 95;
  if (coastalDistance < 300) return 75;
  if (coastalDistance < 500) return 55;
  if (coastalDistance < 1000) return 30;
  if (coastalDistance < 2000) return 15;
  return 5;
}

function calculateDensityPressure(buildingCount: number): number {
  return Math.min(100, buildingCount * 2);
}

function calculateInfrastructureRisk(coastalDistance: number): number {
  // Areas very far from infrastructure or very close to coast have higher risk
  const distanceScore = coastalDistance > 5000 ? 40 : 0;
  return Math.min(100, distanceScore + 10);
}

function determineBand(score: number): RiskBand {
  if (score < 35) return "Low";
  if (score < 65) return "Medium";
  return "High";
}

export function calculateRiskScore(inputs: RiskInputs): RiskScore {
  const floodRisk = calculateFloodRisk(inputs.floodZoneOverlap, inputs.coastalDistance);
  const coastalExposure = calculateCoastalExposure(inputs.coastalDistance);
  const densityPressure = calculateDensityPressure(inputs.nearbyBuildingCount);
  const infrastructureRisk = calculateInfrastructureRisk(inputs.coastalDistance);

  // Weighted overall score
  const overallRisk =
    floodRisk * 0.35 +
    coastalExposure * 0.25 +
    densityPressure * 0.15 +
    infrastructureRisk * 0.25;

  return {
    floodRisk: Math.round(floodRisk * 10) / 10,
    coastalExposure: Math.round(coastalExposure * 10) / 10,
    densityPressure: Math.round(densityPressure * 10) / 10,
    infrastructureRisk: Math.round(infrastructureRisk * 10) / 10,
    overallRisk: Math.round(overallRisk * 10) / 10,
    riskBand: determineBand(overallRisk),
  };
}
