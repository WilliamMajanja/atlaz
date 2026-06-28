import { SiteAnalysisFull, GeoPoint, NeighbourhoodProfile, BadgeType } from "../../types";
import { haversineDistance } from "../distance";
import { calculateRiskScore } from "../../modules/risk";
import { calculateOpportunityScore } from "../../modules/valuation";
import { generateReportContent, type ReportContent } from "../../modules/reports";
import { neighbourhoods } from "../../data/seed/zanzibar";
import { config } from "../config";

/**
 * Core scoring engine for ZanAtlas.
 * 
 * Combines geo, risk, opportunity, and capital modules
 * into a unified site analysis score.
 */

const WEIGHTS = config.scoring.weights;

function findNearestNeighbourhood(point: GeoPoint): NeighbourhoodProfile | null {
  let nearest: NeighbourhoodProfile | null = null;
  let minDist = Infinity;

  for (const n of neighbourhoods) {
    const dist = haversineDistance(point, { latitude: n.latitude, longitude: n.longitude });
    if (dist < minDist) {
      minDist = dist;
      nearest = n;
    }
  }

  return nearest;
}

function findNearestRoadDistance(point: GeoPoint): number {
  // Simplified: estimate based on distance to nearest major road
  // In production, this would query actual road network data
  const majorRoadPoints: GeoPoint[] = [
    { latitude: -6.165, longitude: 39.190 },
    { latitude: -6.155, longitude: 39.220 },
    { latitude: -5.735, longitude: 39.280 },
    { latitude: -5.725, longitude: 39.300 },
    { latitude: -6.270, longitude: 39.450 },
    { latitude: -6.225, longitude: 39.485 },
  ];

  let minDist = Infinity;
  for (const rp of majorRoadPoints) {
    const dist = haversineDistance(point, rp);
    if (dist < minDist) minDist = dist;
  }

  return minDist;
}

function findCoastlineDistance(point: GeoPoint): number {
  // Simplified coastline distance estimation
  // Closer to the ocean = smaller longitude value relative to island center
  const coastlineRef = { latitude: point.latitude, longitude: 39.200 };
  return Math.abs(point.longitude - coastlineRef.longitude) * 111000;
}

function generateBadges(
  riskScore: { overallRisk: number; floodRisk: number },
  opportunityScore: { overallOpportunity: number; tourismDemand: number },
  neighbourhood: NeighbourhoodProfile | null
): BadgeType[] {
  const badges: BadgeType[] = [];

  if (opportunityScore.tourismDemand > 75) badges.push("Prime Tourism Corridor");
  if (opportunityScore.overallOpportunity > 70 && (neighbourhood?.tourismScore ?? 0) > 70) {
    badges.push("Golden Visa Potential");
  }
  if (opportunityScore.tourismDemand > 60 && (neighbourhood?.floodSensitivity ?? 0) < 40) {
    badges.push("Eco-Resort Potential");
  }
  if (riskScore.floodRisk > 60) badges.push("High Flood Caution");
  if (opportunityScore.overallOpportunity < 40) badges.push("Land Bank Candidate");
  if ((neighbourhood?.infrastructureScore ?? 0) < 45) badges.push("Infrastructure Watch");
  badges.push("Needs Legal Verification");

  return badges;
}

function suggestStrategy(
  opportunityScore: { overallOpportunity: number; tourismDemand: number; developmentMomentum: number },
  riskScore: { overallRisk: number },
  neighbourhood: NeighbourhoodProfile | null
): string {
  if (riskScore.overallRisk > 60) return "Conservative land hold - await infrastructure improvement";
  if (opportunityScore.tourismDemand > 80) return "Hospitality development - boutique hotel or eco-resort";
  if (opportunityScore.developmentMomentum > 70) return "Active development - residential or mixed-use";
  if ((neighbourhood?.infrastructureScore ?? 0) > 60) return "Mixed-use development with commercial component";
  return "Long-term land banking in emerging corridor";
}

export function runFullSiteAnalysis(point: GeoPoint): SiteAnalysisFull {
  const neighbourhood = findNearestNeighbourhood(point);
  const roadDistance = findNearestRoadDistance(point);
  const coastlineDistance = findCoastlineDistance(point);

  const riskScore = calculateRiskScore({
    point,
    floodZoneOverlap: neighbourhood?.floodSensitivity ? neighbourhood.floodSensitivity / 100 : 0.3,
    coastalDistance: coastlineDistance,
    nearbyBuildingCount: Math.round(neighbourhood?.developmentMomentum ?? 30),
  });

  const opportunityScore = calculateOpportunityScore({
    point,
    roadDistance,
    coastlineDistance,
    tourismZoneProximity: neighbourhood?.tourismScore ? neighbourhood.tourismScore / 100 : 0.5,
    nearbyDevelopmentScore: neighbourhood?.developmentMomentum ?? 40,
    neighbourhoodScore: neighbourhood ? (neighbourhood.tourismScore + neighbourhood.infrastructureScore) / 2 : 50,
    marketDemandPlaceholder: neighbourhood?.tourismScore ?? 50,
  });

  // Land Opportunity Score (weighted composite)
  const capitalScore = Math.round(
    (roadDistance < 500 ? 80 : roadDistance < 1000 ? 60 : 30) * WEIGHTS.roadAccess +
    opportunityScore.tourismDemand * WEIGHTS.tourismDemand +
    (100 - riskScore.floodRisk) * WEIGHTS.floodSafety +
    (neighbourhood?.infrastructureScore ?? 50) * WEIGHTS.infrastructure +
    opportunityScore.marketLiquidity * WEIGHTS.marketLiquidity +
    opportunityScore.developmentMomentum * WEIGHTS.developmentMomentum +
    60 * WEIGHTS.legalConfidence // Default legal confidence
  );

  const badges = generateBadges(riskScore, opportunityScore, neighbourhood);
  const suggestedStrategy = suggestStrategy(opportunityScore, riskScore, neighbourhood);

  return {
    location: point,
    neighbourhood: neighbourhood?.name ?? null,
    riskScore,
    opportunityScore,
    capitalScore,
    suggestedStrategy,
    badges,
    recommendedActions: [
      "Verify land title and ownership",
      "Confirm zoning approval",
      "Commission professional survey",
      "Review flood risk assessment",
      "Assess infrastructure access",
    ],
    disclaimer: config.disclaimer,
  };
}

export function generateReportFromAnalysis(analysis: SiteAnalysisFull): ReportContent {
  return generateReportContent(analysis);
}
