import { GeoPoint, OpportunityScore, OpportunityBand } from "../../types";

/**
 * Opportunity Module - ZanAtlas
 * 
 * Scores development opportunity based on proximity to
 * infrastructure, tourism zones, and market conditions.
 * Deterministic rules for MVP.
 */

interface OpportunityInputs {
  point: GeoPoint;
  roadDistance: number;          // meters to nearest road
  coastlineDistance: number;     // meters to nearest coastline
  tourismZoneProximity: number; // 0-1 score for tourism zone closeness
  nearbyDevelopmentScore: number; // 0-100, development activity in area
  neighbourhoodScore: number;   // 0-100, overall neighbourhood quality
  marketDemandPlaceholder: number; // 0-100, placeholder for real demand data
}

function calculateTourismDemand(
  coastlineDistance: number,
  tourismZoneProximity: number
): number {
  const coastalBonus = coastlineDistance < 500 ? 30 : coastlineDistance < 1500 ? 15 : 0;
  return Math.min(100, tourismZoneProximity * 70 + coastalBonus);
}

function calculateInfrastructureAccess(roadDistance: number): number {
  if (roadDistance < 100) return 95;
  if (roadDistance < 300) return 80;
  if (roadDistance < 500) return 65;
  if (roadDistance < 1000) return 45;
  if (roadDistance < 2000) return 25;
  return 10;
}

function calculateDevelopmentMomentum(
  nearbyDevelopment: number,
  neighbourhoodScore: number
): number {
  return nearbyDevelopment * 0.5 + neighbourhoodScore * 0.5;
}

function calculateMarketLiquidity(
  neighbourhoodScore: number,
  tourismDemand: number
): number {
  return neighbourhoodScore * 0.4 + tourismDemand * 0.6;
}

function determineBand(score: number): OpportunityBand {
  if (score < 30) return "Low";
  if (score < 55) return "Medium";
  if (score < 75) return "High";
  return "Prime";
}

export function calculateOpportunityScore(inputs: OpportunityInputs): OpportunityScore {
  const tourismDemand = calculateTourismDemand(
    inputs.coastlineDistance,
    inputs.tourismZoneProximity
  );
  const infrastructureAccess = calculateInfrastructureAccess(inputs.roadDistance);
  const developmentMomentum = calculateDevelopmentMomentum(
    inputs.nearbyDevelopmentScore,
    inputs.neighbourhoodScore
  );
  const marketLiquidity = calculateMarketLiquidity(
    inputs.neighbourhoodScore,
    tourismDemand
  );

  const overallOpportunity =
    tourismDemand * 0.25 +
    infrastructureAccess * 0.20 +
    developmentMomentum * 0.25 +
    marketLiquidity * 0.15 +
    inputs.neighbourhoodScore * 0.15;

  return {
    tourismDemand: Math.round(tourismDemand * 10) / 10,
    infrastructureAccess: Math.round(infrastructureAccess * 10) / 10,
    developmentMomentum: Math.round(developmentMomentum * 10) / 10,
    marketLiquidity: Math.round(marketLiquidity * 10) / 10,
    overallOpportunity: Math.round(overallOpportunity * 10) / 10,
    opportunityBand: determineBand(overallOpportunity),
  };
}
